const pool = require('../config/db');
const { emTransacao } = require('../config/transacao');
const { CAMPOS_EVENTO } = require('../services/eventos');
const { numero, inteiro, data, texto, vazio } = require('../utils/validar');
const { registrarLog } = require('../utils/registrar-log');
const { montarOrcamento, montarTicket } = require('../services/orcamento');

// Para onde um evento pode "andar" (RF08): rascunho → aberto → fechado, ou cancelado
const TRANSICOES = {
  rascunho: ['aberto', 'cancelado'],
  aberto: ['fechado', 'cancelado'],
};

// Confere os campos do evento. Devolve { erro } ou { dados } já limpos.
function validarEvento(corpo) {
  const nome = texto(corpo.nome, 150);
  const local = texto(corpo.local, 200);
  const dataInicio = data(corpo.data);
  const temDataFim = !vazio(corpo.data_fim);
  const dataFim = temDataFim ? data(corpo.data_fim) : null;
  const temDescricao = !vazio(corpo.descricao);
  const descricao = temDescricao ? texto(corpo.descricao, 2000) : null;
  const temPublicoMinimo = !vazio(corpo.publico_minimo);
  const temPublicoMaximo = !vazio(corpo.publico_maximo);
  const publicoMinimo = temPublicoMinimo ? inteiro(corpo.publico_minimo) : null;
  const publicoMaximo = temPublicoMaximo ? inteiro(corpo.publico_maximo) : null;
  const margem = numero(corpo.margem_lucro ?? 0);

  if (!nome) return { erro: 'Informe o nome do evento (até 150 caracteres)' };
  if (!local) return { erro: 'Informe o local do evento (até 200 caracteres)' };
  if (!dataInicio) return { erro: 'Informe a data de início no formato AAAA-MM-DD' };
  if (temDataFim && !dataFim) return { erro: 'A data de fim deve estar no formato AAAA-MM-DD' };
  if (dataFim && dataFim < dataInicio) {
    return { erro: 'A data de fim não pode ser anterior à data de início' };
  }
  if (temDescricao && !descricao) return { erro: 'A descrição deve ter no máximo 2000 caracteres' };
  // público é opcional enquanto o evento está em rascunho; passa a ser exigido só para publicar (RF08)
  if (temPublicoMinimo && (publicoMinimo === null || publicoMinimo <= 0)) {
    return { erro: 'O público mínimo deve ser um número inteiro maior que zero' };
  }
  if (temPublicoMaximo && (publicoMaximo === null || publicoMaximo < (publicoMinimo ?? 1))) {
    return { erro: 'O público máximo deve ser um número inteiro maior ou igual ao mínimo' };
  }
  if (temPublicoMaximo && !temPublicoMinimo) {
    return { erro: 'Informe também o público mínimo' };
  }
  if (margem === null || margem < 0 || margem >= 100) {
    return { erro: 'A margem de lucro deve estar entre 0 e 99,99 (em %)' };
  }

  return {
    dados: {
      nome, local, descricao,
      data: dataInicio, data_fim: dataFim,
      publico_minimo: publicoMinimo, publico_maximo: publicoMaximo, margem_lucro: margem,
    },
  };
}

// RF05 – Criar evento (nasce como "rascunho")
async function criarEvento(req, res) {
  const { erro, dados } = validarEvento(req.body);
  if (erro) return res.status(400).json({ erro });

  const { rows } = await pool.query(
    `INSERT INTO eventos (id_organizador, nome, data, data_fim, local, descricao,
                          publico_minimo, publico_maximo, margem_lucro)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING ${CAMPOS_EVENTO}`,
    [req.idOrganizador, dados.nome, dados.data, dados.data_fim, dados.local, dados.descricao,
     dados.publico_minimo, dados.publico_maximo, dados.margem_lucro]
  );
  await registrarLog(req.usuario.id, 'evento_criado', `#${rows[0].id_evento} — ${rows[0].nome}`);
  res.status(201).json(rows[0]);
}

// RF05 – Listar os eventos do organizador logado
// Acrescenta "ticket_a_partir_de": o ticket-alvo no cenário de público mínimo,
// pra aparecer direto na lista sem precisar entrar em cada evento (null se o
// evento ainda não tem público mínimo/máximo definidos).
async function listarEventos(req, res) {
  const { rows } = await pool.query(
    `SELECT e.id_evento, e.nome, e.data, e.data_fim, e.local, e.publico_minimo,
            e.publico_maximo, e.margem_lucro, e.status,
            (SELECT COUNT(*) FROM itens_custo i WHERE i.id_evento = e.id_evento) AS total_itens
       FROM eventos e
      WHERE e.id_organizador = $1
      ORDER BY e.data DESC, e.id_evento DESC`,
    [req.idOrganizador]
  );

  const comTicket = await Promise.all(
    rows.map(async (evento) => {
      if (evento.publico_minimo === null || evento.publico_maximo === null) {
        return { ...evento, ticket_a_partir_de: null };
      }
      const orcamento = await montarOrcamento(evento.id_evento);
      const ticket = montarTicket(evento, orcamento);
      const minimo = ticket.cenarios?.find((c) => c.cenario === 'minimo');
      return { ...evento, ticket_a_partir_de: minimo ? minimo.ticket_alvo : null };
    })
  );
  res.json(comTicket);
}

