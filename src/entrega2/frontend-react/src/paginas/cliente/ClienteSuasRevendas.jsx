import { useState } from 'react'
import { ClienteHeader } from '../../componentes/cliente/ClienteHeader'

const pedidos = [
  ['Festival de Verão 2025 • Pista Premium', 'Comprador: Rodrigo Mendonça • Pedido #TK-84920', 'Aguardando pagamento', 'R$ 280,00', 'pendente', 'Ver Proposta'],
  ['Rock in Rio 2025 • Dia do Rock, Gramado', 'Comprador: Camila Lima • Pedido #TK-84918', 'Em custódia', 'R$ 220,00', 'custodia', 'Liberar Ingresso'],
  ['Final do Campeonato Nacional • Cadeira Coberta', 'Comprador: Felipe Alencar • Pedido #TK-84801', 'Em custódia', 'R$ 490,00', 'custodia', 'Liberar Ingresso'],
  ['Noite de Comédia Especial • Plateia VIP', 'Comprador: Mariana Costa • Pedido #TK-84755', 'Concluída', 'R$ 110,00', 'custodia', 'Ver Comprovante'],
  ['Coldplay World Tour Brasil • Pista Premium', 'Comprador: João Pereira • Pedido #TK-84712', 'Concluída', 'R$ 220,00', 'custodia', 'Ver Comprovante'],
]

export function ClienteSuasRevendas() {
  const [filtro, setFiltro] = useState('todos')

  const filtrados = pedidos.filter((item) => {
    if (filtro === 'pendentes') return item[4] === 'pendente'
    if (filtro === 'concluidos') return item[2] === 'Concluída'
    return true
  })

  return (
    <>
      <ClienteHeader
        titulo="Suas Revendas"
        descricao="Acompanhe os ingressos que você anunciou para revenda ou repasse protegido com garantia escrow."
        voltarParaPerfil
        nome="Gabriel Souza"
      />

      <main className="cliente-main">
        <div className="cliente-stats-row">
          <div className="cliente-stat-box"><span>Saldo em Custódia</span><strong>R$ 770,00</strong><small>2 transações garantidas</small></div>
          <div className="cliente-stat-box"><span>Vendas Concluídas</span><strong>R$ 330,00</strong><small>2 repasses finalizados</small></div>
        </div>

        <div className="cliente-filtros-bar">
          {[
            ['todos', 'Todos (5)'],
            ['pendentes', 'Pendentes (2)'],
            ['concluidos', 'Concluídos (3)'],
          ].map(([valor, texto]) => (
            <button key={valor} type="button" className={`cliente-filtro-pill ${filtro === valor ? 'is-active' : ''}`} onClick={() => setFiltro(valor)}>
              {texto}
            </button>
          ))}
        </div>

        <div className="cliente-lista-head">
          <div><h2>Pedidos de Revenda</h2><p>{filtrados.length} transações registradas</p></div>
          <button type="button" className="cliente-btn-primario">Anunciar Novo Ingresso</button>
        </div>

        <div className="cliente-ingresso-lista">
          {filtrados.map(([titulo, detalhe, status, preco, tipo, acao]) => (
            <article className="cliente-ingresso-item" key={titulo}>
              <img className="cliente-ingresso-item__imagem" src={`https://picsum.photos/seed/${titulo}/160/160`} alt={titulo} />
              <div className="cliente-ingresso-item__info">
                <h3>{titulo}</h3>
                <p>{detalhe}</p>
                <div className="cliente-ingresso-item__tags">
                  <span className={`cliente-tag cliente-tag--${tipo}`}>{status}</span>
                </div>
              </div>
              <div className="cliente-ingresso-item__preco"><strong>{preco}</strong><small>{status === 'Concluída' ? 'recebido' : 'valor líquido'}</small></div>
              <div className="cliente-ingresso-item__acoes">
                <button type="button" className={status === 'Concluída' ? 'cliente-btn-secundario-claro' : 'cliente-btn-comprar'}>{acao}</button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </>
  )
}
