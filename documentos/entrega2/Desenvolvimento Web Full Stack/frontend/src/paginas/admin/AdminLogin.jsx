import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { entrar } from '../../api/auth'
import { FormularioLoginAdmin } from '../../componentes/admin/formularios'

export function AdminLogin() {
  const navegar = useNavigate()
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function aoFazerLogin(email, senha) {
    setErro('')
    setCarregando(true)
    try {
      const usuario = await entrar(email, senha)
      if (usuario.tipo !== 'administrador') {
        setErro('Esta conta não tem acesso ao painel administrativo.')
        return
      }
      navegar('/admin')
    } catch (erroLogin) {
      setErro(erroLogin.message)
    } finally {
      setCarregando(false)
    }
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

          <FormularioLoginAdmin aoEnviar={aoFazerLogin} erro={erro} carregando={carregando} />
        </section>
      </main>

      <footer>
        <p>&copy; 2026 TrocaTicket. Ambiente interno — acesso restrito.</p>
      </footer>
    </>
  )
}
