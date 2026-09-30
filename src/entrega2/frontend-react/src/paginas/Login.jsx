import { Link, useNavigate } from 'react-router-dom'
import { CabecalhoSimples } from '../componentes/publico/Cabecalho'
import { RodapeSimples } from '../componentes/publico/Rodape'

export function Login() {
  const navegar = useNavigate()

  return (
    <>
      <CabecalhoSimples />

      <main>
        <section>
          <h1>Entrar</h1>
          <p>Acesse sua conta TrocaTicket.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              navegar('/cliente')
            }}
          >
            <div>
              <label htmlFor="email"> E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Digite seu e-mail"
                required
              />
            </div>
            <div>
              <label htmlFor="senha"> Senha </label>
              <input
                type="password"
                id="senha"
                name="senha"
                placeholder="Digite sua senha"
                required
              />
            </div>
            <button type="submit"> Entrar </button>
          </form>
          <p>
            {' '}
            <a href=""> Esqueci minha senha </a>{' '}
          </p>
          <p>
            Ainda não possui uma conta?
            <Link to="/cadastro"> Criar conta </Link>
          </p>
          <p>
            É administrador?
            <Link to="/admin/login"> Entrar como admin </Link>
          </p>
        </section>
      </main>

      <RodapeSimples />
    </>
  )
}
