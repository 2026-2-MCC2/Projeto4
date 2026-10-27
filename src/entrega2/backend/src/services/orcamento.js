const pool = require('../config/db');
const { calcularTicket } = require('./ticket');

// Nas somas, o dinheiro vira CENTAVOS (número inteiro) para evitar erros do computador
// como 0.1 + 0.2 = 0.30000000000000004.
const emCentavos = (reais) => Math.round(reais * 100);
const emReais = (centavos) => centavos / 100;

// RF12 – Orçamento consolidado: propostas escolhidas + custos cadastrados
async function montarOrcamento(idEvento) {
  // cada item com a proposta ACEITA (se já houver uma)
  const { rows: itens } = await pool.query(
    `SELECT i.id_item, i.nome, i.categoria,
            p.id_proposta, p.valor_total AS valor_proposta, u.nome AS fornecedor
       FROM itens_custo i
       LEFT JOIN propostas p    ON p.id_item = i.id_item AND p.status = 'aceita'
       LEFT JOIN fornecedores f ON f.id_fornecedor = p.id_fornecedor
       LEFT JOIN usuarios u     ON u.id_usuario = f.id_usuario
      WHERE i.id_evento = $1
      ORDER BY i.id_item`,
    [idEvento]
  );

  const { rows: custos } = await pool.query(
    `SELECT id_custo, tipo, descricao, valor, por_participante
       FROM custos_evento WHERE id_evento = $1 ORDER BY id_custo`,
    [idEvento]
  );

  let propostas = 0;        // soma das propostas aceitas
  let fixos = 0;            // custos de valor total
  let porParticipante = 0;  // custos cobrados por pessoa
  for (const item of itens) {
    if (item.valor_proposta !== null) propostas += emCentavos(item.valor_proposta);
  }
  for (const custo of custos) {
    if (custo.por_participante) porParticipante += emCentavos(custo.valor);
    else fixos += emCentavos(custo.valor);
  }

  return {
    itens,
    custos,
    itens_sem_proposta: itens.filter((item) => item.id_proposta === null).length,
    total_propostas: emReais(propostas),
    total_custos_fixos: emReais(fixos),
    custo_fixo_total: emReais(propostas + fixos),          // não depende do público
    custo_por_participante: emReais(porParticipante),      // multiplica pelo público
  };
}

// Custo total do evento para um certo público = fixo + (custo por pessoa × público)
function custoParaPublico(orcamento, publico) {
  const fixo = emCentavos(orcamento.custo_fixo_total);
  const variavel = emCentavos(orcamento.custo_por_participante) * publico;
  return emReais(fixo + variavel);
}

// RF13 – Ticket nos cenários de público mínimo, máximo e (opcional) esperado
function montarTicket(evento, orcamento, publicoEsperado = null) {
  if (evento.publico_minimo === null || evento.publico_maximo === null) {
    return { erro: 'Defina o público mínimo e máximo do evento antes de calcular o ticket' };
  }

  const publicos = [
    ['minimo', evento.publico_minimo],
    ['maximo', evento.publico_maximo],
  ];
  if (publicoEsperado !== null) publicos.push(['esperado', publicoEsperado]);

  const cenarios = [];
  for (const [nome, publico] of publicos) {
    const custoTotal = custoParaPublico(orcamento, publico);
    const calculo = calcularTicket({ custoTotal, publico, margemPercentual: evento.margem_lucro });
    if (calculo.erro) return calculo;
    cenarios.push({ cenario: nome, publico, custo_total: custoTotal, ...calculo });
  }

  let aviso = null;
  if (orcamento.itens.length === 0 && orcamento.custos.length === 0) {
    aviso = 'Nenhum custo cadastrado ainda: o ticket está zerado';
  } else if (orcamento.itens_sem_proposta > 0) {
    aviso = `${orcamento.itens_sem_proposta} item(ns) ainda sem proposta selecionada: ` +
            'o ticket é uma estimativa parcial';
  }

  return {
    formula: 'ticket_alvo = custo_total / (publico x (1 - margem)); ' +
             'ticket_equilibrio = custo_total / publico',
    arredondamento: 'para cima, com 2 casas decimais',
    margem_lucro: evento.margem_lucro,
    aviso,
    cenarios,
  };
}

module.exports = { montarOrcamento, montarTicket, custoParaPublico };
