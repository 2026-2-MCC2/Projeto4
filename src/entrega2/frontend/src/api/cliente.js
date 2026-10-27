// Cliente HTTP único para falar com o backend (src/entrega2/backend).
// Usa fetch (sem axios, sem instalar nada novo). Lê o token salvo no login
// e sempre devolve o JSON já pronto, ou lança um Error com a mensagem do backend.

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const CHAVE_TOKEN = 'trocaticket-token'
const CHAVE_USUARIO = 'trocaticket-usuario'

export function salvarSessao(token, usuario) {
  localStorage.setItem(CHAVE_TOKEN, token)
  localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario))
}

export function limparSessao() {
  localStorage.removeItem(CHAVE_TOKEN)
  localStorage.removeItem(CHAVE_USUARIO)
}

export function obterToken() {
  return localStorage.getItem(CHAVE_TOKEN)
}

export function obterUsuario() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_USUARIO) || 'null')
  } catch {
    return null
  }
}

// Monta a query string a partir de um objeto, ignorando valores vazios.
function paraQueryString(parametros) {
  if (!parametros) return ''
  const partes = Object.entries(parametros)
    .filter(([, valor]) => valor !== undefined && valor !== null && valor !== '')
    .map(([chave, valor]) => `${encodeURIComponent(chave)}=${encodeURIComponent(valor)}`)
  return partes.length ? `?${partes.join('&')}` : ''
}

// options: { method, body, query }
async function requisitar(caminho, options = {}) {
  const { method = 'GET', body, query } = options
  const token = obterToken()

  const resposta = await fetch(`${BASE_URL}${caminho}${paraQueryString(query)}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  // 204 No Content não tem corpo para ler
  const texto = resposta.status === 204 ? '' : await resposta.text()
  const dados = texto ? JSON.parse(texto) : null

  if (!resposta.ok) {
    const mensagem = dados?.erro || `Erro ${resposta.status} ao falar com o servidor`
    const erro = new Error(mensagem)
    erro.status = resposta.status
    throw erro
  }
  return dados
}

export const api = {
  get: (caminho, query) => requisitar(caminho, { method: 'GET', query }),
  post: (caminho, body) => requisitar(caminho, { method: 'POST', body }),
  put: (caminho, body) => requisitar(caminho, { method: 'PUT', body }),
  patch: (caminho, body) => requisitar(caminho, { method: 'PATCH', body }),
  del: (caminho) => requisitar(caminho, { method: 'DELETE' }),
}
