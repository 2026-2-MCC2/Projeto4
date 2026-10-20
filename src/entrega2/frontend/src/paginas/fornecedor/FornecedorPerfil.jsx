import { useState } from 'react'

export function FornecedorPerfil() {
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado') || 'null')
  const [empresa, setEmpresa] = useState(usuario?.empresa || 'Buffet Pro')
  const [responsavel, setResponsavel] = useState(usuario?.nome || 'Fernanda Lima')
  const [email, setEmail] = useState(usuario?.email || 'fernanda.lima@buffetpro.com.br')
  const [telefone, setTelefone] = useState('')
  const [mensagem, setMensagem] = useState('')
  function salvar(e) {
    e.preventDefault()
    const atualizado = { ...(usuario || {}), nome: responsavel, email, empresa, telefone }
    localStorage.setItem('usuarioLogado', JSON.stringify(atualizado))
    setMensagem('Perfil atualizado localmente para demonstração.')
  }
  return <>
    <div className="fornecedor-page-head"><div><h1>Meu perfil</h1><p>Confira e atualize os dados da sua empresa fornecedora.</p></div></div>
    <section className="fornecedor-panel"><form className="fornecedor-form" onSubmit={salvar}>
      <label>Nome da empresa<input value={empresa} onChange={e => setEmpresa(e.target.value)} required /></label>
      <label>Responsável<input value={responsavel} onChange={e => setResponsavel(e.target.value)} required /></label>
      <label>E-mail<input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></label>
      <label>Telefone / WhatsApp<input type="tel" value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="(11) 98765-4321" /></label>
      <button className="fornecedor-btn" type="submit">Salvar alterações</button>{mensagem && <p role="status">{mensagem}</p>}
    </form></section>
  </>
}
