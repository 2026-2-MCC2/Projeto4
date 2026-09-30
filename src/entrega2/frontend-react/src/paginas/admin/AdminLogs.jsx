import { useState } from 'react'
import { eventosLog, filtrosSeveridade } from '../../dados/admin'
import { CabecalhoPagina } from '../../componentes/admin/layout'
import {
  Botao,
  CartaoEstatistica,
  Painel,
  StatusPill,
} from '../../componentes/admin/primitivos'
import { AbasSeveridade, BarraFiltros } from '../../componentes/admin/formularios'
import { ListaLogs } from '../../componentes/admin/dados'

export function AdminLogs() {
  const [severidade, setSeveridade] = useState('Todos')

  return (
    <>
      <CabecalhoPagina
        eyebrow="Imutabilidade Ledger v2.4 · Audit Node Synced"
        titulo="Logs e Auditoria"
        descricao="Rastreamento imutável de ações administrativas, eventos de custódia e acessos ao sistema, com validação criptográfica em tempo real."
        acoes={<Botao>⭳ Exportar Logs (CSV/JSON)</Botao>}
      />

      <div className="admin-stats admin-stats--3">
        <CartaoEstatistica
          rotulo="Eventos Registrados (24h)"
          valor="1.842"
          detalhe="+12% vs. ontem"
        />
        <CartaoEstatistica
          rotulo="Liberações de Custódia"
          valor="R$ 412.300"
          detalhe="18 liquidações"
        />
        <CartaoEstatistica
          rotulo="Tentativas Bloqueadas"
          valor="14"
          detalhe="Zero incidentes de vazamento"
        />
      </div>

      <BarraFiltros>
        <AbasSeveridade
          opcoes={filtrosSeveridade}
          ativa={severidade}
          aoTrocar={setSeveridade}
        />
        <small className="admin-hint">18/10 – 25/10 · 6 filtros aplicados</small>
        <a
          href="#"
          className="admin-filterbar__new"
          onClick={(e) => e.preventDefault()}
        >
          Limpar filtros
        </a>
      </BarraFiltros>

      <Painel className="admin-panel--flush">
        <ListaLogs eventos={eventosLog} />
      </Painel>

      <Painel className="admin-hash-box">
        <div>
          <strong>Integridade Criptográfica</strong>
          <p>
            Merkle Root: <code>9a7b…c41e</code> · Bloco auditável nº 98.412
          </p>
        </div>
        <StatusPill>100% Verificado</StatusPill>
      </Painel>
    </>
  )
}
