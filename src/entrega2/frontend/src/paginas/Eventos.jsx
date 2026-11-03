import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Cabecalho } from '../componentes/publico/Cabecalho'
import { Rodape } from '../componentes/publico/Rodape'

const eventos = [
  {
    imagem: '/images/eventos/evento-3.jpg',
    categoria: 'ESPORTE',
    nome: 'Evento Esportivo',
    data: '05 de novembro de 2026',
    dataISO: '2026-11-05',
    local: 'São Paulo - SP',
    preco: 'R$ 60,00',
  },
  {
    imagem: '/images/eventos/evento-1.jpg',
    categoria: 'SHOW',
    nome: 'Nome do Evento',
    data: '15 de outubro de 2026',
    dataISO: '2026-10-15',
    local: 'São Paulo - SP',
    preco: 'R$ 80,00',
  },
  {
    imagem: '/images/eventos/evento-2.jpg',
    categoria: 'FESTIVAL',
    nome: 'Festival TrocaTicket',
    data: '22 de outubro de 2026',
    dataISO: '2026-10-22',
    local: 'São Paulo - SP',
    preco: 'R$ 120,00',
  },
  {
    imagem: '/images/eventos/evento-4.jpg',
    categoria: 'TEATRO',
    nome: 'Espetáculo de Teatro',
    data: '12 de novembro de 2026',
    dataISO: '2026-11-12',
    local: 'São Paulo - SP',
    preco: 'R$ 45,00',
  },
]

const CATEGORIAS = [
  { id: 'shows', label: 'Shows', categoria: 'SHOW' },
  { id: 'festivais', label: 'Festivais', categoria: 'FESTIVAL' },
  { id: 'esportes', label: 'Esportes', categoria: 'ESPORTE' },
  { id: 'teatro', label: 'Teatro', categoria: 'TEATRO' },
  { id: 'outros', label: 'Outros', categoria: null },
]

const CATEGORIA_PARA_FILTRO = CATEGORIAS.reduce((mapa, opcao) => {
  if (opcao.categoria) mapa[opcao.categoria] = opcao.id
  return mapa
}, {})

function normalizar(texto) {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}

export function Eventos() {
  const [busca, setBusca] = useState('')
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([])
  const [cidade, setCidade] = useState('')
  const [dataMinima, setDataMinima] = useState('')
  const [ordenacao, setOrdenacao] = useState('relevancia')

  function alternarCategoria(id) {
    setCategoriasSelecionadas((atual) =>
      atual.includes(id) ? atual.filter((item) => item !== id) : [...atual, id]
    )
  }

  const eventosFiltrados = useMemo(() => {
    const termo = normalizar(busca)
    const termoCidade = normalizar(cidade)

    let resultado = eventos.filter((evento) => {
      const correspondeTermo =
        termo === '' ||
        normalizar(evento.nome).includes(termo) ||
        normalizar(evento.categoria).includes(termo) ||
        normalizar(evento.local).includes(termo)

      const filtroDaCategoria = CATEGORIA_PARA_FILTRO[evento.categoria] || 'outros'
      const correspondeCategoria =
        categoriasSelecionadas.length === 0 ||
        categoriasSelecionadas.includes(filtroDaCategoria)

      const correspondeCidade =
        termoCidade === '' || normalizar(evento.local).includes(termoCidade)

      const correspondeData = dataMinima === '' || evento.dataISO >= dataMinima

      return correspondeTermo && correspondeCategoria && correspondeCidade && correspondeData
    })

    if (ordenacao === 'data') {
      resultado = [...resultado].sort((a, b) => a.dataISO.localeCompare(b.dataISO))
    }

    return resultado
  }, [busca, categoriasSelecionadas, cidade, dataMinima, ordenacao])

  return (
    <>
      <Cabecalho />

      <main>
        <section>
          <h1>Encontre seu próximo evento</h1>
          <p> Descubra eventos, shows, festivais, esportes e muito mais. </p>
          <form onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="pesquisa"> Pesquisar eventos </label>
            <input
              type="search"
              id="pesquisa"
              name="pesquisa"
              placeholder="Digite o nome do evento, artista ou local"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <button type="submit"> Pesquisar </button>
          </form>
        </section>

        <section>
          <aside>
            <h2>Filtros</h2>
            <fieldset>
              <legend>Categoria</legend>
              {CATEGORIAS.map((opcao) => (
                <div key={opcao.id}>
                  <input
                    type="checkbox"
                    id={opcao.id}
                    name="categoria"
                    value={opcao.id}
                    checked={categoriasSelecionadas.includes(opcao.id)}
                    onChange={() => alternarCategoria(opcao.id)}
                  />
                  <label htmlFor={opcao.id}> {opcao.label} </label>
                </div>
              ))}
            </fieldset>

            <fieldset>
              <legend>Local</legend>
              <label htmlFor="local"> Cidade ou estado </label>
              <input
                type="text"
                id="local"
                name="local"
                placeholder="Ex.: São Paulo"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
              />
            </fieldset>

            <fieldset>
              <legend>Data</legend>
              <label htmlFor="data"> A partir de </label>
              <input
                type="date"
                id="data"
                name="data"
                value={dataMinima}
                onChange={(e) => setDataMinima(e.target.value)}
              />
            </fieldset>

            <button type="button"> Aplicar filtros </button>
          </aside>

          <div>
            <div>
              <h2>Eventos disponíveis</h2>
              <label htmlFor="ordenacao"> Ordenar por: </label>
              <select
                id="ordenacao"
                name="ordenacao"
                value={ordenacao}
                onChange={(e) => setOrdenacao(e.target.value)}
              >
                <option value="relevancia"> Relevância </option>
                <option value="data"> Data mais próxima </option>
              </select>
            </div>

            {eventosFiltrados.length === 0 && (
              <p> Nenhum evento encontrado com esses filtros. </p>
            )}

            {eventosFiltrados.map((evento) => (
              <article key={evento.nome}>
                <img src={evento.imagem} alt="Imagem do evento" />
                <div>
                  <p> {evento.categoria}</p>
                  <h3> {evento.nome} </h3>
                  <p> 📅 {evento.data}</p>
                  <p>📍 {evento.local} </p>
                  <p>
                    {' '}
                    A partir de <strong> {evento.preco}</strong>{' '}
                  </p>
                  <Link to="/login"> Ver evento </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Rodape />
    </>
  )
}
