const pool = require('../config/db');
const { idValido } = require('../utils/validar');

// RF (admin) – Logs de auditoria: quem fez o quê e quando.
// Filtros opcionais: ?acao=login_sucesso  e  ?id_usuario=7
async function listarLogs(req, res) {
  const filtros = [];
  const valores = [];

  if (req.query.acao !== undefined) {
    valores.push(req.query.acao);
    filtros.push(`l.acao = $${valores.length}`);
  }
  if (req.query.id_usuario !== undefined) {
    const idUsuario = idValido(req.query.id_usuario);
    if (!idUsuario) return res.status(400).json({ erro: 'id_usuario inválido' });
    valores.push(idUsuario);
    filtros.push(`l.id_usuario = $${valores.length}`);
  }

  const onde = filtros.length ? `WHERE ${filtros.join(' AND ')}` : '';
  const { rows } = await pool.query(
    `SELECT l.id_log, l.acao, l.detalhe, l.criado_em,
            l.id_usuario, u.nome AS usuario, u.tipo AS tipo_usuario
       FROM logs_auditoria l
       LEFT JOIN usuarios u ON u.id_usuario = l.id_usuario
       ${onde}
      ORDER BY l.criado_em DESC
      LIMIT 200`,
    valores
  );
  res.json(rows);
}

module.exports = { listarLogs };
