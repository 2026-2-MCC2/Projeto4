import { Link, useNavigate } from 'react-router-dom'
import { entrarComoAdmin } from '../../componentes/admin/autenticacao'
import { FormularioLoginAdmin } from '../../componentes/admin/formularios'

export function AdminLogin() {
  const navegar = useNavigate()

  function aoFazerLogin() {
    entrarComoAdmin()
    navegar('/admin')
  }

  return (
    <>
      <header>
        <Link to="/">
          <img src="/images/logo_navbar_web.png" alt="TrocaTicket" />
        </Link>
      </header>

      <main>
        <section className="admin-card">
          <span className="admin-badge">ADMIN</span>
          <h1>Painel Administrativo</h1>
          <p>Acesso restrito à equipe TrocaTicket.</p>

          <FormularioLoginAdmin aoEnviar={aoFazerLogin} />
        </section>
      </main>

      <footer>
        <p>&copy; 2026 TrocaTicket. Ambiente interno — acesso restrito.</p>
      </footer>
    </>
  )
}
