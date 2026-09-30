const CHAVE_SESSAO_ADMIN = 'trocaticket-admin-logado'

export function estaLogadoComoAdmin() {
  try {
    return window.sessionStorage.getItem(CHAVE_SESSAO_ADMIN) === '1'
  } catch {
    return false
  }
}

export function entrarComoAdmin() {
  try {
    window.sessionStorage.setItem(CHAVE_SESSAO_ADMIN, '1')
  } catch {
    return
  }
}

export function sairComoAdmin() {
  try {
    window.sessionStorage.removeItem(CHAVE_SESSAO_ADMIN)
  } catch {
    return
  }
}
