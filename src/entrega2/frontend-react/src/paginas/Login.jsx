import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CabecalhoSimples } from '../componentes/publico/Cabecalho'
import { RodapeSimples } from '../componentes/publico/Rodape'

const contasTeste = [
  {
    tipo: 'cliente',
    nome: 'Gabriel Souza',
    email: 'gabriel.souza@email.com',
    senha: 'Cliente123!',
  },
  {
    tipo: 'organizador',
    nome: 'Carlos Mendes',
    email: 'carlos.mendes@liveprod.com.br',
    senha: 'Organizador123!',
  },
  {
    tipo: 'fornecedor',
    nome: 'Fernanda Lima',
    email: 'fernanda.lima@buffetpro.com.br',
    senha: 'Fornecedor123!',
  },
]

export function Login() {
  const navegar = useNavigate()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  function fazerLogin(e) {
    e.preventDefault()

    setErro('')

    const conta = contasTeste.find(
      (usuario) =>
        usuario.email.toLowerCase() === email.toLowerCase() &&
        usuario.senha === senha,
    )

    if (!conta) {
      setErro('E-mail ou senha incorretos.')
      return
    }

    // Guarda temporariamente o usuário logado.
    // Depois, quando existir backend, isso será substituído
    // pela autenticação real.
    localStorage.setItem(
      'usuarioLogado',
      JSON.stringify(conta),
    )

    if (conta.tipo === 'cliente') {
      navegar('/cliente')
    } else if (conta.tipo === 'organizador') {
      navegar('/organizador')
    } else if (conta.tipo === 'fornecedor') {
      navegar('/fornecedor')
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

            <button type="submit">
              Entrar
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