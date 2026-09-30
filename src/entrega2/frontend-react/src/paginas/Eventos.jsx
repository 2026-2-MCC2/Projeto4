import { Link } from 'react-router-dom'
import { Cabecalho } from '../componentes/publico/Cabecalho'
import { Rodape } from '../componentes/publico/Rodape'

const eventos = [
  {
    imagem: '/images/eventos/evento-1.jpg',
    categoria: 'SHOW',
    nome: 'Nome do Evento',
    data: '15 de outubro de 2026',
    local: 'São Paulo - SP',
    preco: 'R$ 80,00',
  },
  {
    imagem: '/images/eventos/evento-2.jpg',
    categoria: 'FESTIVAL',
    nome: 'Festival TrocaTicket',
    data: '22 de outubro de 2026',
    local: 'São Paulo - SP',
    preco: 'R$ 120,00',
  },
  {
    imagem: '/images/eventos/evento-3.jpg',
    categoria: 'ESPORTE',
    nome: 'Evento Esportivo',
    data: '05 de novembro de 2026',
    local: 'São Paulo - SP',
    preco: 'R$ 60,00',
  },
  {
    imagem: '/images/eventos/evento-4.jpg',
    categoria: 'TEATRO',
    nome: 'Espetáculo de Teatro',
    data: '12 de novembro de 2026',
    local: 'São Paulo - SP',
    preco: 'R$ 45,00',
  },
]

export function Eventos() {
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
            />
            <button type="submit"> Pesquisar </button>
          </form>
        </section>

        <section>
          <aside>
            <h2>Filtros</h2>
            <fieldset>
              <legend>Categoria</legend>
              <div>
                <input type="checkbox" id="shows" name="categoria" value="shows" />
                <label htmlFor="shows"> Shows </label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="festivais"
                  name="categoria"
                  value="festivais"
                />
                <label htmlFor="festivais"> Festivais </label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="esportes"
                  name="categoria"
                  value="esportes"
                />
                <label htmlFor="esportes"> Esportes </label>
              </div>
              <div>
                <input type="checkbox" id="teatro" name="categoria" value="teatro" />
                <label htmlFor="teatro"> Teatro </label>
              </div>
              <div>
                <input type="checkbox" id="outros" name="categoria" value="outros" />
                <label htmlFor="outros"> Outros </label>
              </div>
            </fieldset>

            <fieldset>
              <legend>Local</legend>
              <label htmlFor="local"> Cidade ou estado </label>
              <input
                type="text"
                id="local"
                name="local"
                placeholder="Ex.: São Paulo"
              />
            </fieldset>

            <fieldset>
              <legend>Data</legend>
              <label htmlFor="data"> A partir de </label>
              <input type="date" id="data" name="data" />
            </fieldset>

            <button type="submit"> Aplicar filtros </button>
          </aside>

          <div>
            <div>
              <h2>Eventos disponíveis</h2>
              <label htmlFor="ordenacao"> Ordenar por: </label>
              <select id="ordenacao" name="ordenacao">
                <option value="relevancia"> Relevância </option>
                <option value="data"> Data mais próxima </option>
              </select>
            </div>

            {eventos.map((evento) => (
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
