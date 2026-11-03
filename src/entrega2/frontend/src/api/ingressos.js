// Ações do cliente autenticado: comprar, ver seus ingressos e revender.
import { api } from './cliente'

export function comprarIngresso(idEvento, quantidade) {
  return api.post('/api/cliente/compras', { id_evento: idEvento, quantidade })
}

export function listarMeusIngressos() {
  return api.get('/api/cliente/ingressos')
}

export function listarMinhasRevendas() {
  return api.get('/api/cliente/revendas')
}

export function criarRevenda(idCompra, precoUnitario) {
  return api.post('/api/cliente/revendas', { id_compra: idCompra, preco_unitario: precoUnitario })
}

export function cancelarRevenda(idRevenda) {
  return api.patch(`/api/cliente/revendas/${idRevenda}/cancelar`)
}

export function comprarRevenda(idRevenda) {
  return api.post(`/api/cliente/revendas/${idRevenda}/comprar`)
}
