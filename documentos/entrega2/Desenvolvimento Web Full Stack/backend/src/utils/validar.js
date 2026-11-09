// Funções pequenas para conferir o que chega do frontend.
// Todas devolvem o valor já convertido, ou null quando é inválido.

// "12" → 12 | 12.5 → 12.5 | "abc", "", null, true → null
function numero(valor) {
  if (valor === null || valor === undefined || valor === '' || typeof valor === 'boolean') {
    return null;
  }
  const n = Number(valor);
  return Number.isFinite(n) ? n : null;
}

// "12" → 12 | 12.5 → null
function inteiro(valor) {
  const n = numero(valor);
  return Number.isInteger(n) ? n : null;
}

// Aceita só números inteiros maiores que zero (usado nos ids das rotas): "7" → 7 | "0" → null
function idValido(valor) {
  const n = inteiro(valor);
  return n !== null && n > 0 ? n : null;
}

// Aceita só "AAAA-MM-DD" e só datas que existem ("2026-02-30" → null)
function data(valor) {
  if (typeof valor !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) return null;
  const d = new Date(`${valor}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === valor ? valor : null;
}

// true para o que o frontend manda quando o campo foi deixado em branco: undefined, null ou ""
const vazio = (valor) => valor === undefined || valor === null || valor === '';

// Texto sem espaços nas pontas; null se estiver vazio ou passar do tamanho máximo
function texto(valor, max) {
  if (typeof valor !== 'string') return null;
  const limpo = valor.trim();
  return limpo.length > 0 && limpo.length <= max ? limpo : null;
}

// Data de hoje no formato "AAAA-MM-DD" (UTC, o mesmo fuso do banco no Supabase)
const hoje = () => new Date().toISOString().slice(0, 10);

module.exports = { numero, inteiro, idValido, data, texto, vazio, hoje };
