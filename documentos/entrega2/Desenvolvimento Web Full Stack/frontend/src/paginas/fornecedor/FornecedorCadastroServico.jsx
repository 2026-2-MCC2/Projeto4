import { useState } from 'react'

export function FornecedorCadastroServico() {
  const [form, setForm] = useState({ empresa: '', responsavel: '', email: '', telefone: '', servico: '', valor: '' })
  const [servicos, setServicos] = useState([])
  const [mensagem, setMensagem] = useState('')
  function alterar(e) { setForm({ ...form, [e.target.name]: e.target.value }) }
  function enviar(e) {
    e.preventDefault()
    setServicos(prev => [{ ...form, id: Date.now() }, ...prev])
    setMensagem('Serviço cadastrado apenas nesta sessão de demonstração.')
    setForm({ empresa: '', responsavel: '', email: '', telefone: '', servico: '', valor: '' })
  }
  return <>
    <div className="fornecedor-page-head"><div><h1>Cadastrar serviço</h1><p>Anuncie seus serviços para organizadores de eventos na plataforma.</p></div></div>
    <section className="fornecedor-panel"><form className="fornecedor-form" onSubmit={enviar}>
      <label>Nome da empresa<input name="empresa" value={form.empresa} onChange={alterar} required /></label>
      <label>Responsável<input name="responsavel" value={form.responsavel} onChange={alterar} required /></label>
      <label>E-mail<input name="email" type="email" value={form.email} onChange={alterar} required /></label>
      <label>Telefone / WhatsApp<input name="telefone" type="tel" value={form.telefone} onChange={alterar} placeholder="(11) 98765-4321" required /></label>
      <label>Serviço ou produto<input name="servico" value={form.servico} onChange={alterar} required /></label>
      <label>Valor (R$)<input name="valor" type="number" min="0" step="0.01" value={form.valor} onChange={alterar} required /></label>
      <button className="fornecedor-btn" type="submit">Cadastrar serviço</button>
      {mensagem && <p role="status">{mensagem}</p>}
    </form></section>
    {servicos.length > 0 && <section className="fornecedor-panel"><h2>Serviços adicionados nesta sessão</h2>{servicos.map(s => <p key={s.id}>{s.servico} — {Number(s.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>)}</section>}
  </>
}
