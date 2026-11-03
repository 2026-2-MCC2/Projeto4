// Vitrine pública (sem login): eventos à venda e ingressos em revenda.
// Usado pela landing page, por /eventos e pela área logada do cliente
// (que mostra a mesma vitrine, só que dentro do layout autenticado).
import { api } from './cliente'

export function listarEventosPublicos(filtros) {
  return api.get('/api/publico/eventos', filtros)
}

export function buscarEventoPublico(id) {
  return api.get(`/api/publico/eventos/${id}`)
}

export function listarRevendasPublicas(filtros) {
  return api.get('/api/publico/revendas', filtros)
}
