import { useNavigate } from 'react-router-dom'
import { CabecalhoSimples } from '../componentes/publico/Cabecalho'
import { RodapeSimples } from '../componentes/publico/Rodape'

export function Cadastro() {
  const navegar = useNavigate()

  return (
    <>
      <CabecalhoSimples />

      <main>
        <section>
          <h1>Criar sua conta</h1>
          <p>Escolha como você deseja utilizar o TrocaTicket.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              navegar('/login')
            }}
          >
            <fieldset>
              <legend>Tipo de conta</legend>
              <div>
                <input
                  type="radio"
                  id="cliente"
                  name="tipo_usuario"
                  value="cliente"
                  defaultChecked
                  required
                />
                <label htmlFor="cliente"> Cliente </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="organizador"
                  name="tipo_usuario"
                  value="organizador"
                />
                <label htmlFor="organizador">Organizador</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="fornecedor"
                  name="tipo_usuario"
                  value="fornecedor"
                />
                <label htmlFor="fornecedor"> Fornecedor</label>
              </div>
            </fieldset>
            <div>
              <label htmlFor="nome">Nome completo</label>
              <input type="text" id="nome" name="nome" required />
            </div>
            <div>
              <label htmlFor="email"> E-mail </label>
              <input type="email" id="email" name="email" required />
            </div>
            <div>
              <label htmlFor="senha">Senha</label>
              <input type="password" id="senha" name="senha" required />
            </div>
            <div>
              <label htmlFor="confirmar-senha">Confirmar senha</label>
              <input
                type="password"
                id="confirmar-senha"
                name="confirmar-senha"
                required
              />
            </div>
            <button type="submit">Criar conta</button>
          </form>
        </section>
      </main>

      <RodapeSimples />
    </>
  )
}
