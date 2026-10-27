import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/cliente'

export function FornecedorEventos() {
  const [eventos, setEventos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const [pesquisa, setPesquisa] = useState('')
  const [buscaAplicada, setBuscaAplicada] = useState('')

  const [expandidoId, setExpandidoId] = useState(null)
  const [detalhe, setDetalhe] = useState(null)
  const [carregandoDetalhe, setCarregandoDetalhe] = useState(false)
  const [erroDetalhe, setErroDetalhe] = useState('')

  useEffect(() => {
    let ativo = true
    setCarregando(true)
    setErro('')
    api.get('/api/fornecedor/eventos')
      .then((dados) => {
        if (ativo) setEventos(Array.isArray(dados) ? dados : [])
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

  const filtrados = useMemo(() => eventos.filter(e =>
    `${e.nome} ${e.local} ${e.organizador}`.toLowerCase().includes(buscaAplicada.toLowerCase())
  ), [buscaAplicada, eventos])

  function buscar(e) {
    e.preventDefault()
    setBuscaAplicada(pesquisa)
  }

  function alternarExpandido(idEvento) {
    if (expandidoId === idEvento) {
      setExpandidoId(null)
      setDetalhe(null)
      setErroDetalhe('')
      return
    }
    setExpandidoId(idEvento)
    setDetalhe(null)
    setErroDetalhe('')
    setCarregandoDetalhe(true)
    api.get(`/api/fornecedor/eventos/${idEvento}`)
      .then((dados) => setDetalhe(dados))
      .catch((e) => setErroDetalhe(e.message))
      .finally(() => setCarregandoDetalhe(false))
  }

  return <>
    <div className="fornecedor-page-head"><div><h1>Buscar oportunidades</h1><p>Eventos que ainda procuram fornecedores para seus serviços.</p></div></div>
    <form className="fornecedor-busca" onSubmit={buscar}>
      <input value={pesquisa} onChange={e => setPesquisa(e.target.value)} placeholder="Nome do evento, local ou organizador" aria-label="Nome do evento, local ou organizador" />
      <button className="fornecedor-btn" type="submit">Buscar</button>
    </form>

    {carregando && <p>Carregando oportunidades...</p>}
    {erro && <p className="fornecedor-mensagem erro">{erro}</p>}

    {!carregando && !erro && <>
      <ul className="fornecedor-eventos-lista">{filtrados.map(e => <li key={e.id_evento} className="fornecedor-evento-card fornecedor-evento-card-coluna">
        <div className="fornecedor-evento-linha">
          <div><strong>{e.nome}</strong><small>{e.data} · {e.local}</small><small>Organizador: {e.organizador} · {e.total_itens} item(ns) de custo</small></div>
          <div className="fornecedor-evento-direita">
            <button type="button" className="fornecedor-btn secundario" onClick={() => alternarExpandido(e.id_evento)}>
              {expandidoId === e.id_evento ? 'Ocultar itens' : 'Ver itens'}
            </button>
          </div>
        </div>

        {expandidoId === e.id_evento && <div className="fornecedor-evento-itens">
          {carregandoDetalhe && <p>Carregando itens...</p>}
          {erroDetalhe && <p className="fornecedor-mensagem erro">{erroDetalhe}</p>}
          {detalhe && <>
            {detalhe.descricao && <p className="fornecedor-evento-descricao">{detalhe.descricao}</p>}
            <ul className="fornecedor-itens-lista">
              {detalhe.itens.map(item => <li key={item.id_item} className="fornecedor-item-linha">
                <div><strong>{item.nome}</strong><small>{item.categoria}</small>{item.descricao && <small>{item.descricao}</small>}</div>
                <div className="fornecedor-evento-direita">
                  {item.minha_proposta
                    ? <span className={`fornecedor-tag ${item.status_proposta === 'aceita' ? 'ok' : 'aviso'}`}>
                        {item.status_proposta === 'aceita' ? 'Proposta aceita' : 'Proposta enviada'}
                      </span>
                    : <Link className="fornecedor-btn" to={`/fornecedor/propostas?evento=${e.id_evento}&item=${item.id_item}`}>Enviar proposta</Link>}
                </div>
              </li>)}
              {!detalhe.itens.length && <p className="fornecedor-vazio">Este evento ainda não tem itens de custo cadastrados.</p>}
            </ul>
          </>}
        </div>}
      </li>)}</ul>
      {filtrados.length === 0 && <p className="fornecedor-vazio">Nenhuma oportunidade encontrada com esses filtros.</p>}
    </>}
  </>
}
