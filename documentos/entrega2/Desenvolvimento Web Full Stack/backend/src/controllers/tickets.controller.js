const pool = require('../config/db');
const { idValido, texto, vazio } = require('../utils/validar');
const { registrarLog } = require('../utils/registrar-log');

const CATEGORIAS = ['evento', 'proposta', 'cadastro', 'financeiro', 'outro'];
const PRIORIDADES = ['alta', 'media', 'baixa'];
const STATUS = ['aberto', 'em_andamento', 'resolvido', 'fechado'];

const CAMPOS_TICKET = `t.id_ticket, t.id_usuario, t.assunto, t.categoria, t.prioridade, t.status,
                       t.criado_em, t.atualizado_em`;

// ---------- lado do usuário comum (qualquer tipo logado) ----------

// Abrir um ticket de suporte
async function criarTicket(req, res) {
  const assunto = texto(req.body.assunto, 150);
  const mensagem = texto(req.body.mensagem, 2000);
  const categoria = req.body.categoria;
  const prioridade = vazio(req.body.prioridade) ? 'media' : req.body.prioridade;

  if (!assunto) return res.status(400).json({ erro: 'Informe o assunto (até 150 caracteres)' });
  if (!CATEGORIAS.includes(categoria)) {
    return res.status(400).json({ erro: `A categoria deve ser uma destas: ${CATEGORIAS.join(', ')}` });
  }
  if (!PRIORIDADES.includes(prioridade)) {
    return res.status(400).json({ erro: `A prioridade deve ser uma destas: ${PRIORIDADES.join(', ')}` });
  }
  if (!mensagem) return res.status(400).json({ erro: 'Descreva o problema (até 2000 caracteres)' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      `INSERT INTO tickets_suporte (id_usuario, assunto, categoria, prioridade)
       VALUES ($1, $2, $3, $4) RETURNING ${CAMPOS_TICKET}`,
      [req.usuario.id, assunto, categoria, prioridade]
    );
    await client.query(
      'INSERT INTO ticket_mensagens (id_ticket, id_usuario, mensagem) VALUES ($1, $2, $3)',
      [rows[0].id_ticket, req.usuario.id, mensagem]
    );
    await client.query('COMMIT');
    await registrarLog(req.usuario.id, 'ticket_criado', `#${rows[0].id_ticket} — ${assunto}`);
    res.status(201).json(rows[0]);
  } catch (erro) {
    await client.query('ROLLBACK');
    throw erro;
  } finally {
    client.release();
  }
}

// Meus tickets
async function listarMeusTickets(req, res) {
  const { rows } = await pool.query(
    `SELECT ${CAMPOS_TICKET} FROM tickets_suporte t
      WHERE t.id_usuario = $1 ORDER BY t.criado_em DESC`,
    [req.usuario.id]
  );
  res.json(rows);
}

async function carregarThread(idTicket) {
  const { rows: mensagens } = await pool.query(
    `SELECT m.id_mensagem, m.mensagem, m.criado_em, m.id_usuario, u.nome AS autor, u.tipo AS autor_tipo
       FROM ticket_mensagens m
       LEFT JOIN usuarios u ON u.id_usuario = m.id_usuario
      WHERE m.id_ticket = $1
      ORDER BY m.id_mensagem`,
    [idTicket]
  );
  return mensagens;
}

// Ver um ticket meu (com a conversa)
async function buscarMeuTicket(req, res) {
  const idTicket = idValido(req.params.id);
  if (!idTicket) return res.status(400).json({ erro: 'ID de ticket inválido' });

  const { rows } = await pool.query(
    `SELECT ${CAMPOS_TICKET} FROM tickets_suporte t
      WHERE t.id_ticket = $1 AND t.id_usuario = $2`,
    [idTicket, req.usuario.id]
  );
  if (!rows[0]) return res.status(404).json({ erro: 'Ticket não encontrado' });

  const mensagens = await carregarThread(idTicket);
  res.json({ ...rows[0], mensagens });
}

// Responder no meu próprio ticket (só se ainda não estiver fechado)
async function responderMeuTicket(req, res) {
  const idTicket = idValido(req.params.id);
  if (!idTicket) return res.status(400).json({ erro: 'ID de ticket inválido' });
  const mensagem = texto(req.body.mensagem, 2000);
  if (!mensagem) return res.status(400).json({ erro: 'Informe a mensagem (até 2000 caracteres)' });

  const { rows } = await pool.query(
    'SELECT id_ticket, status FROM tickets_suporte WHERE id_ticket = $1 AND id_usuario = $2',
    [idTicket, req.usuario.id]
  );
  if (!rows[0]) return res.status(404).json({ erro: 'Ticket não encontrado' });
  if (rows[0].status === 'fechado') {
    return res.status(409).json({ erro: 'Este ticket está fechado' });
  }

  await pool.query(
    'INSERT INTO ticket_mensagens (id_ticket, id_usuario, mensagem) VALUES ($1, $2, $3)',
    [idTicket, req.usuario.id, mensagem]
  );
  await pool.query(
    "UPDATE tickets_suporte SET status = 'em_andamento', atualizado_em = NOW() WHERE id_ticket = $1",
    [idTicket]
  );
  res.status(201).json({ ok: true });
}

