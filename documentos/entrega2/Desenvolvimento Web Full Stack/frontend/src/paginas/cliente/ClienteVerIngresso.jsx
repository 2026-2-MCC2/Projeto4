import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ClienteHeader } from '../../componentes/cliente/ClienteHeader'
import { ModalPagamento } from '../../componentes/cliente/ModalPagamento'
import { buscarEventoPublico, buscarRevendaPublica } from '../../api/publico'
import { comprarIngresso, comprarRevenda, criarProposta } from '../../api/ingressos'
import { usuarioLogado } from '../../api/auth'

function formatarPreco(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatarData(dataIso) {
  if (!dataIso) return ''
  return new Date(`${dataIso}T00:00:00`).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
}

export function ClienteVerIngresso() {
  const usuario = usuarioLogado()
  const { tipo, id } = useParams()
  const navegar = useNavigate()
  const ehRevenda = tipo === 'revenda'

  const [item, setItem] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [quantidade, setQuantidade] = useState(1)

  const [modalPagamentoAberto, setModalPagamentoAberto] = useState(false)

  const [formPropostaAberto, setFormPropostaAberto] = useState(false)
  const [precoProposta, setPrecoProposta] = useState('')
  const [enviandoProposta, setEnviandoProposta] = useState(false)
  const [erroProposta, setErroProposta] = useState('')
  const [propostaEnviada, setPropostaEnviada] = useState(false)

  useEffect(() => {
    let cancelado = false
    setCarregando(true)
    setErro('')

    const busca = ehRevenda ? buscarRevendaPublica(id) : buscarEventoPublico(id)
    busca
      .then((dados) => {
        if (cancelado) return
        if (ehRevenda) {
          setItem({
            titulo: dados.nome,
            local: dados.local,
            data: dados.data,
            preco: Number(dados.preco_unitario),
            imagem: dados.imagem_url || `https://picsum.photos/seed/revenda-${dados.id_revenda}/1000/560`,
            categoria: dados.categoria,
            quantidadeLote: dados.quantidade,
            disponiveis: dados.quantidade,
            precoMaximoProposta: Math.round(Number(dados.preco_original) * 1.10 * 100) / 100,
          })
          setQuantidade(dados.quantidade)
        } else {
          setItem({
            titulo: dados.nome,
            local: dados.local,
            data: dados.data,
            preco: Number(dados.preco_ingresso),
            imagem: dados.imagem_url || `https://picsum.photos/seed/evento-${dados.id_evento}/1000/560`,
            categoria: dados.categoria,
            disponiveis: dados.ingressos_disponiveis,
          })
        }
      })
      .catch((erroRequisicao) => {
        if (!cancelado) setErro(erroRequisicao.message)
      })
      .finally(() => {
        if (!cancelado) setCarregando(false)
      })

    return () => { cancelado = true }
  }, [tipo, id, ehRevenda])

  async function confirmarCompra() {
    if (ehRevenda) {
      await comprarRevenda(id)
    } else {
      await comprarIngresso(id, quantidade)
    }
  }

  async function enviarProposta(e) {
    e.preventDefault()
    const preco = Number(precoProposta)
    if (!preco || preco <= 0) {
      setErroProposta('Informe um valor válido')
      return
    }
    setEnviandoProposta(true)
    setErroProposta('')
    try {
      await criarProposta(id, preco)
      setPropostaEnviada(true)
      setFormPropostaAberto(false)
    } catch (erroRequisicao) {
      setErroProposta(erroRequisicao.message)
    } finally {
      setEnviandoProposta(false)
    }
  }

  if (carregando) {
    return (
      <>
        <ClienteHeader titulo="Detalhes do Ingresso" descricao="Carregando..." nome={usuario?.nome} />
        <main className="cliente-main"><p>Carregando ingresso...</p></main>
      </>
    )
  }

  if (erro || !item) {
    return (
      <>
        <ClienteHeader titulo="Detalhes do Ingresso" descricao="Não foi possível carregar este ingresso." nome={usuario?.nome} />
        <main className="cliente-main">
          <p role="alert" style={{ color: '#BE123C' }}>{erro || 'Ingresso não encontrado.'}</p>
          <Link to="/cliente/ingressos" className="cliente-voltar">← Voltar para Ingressos</Link>
        </main>
      </>
    )
  }

  const total = item.preco * quantidade

  return (
    <>
      <ClienteHeader
        titulo="Detalhes do Ingresso"
        descricao="Confira as informações completas antes de comprar ou negociar."
        nome={usuario?.nome}
      />

      <main className="cliente-main">
        <Link to="/cliente/ingressos" className="cliente-voltar">← Voltar para Ingressos</Link>

        <div className="cliente-detalhe">
          <section className="cliente-detalhe-principal">
            <div className="cliente-detalhe-banner">
              <img src={item.imagem} alt={item.titulo} />
              <span className="cliente-ticket-card__badge">{ehRevenda ? 'Revenda' : 'Venda oficial'}</span>
            </div>

            <h1>{item.titulo}</h1>

            <p className="cliente-detalhe-meta">
              <span>📅 {formatarData(item.data)}</span>
              <span>📍 {item.local}</span>
            </p>

            <p className="cliente-detalhe-descricao">
              Ingresso protegido pela custódia TrocaTicket. O valor só é liberado ao
              vendedor depois que o ingresso é validado e o acesso ao evento é confirmado.
            </p>

            <div className="cliente-detalhe-info-grid">
              <div><span>Data</span><strong>{formatarData(item.data)}</strong></div>
              <div><span>Local</span><strong>{item.local}</strong></div>
              <div><span>Categoria</span><strong>{item.categoria || '—'}</strong></div>
              <div><span>Tipo</span><strong>{ehRevenda ? `Lote de ${item.quantidadeLote} ingresso(s)` : 'Ingresso individual'}</strong></div>
            </div>
          </section>

          <aside className="cliente-detalhe-resumo">
            <div className="cliente-compra-card">
              <div className="cliente-compra-card__preco">
                <small>{quantidade > 1 ? `Total (${quantidade} ingressos)` : 'Total'}</small>
                <strong>{formatarPreco(total)}</strong>
              </div>

              {!ehRevenda && (
                <div className="cliente-quantidade">
                  <span>Quantidade</span>
                  <div className="cliente-quantidade-stepper">
                    <button
                      type="button"
                      disabled={quantidade <= 1}
                      onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
                    >
                      −
                    </button>
                    <span>{quantidade}</span>
                    <button
                      type="button"
                      disabled={quantidade >= Math.min(8, item.disponiveis || 8)}
                      onClick={() => setQuantidade((q) => Math.min(item.disponiveis || 8, q + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <button
                type="button"
                className="cliente-btn-comprar"
                onClick={() => setModalPagamentoAberto(true)}
              >
                Comprar agora
              </button>

              {ehRevenda && !propostaEnviada && (
                <button
                  type="button"
                  className="cliente-btn-secundario-claro"
                  onClick={() => setFormPropostaAberto((aberto) => !aberto)}
                >
                  Fazer contraproposta
                </button>
              )}

              {ehRevenda && formPropostaAberto && (
                <form className="cliente-field" onSubmit={enviarProposta} style={{ marginTop: '0.75rem' }}>
                  <label htmlFor="preco-proposta">Seu valor proposto (por ingresso)</label>
                  <input
                    id="preco-proposta"
                    type="number"
                    min="0.01"
                    max={item.precoMaximoProposta}
                    step="0.01"
                    placeholder={`Anunciado a ${formatarPreco(item.preco)}`}
                    value={precoProposta}
                    onChange={(e) => setPrecoProposta(e.target.value)}
                    required
                  />
                  <small>Máximo permitido: {formatarPreco(item.precoMaximoProposta)} (10% acima do valor original — regra antiágio)</small>
                  {erroProposta && (
                    <p role="alert" style={{ color: '#BE123C', fontSize: '0.85rem' }}>{erroProposta}</p>
                  )}
                  <button type="submit" className="cliente-btn-comprar" disabled={enviandoProposta} style={{ marginTop: '0.5rem' }}>
                    {enviandoProposta ? 'Enviando...' : 'Enviar proposta'}
                  </button>
                </form>
              )}

              {propostaEnviada && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  ✓ Proposta enviada! O vendedor vai analisar e você pode acompanhar o status em
                  {' '}<Link to="/cliente/suas-revendas">Suas Revendas</Link>.
                </p>
              )}

              <p className="cliente-compra-card__aviso">
                🛡️ Pagamento retido em custódia até a validação do ingresso.
              </p>
            </div>

            <div className="cliente-passos">
              <h2>Como funciona a troca segura</h2>
              <ol>
                <li><span>1</span><div><strong>Pagamento em custódia</strong><p>Você paga e o valor fica retido com a TrocaTicket.</p></div></li>
                <li><span>2</span><div><strong>Ingresso transferido</strong><p>O vendedor transfere o ingresso e o QR Code é validado.</p></div></li>
                <li><span>3</span><div><strong>Liberação em até 24h</strong><p>Confirmado o acesso, o valor é liberado automaticamente.</p></div></li>
              </ol>
            </div>
          </aside>
        </div>
      </main>

      {modalPagamentoAberto && (
        <ModalPagamento
          titulo={item.titulo}
          resumo={`${quantidade}x · ${formatarData(item.data)}`}
          total={total}
          aoConfirmar={confirmarCompra}
          aoFechar={() => setModalPagamentoAberto(false)}
          aoSucesso={() => navegar('/cliente/seus-ingressos')}
        />
      )}
    </>
  )
}
