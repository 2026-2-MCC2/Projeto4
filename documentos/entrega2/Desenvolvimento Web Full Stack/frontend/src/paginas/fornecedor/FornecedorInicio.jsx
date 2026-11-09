import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/cliente'
import { moeda } from '../../utils/formatar'
import { usuarioLogado } from '../../api/auth'

const ROTULOS_STATUS = {
  enviada: 'Aguardando resposta',
  aceita: 'Aceita',
  recusada: 'Recusada',
  cancelada: 'Cancelada',
}

export function FornecedorInicio() {

    const [propostas, setPropostas] = useState([])
  const [eventos, setEventos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true
    Promise.all([
      api.get('/api/fornecedor/propostas'),
      api.get('/api/fornecedor/eventos'),
    ])
      .then(([listaPropostas, listaEventos]) => {
        if (!ativo) return
        setPropostas(Array.isArray(listaPropostas) ? listaPropostas : [])
        setEventos(Array.isArray(listaEventos) ? listaEventos : [])
      })
      .catch((e) => { if (ativo) setErro(e.message) })
      .finally(() => { if (ativo) setCarregando(false) })
    return () => { ativo = false }
  }, [])
  
  const usuario = usuarioLogado()

  // Indicadores calculados a partir dos dados reais
  const aguardando = propostas.filter(p => p.status === 'enviada').length
  const aceitas = propostas.filter(p => p.status === 'aceita')
  const valorAceito = aceitas.reduce((soma, p) => soma + Number(p.valor_total || 0), 0)

  return <>
    <div className="fornecedor-page-head">
      <div><h1>Olá, {usuario?.nome || 'fornecedor'}!</h1><p>Acompanhe suas propostas e os eventos abertos para cotação.</p></div>
      <Link className="fornecedor-btn" to="/fornecedor/busca">Buscar oportunidades</Link>
    </div>
    <div className="fornecedor-stats">
      <article><span>Propostas enviadas</span><strong>{propostas.length}</strong><small>{aguardando} aguardando resposta</small></article>
      <article><span>Propostas aceitas</span><strong>{aceitas.length}</strong><small>Selecionadas por organizadores</small></article>
      <article><span>Eventos para cotar</span><strong>{eventos.length}</strong><small>Abertos para propostas agora</small></article>
      <article className="escuro"><span>Valor em propostas aceitas</span><strong>{moeda(valorAceito)}</strong><small>Soma das propostas aceitas</small></article>
    </div>
    <div className="fornecedor-grid">
      <section className="fornecedor-panel"><h2>Propostas recentes</h2>
        {carregando && <p>Carregando...</p>}
        {erro && <p role="alert">Não foi possível carregar: {erro}</p>}
        {!carregando && !erro && propostas.length === 0 && <p>Você ainda não enviou propostas.</p>}
        {propostas.slice(0, 3).map(p => (
          <div className="fornecedor-lista-item" key={p.id_proposta}>
            <div><strong>{p.evento}</strong><small>{p.item} · {moeda(p.valor_total)}</small></div>
            <span className="fornecedor-tag">{ROTULOS_STATUS[p.status] || p.status}</span>
          </div>
        ))}
        <Link className="fornecedor-link-secundario" to="/fornecedor/propostas">Ver todas as propostas</Link>
      </section>
      <section className="fornecedor-panel"><h2>Eventos abertos para cotação</h2>
        {!carregando && !erro && eventos.length === 0 && <p>Nenhum evento aberto para cotação no momento.</p>}
        {eventos.slice(0, 3).map(e => (
          <div className="fornecedor-lista-item" key={e.id_evento}>
            <div><strong>{e.nome}</strong><small>{e.local} · {e.total_itens} item(ns) para cotar</small></div>
          </div>
        ))}
        <Link className="fornecedor-link-secundario" to="/fornecedor/busca">Ver todos os eventos</Link>
      </section>
    </div>
  </>
}
