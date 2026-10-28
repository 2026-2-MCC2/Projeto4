const { test } = require('node:test');
const assert = require('node:assert/strict');
const { calcularTicket, arredondarParaCima } = require('../src/services/ticket');

test('calcularTicket bate com o exemplo oficial do RF13 (custo 10000, público 100, margem 20%)', () => {
  const r = calcularTicket({ custoTotal: 10000, publico: 100, margemPercentual: 20 });
  assert.equal(r.ticket_equilibrio, 100);
  assert.equal(r.ticket_alvo, 125);
});

test('calcularTicket bate com o cenário real seedado (Festival de Verão 2026, público mínimo 500)', () => {
  // custo_total = propostas aceitas (18500) + custo fiscal fixo (5000) + custo por participante (10 x 500)
  const r = calcularTicket({ custoTotal: 28500, publico: 500, margemPercentual: 20 });
  assert.equal(r.ticket_equilibrio, 57);
  assert.equal(r.ticket_alvo, 71.25);
  assert.equal(r.receita_estimada, 35625);
  assert.equal(r.lucro_estimado, 7125);
});

test('calcularTicket com margem zero: alvo e equilíbrio ficam iguais', () => {
  const r = calcularTicket({ custoTotal: 1000, publico: 50, margemPercentual: 0 });
  assert.equal(r.ticket_equilibrio, r.ticket_alvo);
});

test('calcularTicket arredonda sempre para cima (nunca deixa o ingresso abaixo do custo)', () => {
  const r = calcularTicket({ custoTotal: 100, publico: 3, margemPercentual: 0 });
  // 100/3 = 33.333... deveria virar 33.34, nunca 33.33
  assert.equal(r.ticket_equilibrio, 33.34);
});

test('calcularTicket rejeita custo negativo', () => {
  const r = calcularTicket({ custoTotal: -1, publico: 10, margemPercentual: 10 });
  assert.ok(r.erro);
});

test('calcularTicket rejeita público zero ou não inteiro', () => {
  assert.ok(calcularTicket({ custoTotal: 100, publico: 0, margemPercentual: 10 }).erro);
  assert.ok(calcularTicket({ custoTotal: 100, publico: 2.5, margemPercentual: 10 }).erro);
});

test('calcularTicket rejeita margem fora de 0-99.99', () => {
  assert.ok(calcularTicket({ custoTotal: 100, publico: 10, margemPercentual: -1 }).erro);
  assert.ok(calcularTicket({ custoTotal: 100, publico: 10, margemPercentual: 100 }).erro);
});

test('arredondarParaCima lida com erro de ponto flutuante (125.00000000000001 -> 125)', () => {
  assert.equal(arredondarParaCima(125.00000000000001), 125);
});
