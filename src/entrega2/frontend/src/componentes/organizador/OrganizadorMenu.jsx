import { NavLink, useNavigate } from 'react-router-dom'
import { sair } from '../../api/auth'

const links = [
  { to: '/organizador', label: 'Meus eventos', end: true },
  { to: '/organizador/criar-evento', label: 'Criar evento' },
  { to: '/organizador/configuracoes', label: 'Configurações' },
]

export function OrganizadorMenu() {
  const navegar = useNavigate()
  function sairDaConta() {
    sair()
    navegar('/login')
  }
  return (
    <aside className="org-menu">
      <h2>TrocaTicket</h2>
      <p>GESTÃO DO ORGANIZADOR</p>
      <nav>
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? 'org-link ativo' : 'org-link')}>
            {l.label}
          </NavLink>
        ))}
      </nav>
      <button type="button" className="org-sair" onClick={sairDaConta}>Sair da conta</button>
    </aside>
  )
}
