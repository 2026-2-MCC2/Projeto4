import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { adminAtual, temasPainel } from '../../dados/admin'
import { ADMIN_ROTAS } from '../../rotas-admin'
import { ContextoLayoutAdmin } from './contexto-layout'
import { Avatar, Botao } from './primitivos'

const chaveTemaAdmin = `trocaticket-tema-admin:${adminAtual.email.toLowerCase()}`

const simbolosNavegacao = {
  painel: (
    <>
      <rect x="3" y="3" width="8" height="8" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="11" width="7" height="10" rx="1" />
      <rect x="3" y="14" width="8" height="7" rx="1" />
    </>
  ),
  usuarios: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M3 21v-1.5A4.5 4.5 0 0 1 7.5 15h3a4.5 4.5 0 0 1 4.5 4.5V21" />
      <path d="M16 5a3.5 3.5 0 0 1 0 6.8M17 15h.5a3.5 3.5 0 0 1 3.5 3.5V21" />
    </>
  ),
  permissoes: (
    <>
      <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  configuracoes: (
    <>
      <path d="M10 3h4l.6 2.4a7 7 0 0 1 1.8 1l2.3-.8 2 3.5-1.7 1.8a7 7 0 0 1 0 2l1.7 1.8-2 3.5-2.3-.8a7 7 0 0 1-1.8 1L14 21h-4l-.6-2.4a7 7 0 0 1-1.8-1l-2.3.8-2-3.5L5 13a7 7 0 0 1 0-2L3.3 9.2l2-3.5 2.3.8a7 7 0 0 1 1.8-1Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  logs: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6M8 13h8m-8 4h8" />
    </>
  ),
  monitoramento: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  tickets: (
    <>
      <path d="M2 9a3 3 0 0 0 0 6v3a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3a3 3 0 0 1 0-6V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2m0 4v2m0 4v2" />
    </>
  ),
}

function IconeNavegacao({ nome }) {
  return (
    <svg
      className="admin-nav__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {simbolosNavegacao[nome]}
    </svg>
  )
}

function lerTemaAdmin() {
  try {
    const temaSalvo = window.localStorage.getItem(chaveTemaAdmin)
    return temasPainel.some((tema) => tema.id === temaSalvo)
      ? temaSalvo
      : temasPainel[0].id
  } catch {
    return temasPainel[0].id
  }
}

export function AdminLayout() {
  const [rodape, definirRodape] = useState(null)
  const [menuAberto, definirMenuAberto] = useState(false)
  const [temaAdmin, atualizarTemaAdmin] = useState(lerTemaAdmin)
  const botaoMenuRef = useRef(null)

  const definirTemaAdmin = (tema) => {
    if (!temasPainel.some((opcao) => opcao.id === tema)) return

    atualizarTemaAdmin(tema)
    try {
      window.localStorage.setItem(chaveTemaAdmin, tema)
    } catch {
      return
    }
  }

  const fecharMenu = () => {
    definirMenuAberto(false)
    botaoMenuRef.current?.focus()
  }

  // Permite fechar o menu com a tecla Esc, para quem navega só pelo teclado.
  useEffect(() => {
    if (!menuAberto) return

    function aoTeclar(evento) {
      if (evento.key === 'Escape') fecharMenu()
    }

    document.addEventListener('keydown', aoTeclar)
    return () => document.removeEventListener('keydown', aoTeclar)
  }, [menuAberto])

  return (
    <ContextoLayoutAdmin
      value={{ rodape, definirRodape, temaAdmin, definirTemaAdmin }}
    >
      <a href="#admin-conteudo" className="admin-skip-link">
        Pular para o conteúdo
      </a>
      <div className="admin-layout" data-tema-admin={temaAdmin}>
        <BarraLateral aberto={menuAberto} aoFechar={fecharMenu} />
        <div
          className={['admin-sidebar-backdrop', menuAberto ? 'is-open' : '']
            .filter(Boolean)
            .join(' ')}
          onClick={fecharMenu}
        />
        <div className="admin-content">
          <BarraTopo
            botaoMenuRef={botaoMenuRef}
            menuAberto={menuAberto}
            aoAlternarMenu={() => definirMenuAberto((atual) => !atual)}
          />
          <main
            id="admin-conteudo"
            className={['admin-main', rodape ? 'admin-main--with-footbar' : '']
              .filter(Boolean)
              .join(' ')}
          >
            <Outlet />
          </main>
          {rodape}
        </div>
      </div>
    </ContextoLayoutAdmin>
  )
}