// ---------- lado do administrador ----------

async function listarTodosTickets(req, res) {
  const filtros = [];
  const valores = [];
  if (req.query.status !== undefined) {
    if (!STATUS.includes(req.query.status)) {
      return res.status(400).json({ erro: `O filtro status deve ser: ${STATUS.join(', ')}` });
    }
    valores.push(req.query.status);
    filtros.push(`t.status = $${valores.length}`);
  }
  if (req.query.categoria !== undefined) {
    if (!CATEGORIAS.includes(req.query.categoria)) {
      return res.status(400).json({ erro: `O filtro categoria deve ser: ${CATEGORIAS.join(', ')}` });
    }
    valores.push(req.query.categoria);
    filtros.push(`t.categoria = $${valores.length}`);
  }
  const onde = filtros.length ? `WHERE ${filtros.join(' AND ')}` : '';

  const { rows } = await pool.query(
    `SELECT ${CAMPOS_TICKET}, u.nome AS autor, u.tipo AS autor_tipo
       FROM tickets_suporte t
       JOIN usuarios u ON u.id_usuario = t.id_usuario
       ${onde}
      ORDER BY t.criado_em DESC`,
    valores
  );
  res.json(rows);
}

async function buscarTicketAdmin(req, res) {
  const idTicket = idValido(req.params.id);
  if (!idTicket) return res.status(400).json({ erro: 'ID de ticket inválido' });

  const { rows } = await pool.query(
    `SELECT ${CAMPOS_TICKET}, u.nome AS autor, u.email AS autor_email, u.tipo AS autor_tipo
       FROM tickets_suporte t
       JOIN usuarios u ON u.id_usuario = t.id_usuario
      WHERE t.id_ticket = $1`,
    [idTicket]
  );
  if (!rows[0]) return res.status(404).json({ erro: 'Ticket não encontrado' });

  const mensagens = await carregarThread(idTicket);
  res.json({ ...rows[0], mensagens });
}

async function responderComoAdmin(req, res) {
  const idTicket = idValido(req.params.id);
  if (!idTicket) return res.status(400).json({ erro: 'ID de ticket inválido' });
  const mensagem = texto(req.body.mensagem, 2000);
  if (!mensagem) return res.status(400).json({ erro: 'Informe a mensagem (até 2000 caracteres)' });

  const { rows } = await pool.query('SELECT id_ticket FROM tickets_suporte WHERE id_ticket = $1', [idTicket]);
  if (!rows[0]) return res.status(404).json({ erro: 'Ticket não encontrado' });

  await pool.query(
    'INSERT INTO ticket_mensagens (id_ticket, id_usuario, mensagem) VALUES ($1, $2, $3)',
    [idTicket, req.usuario.id, mensagem]
  );
  await pool.query(
    "UPDATE tickets_suporte SET status = 'em_andamento', atualizado_em = NOW() WHERE id_ticket = $1",
    [idTicket]
  );
  res.status(201).json({ ok: true });
}

async function atualizarStatusTicket(req, res) {
  const idTicket = idValido(req.params.id);
  if (!idTicket) return res.status(400).json({ erro: 'ID de ticket inválido' });
  const { status } = req.body;
  if (!STATUS.includes(status)) {
    return res.status(400).json({ erro: `O status deve ser: ${STATUS.join(', ')}` });
  }

  const { rows } = await pool.query(
    `UPDATE tickets_suporte SET status = $1, atualizado_em = NOW()
      WHERE id_ticket = $2 RETURNING ${CAMPOS_TICKET}`,
    [status, idTicket]
  );
  if (!rows[0]) return res.status(404).json({ erro: 'Ticket não encontrado' });
  await registrarLog(req.usuario.id, 'ticket_status_alterado', `#${idTicket} -> ${status}`);
  res.json(rows[0]);
}

module.exports = {
  criarTicket, listarMeusTickets, buscarMeuTicket, responderMeuTicket,
  listarTodosTickets, buscarTicketAdmin, responderComoAdmin, atualizarStatusTicket,
};
