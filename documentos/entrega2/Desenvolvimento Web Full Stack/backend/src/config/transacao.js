const pool = require('./db');

// Roda várias queries "tudo ou nada": se uma falhar, NENHUMA é salva.
// Uso: await emTransacao(async (client) => { await client.query(...); await client.query(...); });
async function emTransacao(funcao) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const resultado = await funcao(client);
    await client.query('COMMIT');
    return resultado;
  } catch (erro) {
    await client.query('ROLLBACK');
    throw erro; // quem chamou decide o que responder
  } finally {
    client.release();
  }
}

module.exports = { emTransacao };
