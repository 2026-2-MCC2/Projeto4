const pool = require('../config/db');

const STATUS_VALIDOS = ['pendente', 'aprovado', 'recusado'];

// RF03 – Listar cadastros (padrão: pendentes)
async function listarCadastros(req, res) {
  const status = req.query.status || 'pendente'; // ?status=aprovado também funciona
  if (!STATUS_VALIDOS.includes(status)) {
    return res.status(400).json({ erro: 'Status inválido' });
  }

  const { rows } = await pool.query(
    `SELECT u.id_usuario, u.nome, u.email, u.telefone, u.tipo, u.status_cadastro, u.criado_em,
            c.cpf,
            COALESCE(o.cnpj, f.cnpj)         AS cnpj,
            COALESCE(o.endereco, f.endereco) AS endereco
       FROM usuarios u
       LEFT JOIN clientes      c ON c.id_usuario = u.id_usuario
       LEFT JOIN organizadores o ON o.id_usuario = u.id_usuario
       LEFT JOIN fornecedores  f ON f.id_usuario = u.id_usuario
      WHERE u.status_cadastro = $1
        AND u.tipo <> 'administrador'
      ORDER BY u.criado_em`,
    [status]
  );
  res.json(rows);
}

// RF04 – Aprovar ou recusar um cadastro
async function decidirCadastro(req, res) {
  const id = Number(req.params.id);
  const { decisao } = req.body;

  if (!Number.isInteger(id)) {
    return res.status(400).json({ erro: 'ID inválido' });
  }
  if (!['aprovado', 'recusado'].includes(decisao)) {
    return res.status(400).json({ erro: "A decisão deve ser 'aprovado' ou 'recusado'" });
  }

  const { rows } = await pool.query(
    `UPDATE usuarios SET status_cadastro = $1
      WHERE id_usuario = $2 AND tipo <> 'administrador'
      RETURNING id_usuario, nome, tipo, status_cadastro`,
    [decisao, id]
  );

  if (!rows[0]) {
    return res.status(404).json({ erro: 'Usuário não encontrado' });
  }
  res.json(rows[0]);
}

module.exports = { listarCadastros, decidirCadastro };