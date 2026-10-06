import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ClienteHeader } from '../../componentes/cliente/ClienteHeader'
import { ingressos } from '../../dados/cliente'

export function ClienteVerIngresso() {
  const { id } = useParams()
  const ingresso = ingressos.find((item) => item.id === id) ?? ingressos[0]
  const [quantidade, setQuantidade] = useState(1)

  const total = ingresso.preco * quantidade

  return (
    <>
      <ClienteHeader
        titulo="Detalhes do Ingresso"
        descricao="Confira as informações completas antes de comprar ou negociar."
      />

      <main className="cliente-main">
        <Link to="/cliente/ingressos" className="cliente-voltar">← Voltar para Ingressos</Link>

        <div className="cliente-detalhe">
          <section className="cliente-detalhe-principal">
            <div className="cliente-detalhe-banner">
              <img
                src={`https://picsum.photos/seed/${ingresso.id}/1000/560`}
                alt={ingresso.titulo}
              />
              <span className="cliente-ticket-card__badge">Show</span>
            </div>

            <h1>{ingresso.titulo}</h1>

            <p className="cliente-detalhe-meta">
              <span>📅 {ingresso.dataExibicao}</span>
              <span>📍 {ingresso.local}</span>
            </p>

            <div className="cliente-ingresso-item__tags">
              {ingresso.tags.map((tag) => (
                <span
                  key={tag.texto}
                  className={`cliente-tag${tag.tipo ? ` cliente-tag--${tag.tipo}` : ''}`}
                >
                  {tag.texto}
                </span>
              ))}
            </div>

            <p className="cliente-detalhe-descricao">
              Ingresso protegido pela custódia TrocaTicket. O valor só é liberado ao
              vendedor depois que o ingresso é validado e o acesso ao evento é confirmado.
            </p>

            <div className="cliente-detalhe-info-grid">
              <div><span>Data</span><strong>25 de Outubro de 2025</strong></div>
              <div><span>Horário</span><strong>18:00</strong></div>
              <div><span>Local</span><strong>{ingresso.local}</strong></div>
              <div><span>Categoria</span><strong>Show / Festival</strong></div>
              <div><span>Setor</span><strong>Pista Premium</strong></div>
              <div><span>Tipo</span><strong>Ingresso individual</strong></div>
            </div>
          </section>

          <aside className="cliente-detalhe-resumo">
            <div className="cliente-compra-card">
              <div className="cliente-compra-card__preco">
                <small>{quantidade > 1 ? `Total (${quantidade} ingressos)` : 'Total'}</small>
                <strong>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
              </div>

              <div className="cliente-quantidade">
                <span>Quantidade</span>
                <div className="cliente-quantidade-stepper">
                  <button
                    type="button"
                    disabled={quantidade <= 1}
                    onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
                  >
                    −
                  </button>
                  <span>{quantidade}</span>
                  <button
                    type="button"
                    disabled={quantidade >= 8}
                    onClick={() => setQuantidade((q) => Math.min(8, q + 1))}
                  >
                    +
                  </button>
                </div>
              </div>

              <button type="button" className="cliente-btn-comprar">Comprar agora</button>
              <button type="button" className="cliente-btn-secundario-claro">Fazer contraproposta</button>

              <p className="cliente-compra-card__aviso">
                🛡️ Pagamento retido em custódia até a validação do ingresso.
              </p>
            </div>

            <div className="cliente-vendedor-card">
              <h2>Vendedor</h2>
              <div className="cliente-vendedor-card__perfil">
                <span className="admin-avatar">MF</span>
                <div>
                  <strong>Mariana Ferreira ✓</strong>
                  <small>Vendedor verificado • 4.9 (37 trocas)</small>
                </div>
              </div>
              <p>Membro desde 2023, sem nenhuma reclamação registrada nas últimas 50 negociações.</p>
            </div>

            <div className="cliente-passos">
              <h2>Como funciona a troca segura</h2>
              <ol>
                <li><span>1</span><div><strong>Pagamento em custódia</strong><p>Você paga e o valor fica retido com a TrocaTicket.</p></div></li>
                <li><span>2</span><div><strong>Ingresso transferido</strong><p>O vendedor transfere o ingresso e o QR Code é validado.</p></div></li>
                <li><span>3</span><div><strong>Liberação em até 24h</strong><p>Confirmado o acesso, o valor é liberado automaticamente.</p></div></li>
              </ol>
            </div>
          </aside>
        </div>
      </main>
    </>
  )
}
