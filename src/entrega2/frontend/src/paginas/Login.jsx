import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CabecalhoSimples } from '../componentes/publico/Cabecalho'
import { RodapeSimples } from '../componentes/publico/Rodape'
import { entrar } from '../api/auth'

export function Login() {
  const navegar = useNavigate()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function fazerLogin(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      const usuario = await entrar(email, senha)

      if (usuario.tipo === 'cliente') {
        navegar('/cliente')
      } else if (usuario.tipo === 'organizador') {
        navegar('/organizador')
      } else if (usuario.tipo === 'fornecedor') {
        navegar('/fornecedor')
      } else {
        navegar('/admin')
      }
    } catch (erroLogin) {
      setErro(erroLogin.message)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <>
      <CabecalhoSimples />

      <main>
        <section>
          <h1>Entrar</h1>

          <p>Acesse sua conta TrocaTicket.</p>

          <form onSubmit={fazerLogin}>
            <div>
              <label htmlFor="email">
                E-mail
              </label>

              <input
                type="email"
                id="email"
                name="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="senha">
                Senha
              </label>

              <input
                type="password"
                id="senha"
                name="senha"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            {erro && (
              <p
                role="alert"
                style={{
                  color: 'red',
                  marginTop: '10px',
                }}
              >
                {erro}
              </p>
            )}

            <button type="submit" disabled={carregando}>
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p>
            <a href="#">
              Esqueci minha senha
            </a>
          </p>

          <p>
            Ainda não possui uma conta?
            <Link to="/cadastro">
              {' '}Criar conta
            </Link>
          </p>

          <p>
            É administrador?
            <Link to="/admin/login">
              {' '}Entrar como admin
            </Link>
          </p>
        </section>
      </main>

      <RodapeSimples />
    </>
  )
}
