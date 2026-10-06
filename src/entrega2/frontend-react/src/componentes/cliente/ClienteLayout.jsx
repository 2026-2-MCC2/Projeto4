import { NavLink, Outlet } from 'react-router-dom'

function Icon({ children, className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export function ClienteLayout() {
  return (
    <div className="cliente-layout">
      <aside className="cliente-sidebar">
        <div className="cliente-sidebar__brand">
          <span className="cliente-sidebar__brand-icon" aria-hidden="true">
            <Icon>
              <path d="M3 9a3 3 0 0 1 0 6v3a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-3a3 3 0 0 1 0-6V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1z" />
              <path d="M13 5v2M13 11v2M13 17v2" />
            </Icon>
          </span>
          <div>
            <strong>Troca<span>Ticket</span></strong>
            <small>Intercâmbio Seguro</small>
          </div>
        </div>

        <nav className="cliente-nav">
          <NavLink to="/cliente" end>
            <Icon><path d="M3 11l9-8 9 8" /><path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10" /></Icon>
            Início
          </NavLink>
          <NavLink to="/cliente/ingressos">
            <Icon><path d="M3 9a3 3 0 0 1 0 6v3a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-3a3 3 0 0 1 0-6V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1z" /></Icon>
            Ingressos
          </NavLink>
          <NavLink to="/cliente/compras">
            <Icon><path d="M6 2 3 6v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V6l-3-4z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></Icon>
            Compras
          </NavLink>
          <NavLink to="/cliente/perfil">
            <Icon><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" /></Icon>
            Perfil
          </NavLink>
        </nav>

        <p className="cliente-nav-label">Conta</p>

        <nav className="cliente-nav">
          <NavLink to="/cliente/seus-ingressos">
            <Icon><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></Icon>
            Seus Ingressos
          </NavLink>
          <NavLink to="/cliente/suas-revendas">
            <Icon><path d="M17 2l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><path d="M7 22l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></Icon>
            Suas Revendas
          </NavLink>
          <NavLink to="/cliente/configuracoes">
            <Icon><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.56V21a2 2 0 0 1-4 0v-.09A1.7 1.7 0 0 0 9 19.36a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.64 15a1.7 1.7 0 0 0-1.56-1.04H3a2 2 0 0 1 0-4h.09A1.7 1.7 0 0 0 4.64 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06A2 2 0 1 1 7.13 4.2l.06.06A1.7 1.7 0 0 0 9 4.64a1.7 1.7 0 0 0 1.04-1.56V3a2 2 0 0 1 4 0v.09A1.7 1.7 0 0 0 15 4.64a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.36 9a1.7 1.7 0 0 0 1.56 1.04H21a2 2 0 0 1 0 4h-.09A1.7 1.7 0 0 0 19.4 15z" /></Icon>
            Configurações
          </NavLink>
        </nav>

        <div className="cliente-sidebar__footer">
          <div className="cliente-safe-box">
            <Icon><path d="M12 2 4 5v6c0 5 3.4 8.7 8 11 4.6-2.3 8-6 8-11V5z" /><path d="m9 12 2 2 4-4" /></Icon>
            <div>
              <strong>Troca Segura Ativa</strong>
              <p>Custódia 100% garantida</p>
            </div>
          </div>

          <NavLink to="/login" className="cliente-logout">
            <Icon><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></Icon>
            Sair da Conta
          </NavLink>
        </div>
      </aside>

      <div className="cliente-content">
        <Outlet />
      </div>
    </div>
  )
}
