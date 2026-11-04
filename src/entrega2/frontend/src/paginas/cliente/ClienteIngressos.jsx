import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClienteHeader } from '../../componentes/cliente/ClienteHeader'
import { listarEventosPublicos, listarRevendasPublicas } from '../../api/publico'
import { usuarioLogado } from '../../api/auth'

function formatarPreco(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatarData(dataIso) {
  if (!dataIso) return ''
  return new Date(`${dataIso}T00:00:00`).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long',
  })
}

export function ClienteIngressos() {
  const usuario = usuarioLogado()
  const [categoria, setCategoria] = useState('todos')
  const [ordenar, setOrdenar] = useState('menor-preco')
  const [itens, setItens] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let cancelado = false
    setCarregando(true)
    setErro('')

    Promise.all([listarEventosPublicos(), listarRevendasPublicas()])
      .then(([eventos, revendas]) => {
        if (cancelado) return
        const itensEventos = eventos.map((evento) => ({
          tipo: 'evento',
          id: evento.id_evento,
          titulo: evento.nome,
          local: evento.local,
          dataExibicao: formatarData(evento.data),
          dataOrdenacao: evento.data,
          categoria: (evento.categoria || '').toLowerCase(),
          preco: Number(evento.preco_ingresso),
          imagem: evento.imagem_url || `https://picsum.photos/seed/evento-${evento.id_evento}/160/160`,
          tag: { texto: 'Venda oficial' },
        }))
        const itensRevendas = revendas.map((revenda) => ({
          tipo: 'revenda',
          id: revenda.id_revenda,
          titulo: revenda.nome,
          local: revenda.local,
          dataExibicao: formatarData(revenda.data),
          dataOrdenacao: revenda.data,
          categoria: (revenda.categoria || '').toLowerCase(),
          preco: Number(revenda.preco_unitario),
          imagem: revenda.imagem_url || `https://picsum.photos/seed/revenda-${revenda.id_revenda}/160/160`,
          tag: { texto: 'Revenda entre clientes', tipo: 'oferta' },
        }))
        setItens([...itensEventos, ...itensRevendas])
      })
      .catch((erroRequisicao) => {
        if (!cancelado) setErro(erroRequisicao.message)
      })
      .finally(() => {
        if (!cancelado) setCarregando(false)
      })

    return () => { cancelado = true }
  }, [])

  const lista = useMemo(() => {
    let resultado = [...itens]

    if (categoria !== 'todos') {
      resultado = resultado.filter((item) => item.categoria === categoria)
    }

    if (ordenar === 'menor-preco') {
      resultado.sort((a, b) => a.preco - b.preco)
    } else if (ordenar === 'maior-preco') {
      resultado.sort((a, b) => b.preco - a.preco)
    } else {
      resultado.sort((a, b) => (a.dataOrdenacao || '').localeCompare(b.dataOrdenacao || ''))
    }

    return resultado
  }, [itens, categoria, ordenar])

  return (
    <>
      <ClienteHeader
        titulo="Ingressos"
        descricao="Explore os ingressos disponíveis para compra ou troca."
        nome={usuario?.nome}
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

        {erro && (
          <div className="cliente-estado" role="alert">
            <p style={{ color: '#BE123C' }}>{erro}</p>
          </div>
        )}

        <div className="cliente-ingresso-lista">
          {carregando ? (
            <div className="cliente-estado">
              <p>Carregando ingressos...</p>
            </div>
          ) : lista.length === 0 ? (
            <div className="cliente-estado">
              <p>Nenhum ingresso encontrado para esse filtro.</p>
            </div>
          ) : (
            lista.map((item) => (
              <article className="cliente-ingresso-item" key={`${item.tipo}-${item.id}`}>
                <img className="cliente-ingresso-item__imagem" src={item.imagem} alt={item.titulo} />

                <div className="cliente-ingresso-item__info">
                  <h3>{item.titulo}</h3>
                  <p>{item.local} • {item.dataExibicao}</p>

                  <div className="cliente-ingresso-item__tags">
                    <span className={`cliente-tag${item.tag.tipo ? ` cliente-tag--${item.tag.tipo}` : ''}`}>
                      {item.tag.texto}
                    </span>
                  </div>
                </div>

                <div className="cliente-ingresso-item__preco">
                  <strong>{formatarPreco(item.preco)}</strong>
                  <small>por ingresso</small>
                </div>

                <div className="cliente-ingresso-item__acoes">
                  <Link to={`/cliente/ingressos/${item.tipo}/${item.id}`} className="cliente-btn-comprar">
                    Ver detalhes
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
