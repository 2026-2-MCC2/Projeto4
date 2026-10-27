const pool = require('../config/db');
const { emTransacao } = require('../config/transacao');
const { idValido } = require('../utils/validar');

const STATUS_PROPOSTA = ['enviada', 'aceita', 'recusada'];

// RF11 – Propostas recebidas pelo evento, já ordenadas por item e do menor para o maior valor.
// Filtros opcionais: ?item=3  e  ?status=enviada
async function listarPropostas(req, res) {
  const filtros = ['p.id_evento = $1', "p.id_item IS NOT NULL", "p.status <> 'cancelada'"];
  const valores = [req.evento.id_evento];

  if (req.query.item !== undefined) {
    const idItem = idValido(req.query.item);
    if (!idItem) return res.status(400).json({ erro: 'O filtro item deve ser um ID válido' });
    valores.push(idItem);
    filtros.push(`p.id_item = $${valores.length}`);
  }
  if (req.query.status !== undefined) {
    if (!STATUS_PROPOSTA.includes(req.query.status)) {
      return res.status(400).json({ erro: `O filtro status deve ser: ${STATUS_PROPOSTA.join(', ')}` });
    }
    valores.push(req.query.status);
    filtros.push(`p.status = $${valores.length}`);
  }

  const { rows } = await pool.query(
    `SELECT p.id_proposta, p.id_item, i.nome AS item, i.categoria,
            p.id_fornecedor, u.nome AS fornecedor,
            p.valor_total, p.descricao, p.validade, p.observacoes, p.status, p.data_proposta,
            (p.valor_total = MIN(p.valor_total) OVER (PARTITION BY p.id_item)) AS menor_valor
       FROM propostas p
       JOIN itens_custo i  ON i.id_item = p.id_item
       JOIN fornecedores f ON f.id_fornecedor = p.id_fornecedor
       JOIN usuarios u     ON u.id_usuario = f.id_usuario
      WHERE ${filtros.join(' AND ')}
      ORDER BY i.id_item, p.valor_total`,
    valores
  );
  res.json(rows);
}

// Busca a proposta DENTRO do evento do organizador (ou responde o erro e devolve null)
async function buscarPropostaDoEvento(req, res) {
  const idProposta = idValido(req.params.idProposta);
  if (!idProposta) {
    res.status(400).json({ erro: 'ID de proposta inválido' });
    return null;
  }
  const { rows } = await pool.query(
    `SELECT id_proposta, id_item, status, (validade >= CURRENT_DATE) AS vigente
       FROM propostas WHERE id_proposta = $1 AND id_evento = $2`,
    [idProposta, req.evento.id_evento]
  );
  if (!rows[0]) {
    res.status(404).json({ erro: 'Proposta não encontrada neste evento' });
    return null;
  }
  return rows[0];
}

// RF12 – Selecionar a proposta que vai compor o orçamento (uma por item)
async function selecionarProposta(req, res) {
  if (req.evento.status !== 'aberto') {
    return res.status(409).json({
      erro: 'Só é possível selecionar propostas com o evento aberto para cotação',
    });
  }
  const proposta = await buscarPropostaDoEvento(req, res);
  if (!proposta) return;

  if (!['enviada', 'aceita'].includes(proposta.status)) {
    return res.status(409).json({ erro: `Uma proposta ${proposta.status} não pode ser selecionada` });
  }
  if (!proposta.vigente) {
    return res.status(409).json({ erro: 'Esta proposta está com a validade vencida' });
  }

  // tudo ou nada: tira a escolha anterior do item e marca a nova
  await emTransacao(async (client) => {
    await client.query(
      `UPDATE propostas SET status = 'enviada' WHERE id_item = $1 AND status = 'aceita'`,
      [proposta.id_item]
    );
    await client.query(
      `UPDATE propostas SET status = 'aceita' WHERE id_proposta = $1`,
      [proposta.id_proposta]
    );
  });
  res.json({ id_proposta: proposta.id_proposta, id_item: proposta.id_item, status: 'aceita' });
}

// RF12 – Desfazer a escolha (o item volta a ficar sem proposta selecionada)
async function desselecionarProposta(req, res) {
  if (req.evento.status !== 'aberto') {
    return res.status(409).json({
      erro: 'Só é possível alterar a seleção com o evento aberto para cotação',
    });
  }
  const proposta = await buscarPropostaDoEvento(req, res);
  if (!proposta) return;

  if (proposta.status !== 'aceita') {
    return res.status(409).json({ erro: 'Esta proposta não está selecionada' });
  }
  await pool.query(
    `UPDATE propostas SET status = 'enviada' WHERE id_proposta = $1`,
    [proposta.id_proposta]
  );
  res.json({ id_proposta: proposta.id_proposta, id_item: proposta.id_item, status: 'enviada' });
}

module.exports = { listarPropostas, selecionarProposta, desselecionarProposta };
