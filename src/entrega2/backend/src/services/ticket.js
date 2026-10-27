// REGRA DE NEGÓCIO: cálculo do ticket (RF13). Não mexe em banco nem em rotas.
//
//   ticket de equilíbrio = custo_total / público                      (lucro zero)
//   ticket-alvo          = custo_total / [público × (1 − margem)]     (margem sobre a RECEITA)
//
// Exemplo: custo R$ 10.000, público 100, margem 20%
//   equilíbrio = 10000 / 100            = R$ 100,00
//   alvo       = 10000 / (100 × 0,80)   = R$ 125,00
//
// Arredondamento: SEMPRE PARA CIMA, na segunda casa decimal (centavos).
// Assim o ingresso nunca fica abaixo do necessário para cobrir o custo/margem.

// 125.00000000000001 (erro comum do computador) → 125 ; 125.001 → 125.01
const arredondarParaCima = (valor) => Math.ceil(Number((valor * 100).toFixed(6))) / 100;

// margemPercentual vem de 0 a 99.99 (ex.: 20 = 20%)
// Devolve { erro } se algum dado for inválido; senão devolve os tickets.
function calcularTicket({ custoTotal, publico, margemPercentual }) {
  if (!Number.isFinite(custoTotal) || custoTotal < 0) {
    return { erro: 'O custo total deve ser um número maior ou igual a zero' };
  }
  if (!Number.isInteger(publico) || publico <= 0) {
    return { erro: 'O público deve ser um número inteiro maior que zero' };
  }
  if (!Number.isFinite(margemPercentual) || margemPercentual < 0 || margemPercentual >= 100) {
    return { erro: 'A margem de lucro deve estar entre 0 e 99,99%' };
  }

  const margem = margemPercentual / 100;
  const ticketEquilibrio = arredondarParaCima(custoTotal / publico);
  const ticketAlvo = arredondarParaCima(custoTotal / (publico * (1 - margem)));
  const receita = Math.round(ticketAlvo * publico * 100) / 100;
  const lucro = Math.round((receita - custoTotal) * 100) / 100;

  return {
    ticket_equilibrio: ticketEquilibrio,
    ticket_alvo: ticketAlvo,
    receita_estimada: receita,
    lucro_estimado: lucro,
  };
}

module.exports = { calcularTicket, arredondarParaCima };
