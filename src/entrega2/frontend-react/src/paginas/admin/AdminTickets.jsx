import { useState } from 'react'
import { ticketSelecionado, tickets } from '../../dados/admin'
import { CabecalhoPagina } from '../../componentes/admin/layout'
import {
  Avatar,
  Botao,
  CabecalhoPainel,
  MiniEstatisticas,
  Painel,
  RodapePainel,
  StatusPill,
} from '../../componentes/admin/primitivos'
import { BarraFiltros } from '../../componentes/admin/formularios'
import { ListaTickets } from '../../componentes/admin/dados'

const OPCOES_PRIORIDADE = [
  'Todas as prioridades',
  'Alta',
  'Média',
  'Baixa',
]

const OPCOES_CATEGORIA = [
  'Todas as categorias',
  'Disputa de Custódia',
  'Gestão de Lotes',
  'Reembolso / Chargeback',
  'Financeiro & Repasse',
]

export function AdminTickets() {
  const [selecionado, setSelecionado] = useState(tickets[0].id)

  return (
    <>
      <CabecalhoPagina
        eyebrow="Central de Atendimento · Fila Operacional Ativa"
        titulo="Suporte e Atendimento a Tickets"
        descricao="Gerencie chamados de usuários, mediação de disputas de custódia e suporte a organizadores."
        acoes={
          <MiniEstatisticas
            itens={[
              { rotulo: 'Abertos', valor: '14' },
              { rotulo: 'Em Andamento', valor: '8' },
              { rotulo: 'Resolvidos', valor: '152' },
            ]}
          />
        }
      />

      <BarraFiltros>
        <input
          type="search"
          placeholder="Buscar por nome, e-mail ou Ticket ID..."
          aria-label="Buscar tickets"
        />
        <select
          aria-label="Filtrar por prioridade"
          defaultValue={OPCOES_PRIORIDADE[0]}
        >
          {OPCOES_PRIORIDADE.map((opcao) => (
            <option key={opcao}>{opcao}</option>
          ))}
        </select>
        <select
          aria-label="Filtrar por categoria"
          defaultValue={OPCOES_CATEGORIA[0]}
        >
          {OPCOES_CATEGORIA.map((opcao) => (
            <option key={opcao}>{opcao}</option>
          ))}
        </select>
      </BarraFiltros>

      <ListaTickets
        tickets={tickets}
        selecionado={selecionado}
        aoSelecionar={setSelecionado}
      />

      <Painel className="admin-ticket-detail">
        <CabecalhoPainel
          eyebrow={ticketSelecionado.eyebrow}
          titulo={`${ticketSelecionado.id} — ${ticketSelecionado.titulo}`}
          descricao={ticketSelecionado.resumo}
        >
          <StatusPill>{ticketSelecionado.estado}</StatusPill>
        </CabecalhoPainel>

        <MiniEstatisticas
          itens={ticketSelecionado.metricas}
          alinhadoAoInicio
        />

        {ticketSelecionado.mensagens.map((mensagem) => (
          <div
            key={mensagem.autor}
            className={[
              'admin-ticket-message',
              mensagem.interno ? 'admin-ticket-message--internal' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <Avatar iniciais={mensagem.iniciais} tamanho="sm" />
            <div>
              <strong>
                {mensagem.autor} <small>· {mensagem.papel} · {mensagem.quando}</small>
              </strong>
              <p>
                {mensagem.interno ? (
                  <em>
                    Nota interna de auditoria (visível apenas para a equipe
                    TrocaTicket):{' '}
                  </em>
                ) : null}
                {mensagem.texto}
              </p>
              {mensagem.anexo ? <small>{mensagem.anexo}</small> : null}
            </div>
          </div>
        ))}

        <RodapePainel>
          <Botao>Bloquear Custódia Provisória</Botao>
          <Botao>Reatribuir</Botao>
          <Botao>Alterar Status</Botao>
          <Botao variante="primario">Marcar como Resolvido</Botao>
        </RodapePainel>
      </Painel>
    </>
  )
}
