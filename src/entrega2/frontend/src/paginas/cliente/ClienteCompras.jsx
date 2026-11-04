import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClienteHeader } from '../../componentes/cliente/ClienteHeader'
import { listarEventosPublicos, listarRevendasPublicas } from '../../api/publico'
import { usuarioLogado } from '../../api/auth'

function formatarPreco(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const CATEGORIAS = ['todos', 'show', 'esporte', 'teatro', 'festival', 'standup']
const ROTULO_CATEGORIA = { todos: 'Todos', show: 'Show', esporte: 'Esporte', teatro: 'Teatro', festival: 'Festival', standup: 'Stand-up' }

export function ClienteCompras() {
  const usuario = usuarioLogado()
  const [categoria, setCategoria] = useState('todos')
  const [itens, setItens] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true
    Promise.all([listarEventosPublicos(), listarRevendasPublicas()])
      .then(([eventos, revendas]) => {
        if (!ativo) return
        const itensEventos = eventos.map((e) => ({
          tipo: 'evento', id: e.id_evento, titulo: e.nome,
          detalhe: `${e.local} • Venda oficial`,
          preco: Number(e.preco_ingresso),
          categoria: (e.categoria || '').toLowerCase(),
          imagem: e.imagem_url || `https://picsum.photos/seed/evento-${e.id_evento}/160/160`,
        }))
        const itensRevendas = revendas.map((r) => ({
          tipo: 'revenda', id: r.id_revenda, titulo: r.nome,
          detalhe: `${r.local} • Revenda entre clientes`,
          preco: Number(r.preco_unitario),
          categoria: (r.categoria || '').toLowerCase(),
          imagem: r.imagem_url || `https://picsum.photos/seed/revenda-${r.id_revenda}/160/160`,
        }))
        setItens([...itensEventos, ...itensRevendas])
      })
      .catch((erroRequisicao) => { if (ativo) setErro(erroRequisicao.message) })
      .finally(() => { if (ativo) setCarregando(false) })
    return () => { ativo = false }
  }, [])

  const filtrados = useMemo(
    () => (categoria === 'todos' ? itens : itens.filter((item) => item.categoria === categoria)),
    [itens, categoria]
  )

  return (
    <>
      <ClienteHeader
        titulo="Compras"
        descricao="Ofertas de ingressos prontas para compra com custódia garantida."
        nome={usuario?.nome}
      />

      <main className="cliente-main">
        <div className="cliente-filtros-bar">
          <span className="cliente-filtros-bar__label">☷ Filtros</span>
          {CATEGORIAS.map((item) => (
            <button
              key={item}
              type="button"
              className={`cliente-filtro-pill ${categoria === item ? 'is-active' : ''}`}
              onClick={() => setCategoria(item)}
            >
              {ROTULO_CATEGORIA[item]}
            </button>
          ))}
        </div>

        <div className="cliente-lista-head">
          <div>
            <h2>Ofertas para você</h2>
            <p>Eventos oficiais e revendas verificadas com custódia TrocaTicket</p>
          </div>
          <span className="cliente-lista-contador">{filtrados.length} oferta{filtrados.length !== 1 ? 's' : ''}</span>
        </div>

        {erro && (
          <div className="cliente-estado" role="alert">
            <p style={{ color: '#BE123C' }}>{erro}</p>
          </div>
        )}

        <div className="cliente-ingresso-lista">
          {carregando ? (
            <div className="cliente-estado"><p>Carregando ofertas...</p></div>
          ) : filtrados.length === 0 ? (
            <div className="cliente-estado"><p>Nenhuma oferta encontrada para esse filtro.</p></div>
          ) : (
            filtrados.map((item) => (
              <article className="cliente-ingresso-item" key={`${item.tipo}-${item.id}`}>
                <img className="cliente-ingresso-item__imagem" src={item.imagem} alt={item.titulo} />
                <div className="cliente-ingresso-item__info">
                  <h3>{item.titulo}</h3>
                  <p>{item.detalhe}</p>
                </div>
                <div className="cliente-ingresso-item__preco">
                  <strong>{formatarPreco(item.preco)}</strong>
                  <small>por ingresso</small>
                </div>
                <div className="cliente-ingresso-item__acoes">
                  <Link to={`/cliente/ingressos/${item.tipo}/${item.id}`} className="cliente-btn-comprar">Comprar</Link>
                </div>
              </article>
            ))
          )}
        </div>
      </main>
    </>
  )
}