// RF05 – Ver um evento (req.evento já foi carregado e conferido pelo middleware)
function buscarEvento(req, res) {
  res.json(req.evento);
}

// RF05 – Atualizar evento (só enquanto for rascunho ou aberto)
async function atualizarEvento(req, res) {
  if (!['rascunho', 'aberto'].includes(req.evento.status)) {
    return res.status(409).json({ erro: `Evento ${req.evento.status} não pode mais ser editado` });
  }
  const { erro, dados } = validarEvento(req.body);
  if (erro) return res.status(400).json({ erro });

  const { rows } = await pool.query(
    `UPDATE eventos
        SET nome = $1, data = $2, data_fim = $3, local = $4, descricao = $5,
            publico_minimo = $6, publico_maximo = $7, margem_lucro = $8
      WHERE id_evento = $9
      RETURNING ${CAMPOS_EVENTO}`,
    [dados.nome, dados.data, dados.data_fim, dados.local, dados.descricao,
     dados.publico_minimo, dados.publico_maximo, dados.margem_lucro, req.evento.id_evento]
  );
  res.json(rows[0]);
}

// RF05 – Excluir evento (só rascunho; itens e custos vão junto, por causa do ON DELETE CASCADE)
async function excluirEvento(req, res) {
  if (req.evento.status !== 'rascunho') {
    return res.status(409).json({
      erro: 'Só é possível excluir eventos em rascunho. Use o status "cancelado"',
    });
  }
  await pool.query('DELETE FROM eventos WHERE id_evento = $1', [req.evento.id_evento]);
  res.status(204).send();
}

// RF08 – Mudar o status: publicar para cotação (aberto), encerrar cotação (fechado) ou cancelar
async function alterarStatus(req, res) {
  const novo = req.body.status;
  if (!['aberto', 'fechado', 'cancelado'].includes(novo)) {
    return res.status(400).json({ erro: "O status deve ser 'aberto', 'fechado' ou 'cancelado'" });
  }

  const atual = req.evento.status;
  if (!(TRANSICOES[atual] || []).includes(novo)) {
    return res.status(409).json({
      erro: `Não é possível mudar o evento de '${atual}' para '${novo}'`,
    });
  }

  if (novo === 'aberto') {
    const { rows } = await pool.query(
      'SELECT COUNT(*) AS total FROM itens_custo WHERE id_evento = $1',
      [req.evento.id_evento]
    );
    if (Number(rows[0].total) === 0) {
      return res.status(409).json({
        erro: 'Cadastre ao menos um item de custo antes de publicar o evento',
      });
    }
    if (req.evento.publico_minimo === null || req.evento.publico_maximo === null) {
      return res.status(409).json({
        erro: 'Defina o público mínimo e máximo antes de publicar o evento',
      });
    }
  }

  const evento = await emTransacao(async (client) => {
    const { rows } = await client.query(
      `UPDATE eventos SET status = $1 WHERE id_evento = $2 RETURNING ${CAMPOS_EVENTO}`,
      [novo, req.evento.id_evento]
    );
    if (novo === 'fechado' || novo === 'cancelado') {
      // quem não foi escolhido fica "recusada"
      await client.query(
        `UPDATE propostas SET status = 'recusada' WHERE id_evento = $1 AND status = 'enviada'`,
        [req.evento.id_evento]
      );
    }
    return rows[0];
  });
  await registrarLog(req.usuario.id, 'evento_status_alterado', `#${evento.id_evento} -> ${novo}`);
  res.json(evento);
}

// Visão geral: todas as propostas recebidas em qualquer evento do organizador,
// pra não precisar entrar evento por evento só pra ver o que está pendente de decisão.
async function listarPropostasOrganizador(req, res) {
  const { rows } = await pool.query(
    `SELECT p.id_proposta, p.id_item, p.id_evento, e.nome AS evento, e.status AS status_evento,
            i.nome AS item, i.categoria, u.nome AS fornecedor,
            p.valor_total, p.descricao, p.validade, p.observacoes, p.status, p.data_proposta
       FROM propostas p
       JOIN eventos e      ON e.id_evento = p.id_evento
       JOIN itens_custo i  ON i.id_item = p.id_item
       JOIN fornecedores f ON f.id_fornecedor = p.id_fornecedor
       JOIN usuarios u     ON u.id_usuario = f.id_usuario
      WHERE e.id_organizador = $1 AND p.id_item IS NOT NULL
      ORDER BY (p.status = 'enviada') DESC, p.data_proposta DESC`,
    [req.idOrganizador]
  );
  res.json(rows);
}

module.exports = {
  criarEvento, listarEventos, buscarEvento, atualizarEvento, excluirEvento, alterarStatus,
  listarPropostasOrganizador,
};
