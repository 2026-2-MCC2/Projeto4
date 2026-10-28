import { useEffect, useState } from 'react'
import { api } from '../../api/cliente'
import { CabecalhoPagina } from '../../componentes/admin/layout'
import {
  Alerta,
  Avatar,
  Botao,
  CabecalhoPainel,
  MiniEstatisticas,
  Painel,
  RodapePainel,
  Tag,
} from '../../componentes/admin/primitivos'
import { BarraFiltros } from '../../componentes/admin/formularios'
import { iniciaisDoNome } from '../../utils/formatar'

const OPCOES_STATUS = [
  { valor: '', rotulo: 'Todos os status' },
  { valor: 'aberto', rotulo: 'Aberto' },
  { valor: 'em_andamento', rotulo: 'Em Andamento' },
  { valor: 'resolvido', rotulo: 'Resolvido' },
  { valor: 'fechado', rotulo: 'Fechado' },
]

const OPCOES_CATEGORIA = [
  { valor: '', rotulo: 'Todas as categorias' },
  { valor: 'evento', rotulo: 'Evento' },
  { valor: 'proposta', rotulo: 'Proposta' },
  { valor: 'cadastro', rotulo: 'Cadastro' },
  { valor: 'financeiro', rotulo: 'Financeiro' },
  { valor: 'outro', rotulo: 'Outro' },
]

const TOM_STATUS = {
  aberto: 'info',
  em_andamento: 'warn',
  resolvido: 'ok',
  fechado: 'dark',
}

const TOM_PRIORIDADE = {
  alta: 'danger',
  media: 'warn',
  baixa: 'info',
}

function rotuloStatus(status) {
  return OPCOES_STATUS.find((opcao) => opcao.valor === status)?.rotulo || status
}

function rotuloCategoria(categoria) {
  return OPCOES_CATEGORIA.find((opcao) => opcao.valor === categoria)?.rotulo || categoria
}


function formatarData(data) {
  if (!data) return ''
  try {
    return new Date(data).toLocaleString('pt-BR')
  } catch {
    return data
  }
}

