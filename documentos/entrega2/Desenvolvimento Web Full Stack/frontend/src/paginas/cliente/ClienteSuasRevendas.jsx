import { useEffect, useMemo, useState } from 'react'
import { ClienteHeader } from '../../componentes/cliente/ClienteHeader'
import { usuarioLogado } from '../../api/auth'
import {
  listarMinhasRevendas, criarRevenda, cancelarRevenda,
  listarMeusIngressos,
  listarPropostasRecebidas, listarPropostasEnviadas,
  responderProposta, cancelarProposta,
} from '../../api/ingressos'

function formatarPreco(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const ROTULO_STATUS = {
  disponivel: { texto: 'Anunciada', tom: 'pendente' },
  vendida: { texto: 'Vendida', tom: 'custodia' },
  cancelada: { texto: 'Cancelada', tom: 'pendente' },
  pendente: { texto: 'Aguardando resposta', tom: 'pendente' },
  aceita: { texto: 'Aceita', tom: 'custodia' },
  recusada: { texto: 'Recusada', tom: 'pendente' },
}

export function ClienteSuasRevendas() {
  const usuario = usuarioLogado()

  const [revendas, setRevendas] = useState([])
  const [propostasRecebidas, setPropostasRecebidas] = useState([])
  const [propostasEnviadas, setPropostasEnviadas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [idEmAcao, setIdEmAcao] = useState(null)

  const [formAberto, setFormAberto] = useState(false)
  const [comprasElegiveis, setComprasElegiveis] = useState([])
  const [compraEscolhida, setCompraEscolhida] = useState('')
  const [precoAnuncio, setPrecoAnuncio] = useState('')
  const [anunciando, setAnunciando] = useState(false)
  const [erroAnuncio, setErroAnuncio] = useState('')

  const precoMaximoAnuncio = useMemo(() => {
    const compra = comprasElegiveis.find((c) => String(c.id_compra) === compraEscolhida)
    return compra ? Math.round(compra.valor_unitario * 1.10 * 100) / 100 : null
  }, [comprasElegiveis, compraEscolhida])

  async function carregarTudo() {
    setCarregando(true)
    setErro('')
    try {
      const [minhasRevendas, recebidas, enviadas] = await Promise.all([
        listarMinhasRevendas(),
        listarPropostasRecebidas(),
        listarPropostasEnviadas(),
      ])
      setRevendas(minhasRevendas)
      setPropostasRecebidas(recebidas)
      setPropostasEnviadas(enviadas)
    } catch (erroRequisicao) {
      setErro(erroRequisicao.message)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => { carregarTudo() }, [])

  async function abrirFormAnuncio() {
    setFormAberto(true)
    setErroAnuncio('')
    try {
      const meusIngressos = await listarMeusIngressos()
      setComprasElegiveis(meusIngressos.filter((item) => !item.em_revenda))
    } catch (erroRequisicao) {
      setErroAnuncio(erroRequisicao.message)
    }
  }

  async function anunciar(e) {
    e.preventDefault()
    const preco = Number(precoAnuncio)
    if (!compraEscolhida) {
      setErroAnuncio('Escolha um ingresso para anunciar')
      return
    }
    if (!preco || preco <= 0) {
      setErroAnuncio('Informe um preço válido')
      return
    }
    setAnunciando(true)
    setErroAnuncio('')
    try {
      await criarRevenda(Number(compraEscolhida), preco)
      setFormAberto(false)
      setCompraEscolhida('')
      setPrecoAnuncio('')
      await carregarTudo()
    } catch (erroRequisicao) {
      setErroAnuncio(erroRequisicao.message)
    } finally {
      setAnunciando(false)
    }
  }

  async function cancelarAnuncio(idRevenda) {
    setIdEmAcao(idRevenda)
    try {
      await cancelarRevenda(idRevenda)
      await carregarTudo()
    } catch (erroRequisicao) {
      setErro(erroRequisicao.message)
    } finally {
      setIdEmAcao(null)
    }
  }

  async function responder(idProposta, decisao) {
    setIdEmAcao(idProposta)
    try {
      await responderProposta(idProposta, decisao)
      await carregarTudo()
    } catch (erroRequisicao) {
      setErro(erroRequisicao.message)
    } finally {
      setIdEmAcao(null)
    }
  }

  async function desistirProposta(idProposta) {
    setIdEmAcao(idProposta)
    try {
      await cancelarProposta(idProposta)
      await carregarTudo()
    } catch (erroRequisicao) {
      setErro(erroRequisicao.message)
    } finally {
      setIdEmAcao(null)
    }
  }

  return (
    <>
      <ClienteHeader
        titulo="Suas Revendas"
        descricao="Anuncie ingressos que você comprou, receba propostas e acompanhe as negociações."
        voltarParaPerfil
        nome={usuario?.nome}
      />

      <main className="cliente-main">
        {erro && (
          <div className="cliente-estado" role="alert">
            <p style={{ color: '#BE123C' }}>{erro}</p>
          </div>
        )}

        <div className="cliente-lista-head">
          <div>
            <h2>Seus Anúncios</h2>
            <p>{revendas.length} anúncio{revendas.length !== 1 ? 's' : ''}</p>
          </div>
          <button type="button" className="cliente-btn-primario" onClick={abrirFormAnuncio}>
            Anunciar Novo Ingresso
          </button>
        </div>

        {formAberto && (
          <form className="cliente-form-section" onSubmit={anunciar}>
            <h2>Novo anúncio de revenda</h2>
            <div className="cliente-field-grid">
              <div className="cliente-field">
                <label htmlFor="compra-escolhida">Ingresso</label>
                <select
                  id="compra-escolhida"
                  value={compraEscolhida}
                  onChange={(e) => setCompraEscolhida(e.target.value)}
                  required
                >
                  <option value="">Selecione um ingresso seu...</option>
                  {comprasElegiveis.map((compra) => (
                    <option key={compra.id_compra} value={compra.id_compra}>
                      {compra.nome} — {compra.quantidade}x (comprado por {formatarPreco(compra.valor_unitario)})
                    </option>
                  ))}
                </select>
                {comprasElegiveis.length === 0 && (
                  <small>Você não tem ingressos disponíveis para anunciar.</small>
                )}
              </div>
              <div className="cliente-field">
                <label htmlFor="preco-anuncio">Preço de revenda (por ingresso)</label>
                <input
                  id="preco-anuncio"
                  type="number"
                  min="0.01"
                  max={precoMaximoAnuncio || undefined}
                  step="0.01"
                  value={precoAnuncio}
                  onChange={(e) => setPrecoAnuncio(e.target.value)}
                  required
                />
                {precoMaximoAnuncio != null && (
                  <small>Máximo permitido: {formatarPreco(precoMaximoAnuncio)} (10% acima do que você pagou — regra antiágio)</small>
                )}
              </div>
            </div>
            {erroAnuncio && <p role="alert" style={{ color: '#BE123C' }}>{erroAnuncio}</p>}
            <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
              <button type="submit" className="cliente-btn-comprar" disabled={anunciando}>
                {anunciando ? 'Publicando...' : 'Publicar anúncio'}
              </button>
              <button type="button" className="cliente-btn-secundario-claro" onClick={() => setFormAberto(false)}>
                Cancelar
              </button>
            </div>
          </form>
        )}

        <div className="cliente-ingresso-lista">
          {carregando ? (
            <div className="cliente-estado"><p>Carregando...</p></div>
          ) : revendas.length === 0 ? (
            <div className="cliente-estado"><p>Você ainda não anunciou nenhum ingresso para revenda.</p></div>
          ) : (
            revendas.map((revenda) => {
              const rotulo = ROTULO_STATUS[revenda.status] || { texto: revenda.status, tom: 'pendente' }
              return (
                <article className="cliente-ingresso-item" key={revenda.id_revenda}>
                  <img className="cliente-ingresso-item__imagem" src={`https://picsum.photos/seed/revenda-${revenda.id_revenda}/160/160`} alt={revenda.nome} />
                  <div className="cliente-ingresso-item__info">
                    <h3>{revenda.nome}</h3>
                    <p>{revenda.quantidade}x • {revenda.local}</p>
                    <div className="cliente-ingresso-item__tags">
                      <span className={`cliente-tag cliente-tag--${rotulo.tom}`}>{rotulo.texto}</span>
                    </div>
                  </div>
                  <div className="cliente-ingresso-item__preco">
                    <strong>{formatarPreco(revenda.preco_unitario)}</strong>
                    <small>por ingresso</small>
                  </div>
                  <div className="cliente-ingresso-item__acoes">
                    {revenda.status === 'disponivel' && (
                      <button
                        type="button"
                        className="cliente-btn-secundario-claro"
                        disabled={idEmAcao === revenda.id_revenda}
                        onClick={() => cancelarAnuncio(revenda.id_revenda)}
                      >
                        Cancelar anúncio
                      </button>
                    )}
                  </div>
                </article>
              )
            })
          )}
        </div>

        <div className="cliente-lista-head" style={{ marginTop: '2rem' }}>
          <div><h2>Propostas Recebidas</h2><p>Ofertas de preço nos seus anúncios</p></div>
        </div>
        <div className="cliente-ingresso-lista">
          {propostasRecebidas.length === 0 ? (
            <div className="cliente-estado"><p>Nenhuma proposta recebida ainda.</p></div>
          ) : (
            propostasRecebidas.map((proposta) => {
              const rotulo = ROTULO_STATUS[proposta.status] || { texto: proposta.status, tom: 'pendente' }
              return (
                <article className="cliente-ingresso-item" key={proposta.id_proposta}>
                  <div className="cliente-ingresso-item__info">
                    <h3>{proposta.nome}</h3>
                    <p>
                      Proposta de {proposta.nome_proponente}: {formatarPreco(proposta.preco_proposto)}
                      {' '}(anunciado a {formatarPreco(proposta.preco_unitario)})
                    </p>
                    <div className="cliente-ingresso-item__tags">
                      <span className={`cliente-tag cliente-tag--${rotulo.tom}`}>{rotulo.texto}</span>
                    </div>
                  </div>
                  <div className="cliente-ingresso-item__acoes">
                    {proposta.status === 'pendente' && (
                      <>
                        <button
                          type="button"
                          className="cliente-btn-comprar"
                          disabled={idEmAcao === proposta.id_proposta}
                          onClick={() => responder(proposta.id_proposta, 'aceita')}
                        >
                          Aceitar
                        </button>
                        <button
                          type="button"
                          className="cliente-btn-secundario-claro"
                          disabled={idEmAcao === proposta.id_proposta}
                          onClick={() => responder(proposta.id_proposta, 'recusada')}
                        >
                          Recusar
                        </button>
                      </>
                    )}
                  </div>
                </article>
              )
            })
          )}
        </div>

        <div className="cliente-lista-head" style={{ marginTop: '2rem' }}>
          <div><h2>Propostas Enviadas</h2><p>Ofertas que você fez em anúncios de outros clientes</p></div>
        </div>
        <div className="cliente-ingresso-lista">
          {propostasEnviadas.length === 0 ? (
            <div className="cliente-estado"><p>Você ainda não enviou nenhuma proposta.</p></div>
          ) : (
            propostasEnviadas.map((proposta) => {
              const rotulo = ROTULO_STATUS[proposta.status] || { texto: proposta.status, tom: 'pendente' }
              return (
                <article className="cliente-ingresso-item" key={proposta.id_proposta}>
                  <div className="cliente-ingresso-item__info">
                    <h3>{proposta.nome}</h3>
                    <p>Sua proposta: {formatarPreco(proposta.preco_proposto)} (anunciado a {formatarPreco(proposta.preco_unitario)})</p>
                    <div className="cliente-ingresso-item__tags">
                      <span className={`cliente-tag cliente-tag--${rotulo.tom}`}>{rotulo.texto}</span>
                    </div>
                  </div>
                  <div className="cliente-ingresso-item__acoes">
                    {proposta.status === 'pendente' && (
                      <button
                        type="button"
                        className="cliente-btn-secundario-claro"
                        disabled={idEmAcao === proposta.id_proposta}
                        onClick={() => desistirProposta(proposta.id_proposta)}
                      >
                        Desistir
                      </button>
                    )}
                  </div>
                </article>
              )
            })
          )}
        </div>
      </main>
    </>
  )
}
