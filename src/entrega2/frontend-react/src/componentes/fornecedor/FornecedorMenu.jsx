import { NavLink, useNavigate } from 'react-router-dom'

const links = [
  { to: '/fornecedor', label: 'Dashboard', end: true },
  { to: '/fornecedor/busca', label: 'Buscar oportunidades' },
  { to: '/fornecedor/propostas', label: 'Minhas propostas' },
  { to: '/fornecedor/eventos', label: 'Meus eventos' },
  { to: '/fornecedor/perfil', label: 'Meu perfil' },
  { to: '/fornecedor/servicos/novo', label: 'Cadastrar serviço' },
]

export function FornecedorMenu() {
  const navegar = useNavigate()
  function sair() {
    localStorage.removeItem('usuarioLogado')
    navegar('/login')
  }
  return <aside className="fornecedor-menu">
    <div className="fornecedor-marca">Troca<span>Ticket</span></div>
    <p className="fornecedor-menu-titulo">Área do Fornecedor</p>
    <nav>
      {links.map(link => <NavLink key={link.to} to={link.to} end={link.end}
        className={({ isActive }) => `fornecedor-nav-link${isActive ? ' ativo' : ''}`}>
        {link.label}
      </NavLink>)}
    </nav>
    <button type="button" className="fornecedor-sair" onClick={sair}>Sair</button>
  </aside>
}