export function AdminTickets() {
  const [tickets, setTickets] = useState([])
  const [carregandoLista, setCarregandoLista] = useState(true)
  const [erroLista, setErroLista] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')

  const [selecionado, setSelecionado] = useState(null)
  const [detalhe, setDetalhe] = useState(null)
  const [carregandoDetalhe, setCarregandoDetalhe] = useState(false)
  const [erroDetalhe, setErroDetalhe] = useState('')

  const [resposta, setResposta] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [mudandoStatus, setMudandoStatus] = useState(false)

  async function carregarLista(idParaManter) {
    setCarregandoLista(true)
    setErroLista('')
    try {
      const dados = await api.get('/api/admin/tickets', {
        status: filtroStatus || undefined,
        categoria: filtroCategoria || undefined,
      })
      setTickets(dados)
      setSelecionado((atual) => {
        const alvo = idParaManter !== undefined ? idParaManter : atual
        if (dados.some((ticket) => ticket.id_ticket === alvo)) return alvo
        return dados[0]?.id_ticket ?? null
      })
    } catch (erro) {
      setErroLista(erro.message)
    } finally {
      setCarregandoLista(false)
    }
  }

  async function carregarDetalhe(id) {
    if (!id) {
      setDetalhe(null)
      return
    }
    setCarregandoDetalhe(true)
    setErroDetalhe('')
    try {
      const dados = await api.get(`/api/admin/tickets/${id}`)
      setDetalhe(dados)
    } catch (erro) {
      setErroDetalhe(erro.message)
    } finally {
      setCarregandoDetalhe(false)
    }
  }

  useEffect(() => {
    carregarLista(undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroStatus, filtroCategoria])

  useEffect(() => {
    carregarDetalhe(selecionado)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selecionado])

  async function aoResponder(evento) {
    evento.preventDefault()
    const mensagem = resposta.trim()
    if (!mensagem || !selecionado) return
    setEnviando(true)
    setErroDetalhe('')
    try {
      await api.post(`/api/admin/tickets/${selecionado}/mensagens`, { mensagem })
      setResposta('')
      await carregarDetalhe(selecionado)
      await carregarLista(selecionado)
    } catch (erro) {
      setErroDetalhe(erro.message)
    } finally {
      setEnviando(false)
    }
  }

  async function aoMudarStatus(novoStatus) {
    if (!selecionado) return
    setMudandoStatus(true)
    setErroDetalhe('')
    try {
      await api.patch(`/api/admin/tickets/${selecionado}/status`, { status: novoStatus })
      await carregarDetalhe(selecionado)
      await carregarLista(selecionado)
    } catch (erro) {
      setErroDetalhe(erro.message)
    } finally {
      setMudandoStatus(false)
    }
  }

  const abertos = tickets.filter((ticket) => ticket.status === 'aberto').length
  const emAndamento = tickets.filter((ticket) => ticket.status === 'em_andamento').length
  const resolvidos = tickets.filter((ticket) => ticket.status === 'resolvido').length

  return (
    <>
      <CabecalhoPagina
        eyebrow="Central de Atendimento"
        titulo="Suporte e Atendimento a Tickets"
        descricao="Gerencie chamados reais de usuários sobre eventos, propostas, cadastro e financeiro."
        acoes={
          <MiniEstatisticas
            itens={[
              { rotulo: 'Abertos', valor: String(abertos) },
              { rotulo: 'Em Andamento', valor: String(emAndamento) },
              { rotulo: 'Resolvidos', valor: String(resolvidos) },
            ]}
          />
        }
      />

      <BarraFiltros>
        <select
          aria-label="Filtrar por status"
          value={filtroStatus}
          onChange={(evento) => setFiltroStatus(evento.target.value)}
        >
          {OPCOES_STATUS.map((opcao) => (
            <option key={opcao.valor} value={opcao.valor}>
              {opcao.rotulo}
            </option>
          ))}
        </select>
        <select
          aria-label="Filtrar por categoria"
          value={filtroCategoria}
          onChange={(evento) => setFiltroCategoria(evento.target.value)}
        >
          {OPCOES_CATEGORIA.map((opcao) => (
            <option key={opcao.valor} value={opcao.valor}>
              {opcao.rotulo}
            </option>
          ))}
        </select>
      </BarraFiltros>

      {erroLista ? (
        <Alerta titulo="Erro ao carregar tickets" tom="danger">
          {erroLista}
        </Alerta>
      ) : null}

      <Painel className="admin-panel--flush">
        {carregandoLista ? (
          <p style={{ padding: '1rem' }}>Carregando tickets...</p>
        ) : tickets.length === 0 ? (
          <p style={{ padding: '1rem' }}>Nenhum ticket encontrado para este filtro.</p>
        ) : (
          <ul className="admin-ticket-list">
            {tickets.map((ticket) => (
              <li
                key={ticket.id_ticket}
                role="button"
                tabIndex={0}
                onClick={() => setSelecionado(ticket.id_ticket)}
                onKeyDown={(evento) => {
                  if (evento.key === 'Enter' || evento.key === ' ') {
                    evento.preventDefault()
                    setSelecionado(ticket.id_ticket)
                  }
                }}
                className={[
                  'admin-ticket-list__item',
                  ticket.id_ticket === selecionado ? 'admin-ticket-list__item--active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <div className="admin-ticket-list__id">
                  <strong>#{ticket.id_ticket}</strong>
                  <small>
                    {rotuloCategoria(ticket.categoria)} · {formatarData(ticket.criado_em)}
                  </small>
                </div>
                <div className="admin-ticket-list__body">
                  <strong>{ticket.assunto}</strong>
                  <span>
                    <Avatar iniciais={iniciaisDoNome(ticket.autor)} tamanho="sm" />{' '}
                    {ticket.autor} ({ticket.autor_tipo})
                  </span>
                </div>
                <div className="admin-ticket-list__tags">
                  <Tag tom={TOM_PRIORIDADE[ticket.prioridade] || 'info'}>{ticket.prioridade}</Tag>
                  <Tag tom={TOM_STATUS[ticket.status] || 'info'}>{rotuloStatus(ticket.status)}</Tag>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Painel>

      {selecionado ? (
        <Painel className="admin-ticket-detail">
          {carregandoDetalhe ? (
            <p>Carregando detalhes do ticket...</p>
          ) : erroDetalhe && !detalhe ? (
            <Alerta titulo="Erro ao carregar ticket" tom="danger">
              {erroDetalhe}
            </Alerta>
          ) : detalhe ? (
            <>
              <CabecalhoPainel
                eyebrow={`${rotuloCategoria(detalhe.categoria)} · Prioridade ${detalhe.prioridade}`}
                titulo={`#${detalhe.id_ticket} — ${detalhe.assunto}`}
                descricao={`Aberto por ${detalhe.autor} (${detalhe.autor_tipo}) em ${formatarData(detalhe.criado_em)}`}
              >
                <Tag tom={TOM_STATUS[detalhe.status] || 'info'}>{rotuloStatus(detalhe.status)}</Tag>
              </CabecalhoPainel>

              {erroDetalhe ? (
                <Alerta titulo="Erro" tom="danger">
                  {erroDetalhe}
                </Alerta>
              ) : null}

              {detalhe.mensagens.map((mensagem) => (
                <div key={mensagem.id_mensagem} className="admin-ticket-message">
                  <Avatar iniciais={iniciaisDoNome(mensagem.autor)} tamanho="sm" />
                  <div>
                    <strong>
                      {mensagem.autor || 'Usuário removido'}{' '}
                      <small>
                        · {mensagem.autor_tipo || '—'} · {formatarData(mensagem.criado_em)}
                      </small>
                    </strong>
                    <p>{mensagem.mensagem}</p>
                  </div>
                </div>
              ))}

              <form className="admin-field" onSubmit={aoResponder}>
                <label htmlFor="resposta-ticket">Responder como administrador</label>
                <textarea
                  id="resposta-ticket"
                  rows={3}
                  value={resposta}
                  onChange={(evento) => setResposta(evento.target.value)}
                  placeholder="Digite sua resposta para o usuário..."
                  disabled={detalhe.status === 'fechado'}
                />
                <Botao
                  type="submit"
                  variante="primario"
                  disabled={enviando || !resposta.trim() || detalhe.status === 'fechado'}
                >
                  {enviando ? 'Enviando...' : 'Enviar resposta'}
                </Botao>
              </form>

              <RodapePainel>
                {OPCOES_STATUS.filter((opcao) => opcao.valor && opcao.valor !== detalhe.status).map(
                  (opcao) => (
                    <Botao
                      key={opcao.valor}
                      variante={opcao.valor === 'resolvido' ? 'primario' : 'fantasma'}
                      disabled={mudandoStatus}
                      onClick={() => aoMudarStatus(opcao.valor)}
                    >
                      Marcar como {opcao.rotulo}
                    </Botao>
                  )
                )}
              </RodapePainel>
            </>
          ) : null}
        </Painel>
      ) : null}
    </>
  )
}
