import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CabecalhoSimples } from '../componentes/publico/Cabecalho'
import { RodapeSimples } from '../componentes/publico/Rodape'
import { api } from '../api/cliente'

const soDigitos = (valor) => valor.replace(/\D/g, '')

export function Cadastro() {
  const navegar = useNavigate()

  const [tipo, setTipo] = useState('cliente')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [cpf, setCpf] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [endereco, setEndereco] = useState('')

  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function cadastrar(e) {
    e.preventDefault()
    setErro('')
    setMensagem('')

    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.')
      return
    }
    if (tipo === 'cliente' && soDigitos(cpf).length !== 11) {
      setErro('Informe um CPF válido (11 números).')
      return
    }
    if (tipo !== 'cliente' && soDigitos(cnpj).length !== 14) {
      setErro('Informe um CNPJ válido (14 números).')
      return
    }

    const corpo = {
      nome,
      email,
      senha,
      tipo,
      telefone: telefone || undefined,
    }
    if (tipo === 'cliente') {
      corpo.cpf = soDigitos(cpf)
    } else {
      corpo.cnpj = soDigitos(cnpj)
      corpo.endereco = endereco || undefined
    }

    setEnviando(true)
    try {
      const resultado = await api.post('/api/auth/cadastro', corpo)
      if (resultado.status_cadastro === 'pendente') {
        setMensagem(
          'Conta criada! Como é uma conta de ' +
            (tipo === 'organizador' ? 'organizador' : 'fornecedor') +
            ', ela precisa ser aprovada por um administrador antes que você consiga entrar. ' +
            'Você já pode ir para a tela de login e tentar depois da aprovação.'
        )
      } else {
        setMensagem('Conta criada! Redirecionando para o login...')
        setTimeout(() => navegar('/login'), 1500)
      }
    } catch (erroCadastro) {
      setErro(erroCadastro.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <CabecalhoSimples />

      <main>
        <section>
          <h1>Criar sua conta</h1>
          <p>Escolha como você deseja utilizar o TrocaTicket.</p>
          <form onSubmit={cadastrar}>
            <fieldset>
              <legend>Tipo de conta</legend>
              <div>
                <input
                  type="radio"
                  id="cliente"
                  name="tipo_usuario"
                  value="cliente"
                  checked={tipo === 'cliente'}
                  onChange={() => setTipo('cliente')}
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
                  checked={tipo === 'organizador'}
                  onChange={() => setTipo('organizador')}
                />
                <label htmlFor="organizador">Organizador</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="fornecedor"
                  name="tipo_usuario"
                  value="fornecedor"
                  checked={tipo === 'fornecedor'}
                  onChange={() => setTipo('fornecedor')}
                />
                <label htmlFor="fornecedor"> Fornecedor</label>
              </div>
            </fieldset>

            {tipo !== 'cliente' && (
              <p role="status">
                Cadastros de organizador e fornecedor precisam ser aprovados por um
                administrador antes do primeiro login.
              </p>
            )}

            <div>
              <label htmlFor="nome">Nome completo</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="email"> E-mail </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="telefone">Telefone (opcional)</label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(11) 98765-4321"
              />
            </div>

            {tipo === 'cliente' ? (
              <div>
                <label htmlFor="cpf">CPF</label>
                <input
                  type="text"
                  id="cpf"
                  name="cpf"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="000.000.000-00"
                  required
                />
              </div>
            ) : (
              <>
                <div>
                  <label htmlFor="cnpj">CNPJ</label>
                  <input
                    type="text"
                    id="cnpj"
                    name="cnpj"
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                    placeholder="00.000.000/0000-00"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="endereco">Endereço (opcional)</label>
                  <input
                    type="text"
                    id="endereco"
                    name="endereco"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="senha">Senha</label>
              <input
                type="password"
                id="senha"
                name="senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                minLength={6}
                required
              />
            </div>
            <div>
              <label htmlFor="confirmar-senha">Confirmar senha</label>
              <input
                type="password"
                id="confirmar-senha"
                name="confirmar-senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                minLength={6}
                required
              />
            </div>

            {erro && (
              <p role="alert" style={{ color: 'red', marginTop: '10px' }}>
                {erro}
              </p>
            )}
            {mensagem && (
              <p role="status" style={{ color: 'green', marginTop: '10px' }}>
                {mensagem}
              </p>
            )}

            <button type="submit" disabled={enviando}>
              {enviando ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>
        </section>
      </main>

      <RodapeSimples />
    </>
  )
}
