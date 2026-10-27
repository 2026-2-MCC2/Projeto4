// Autenticação real contra POST /api/auth/login (RF02). Substitui a lista
// fixa de contas de teste que existia antes no Login.jsx.
import { api } from './cliente'
import { salvarSessao, limparSessao, obterToken, obterUsuario } from './cliente'

export async function entrar(email, senha) {
  const { token, usuario } = await api.post('/api/auth/login', { email, senha })
  salvarSessao(token, usuario)
  return usuario
}

export function sair() {
  limparSessao()
}

export function usuarioLogado() {
  return obterUsuario()
}

export function estaAutenticado(tipo) {
  const usuario = obterUsuario()
  if (!obterToken() || !usuario) return false
  return tipo ? usuario.tipo === tipo : true
}

export { obterToken, obterUsuario }
