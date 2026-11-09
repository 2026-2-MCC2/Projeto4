import { useEffect, useState } from 'react'
import { api } from '../../api/cliente'

export function FornecedorMeusEventos() {
  const [propostas, setPropostas] = useState([])
  const [vendasPorEvento, setVendasPorEvento] = useState({})
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true
    setCarregando(true)
    setErro('')
    api.get('/api/fornecedor/propostas', { status: 'aceita' })
      .then((dados) => {
        if (ativo) setPropostas(Array.isArray(dados) ? dados : [])
      })
      .catch((e) => {
        if (ativo) setErro(e.message)
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })
    return () => {
      ativo = false
    }
  }, [])

  const eventosAgrupados = []
  const indicePorEvento = new Map()
  for (const p of propostas) {
    if (!indicePorEvento.has(p.id_evento)) {
      indicePorEvento.set(p.id_evento, eventosAgrupados.length)
      eventosAgrupados.push({ id_evento: p.id_evento, nome: p.evento, itens: [] })
    }
    eventosAgrupados[indicePorEvento.get(p.id_evento)].itens.push(p)
  }

  // Busca a quantidade de ingressos vendidos de cada evento (não quem comprou),
  // um por um, só depois que sabemos quais eventos o fornecedor participa.
  useEffect(() => {
    const idsEventos = eventosAgrupados.map((e) => e.id_evento)
    if (!idsEventos.length) return
    let ativo = true
    Promise.all(
      idsEventos.map((id) =>
        api.get(`/api/fornecedor/eventos/${id}/vendas`)
          .then((dados) => [id, dados.ingressos_vendidos])
          .catch(() => [id, null])
      )
    ).then((pares) => {
      if (ativo) setVendasPorEvento(Object.fromEntries(pares))
    })
    return () => {
      ativo = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propostas])

  return <>
    <div className="fornecedor-page-head"><div><h1>Meus eventos</h1><p>Eventos em que você teve pelo menos uma proposta aceita.</p></div></div>

    {carregando && <p>Carregando seus eventos...</p>}
    {erro && <p className="fornecedor-mensagem erro">{erro}</p>}

    {!carregando && !erro && <ul className="fornecedor-eventos-lista">
      {eventosAgrupados.map(evento => <li key={evento.id_evento} className="fornecedor-evento-card fornecedor-evento-card-coluna">
        <div className="fornecedor-evento-cabecalho">
          <strong>{evento.nome}</strong>
          {vendasPorEvento[evento.id_evento] != null && (
            <span className="fornecedor-tag ok">
              🎟️ {vendasPorEvento[evento.id_evento]} ingresso{vendasPorEvento[evento.id_evento] !== 1 ? 's' : ''} vendido{vendasPorEvento[evento.id_evento] !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <ul className="fornecedor-itens-lista">
          {evento.itens.map(p => <li key={p.id_proposta} className="fornecedor-item-linha">
            <div><strong>{p.item}</strong><small>Proposta aceita em: {new Date(p.data_proposta).toLocaleDateString('pt-BR')}</small></div>
            <div className="fornecedor-evento-direita">
              <strong>{Number(p.valor_total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
              <span className="fornecedor-tag ok">Aceita</span>
            </div>
          </li>)}
        </ul>
      </li>)}
      {!eventosAgrupados.length && <p className="fornecedor-vazio">Você ainda não tem propostas aceitas.</p>}
    </ul>}
  </>
}
