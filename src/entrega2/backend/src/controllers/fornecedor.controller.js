const pool = require('../config/db');
const { idValido, numero, data, texto, vazio, hoje } = require('../utils/validar');

// Só aparecem para o fornecedor os eventos abertos para cotação que ainda não terminaram
const EVENTO_DISPONIVEL = "e.status = 'aberto' AND COALESCE(e.data_fim, e.data) >= CURRENT_DATE";

// RF09 – Eventos disponíveis para enviar propostas
// (a margem de lucro e os custos do organizador NÃO aparecem aqui, de propósito)
async function listarEventos(req, res) {
  const { rows } = await pool.query(
    `SELECT e.id_evento, e.nome, e.data, e.data_fim, e.local, e.descricao,
            e.publico_minimo, e.publico_maximo, u.nome AS organizador,
            (SELECT COUNT(*) FROM itens_custo i WHERE i.id_evento = e.id_evento) AS total_itens
       FROM eventos e
       JOIN organizadores o ON o.id_organizador = e.id_organizador
       JOIN usuarios u      ON u.id_usuario = o.id_usuario
      WHERE ${EVENTO_DISPONIVEL}
      ORDER BY e.data, e.id_evento`
  );
  res.json(rows);
}

// RF09 – Detalhe de um evento + itens de custo (cada item mostra a minha proposta, se existir)
async function buscarEvento(req, res) {
  const idEvento = idValido(req.params.id);
  if (!idEvento) return res.status(400).json({ erro: 'ID de evento inválido' });

  const { rows } = await pool.query(
    `SELECT e.id_evento, e.nome, e.data, e.data_fim, e.local, e.descricao,
            e.publico_minimo, e.publico_maximo, u.nome AS organizador
       FROM eventos e
       JOIN organizadores o ON o.id_organizador = e.id_organizador
       JOIN usuarios u      ON u.id_usuario = o.id_usuario
      WHERE e.id_evento = $1 AND ${EVENTO_DISPONIVEL}`,
    [idEvento]
  );
  if (!rows[0]) {
    return res.status(404).json({ erro: 'Evento não encontrado ou fechado para cotação' });
  }

  const { rows: itens } = await pool.query(
    `SELECT i.id_item, i.nome, i.categoria, i.descricao,
            p.id_proposta AS minha_proposta, p.valor_total AS meu_valor, p.status AS status_proposta
       FROM itens_custo i
       LEFT JOIN propostas p ON p.id_item = i.id_item
                            AND p.id_fornecedor = $2
                            AND p.status IN ('enviada', 'aceita')
      WHERE i.id_evento = $1
      ORDER BY i.id_item`,
    [idEvento, req.idFornecedor]
  );
  res.json({ ...rows[0], itens });
}

// Confere os campos da proposta. Devolve { erro } ou { dados }.
function validarProposta(corpo) {
  const valor = numero(corpo.valor_total);
  const descricao = texto(corpo.descricao, 2000);
  const validade = data(corpo.validade);
  const temObservacoes = !vazio(corpo.observacoes);
  const observacoes = temObservacoes ? texto(corpo.observacoes, 2000) : null;

  if (valor === null || valor <= 0 || valor > 99999999.99) {
    return { erro: 'O valor da proposta deve ser maior que zero' };
  }
  if (!descricao) return { erro: 'Descreva o que está sendo oferecido (até 2000 caracteres)' };
  if (!validade) return { erro: 'Informe a validade da proposta no formato AAAA-MM-DD' };
  if (validade < hoje()) return { erro: 'A validade da proposta não pode estar no passado' };
  if (temObservacoes && !observacoes) {
    return { erro: 'As observações devem ter no máximo 2000 caracteres' };
  }
  return { dados: { valor_total: valor, descricao, validade, observacoes } };
}

const CAMPOS_PROPOSTA = `id_proposta, id_evento, id_item, id_fornecedor, valor_total,
                         descricao, validade, observacoes, status, data_proposta`;

