import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClienteHeader } from '../../componentes/cliente/ClienteHeader'
import { listarEventosPublicos } from '../../api/publico'
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

export function ClienteInicio() {
  const usuario = usuarioLogado()
  const [eventos, setEventos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true
    listarEventosPublicos()
      .then((dados) => { if (ativo) setEventos(dados) })
      .catch((erroRequisicao) => { if (ativo) setErro(erroRequisicao.message) })
      .finally(() => { if (ativo) setCarregando(false) })
    return () => { ativo = false }
  }, [])

  const [destaque, ...resto] = eventos

  return (
    <>
      <ClienteHeader
        titulo={`Olá, ${usuario?.nome || 'visitante'}!`}
        descricao="Encontre ingressos verificados, com custódia garantida."
      />

      <main className="cliente-main">
        {erro && (
          <div className="cliente-estado" role="alert">
            <p style={{ color: '#BE123C' }}>{erro}</p>
          </div>
        )}

        {carregando && <p>Carregando eventos...</p>}

        {!carregando && !erro && destaque && (
          <section className="cliente-hero">
            <div className="cliente-hero__info">
              <span className="cliente-hero__badge">Em destaque</span>
              <h2>{destaque.nome}</h2>
              <p className="cliente-hero__meta">
                <span>📅 {formatarData(destaque.data)}</span>
                <span>📍 {destaque.local}</span>
              </p>
              <p className="cliente-hero__preco">
                <small>A partir de</small>
                <strong>{formatarPreco(destaque.preco_ingresso)}</strong>
              </p>
              <div className="cliente-hero__actions">
                <Link to={`/cliente/ingressos/evento/${destaque.id_evento}`} className="cliente-btn-primario">
                  Ver ingressos →
                </Link>
              </div>
            </div>

            <div className="cliente-hero__imagem">
              <img
                src={destaque.imagem_url || `https://picsum.photos/seed/evento-${destaque.id_evento}/700/500`}
                alt={destaque.nome}
              />
            </div>
          </section>
        )}

        {!carregando && !erro && eventos.length === 0 && (
          <div className="cliente-estado"><p>Nenhum evento disponível no momento.</p></div>
        )}

        {resto.length > 0 && (
          <section>
            <div className="cliente-destaques__head">
              <div>
                <h2>Ingressos em Destaque</h2>
                <p>Ofertas verificadas com custódia TrocaTicket</p>
              </div>
              <Link to="/cliente/ingressos" className="cliente-ver-todos">Ver todos →</Link>
            </div>

            <div className="cliente-cards-grid">
              {resto.slice(0, 3).map((evento) => (
                <article className="cliente-ticket-card" key={evento.id_evento}>
                  <div className="cliente-ticket-card__imagem" data-categoria={evento.categoria}>
                    <img
                      src={evento.imagem_url || `https://picsum.photos/seed/evento-${evento.id_evento}/500/400`}
                      alt={evento.nome}
                    />
                    <span className="cliente-ticket-card__badge">{evento.categoria || 'Evento'}</span>
                  </div>
                  <div className="cliente-ticket-card__corpo">
                    <h3>{evento.nome}</h3>
                    <p>📅 {formatarData(evento.data)}</p>
                    <p>📍 {evento.local}</p>
                    <div className="cliente-ticket-card__rodape">
                      <div>
                        <small>A partir de</small>
                        <strong>{formatarPreco(evento.preco_ingresso)}</strong>
                      </div>
                      <Link to={`/cliente/ingressos/evento/${evento.id_evento}`} className="cliente-btn-detalhes">
                        Ver detalhes →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  )
}
