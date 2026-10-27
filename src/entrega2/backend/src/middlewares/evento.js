const { idValido } = require('../utils/validar');
const { eventoDoOrganizador } = require('../services/eventos');

// Roda em toda rota "/:id/...": confere o id e se o evento é do organizador logado.
// Depois disso as rotas usam req.evento (já carregado do banco).
async function carregarEvento(req, res, next) {
  const idEvento = idValido(req.params.id);
  if (!idEvento) {
    return res.status(400).json({ erro: 'ID de evento inválido' });
  }
  const evento = await eventoDoOrganizador(idEvento, req.idOrganizador);
  if (!evento) {
    return res.status(404).json({ erro: 'Evento não encontrado' });
  }
  req.evento = evento;
  next();
}

module.exports = { carregarEvento };
