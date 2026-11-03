const pool = require('../config/db');
const { idValido } = require('../utils/validar');

// Só aparecem na vitrine pública os eventos que o organizador publicou, com
// vagas e data ainda válidas.
const EVENTO_PUBLICADO = `e.publicado_para_venda = true AND e.status != 'cancelado'
                           AND COALESCE(e.data_fim, e.data) >= CURRENT_DATE
                           AND e.ingressos_vendidos < e.ingressos_total`;

const CAMPOS_EVENTO_PUBLICO = `e.id_evento, e.nome, e.data, e.data_fim, e.local, e.descricao,
       e.categoria, e.imagem_url, e.preco_ingresso,
       (e.ingressos_total - e.ingressos_vendidos) AS ingressos_disponiveis,
       u.nome AS organizador`;

// Vitrine pública de eventos (RF — venda de ingressos ao cliente final)
async function listarEventos(req, res) {
  const { rows } = await pool.query(
    `SELECT ${CAMPOS_EVENTO_PUBLICO}
       FROM eventos e
       JOIN organizadores o ON o.id_organizador = e.id_organizador
       JOIN usuarios u      ON u.id_usuario = o.id_usuario
      WHERE ${EVENTO_PUBLICADO}
      ORDER BY e.data, e.id_evento`
  );
  res.json(rows);
}

async function buscarEvento(req, res) {
  const idEvento = idValido(req.params.id);
  if (!idEvento) return res.status(400).json({ erro: 'ID de evento inválido' });

  const { rows } = await pool.query(
    `SELECT ${CAMPOS_EVENTO_PUBLICO}
       FROM eventos e
       JOIN organizadores o ON o.id_organizador = e.id_organizador
       JOIN usuarios u      ON u.id_usuario = o.id_usuario
      WHERE e.id_evento = $1 AND ${EVENTO_PUBLICADO}`,
    [idEvento]
  );
  if (!rows[0]) {
    return res.status(404).json({ erro: 'Evento não encontrado ou indisponível para venda' });
  }
  res.json(rows[0]);
}

// Vitrine pública de revenda: ingressos que outros clientes colocaram à venda
async function listarRevendas(req, res) {
  const { rows } = await pool.query(
    `SELECT r.id_revenda, r.preco_unitario, r.criado_em,
            c.id_compra, c.quantidade,
            e.id_evento, e.nome, e.data, e.data_fim, e.local, e.categoria, e.imagem_url
       FROM revendas r
       JOIN compras c ON c.id_compra = r.id_compra
       JOIN eventos e ON e.id_evento = c.id_evento
      WHERE r.status = 'disponivel' AND COALESCE(e.data_fim, e.data) >= CURRENT_DATE
      ORDER BY r.criado_em DESC`
  );
  res.json(rows);
}

module.exports = { listarEventos, buscarEvento, listarRevendas };
