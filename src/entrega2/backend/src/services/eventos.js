const pool = require('../config/db');

const CAMPOS_EVENTO = `id_evento, id_organizador, nome, data, data_fim, local, descricao,
                       publico_minimo, publico_maximo, margem_lucro, status`;

// Busca o evento SE ele pertencer ao organizador logado (senão devolve undefined).
// É isto que impede um organizador de mexer no evento de outro.
async function eventoDoOrganizador(idEvento, idOrganizador) {
  const { rows } = await pool.query(
    `SELECT ${CAMPOS_EVENTO} FROM eventos WHERE id_evento = $1 AND id_organizador = $2`,
    [idEvento, idOrganizador]
  );
  return rows[0];
}

// Busca qualquer evento (usado pelo administrador)
async function eventoPorId(idEvento) {
  const { rows } = await pool.query(
    `SELECT ${CAMPOS_EVENTO} FROM eventos WHERE id_evento = $1`,
    [idEvento]
  );
  return rows[0];
}

module.exports = { CAMPOS_EVENTO, eventoDoOrganizador, eventoPorId };
