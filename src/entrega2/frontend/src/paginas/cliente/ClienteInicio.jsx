import { Link } from 'react-router-dom'
import { ClienteHeader } from '../../componentes/cliente/ClienteHeader'

const destaques = [
  ['Festival de Verão 2025', 'show', '25 de Outubro de 2025 – 18:00', 'Allianz Parque – São Paulo, SP', 'R$ 280,00', 'festival-verao-2025'],
  ['Final do Campeonato Nacional', 'esporte', '12 de Novembro de 2025 – 21:30', 'Estádio do Maracanã – Rio de Janeiro, RJ', 'R$ 350,00', 'campeonato-nacional'],
  ['Noite de Comédia Especial', 'teatro', '05 de Dezembro de 2025 – 20:00', 'Teatro Bradesco – São Paulo, SP', 'R$ 90,00', 'comedia-especial'],
]

export function ClienteInicio() {
  return (
    <>
      <ClienteHeader
        titulo="Olá, Gabriel Souza!"
        descricao="Encontre ingressos verificados, com custódia garantida."
      />

      <main className="cliente-main">
        <div className="cliente-search-row">
          <div className="cliente-search">
            🔎
            <input type="search" placeholder="Buscar por nome do evento, artista ou estádio..." />
          </div>
          <button type="button" className="cliente-filtros-btn">☷ Filtros</button>
        </div>

        <section className="cliente-hero">
          <div className="cliente-hero__info">
            <span className="cliente-hero__badge">Em destaque</span>
            <h2>Festival de Verão 2025</h2>
            <p className="cliente-hero__meta">
              <span>📅 25 de Outubro de 2025 – 18:00</span>
              <span>📍 Allianz Parque – São Paulo, SP</span>
            </p>
            <p className="cliente-hero__preco">
              <small>A partir de</small>
              <strong>R$ 280,00</strong>
            </p>
            <div className="cliente-hero__actions">
              <Link to="/cliente/ingressos/festival-verao-2025" className="cliente-btn-primario">
                Ver ingressos →
              </Link>
              <button type="button" className="cliente-btn-secundario">🔖 Salvar evento</button>
            </div>
          </div>

          <div className="cliente-hero__imagem">
            <img src="https://picsum.photos/seed/festival-verao-2025/700/500" alt="Público no Festival de Verão 2025" />
          </div>
        </section>

        <section>
          <div className="cliente-destaques__head">
            <div>
              <h2>Ingressos em Destaque</h2>
              <p>Ofertas verificadas com custódia TrocaTicket</p>
            </div>
            <Link to="/cliente/ingressos" className="cliente-ver-todos">Ver todos →</Link>
          </div>

          <div className="cliente-cards-grid">
            {destaques.map(([titulo, categoria, data, local, preco, id]) => (
              <article className="cliente-ticket-card" key={id}>
                <div className="cliente-ticket-card__imagem" data-categoria={categoria}>
                  <img src={`https://picsum.photos/seed/${id}/500/400`} alt={titulo} />
                  <span className="cliente-ticket-card__badge">
                    {categoria === 'show' ? 'Show' : categoria === 'esporte' ? 'Esporte' : 'Teatro'}
                  </span>
                </div>
                <div className="cliente-ticket-card__corpo">
                  <h3>{titulo}</h3>
                  <p>📅 {data}</p>
                  <p>📍 {local}</p>
                  <div className="cliente-ticket-card__rodape">
                    <div>
                      <small>A partir de</small>
                      <strong>{preco}</strong>
                    </div>
                    <Link to={`/cliente/ingressos/${id}`} className="cliente-btn-detalhes">
                      Ver detalhes →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
