import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { oportunidadesIniciais, propostasIniciais } from '../../dados/fornecedor'

export function FornecedorPropostas() {
  const [params] = useSearchParams()
  const idInicial = params.get('evento') || ''
  const [evento, setEvento] = useState(idInicial)
  const [servico, setServico] = useState('')
  const [valor, setValor] = useState('')
  const [descricao, setDescricao] = useState('')
  const [propostas, setPropostas] = useState(propostasIniciais)
  const [mensagem, setMensagem] = useState('')
  function enviar(e) {
    e.preventDefault()
    const oportunidade = oportunidadesIniciais.find(x => String(x.id) === evento)
    if (!evento || !servico.trim() || Number(valor) <= 0) {
      setMensagem('Preencha o evento, o serviço e um valor maior que zero.')
      return
    }
    setPropostas(prev => [{ id: Date.now(), evento: oportunidade?.nome || evento, servico, data: new Date().toLocaleDateString('pt-BR'), valor: Number(valor), status: 'Em análise', descricao }, ...prev])
    setServico(''); setValor(''); setDescricao('')
    setMensagem('Proposta adicionada à lista local de demonstração.')
  }
  return <>
    <div className="fornecedor-page-head"><div><h1>Minhas propostas</h1><p>Envie e acompanhe suas propostas para os eventos.</p></div></div>
    <section className="fornecedor-panel">
      <h2>Enviar nova proposta</h2>
      <form className="fornecedor-form" onSubmit={enviar}>
        <label>Evento<select value={evento} onChange={e => setEvento(e.target.value)} required><option value="">Selecione um evento</option>{oportunidadesIniciais.map(e => <option value={e.id} key={e.id}>{e.nome}</option>)}</select></label>
        <label>Serviço oferecido<input value={servico} onChange={e => setServico(e.target.value)} placeholder="Ex.: Buffet, segurança, som" required /></label>
        <label>Valor da proposta (R$)<input type="number" min="0.01" step="0.01" value={valor} onChange={e => setValor(e.target.value)} required /></label>
        <label>Descrição da proposta<textarea value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Digite os detalhes da sua proposta..." rows="4" /></label>
        <button className="fornecedor-btn" type="submit">Enviar proposta</button>
        {mensagem && <p role="status" className="fornecedor-mensagem">{mensagem}</p>}
      </form>
    </section>
    <section className="fornecedor-panel fornecedor-propostas-enviadas"><h2>Propostas enviadas</h2>
      {propostas.map(p => <div className="fornecedor-proposta-item" key={p.id}><div><strong>{p.evento}</strong><small>Serviço: {p.servico}</small><small>Enviada em: {p.data}</small></div><div className="fornecedor-evento-direita"><strong>{Number(p.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong><span className="fornecedor-tag">{p.status}</span></div></div>)}
    </section>
  </>
}
