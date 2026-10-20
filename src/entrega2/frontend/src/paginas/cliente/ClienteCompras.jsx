import { Link } from 'react-router-dom'
import { ClienteHeader } from '../../componentes/cliente/ClienteHeader'

const ofertas = [
  ['Festival de Verão 2025', 'Pista Premium • Setor Norte • Vendedor verificado', 'R$ 280,00', 'festival-verao-2025'],
  ['Final do Campeonato Nacional', 'Cadeira Inferior • Setor Leste • Vendedor verificado', 'R$ 350,00', 'campeonato-nacional'],
  ['Noite de Comédia Especial', 'Plateia A • Fileira F • Vendedor verificado', 'R$ 90,00', 'comedia-especial'],
  ['Rock The Mountain 2025', 'Passaporte 2 dias • Área geral • Vendedor verificado', 'R$ 180,00', 'rock-the-mountain'],
  ['Coldplay World Tour Brasil', 'Pista Geral • Portão B • Vendedor verificado', 'R$ 620,00', 'coldplay-brasil'],
  ['Lollapalooza Brasil - Sábado', 'Pista • Dia 1 • Vendedor verificado', 'R$ 520,00', 'lollapalooza-brasil'],
]

export function ClienteCompras() {
  return (
    <>
      <ClienteHeader
        titulo="Compras"
        descricao="Ofertas de ingressos prontas para compra com custódia garantida."
      />

      <main className="cliente-main">
        <div className="cliente-filtros-bar">
          <span className="cliente-filtros-bar__label">☷ Filtros</span>
          {['Todos', 'Show', 'Esporte', 'Teatro', 'Festival', 'Stand-up'].map((item, index) => (
            <button key={item} type="button" className={`cliente-filtro-pill ${index === 0 ? 'is-active' : ''}`}>
              {item}
            </button>
          ))}
        </div>

        <div className="cliente-lista-head">
          <div>
            <h2>Ofertas para você</h2>
            <p>Salve os eventos que quiser acompanhar</p>
          </div>
          <span className="cliente-lista-contador">6 ofertas</span>
        </div>

        <div className="cliente-ingresso-lista">
          {ofertas.map(([titulo, detalhe, preco, id]) => (
            <article className="cliente-ingresso-item" key={id}>
              <img className="cliente-ingresso-item__imagem" src={`https://picsum.photos/seed/${id}/160/160`} alt={titulo} />
              <div className="cliente-ingresso-item__info">
                <h3>{titulo}</h3>
                <p>{detalhe}</p>
              </div>
              <div className="cliente-ingresso-item__preco">
                <strong>{preco}</strong>
                <small>por ingresso</small>
              </div>
              <div className="cliente-ingresso-item__acoes">
                <Link to={`/cliente/ingressos/${id}`} className="cliente-btn-comprar">Comprar</Link>
              </div>
            </article>
          ))}
        </div>
      </main>
    </>
  )
}
