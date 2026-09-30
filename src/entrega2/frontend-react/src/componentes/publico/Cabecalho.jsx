import { Link } from 'react-router-dom'

export function Cabecalho() {
  return (
    <header>
      <Link to="/" aria-label="Página Inicial">
        <img src="/images/logo_navbar_web.png" alt="TrocaTicket" />
      </Link>
      <nav>
        <Link to="/">Início</Link>
        <Link to="/eventos">Eventos</Link>
        <Link to="/revenda">Revenda</Link>
        <Link to="/login">Entrar</Link>
        <Link to="/cadastro">Criar conta</Link>
      </nav>
    </header>
  )
}

export function CabecalhoSimples() {
  return (
    <header>
      <Link to="/">
        <img src="/images/logo_navbar_web.png" alt="TrocaTicket" />
      </Link>
    </header>
  )
}
