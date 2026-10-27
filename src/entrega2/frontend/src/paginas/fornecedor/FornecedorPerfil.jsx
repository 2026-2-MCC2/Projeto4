import { useState } from 'react'
import { obterUsuario } from '../../api/auth'

export function FornecedorPerfil() {
  const usuario = obterUsuario()
  const [empresa, setEmpresa] = useState(usuario?.empresa || '')
  const [responsavel, setResponsavel] = useState(usuario?.nome || '')
  const [email, setEmail] = useState(usuario?.email || '')
  const [telefone, setTelefone] = useState('')
  const [mensagem, setMensagem] = useState('')
  function salvar(e) {
    e.preventDefault()
    // A API ainda não tem uma rota para editar o cadastro do fornecedor (fora do RF05-RF14).
    setMensagem('Exibição apenas: ainda não existe uma rota no backend para salvar o perfil do fornecedor.')
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
