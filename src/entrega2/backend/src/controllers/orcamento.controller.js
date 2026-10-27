const { inteiro } = require('../utils/validar');
const { montarOrcamento, montarTicket } = require('../services/orcamento');

// RF12 – Orçamento consolidado do evento
async function obterOrcamento(req, res) {
  const orcamento = await montarOrcamento(req.evento.id_evento);
  res.json({ id_evento: req.evento.id_evento, ...orcamento });
}

// RF13 – Ticket estimado. Opcional: ?publico_esperado=800
async function obterTicket(req, res) {
  const { publico_minimo: minimo, publico_maximo: maximo } = req.evento;
  if (minimo === null || maximo === null) {
    return res.status(422).json({
      erro: 'Defina o público mínimo e máximo do evento antes de calcular o ticket',
    });
  }

  let publicoEsperado = null;
  if (req.query.publico_esperado !== undefined) {
    publicoEsperado = inteiro(req.query.publico_esperado);
    if (publicoEsperado === null || publicoEsperado < minimo || publicoEsperado > maximo) {
      return res.status(400).json({
        erro: `O público esperado deve ser um número inteiro entre ${minimo} e ${maximo}`,
      });
    }
  }

  const orcamento = await montarOrcamento(req.evento.id_evento);
  const ticket = montarTicket(req.evento, orcamento, publicoEsperado);
  if (ticket.erro) return res.status(422).json({ erro: ticket.erro });

  res.json({ id_evento: req.evento.id_evento, nome: req.evento.nome, ...ticket });
}

module.exports = { obterOrcamento, obterTicket };
