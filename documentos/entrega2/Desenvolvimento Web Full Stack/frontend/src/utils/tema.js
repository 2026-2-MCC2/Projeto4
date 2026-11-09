import { temasPainel } from '../dados/admin'

export { temasPainel }

// Mesmo padrão de persistência usado no Admin, mas com uma chave por papel
// (cliente/organizador/fornecedor), pra cada área guardar sua própria escolha.
function chave(papel, email) {
  return `trocaticket-tema-${papel}:${(email || 'anon').toLowerCase()}`
}

export function lerTema(papel, email) {
  try {
    const salvo = window.localStorage.getItem(chave(papel, email))
    return temasPainel.some((tema) => tema.id === salvo) ? salvo : null
  } catch {
    return null
  }
}

export function salvarTema(papel, email, temaId) {
  try {
    window.localStorage.setItem(chave(papel, email), temaId)
  } catch {
    // localStorage indisponível (modo privado, etc.) — a escolha só não persiste
  }
}
