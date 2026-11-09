import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { obterUsuario } from '../../api/auth'
import { SeletorTema } from '../../componentes/comum/SeletorTema'
import { temasPainel } from '../../utils/tema'

export function OrganizadorConfiguracoes() {
  const { tema, definirTema } = useOutletContext()
  const u = obterUsuario() || {}
  const [nome, setNome] = useState(u.nome || '')
  const [email, setEmail] = useState(u.email || '')
  const [msg, setMsg] = useState('')

  return (
    <section>
      <div className="org-titulo">
        <div>
          <h1>Configurações da conta</h1>
          <p>Gerencie os dados de demonstração do seu perfil.</p>
        </div>
      </div>

      <form
        className="org-form"
        onSubmit={(e) => {
          e.preventDefault()
          setMsg('Exibição apenas: ainda não existe uma rota no backend para salvar o perfil do organizador.')
        }}
      >
        <label>
          Nome do organizador
          <input value={nome} onChange={(e) => setNome(e.target.value)} required />
        </label>
        <label>
          E-mail
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <button className="org-botao">Salvar alterações</button>
        {msg && <p role="status" className="org-sucesso">{msg}</p>}
      </form>

      <div className="org-form" style={{ marginTop: '1.25rem' }}>
        <SeletorTema temas={temasPainel} selecionado={tema} aoSelecionar={definirTema} nomeGrupo="tema-organizador" />
      </div>
    </section>
  )
}
