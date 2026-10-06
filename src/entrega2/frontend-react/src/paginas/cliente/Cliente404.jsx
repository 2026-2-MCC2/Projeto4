import { Link } from 'react-router-dom'

export function Cliente404() {
  return (
    <main>
      <section className="pagina-404">
        <div className="pagina-404__codigo">404</div>
        <h1>Página não encontrada</h1>
        <p>O endereço que você tentou acessar não existe ou foi movido. Confira o link ou volte para o início.</p>
        <Link to="/cliente">← Voltar para o Início</Link>
      </section>
    </main>
  )
}