// RF10 – Enviar proposta para um item de um evento
async function enviarProposta(req, res) {
  const idItem = idValido(req.body.id_item);
  if (!idItem) {
    return res.status(400).json({ erro: 'Informe o id_item (número inteiro maior que zero)' });
  }
  const { erro, dados } = validarProposta(req.body);
  if (erro) return res.status(400).json({ erro });

  const { rows: itens } = await pool.query(
    `SELECT i.id_item, i.id_evento, (${EVENTO_DISPONIVEL}) AS disponivel
       FROM itens_custo i
       JOIN eventos e ON e.id_evento = i.id_evento
      WHERE i.id_item = $1`,
    [idItem]
  );
  if (!itens[0]) return res.status(404).json({ erro: 'Item não encontrado' });
  if (!itens[0].disponivel) {
    return res.status(409).json({ erro: 'Este evento não está aberto para cotação' });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO propostas
         (id_evento, id_item, id_fornecedor, valor_total, descricao, validade, observacoes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING ${CAMPOS_PROPOSTA}`,
      [itens[0].id_evento, idItem, req.idFornecedor,
       dados.valor_total, dados.descricao, dados.validade, dados.observacoes]
    );
    res.status(201).json(rows[0]);
  } catch (erroBanco) {
    if (erroBanco.code === '23505') { // código do Postgres para "valor duplicado"
      return res.status(409).json({
        erro: 'Você já enviou uma proposta para este item. Edite a existente',
      });
    }
    throw erroBanco;
  }
}

// Histórico do fornecedor – filtro opcional ?status=enviada
async function listarMinhasPropostas(req, res) {
  const valores = [req.idFornecedor];
  let filtroStatus = '';
  if (req.query.status !== undefined) {
    if (!['enviada', 'aceita', 'recusada', 'cancelada'].includes(req.query.status)) {
      return res.status(400).json({ erro: 'Status inválido' });
    }
    valores.push(req.query.status);
    filtroStatus = 'AND p.status = $2';
  }

  const { rows } = await pool.query(
    `SELECT p.id_proposta, p.id_evento, e.nome AS evento, p.id_item, i.nome AS item,
            p.valor_total, p.descricao, p.validade, p.observacoes, p.status, p.data_proposta
       FROM propostas p
       JOIN itens_custo i ON i.id_item = p.id_item
       JOIN eventos e     ON e.id_evento = p.id_evento
      WHERE p.id_fornecedor = $1 ${filtroStatus}
      ORDER BY p.id_proposta DESC`,
    valores
  );
  res.json(rows);
}

// Busca a proposta SE for do fornecedor logado (ou responde o erro e devolve null)
async function buscarMinhaProposta(req, res) {
  const idProposta = idValido(req.params.id);
  if (!idProposta) {
    res.status(400).json({ erro: 'ID de proposta inválido' });
    return null;
  }
  const { rows } = await pool.query(
    `SELECT p.id_proposta, p.status, (${EVENTO_DISPONIVEL}) AS disponivel
       FROM propostas p
       JOIN eventos e ON e.id_evento = p.id_evento
      WHERE p.id_proposta = $1 AND p.id_fornecedor = $2`,
    [idProposta, req.idFornecedor]
  );
  if (!rows[0]) {
    res.status(404).json({ erro: 'Proposta não encontrada' });
    return null;
  }
  return rows[0];
}

// Editar proposta (só enquanto estiver "enviada" e o evento aberto)
async function editarProposta(req, res) {
  const proposta = await buscarMinhaProposta(req, res);
  if (!proposta) return;
  if (proposta.status !== 'enviada' || !proposta.disponivel) {
    return res.status(409).json({
      erro: 'Só é possível editar propostas enviadas de eventos abertos',
    });
  }
  const { erro, dados } = validarProposta(req.body);
  if (erro) return res.status(400).json({ erro });

  const { rows } = await pool.query(
    `UPDATE propostas SET valor_total = $1, descricao = $2, validade = $3, observacoes = $4
      WHERE id_proposta = $5
      RETURNING ${CAMPOS_PROPOSTA}`,
    [dados.valor_total, dados.descricao, dados.validade, dados.observacoes, proposta.id_proposta]
  );
  res.json(rows[0]);
}

// Cancelar proposta (só se ainda estiver "enviada")
async function cancelarProposta(req, res) {
  const proposta = await buscarMinhaProposta(req, res);
  if (!proposta) return;
  if (proposta.status !== 'enviada') {
    return res.status(409).json({ erro: `Uma proposta ${proposta.status} não pode ser cancelada` });
  }
  const { rows } = await pool.query(
    `UPDATE propostas SET status = 'cancelada' WHERE id_proposta = $1 RETURNING ${CAMPOS_PROPOSTA}`,
    [proposta.id_proposta]
  );
  res.json(rows[0]);
}

module.exports = {
  listarEventos, buscarEvento, enviarProposta, listarMinhasPropostas, editarProposta, cancelarProposta,
};
