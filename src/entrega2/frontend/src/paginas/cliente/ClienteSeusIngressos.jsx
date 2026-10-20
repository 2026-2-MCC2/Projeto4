import { ClienteHeader } from '../../componentes/cliente/ClienteHeader'

const lista = [
  ['Festival de Verão 2025', 'Pista Premium • 25/10/2025 • Allianz Parque, SP', 'Válido', true],
  ['Final do Campeonato Nacional', 'Cadeira Inferior • 12/11/2025 • Maracanã, RJ', 'Em custódia', false],
  ['Noite de Comédia Especial', 'Plateia A - Fila G • 05/12/2025 • Teatro Bradesco, SP', 'Válido', true],
  ['Rock The Mountain 2025', 'Passaporte Fins de Semana • 18/03/2026 • Petrópolis, RJ', 'Em custódia', false],
  ['Coldplay World Tour Brasil', 'Pista Geral • 05/04/2026 • Estádio MorumBIS, SP', 'Válido', true],
]

export function ClienteSeusIngressos() {
  return (
    <>
      <ClienteHeader
        titulo="Seus Ingressos"
        descricao="Visualize e gerencie todos os ingressos adquiridos e sob proteção de custódia."
        voltarParaPerfil
        nome="Gabriel Souza"
      />

      <main className="cliente-main">
        <div className="cliente-aviso-custodia">
          🛡️
          <div>
            <strong>Resolução garantida 24/7.</strong>
            {' '}Nos ingressos com status "Em custódia", o pagamento do vendedor só é liberado 2 horas após a validação bem-sucedida na catraca do evento.
          </div>
        </div>

        <div className="cliente-proximo-evento">
          <div>
            <span>Próximo evento • Em 14 dias</span>
            <h2>Festival de Verão 2025</h2>
            <p>25 de Outubro às 18:00 • Allianz Parque, São Paulo - SP</p>
          </div>
        </div>

        <div className="cliente-lista-head">
          <div><h2>Lista de Ingressos</h2><p>5 ingressos encontrados</p></div>
        </div>

        <div className="cliente-ingresso-lista">
          {lista.map(([titulo, detalhe, status, valido]) => {
            const id = titulo.toLowerCase().replaceAll(' ', '-')
            return (
              <article className="cliente-ingresso-item" key={titulo}>
                <img className="cliente-ingresso-item__imagem" src={`https://picsum.photos/seed/${id}/160/160`} alt={titulo} />
                <div className="cliente-ingresso-item__info">
                  <h3>{titulo}</h3>
                  <p>{detalhe}</p>
                  <div className="cliente-ingresso-item__tags">
                    <span className={`cliente-tag ${valido ? 'cliente-tag--custodia' : 'cliente-tag--pendente'}`}>{status}</span>
                  </div>
                </div>
                <div className="cliente-ingresso-item__acoes">
                  <button type="button" className={valido ? 'cliente-btn-comprar' : 'cliente-btn-secundario-claro'}>
                    {valido ? '▦ Ver QR Code' : 'Acompanhar'}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </main>
    </>
  )
}
