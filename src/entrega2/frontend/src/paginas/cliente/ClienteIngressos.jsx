import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClienteHeader } from '../../componentes/cliente/ClienteHeader'
import { ingressos } from '../../dados/cliente'

function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function ClienteIngressos() {
  const [categoria, setCategoria] = useState('todos')
  const [ordenar, setOrdenar] = useState('menor-preco')

  const lista = useMemo(() => {
    let resultado = [...ingressos]

    if (categoria !== 'todos') {
      resultado = resultado.filter((item) => item.categoria === categoria)
    }

    if (ordenar === 'menor-preco') {
      resultado.sort((a, b) => a.preco - b.preco)
    } else if (ordenar === 'maior-preco') {
      resultado.sort((a, b) => b.preco - a.preco)
    } else {
      resultado.sort((a, b) => a.dataOrdenacao.localeCompare(b.dataOrdenacao))
    }

    return resultado
  }, [categoria, ordenar])

  return (
    <>
      <ClienteHeader
        titulo="Ingressos"
        descricao="Explore os ingressos disponíveis para compra ou troca."
      />

      <main className="cliente-main">
        <div className="cliente-filtros-bar">
          <span className="cliente-filtros-bar__label">☷ Filtros</span>

          {[
            ['todos', 'Todos'],
            ['show', 'Show'],
            ['esporte', 'Esporte'],
            ['teatro', 'Teatro'],
            ['festival', 'Festival'],
            ['standup', 'Stand-up'],
          ].map(([valor, texto]) => (
            <button
              key={valor}
              type="button"
              className={`cliente-filtro-pill ${categoria === valor ? 'is-active' : ''}`}
              onClick={() => setCategoria(valor)}
            >
              {texto}
            </button>
          ))}

          <div className="cliente-ordenar">
            <label htmlFor="select-ordenar">Ordenar:</label>
            <select id="select-ordenar" value={ordenar} onChange={(e) => setOrdenar(e.target.value)}>
              <option value="menor-preco">Menor preço</option>
              <option value="maior-preco">Maior preço</option>
              <option value="data">Data do evento</option>
            </select>
          </div>
        </div>

        <div className="cliente-lista-head">
          <div>
            <h2>Ingressos disponíveis</h2>
            <p>Ofertas verificadas com custódia TrocaTicket</p>
          </div>
          <span className="cliente-lista-contador">
            {lista.length} ingresso{lista.length !== 1 ? 's' : ''} encontrado{lista.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="cliente-ingresso-lista">
          {lista.length === 0 ? (
            <div className="cliente-estado">
              <p>Nenhum ingresso encontrado para esse filtro.</p>
            </div>
          ) : (
            lista.map((item) => (
              <article className="cliente-ingresso-item" key={item.id}>
                <img className="cliente-ingresso-item__imagem" src={item.imagem} alt={item.titulo} />

                <div className="cliente-ingresso-item__info">
                  <h3>{item.titulo}</h3>
                  <p>{item.local} • {item.dataExibicao}</p>

                  <div className="cliente-ingresso-item__tags">
                    {item.tags.map((tag) => (
                      <span
                        key={tag.texto}
                        className={`cliente-tag${tag.tipo ? ` cliente-tag--${tag.tipo}` : ''}`}
                      >
                        {tag.texto}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="cliente-ingresso-item__preco">
                  <strong>{formatarPreco(item.preco)}</strong>
                  <small>por ingresso</small>
                </div>

                <div className="cliente-ingresso-item__acoes">
                  <button type="button" className="cliente-icone-quadrado" aria-label="Salvar ingresso">
                    🔖
                  </button>

                  <Link to={`/cliente/ingressos/${item.id}`} className="cliente-btn-comprar">
                    Comprar
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      </main>
    </>
  )
}
