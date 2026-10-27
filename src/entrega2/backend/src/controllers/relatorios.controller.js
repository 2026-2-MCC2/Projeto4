const pool = require('../config/db');
const { idValido } = require('../utils/validar');
const { eventoPorId } = require('../services/eventos');
const { montarOrcamento, montarTicket } = require('../services/orcamento');

const STATUS_EVENTO = ['rascunho', 'aberto', 'fechado', 'cancelado'];
const STATUS_PROPOSTA = ['enviada', 'aceita', 'recusada', 'cancelada'];

// RF14 – Números gerais da plataforma
async function resumo(req, res) {
  const { rows: usuarios } = await pool.query(
    `SELECT tipo, status_cadastro, COUNT(*) AS total
       FROM usuarios GROUP BY tipo, status_cadastro ORDER BY tipo, status_cadastro`
  );
  const { rows: eventos } = await pool.query(
    `SELECT status, COUNT(*) AS total FROM eventos GROUP BY status ORDER BY status`
  );
  const { rows: propostas } = await pool.query(
    `SELECT status, COUNT(*) AS total, COALESCE(SUM(valor_total), 0) AS valor_total
       FROM propostas WHERE id_item IS NOT NULL GROUP BY status ORDER BY status`
  );
  res.json({ usuarios, eventos, propostas });
}

// RF14 – Todos os eventos, com organizador e andamento da cotação. Filtro: ?status=aberto
async function listarEventos(req, res) {
  const valores = [];
  let filtro = '';
  if (req.query.status !== undefined) {
    if (!STATUS_EVENTO.includes(req.query.status)) {
      return res.status(400).json({ erro: `O filtro status deve ser: ${STATUS_EVENTO.join(', ')}` });
    }
    valores.push(req.query.status);
    filtro = 'WHERE e.status = $1';
  }

  const { rows } = await pool.query(
    `SELECT e.id_evento, e.nome, e.data, e.local, e.status,
            e.publico_minimo, e.publico_maximo, e.margem_lucro,
            u.nome AS organizador,
            (SELECT COUNT(*) FROM itens_custo i WHERE i.id_evento = e.id_evento) AS total_itens,
            (SELECT COUNT(*) FROM propostas p
              WHERE p.id_evento = e.id_evento AND p.id_item IS NOT NULL
                AND p.status <> 'cancelada') AS total_propostas,
            (SELECT COUNT(*) FROM propostas p
              WHERE p.id_evento = e.id_evento AND p.status = 'aceita') AS itens_com_proposta_aceita,
            (SELECT COALESCE(SUM(p.valor_total), 0) FROM propostas p
              WHERE p.id_evento = e.id_evento AND p.status = 'aceita') AS total_propostas_aceitas
       FROM eventos e
       JOIN organizadores o ON o.id_organizador = e.id_organizador
       JOIN usuarios u      ON u.id_usuario = o.id_usuario
       ${filtro}
      ORDER BY e.data DESC, e.id_evento DESC`,
    valores
  );
  res.json(rows);
}

// RF14 – Um evento completo: dados + orçamento consolidado + ticket
async function buscarEvento(req, res) {
  const idEvento = idValido(req.params.id);
  if (!idEvento) return res.status(400).json({ erro: 'ID de evento inválido' });

  const evento = await eventoPorId(idEvento);
  if (!evento) return res.status(404).json({ erro: 'Evento não encontrado' });

  const orcamento = await montarOrcamento(idEvento);
  const ticket = montarTicket(evento, orcamento);
  res.json({ evento, orcamento, ticket: ticket.erro ? null : ticket });
}

// RF14 – Todas as propostas da plataforma. Filtro: ?status=aceita
async function listarPropostas(req, res) {
  const valores = [];
  let filtro = '';
  if (req.query.status !== undefined) {
    if (!STATUS_PROPOSTA.includes(req.query.status)) {
      return res.status(400).json({ erro: `O filtro status deve ser: ${STATUS_PROPOSTA.join(', ')}` });
    }
    valores.push(req.query.status);
    filtro = 'AND p.status = $1';
  }

  const { rows } = await pool.query(
    `SELECT p.id_proposta, p.id_evento, e.nome AS evento, p.id_item, i.nome AS item,
            u.nome AS fornecedor, p.valor_total, p.validade, p.status, p.data_proposta
       FROM propostas p
       JOIN eventos e      ON e.id_evento = p.id_evento
       JOIN itens_custo i  ON i.id_item = p.id_item
       JOIN fornecedores f ON f.id_fornecedor = p.id_fornecedor
       JOIN usuarios u     ON u.id_usuario = f.id_usuario
      WHERE p.id_item IS NOT NULL ${filtro}
      ORDER BY p.id_proposta DESC`,
    valores
  );
  res.json(rows);
}

module.exports = { resumo, listarEventos, buscarEvento, listarPropostas };
