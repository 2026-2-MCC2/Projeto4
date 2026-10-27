// Sessão do admin agora usa o JWT real devolvido por POST /api/auth/login
// (antes era só uma flag fixa em sessionStorage).
import { estaAutenticado, sair } from '../../api/auth'

export function estaLogadoComoAdmin() {
  return estaAutenticado('administrador')
}

export function sairComoAdmin() {
  sair()
}
