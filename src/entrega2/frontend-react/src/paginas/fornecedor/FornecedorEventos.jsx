import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { oportunidadesIniciais } from '../../dados/fornecedor'

export function FornecedorEventos() {
  const [pesquisa, setPesquisa] = useState('')
  const [tipo, setTipo] = useState('')
  const [buscaAplicada, setBuscaAplicada] = useState({ pesquisa: '', tipo: '' })
  const filtrados = useMemo(() => oportunidadesIniciais.filter(e =>
    `${e.nome} ${e.local} ${e.organizador}`.toLowerCase().includes(buscaAplicada.pesquisa.toLowerCase()) &&
    (!buscaAplicada.tipo || e.tipo === buscaAplicada.tipo)
  ), [buscaAplicada])
  function buscar(e) { e.preventDefault(); setBuscaAplicada({ pesquisa, tipo }) }
  return <>
    <div className="fornecedor-page-head"><div><h1>Buscar oportunidades</h1><p>Eventos que ainda procuram fornecedores para seus serviços.</p></div></div>
    <form className="fornecedor-busca" onSubmit={buscar}>
      <input value={pesquisa} onChange={e => setPesquisa(e.target.value)} placeholder="Nome do evento ou local" aria-label="Nome do evento ou local" />
      <select value={tipo} onChange={e => setTipo(e.target.value)} aria-label="Tipo de serviço">
        <option value="">Todos os serviços</option><option value="buffet">Buffet</option><option value="seguranca">Segurança</option><option value="som">Som e iluminação</option><option value="palco">Palco</option><option value="limpeza">Limpeza</option>
      </select>
      <button className="fornecedor-btn" type="submit">Buscar</button>
    </form>
    <ul className="fornecedor-eventos-lista">{filtrados.map(e => <li key={e.id} className="fornecedor-evento-card">
      <div><strong>{e.nome}</strong><small>{e.data} · {e.local}</small><small>Organizador: {e.organizador} · Precisa de: {e.servico}</small></div>
      <div className="fornecedor-evento-direita"><span>{e.valor}</span><Link className="fornecedor-btn" to={`/fornecedor/propostas?evento=${e.id}`}>Enviar proposta</Link></div>
    </li>)}</ul>
    {filtrados.length === 0 && <p className="fornecedor-vazio">Nenhuma oportunidade encontrada com esses filtros.</p>}
  </>
}
