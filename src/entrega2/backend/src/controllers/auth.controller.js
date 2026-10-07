const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const jwt = require('jsonwebtoken');

const TIPOS_PUBLICOS = ['cliente', 'organizador', 'fornecedor']; // admin não se cadastra sozinho
const soDigitos = (valor) => String(valor || '').replace(/\D/g, ''); // "123.456-7" → "1234567"

// RF01 – Cadastro de usuário
async function cadastrar(req, res) {
  const { nome, email, telefone, senha, tipo, cpf, cnpj, endereco } = req.body;

  // 1. Validações
  if (!nome || !email || !senha || !TIPOS_PUBLICOS.includes(tipo)) {
    return res.status(400).json({ erro: 'Preencha nome, email, senha e um tipo válido' });
  }
  if (senha.length < 6) {
    return res.status(400).json({ erro: 'A senha deve ter pelo menos 6 caracteres' });
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

  res.json({
    token,
    usuario: { id: usuario.id_usuario, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo },
  });
}

module.exports = { cadastrar, login };