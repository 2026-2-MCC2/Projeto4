const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const { registrarLog } = require('../utils/registrar-log');

const TIPOS_PUBLICOS = ['cliente', 'organizador', 'fornecedor']; // admin não se cadastra sozinho
const soDigitos = (valor) => String(valor || '').replace(/\D/g, ''); // "123.456-7" → "1234567"

// RF01 – Cadastro de usuário
async function cadastrar(req, res) {
  const { nome, email, telefone, senha, tipo, cpf, cnpj, endereco } = req.body;

  // 1. Validações
  if (!nome || !email || !senha || !TIPOS_PUBLICOS.includes(tipo)) {
    return res.status(400).json({ erro: 'Preencha nome, email, senha e um tipo válido' });
  }
  if (senha.length < 8 || !/[A-Za-z]/.test(senha) || !/[0-9]/.test(senha)) {
    return res.status(400).json({
      erro: 'A senha deve ter pelo menos 8 caracteres, com letras e números',
    });
  }
  if (tipo === 'cliente' && soDigitos(cpf).length !== 11) {
    return res.status(400).json({ erro: 'CPF inválido' });
  }
  if (tipo !== 'cliente' && soDigitos(cnpj).length !== 14) {
    return res.status(400).json({ erro: 'CNPJ inválido' });
  }

  // 2. Cliente entra aprovado; organizador e fornecedor aguardam o admin
  const status = tipo === 'cliente' ? 'aprovado' : 'pendente';

  const client = await pool.connect(); // pega uma conexão só para esta operação
  try {
    await client.query('BEGIN'); // inicia a transação

    const senhaHash = await bcrypt.hash(senha, 10);
    const { rows } = await client.query(
      `INSERT INTO usuarios (nome, email, telefone, senha_hash, tipo, status_cadastro)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id_usuario`,
      [nome, email.toLowerCase(), telefone || null, senhaHash, tipo, status]
    );
    const idUsuario = rows[0].id_usuario;

    if (tipo === 'cliente') {
      await client.query(
        'INSERT INTO clientes (id_usuario, cpf) VALUES ($1, $2)',
        [idUsuario, soDigitos(cpf)]
      );
    } else {
      const tabela = tipo === 'organizador' ? 'organizadores' : 'fornecedores';
      await client.query(
        `INSERT INTO ${tabela} (id_usuario, cnpj, endereco) VALUES ($1, $2, $3)`,
        [idUsuario, soDigitos(cnpj), endereco || null]
      );
    }

    await client.query('COMMIT'); // confirma tudo
    await registrarLog(idUsuario, 'cadastro_criado', `${tipo} — status inicial: ${status}`);
    res.status(201).json({ id_usuario: idUsuario, tipo, status_cadastro: status });
  } catch (erro) {
    await client.query('ROLLBACK'); // desfaz tudo se algo falhou
    if (erro.code === '23505') { // código do Postgres para "valor duplicado"
      return res.status(409).json({ erro: 'E-mail, CPF ou CNPJ já cadastrado' });
    }
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao cadastrar' });
  } finally {
    client.release(); // devolve a conexão para o pool
  }
}


// RF02 – Login (só usuários aprovados)
async function login(req, res) {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ erro: 'Informe e-mail e senha' });
  }

  // 1. Busca o usuário
  const { rows } = await pool.query(
    'SELECT id_usuario, nome, email, senha_hash, tipo, status_cadastro FROM usuarios WHERE email = $1',
    [email.toLowerCase()]
  );
  const usuario = rows[0];

  // 2. Confere a senha (mesma mensagem nos dois casos, para não revelar se o e-mail existe)
  if (!usuario || !(await bcrypt.compare(senha, usuario.senha_hash))) {
    return res.status(401).json({ erro: 'E-mail ou senha inválidos' });
  }

  // 3. Confere a aprovação
  if (usuario.status_cadastro === 'pendente') {
    return res.status(403).json({ erro: 'Cadastro aguardando aprovação do administrador' });
  }
  if (usuario.status_cadastro === 'recusado') {
    return res.status(403).json({ erro: 'Cadastro recusado' });
  }

  // 4. Gera o token
  const token = jwt.sign(
    { id: usuario.id_usuario, tipo: usuario.tipo },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );

  await registrarLog(usuario.id_usuario, 'login', usuario.tipo);
  res.json({
    token,
    usuario: { id: usuario.id_usuario, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo },
  });
}

// Retorna os dados do usuário logado (rota protegida)
async function me(req, res) {
  const { rows } = await pool.query(
    'SELECT id_usuario, nome, email, telefone, tipo, status_cadastro FROM usuarios WHERE id_usuario = $1',
    [req.usuario.id]
  );
  if (!rows[0]) return res.status(404).json({ erro: 'Usuário não encontrado' });
  res.json(rows[0]);
}

// Atualiza nome/telefone do usuário logado (qualquer tipo)
async function atualizarPerfil(req, res) {
  const nome = (req.body.nome || '').trim();
  const telefone = (req.body.telefone || '').trim();
  if (!nome) return res.status(400).json({ erro: 'Informe o nome' });

  const { rows } = await pool.query(
    `UPDATE usuarios SET nome = $1, telefone = $2 WHERE id_usuario = $3
     RETURNING id_usuario, nome, email, telefone, tipo, status_cadastro`,
    [nome, telefone || null, req.usuario.id]
  );
  await registrarLog(req.usuario.id, 'perfil_atualizado', nome);
  res.json(rows[0]);
}

// Troca a senha do usuário logado, conferindo a senha atual antes
async function atualizarSenha(req, res) {
  const { senha_atual: senhaAtual, senha_nova: senhaNova } = req.body;
  if (!senhaAtual || !senhaNova) {
    return res.status(400).json({ erro: 'Informe a senha atual e a nova senha' });
  }
  if (senhaNova.length < 8 || !/[A-Za-z]/.test(senhaNova) || !/[0-9]/.test(senhaNova)) {
    return res.status(400).json({
      erro: 'A nova senha deve ter pelo menos 8 caracteres, com letras e números',
    });
  }

  const { rows } = await pool.query(
    'SELECT senha_hash FROM usuarios WHERE id_usuario = $1',
    [req.usuario.id]
  );
  if (!rows[0] || !(await bcrypt.compare(senhaAtual, rows[0].senha_hash))) {
    return res.status(401).json({ erro: 'Senha atual incorreta' });
  }

  const novaSenhaHash = await bcrypt.hash(senhaNova, 10);
  await pool.query('UPDATE usuarios SET senha_hash = $1 WHERE id_usuario = $2', [novaSenhaHash, req.usuario.id]);
  await registrarLog(req.usuario.id, 'senha_alterada', null);
  res.status(204).send();
}

module.exports = { cadastrar, login, me, atualizarPerfil, atualizarSenha };