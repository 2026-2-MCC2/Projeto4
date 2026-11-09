const pool = require('../config/db');

// Grava uma linha em logs_auditoria. Nunca lança erro: se o log falhar,
// a ação principal (login, aprovação, etc.) não pode ser derrubada por isso.
async function registrarLog(idUsuario, acao, detalhe) {
  try {
    await pool.query(
      'INSERT INTO logs_auditoria (id_usuario, acao, detalhe) VALUES ($1, $2, $3)',
      [idUsuario || null, acao, detalhe || null]
    );
  } catch (erro) {
    console.error('Falha ao gravar log de auditoria:', erro.message);
  }
}

module.exports = { registrarLog };
