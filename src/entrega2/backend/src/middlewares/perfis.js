const pool = require('../config/db');

// Descobre quem é o ORGANIZADOR logado e só deixa passar se o cadastro estiver aprovado.
// Depois disso, as rotas podem usar req.idOrganizador.
async function exigirOrganizador(req, res, next) {
  const { rows } = await pool.query(
    `SELECT o.id_organizador
       FROM organizadores o
       JOIN usuarios u ON u.id_usuario = o.id_usuario
      WHERE o.id_usuario = $1 AND u.status_cadastro = 'aprovado'`,
    [req.usuario.id]
  );
  if (!rows[0]) {
    return res.status(403).json({ erro: 'Acesso permitido apenas a organizadores aprovados' });
  }
  req.idOrganizador = rows[0].id_organizador;
  next();
}

// Igual, mas para o FORNECEDOR (cria req.idFornecedor)
async function exigirFornecedor(req, res, next) {
  const { rows } = await pool.query(
    `SELECT f.id_fornecedor
       FROM fornecedores f
       JOIN usuarios u ON u.id_usuario = f.id_usuario
      WHERE f.id_usuario = $1 AND u.status_cadastro = 'aprovado'`,
    [req.usuario.id]
  );
  if (!rows[0]) {
    return res.status(403).json({ erro: 'Acesso permitido apenas a fornecedores aprovados' });
  }
  req.idFornecedor = rows[0].id_fornecedor;
  next();
}

module.exports = { exigirOrganizador, exigirFornecedor };
