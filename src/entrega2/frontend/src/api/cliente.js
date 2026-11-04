// Cliente HTTP único para falar com o backend (src/entrega2/backend).
// Usa fetch (sem axios, sem instalar nada novo). Lê o token salvo no login
// e sempre devolve o JSON já pronto, ou lança um Error com a mensagem do backend.

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const CHAVE_SESSOES = 'trocaticket-sessoes'

// Uma sessão por papel (cliente/organizador/fornecedor/administrador), não
// uma só pro navegador inteiro. Sem isso, logar como admin numa aba derruba
// a sessão do organizador em outra aba (localStorage é compartilhado entre
// abas da mesma origem) — cada aba usa o papel da sua própria URL pra saber
// qual sessão ler/gravar, então dá pra ficar logado em vários papéis ao
// mesmo tempo, cada um na sua aba.
function papelDaRota() {
  if (typeof window === 'undefined') return null
  const caminho = window.location.pathname
  if (caminho.startsWith('/admin')) return 'administrador'
  if (caminho.startsWith('/organizador')) return 'organizador'
  if (caminho.startsWith('/fornecedor')) return 'fornecedor'
  if (caminho.startsWith('/cliente')) return 'cliente'
  return null
}

function lerSessoes() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_SESSOES) || '{}')
  } catch {
    return {}
  }
}

function gravarSessoes(sessoes) {
  localStorage.setItem(CHAVE_SESSOES, JSON.stringify(sessoes))
}

// O papel de quem acabou de logar vem da própria resposta do login, não da
// rota atual (por exemplo, "/login" não tem papel nenhum na URL).
export function salvarSessao(token, usuario) {
  const sessoes = lerSessoes()
  sessoes[usuario.tipo] = { token, usuario }
  gravarSessoes(sessoes)
}

export function limparSessao(papel = papelDaRota()) {
  if (!papel) return
  const sessoes = lerSessoes()
  delete sessoes[papel]
  gravarSessoes(sessoes)
}

export function obterToken(papel = papelDaRota()) {
  if (!papel) return null
  return lerSessoes()[papel]?.token || null
}

export function obterUsuario(papel = papelDaRota()) {
  if (!papel) return null
  return lerSessoes()[papel]?.usuario || null
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
    // Sessão expirada/token inválido: se a chamada já tinha um token (ou
    // seja, o usuário estava logado), desloga e manda pra tela de login em
    // vez de deixar a tela só mostrando um erro técnico sem explicação.
    if (resposta.status === 401 && token) {
      const destino = obterUsuario()?.tipo === 'administrador' ? '/admin/login' : '/login'
      limparSessao()
      if (typeof window !== 'undefined') {
        window.location.href = destino
      }
    }
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
