const { test } = require('node:test');
const assert = require('node:assert/strict');
const { montarTicket, custoParaPublico } = require('../src/services/orcamento');

const orcamentoExemplo = {
  itens: [],
  custos: [],
  itens_sem_proposta: 0,
  total_propostas: 18500,
  total_custos_fixos: 5000,
  custo_fixo_total: 23500, // propostas + custos fixos
  custo_por_participante: 10,
};

test('custoParaPublico soma o fixo com o variável multiplicado pelo público', () => {
  assert.equal(custoParaPublico(orcamentoExemplo, 500), 28500);
  assert.equal(custoParaPublico(orcamentoExemplo, 1000), 33500);
});

test('montarTicket gera os cenários mínimo e máximo do evento, e erra sem público definido', () => {
  const evento = { publico_minimo: 500, publico_maximo: 1000, margem_lucro: 20 };
  const resultado = montarTicket(evento, orcamentoExemplo);
  assert.equal(resultado.cenarios.length, 2);
  assert.equal(resultado.cenarios[0].cenario, 'minimo');
  assert.equal(resultado.cenarios[0].ticket_alvo, 71.25);
  assert.equal(resultado.cenarios[1].ticket_alvo, 41.88);

  const semPublico = montarTicket({ publico_minimo: null, publico_maximo: null, margem_lucro: 20 }, orcamentoExemplo);
  assert.ok(semPublico.erro);
});

test('montarTicket inclui o cenário "esperado" só quando o público esperado é passado', () => {
  const evento = { publico_minimo: 500, publico_maximo: 1000, margem_lucro: 20 };
  const resultado = montarTicket(evento, orcamentoExemplo, 800);
  assert.equal(resultado.cenarios.length, 3);
  assert.equal(resultado.cenarios[2].cenario, 'esperado');
  assert.equal(resultado.cenarios[2].publico, 800);
});

test('montarTicket avisa quando ainda falta proposta selecionada em algum item', () => {
  const evento = { publico_minimo: 500, publico_maximo: 1000, margem_lucro: 20 };
  const comPendencia = { ...orcamentoExemplo, itens: [{ id_item: 1 }], itens_sem_proposta: 1 };
  const resultado = montarTicket(evento, comPendencia);
  assert.match(resultado.aviso, /sem proposta selecionada/);
});