function BarraLateral({ aberto, aoFechar }) {
  const navegar = useNavigate()

  return (
    <aside
      id="admin-menu-lateral"
      className={['admin-sidebar', aberto ? 'is-open' : ''].filter(Boolean).join(' ')}
    >
      <button
        type="button"
        className="admin-sidebar-close"
        aria-label="Fechar menu"
        onClick={aoFechar}
      >
        ✕
      </button>

      <div className="admin-sidebar__brand">
        <img src="/images/logo_navbar_web.png" alt="TrocaTicket" />
        <span>Intercâmbio Seguro</span>
      </div>

      <div className="admin-sidebar__user">
        <Avatar iniciais={adminAtual.iniciais} />
        <div>
          <strong>{adminAtual.nome}</strong>
          <small>{adminAtual.cargo}</small>
        </div>
      </div>

      <nav className="admin-nav">
        {ADMIN_ROTAS.map((rota) => (
          <NavLink
            key={rota.caminho}
            to={rota.caminho}
            end={rota.caminho === '/admin'}
            className={({ isActive }) => (isActive ? 'is-active' : undefined)}
            onClick={aoFechar}
          >
            <IconeNavegacao nome={rota.icone} />
            <span>{rota.rotulo}</span>
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar__footer">
        <div className="admin-safe-box">
          <strong>Ambiente Seguro</strong>
          <p>
            SSL Ativo / 2FA obrigatório para transações de custódia e emissão de
            permissões.
          </p>
        </div>
        <Botao
          variante="suave"
          className="admin-logout"
          aoClicar={() => navegar('/admin/login')}
        >
          Sair da Conta
        </Botao>
      </div>
    </aside>
  )
}

function BarraTopo({ botaoMenuRef, menuAberto, aoAlternarMenu }) {
  return (
    <div className="admin-topbar">
      <button
        ref={botaoMenuRef}
        type="button"
        className="admin-menu-toggle"
        aria-expanded={menuAberto}
        aria-controls="admin-menu-lateral"
        aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
        onClick={aoAlternarMenu}
      >
        {menuAberto ? '✕' : '☰'}
      </button>
      <input
        type="search"
        placeholder="Buscar usuários, logs, permissões ou eventos..."
        aria-label="Busca global do painel"
      />
      <div className="admin-topbar__status">
        <span className="admin-status-dot" />
        Sistemas Operacionais 99.9%
      </div>
      <div className="admin-topbar__user">
        <strong>{adminAtual.nome}</strong>
        <small>{adminAtual.email}</small>
      </div>
    </div>
  )
}

export function CabecalhoPagina({ eyebrow, titulo, descricao, acoes }) {
  return (
    <div className="admin-page-head">
      <div>
        <span className="admin-eyebrow">{eyebrow}</span>
        <h1>{titulo}</h1>
        <p>{descricao}</p>
      </div>
      {acoes}
    </div>
  )
}

export function Abas({ abas, ativa, aoTrocar }) {
  return (
    <div className="admin-tabbar" role="tablist">
      {abas.map((aba) => (
        <span
          key={aba}
          role="tab"
          aria-selected={aba === ativa}
          tabIndex={0}
          className={aba === ativa ? 'is-active' : undefined}
          onClick={() => aoTrocar(aba)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              aoTrocar(aba)
            }
          }}
        >
          {aba}
        </span>
      ))}
    </div>
  )
}

export function RodapeFixo({ children }) {
  return <div className="admin-footbar">{children}</div>
}
