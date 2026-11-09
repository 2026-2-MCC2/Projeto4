const { test } = require('node:test');
const assert = require('node:assert/strict');
const { numero, inteiro, idValido, data, texto, vazio } = require('../src/utils/validar');

test('numero aceita número e string numérica, rejeita texto/boolean/vazio', () => {
  assert.equal(numero('12'), 12);
  assert.equal(numero(12.5), 12.5);
  assert.equal(numero('abc'), null);
  assert.equal(numero(''), null);
  assert.equal(numero(null), null);
  assert.equal(numero(true), null);
});

test('inteiro aceita só número inteiro', () => {
  assert.equal(inteiro('12'), 12);
  assert.equal(inteiro('12.5'), null);
});

test('idValido aceita só inteiro maior que zero', () => {
  assert.equal(idValido('7'), 7);
  assert.equal(idValido('0'), null);
  assert.equal(idValido('-1'), null);
  assert.equal(idValido('abc'), null);
});

test('data aceita só AAAA-MM-DD válido, rejeita data inexistente (30 de fevereiro)', () => {
  assert.equal(data('2026-02-30'), null);
  assert.equal(data('2026-12-31'), '2026-12-31');
  assert.equal(data('31-12-2026'), null);
  assert.equal(data('2026-13-01'), null);
});

test('texto corta espaço nas pontas e respeita o tamanho máximo', () => {
  assert.equal(texto('  Festival  ', 20), 'Festival');
  assert.equal(texto('', 20), null);
  assert.equal(texto('a'.repeat(21), 20), null);
  assert.equal(texto(123, 20), null);
});

test('vazio reconhece undefined, null e string vazia; não confunde 0 nem false com vazio', () => {
  assert.equal(vazio(undefined), true);
  assert.equal(vazio(null), true);
  assert.equal(vazio(''), true);
  assert.equal(vazio(0), false);
  assert.equal(vazio(false), false);
});
