import { useEffect, useState } from 'react'
import { api } from '../../api/cliente'
import { CabecalhoPagina, Abas } from '../../componentes/admin/layout'
import {
  Alerta,
  Botao,
  CabecalhoPainel,
  CartaoEstatistica,
  Painel,
  Tag,
} from '../../componentes/admin/primitivos'
import { BarraFiltros } from '../../componentes/admin/formularios'

const ROTULOS_STATUS_EVENTO = {
  rascunho: 'Rascunho',
  aberto: 'Em cotação',
  fechado: 'Fechado',
  cancelado: 'Cancelado',
}

const TOM_STATUS_EVENTO = {
  rascunho: 'warn',
  aberto: 'info',
  fechado: 'ok',
  cancelado: 'danger',
}

const ROTULOS_STATUS_PROPOSTA = {
  enviada: 'Enviada',
  aceita: 'Aceita',
  recusada: 'Recusada',
  cancelada: 'Cancelada',
}

const TOM_STATUS_PROPOSTA = {
  enviada: 'info',
  aceita: 'ok',
  recusada: 'danger',
  cancelada: 'warn',
}

function capitalizar(texto) {
  if (!texto) return '—'
  return texto.charAt(0).toUpperCase() + texto.slice(1).replaceAll('_', ' ')
}

function formatarMoeda(valor) {
  const numero = Number(valor)
  if (valor === null || valor === undefined || Number.isNaN(numero)) return '—'
  return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatarNumero(valor) {
  const numero = Number(valor)
  return Number.isNaN(numero) ? '0' : String(numero)
}

export function AdminRelatorios() {
  const [aba, setAba] = useState('Resumo')

  return (
    <>
      <CabecalhoPagina
        eyebrow="Inteligência de Negócio · RF14"
        titulo="Relatórios de Eventos"
        descricao="Acompanhe o desempenho geral da plataforma, o orçamento consolidado de cada evento e o andamento das propostas de fornecedores."
      />

      <Abas
        abas={['Resumo', 'Eventos', 'Propostas']}
        ativa={aba}
        aoTrocar={setAba}
      />

      {aba === 'Resumo' && <SecaoResumo />}
      {aba === 'Eventos' && <SecaoEventos />}
      {aba === 'Propostas' && <SecaoPropostas />}
    </>
  )
}

function SecaoResumo() {
  const [dados, setDados] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true
    setCarregando(true)
    setErro('')
    api
      .get('/api/relatorios/resumo')
      .then((d) => {
        if (ativo) setDados(d)
      })
      .catch((e) => {
        if (ativo) setErro(e.message)
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })
    return () => {
      ativo = false
    }
  }, [])

  if (carregando) return <Painel>Carregando resumo...</Painel>
  if (erro)
    return (
      <Painel>
        <Alerta titulo="Não foi possível carregar o resumo" tom="danger">
          {erro}
        </Alerta>
      </Painel>
    )
  if (!dados) return null

  return (
    <>
      <Painel>
        <CabecalhoPainel titulo="Usuários" descricao="Totais por tipo e status de cadastro." />
        <div className="admin-report-grid">
          {dados.usuarios?.map((item) => (
            <CartaoEstatistica
              key={`${item.tipo}-${item.status_cadastro}`}
              rotulo={`${capitalizar(item.tipo)} · ${capitalizar(item.status_cadastro)}`}
              valor={formatarNumero(item.total)}
            />
          ))}
          {!dados.usuarios?.length && <p>Nenhum dado de usuários disponível.</p>}
        </div>
      </Painel>

      <Painel>
        <CabecalhoPainel titulo="Eventos" descricao="Totais por status do evento." />
        <div className="admin-report-grid">
          {dados.eventos?.map((item) => (
            <CartaoEstatistica
              key={item.status}
              rotulo={ROTULOS_STATUS_EVENTO[item.status] || capitalizar(item.status)}
              valor={formatarNumero(item.total)}
            />
          ))}
          {!dados.eventos?.length && <p>Nenhum dado de eventos disponível.</p>}
        </div>
      </Painel>

      <Painel>
        <CabecalhoPainel titulo="Propostas" descricao="Totais e valor somado por status." />
        <div className="admin-report-grid">
          {dados.propostas?.map((item) => (
            <CartaoEstatistica
              key={item.status}
              rotulo={ROTULOS_STATUS_PROPOSTA[item.status] || capitalizar(item.status)}
              valor={formatarNumero(item.total)}
              detalhe={formatarMoeda(item.valor_total)}
            />
          ))}
          {!dados.propostas?.length && <p>Nenhum dado de propostas disponível.</p>}
        </div>
      </Painel>
    </>
  )
}

function SecaoEventos() {
  const [status, setStatus] = useState('')
  const [eventos, setEventos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const [detalheId, setDetalheId] = useState(null)
  const [detalhe, setDetalhe] = useState(null)
  const [carregandoDetalhe, setCarregandoDetalhe] = useState(false)
  const [erroDetalhe, setErroDetalhe] = useState('')

  useEffect(() => {
    let ativo = true
    setCarregando(true)
    setErro('')
    api
      .get('/api/relatorios/eventos', status ? { status } : undefined)
      .then((d) => {
        if (ativo) setEventos(Array.isArray(d) ? d : [])
      })
      .catch((e) => {
        if (ativo) setErro(e.message)
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })
    return () => {
      ativo = false
    }
  }, [status])

  function abrirDetalhe(id) {
    setDetalheId(id)
    setDetalhe(null)
    setErroDetalhe('')
    setCarregandoDetalhe(true)
    api
      .get(`/api/relatorios/eventos/${id}`)
      .then((d) => setDetalhe(d))
      .catch((e) => setErroDetalhe(e.message))
      .finally(() => setCarregandoDetalhe(false))
  }

  function fecharDetalhe() {
    setDetalheId(null)
    setDetalhe(null)
    setErroDetalhe('')
  }

  return (
    <>
      <BarraFiltros>
        <label htmlFor="admin-rel-eventos-status">Status</label>
        <select
          id="admin-rel-eventos-status"
          aria-label="Filtrar eventos por status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Todos</option>
          {Object.keys(ROTULOS_STATUS_EVENTO).map((chave) => (
            <option key={chave} value={chave}>
              {ROTULOS_STATUS_EVENTO[chave]}
            </option>
          ))}
        </select>
      </BarraFiltros>

      <Painel>
        {carregando && <p>Carregando eventos...</p>}
        {erro && (
          <Alerta titulo="Não foi possível carregar os eventos" tom="danger">
            {erro}
          </Alerta>
        )}

        {!carregando && !erro && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Evento</th>
                <th>Organizador</th>
                <th>Data</th>
                <th>Local</th>
                <th>Status</th>
                <th>Público mín/máx</th>
                <th>Itens</th>
                <th>Propostas</th>
                <th>Propostas aceitas</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {eventos.map((evento) => (
                <tr key={evento.id_evento}>
                  <td>{evento.nome}</td>
                  <td>{evento.organizador}</td>
                  <td>{evento.data}</td>
                  <td>{evento.local}</td>
                  <td>
                    <Tag tom={TOM_STATUS_EVENTO[evento.status] || 'info'}>
                      {ROTULOS_STATUS_EVENTO[evento.status] || evento.status}
                    </Tag>
                  </td>
                  <td>
                    {evento.publico_minimo ?? '—'} / {evento.publico_maximo ?? '—'}
                  </td>
                  <td>{formatarNumero(evento.total_itens)}</td>
                  <td>{formatarNumero(evento.total_propostas)}</td>
                  <td>{formatarNumero(evento.total_propostas_aceitas)}</td>
                  <td>
                    <Botao onClick={() => abrirDetalhe(evento.id_evento)}>
                      Ver detalhes
                    </Botao>
                  </td>
                </tr>
              ))}
              {!eventos.length && (
                <tr>
                  <td colSpan={10}>Nenhum evento encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </Painel>

      {detalheId && (
        <div className="admin-modal-backdrop" onClick={fecharDetalhe}>
          <div
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <Painel className="admin-modal__panel">
              <CabecalhoPainel
                eyebrow="Detalhe do evento"
                titulo={detalhe?.evento?.nome || `Evento #${detalheId}`}
                descricao={detalhe?.evento ? `${detalhe.evento.data} · ${detalhe.evento.local}` : ''}
              >
                <Botao onClick={fecharDetalhe}>Fechar</Botao>
              </CabecalhoPainel>

              {carregandoDetalhe && <p>Carregando detalhe...</p>}
              {erroDetalhe && (
                <Alerta titulo="Não foi possível carregar o detalhe" tom="danger">
                  {erroDetalhe}
                </Alerta>
              )}

              {!carregandoDetalhe && !erroDetalhe && detalhe && (
                <DetalheEvento detalhe={detalhe} />
              )}
            </Painel>
          </div>
        </div>
      )}
    </>
  )
}

function DetalheEvento({ detalhe }) {
  const { orcamento, ticket } = detalhe

  return (
    <>
      <div className="admin-report-grid">
        <CartaoEstatistica
          rotulo="Total de propostas aceitas"
          valor={formatarMoeda(orcamento?.total_propostas)}
        />
        <CartaoEstatistica
          rotulo="Custos fixos"
          valor={formatarMoeda(orcamento?.total_custos_fixos)}
        />
        <CartaoEstatistica
          rotulo="Custo fixo total"
          valor={formatarMoeda(orcamento?.custo_fixo_total)}
        />
        <CartaoEstatistica
          rotulo="Custo por participante"
          valor={formatarMoeda(orcamento?.custo_por_participante)}
        />
        <CartaoEstatistica
          rotulo="Itens sem proposta"
          valor={formatarNumero(orcamento?.itens_sem_proposta)}
        />
      </div>

      {!ticket && (
        <Alerta titulo="Ticket de equilíbrio indisponível" tom="warn">
          Este evento ainda não tem público mínimo e máximo definidos, então não
          é possível calcular o ticket de equilíbrio.
        </Alerta>
      )}

      {ticket && (
        <div className="admin-report-cenarios">
          <Alerta titulo="Fórmula de cálculo" tom="info">
            {ticket.formula} (arredondamento: {ticket.arredondamento}, margem de
            lucro: {ticket.margem_lucro}%)
            {ticket.aviso ? ` — ${ticket.aviso}` : ''}
          </Alerta>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Cenário</th>
                <th>Público</th>
                <th>Custo total</th>
                <th>Ticket de equilíbrio</th>
                <th>Ticket alvo</th>
                <th>Receita estimada</th>
                <th>Lucro estimado</th>
              </tr>
            </thead>
            <tbody>
              {ticket.cenarios?.map((cenario) => (
                <tr key={cenario.cenario}>
                  <td>{cenario.cenario === 'minimo' ? 'Mínimo' : 'Máximo'}</td>
                  <td>{formatarNumero(cenario.publico)}</td>
                  <td>{formatarMoeda(cenario.custo_total)}</td>
                  <td>{formatarMoeda(cenario.ticket_equilibrio)}</td>
                  <td>{formatarMoeda(cenario.ticket_alvo)}</td>
                  <td>{formatarMoeda(cenario.receita_estimada)}</td>
                  <td>{formatarMoeda(cenario.lucro_estimado)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

function SecaoPropostas() {
  const [status, setStatus] = useState('')
  const [propostas, setPropostas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true
    setCarregando(true)
    setErro('')
    api
      .get('/api/relatorios/propostas', status ? { status } : undefined)
      .then((d) => {
        if (ativo) setPropostas(Array.isArray(d) ? d : [])
      })
      .catch((e) => {
        if (ativo) setErro(e.message)
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })
    return () => {
      ativo = false
    }
  }, [status])

  return (
    <>
      <BarraFiltros>
        <label htmlFor="admin-rel-propostas-status">Status</label>
        <select
          id="admin-rel-propostas-status"
          aria-label="Filtrar propostas por status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Todos</option>
          {Object.keys(ROTULOS_STATUS_PROPOSTA).map((chave) => (
            <option key={chave} value={chave}>
              {ROTULOS_STATUS_PROPOSTA[chave]}
            </option>
          ))}
        </select>
      </BarraFiltros>

      <Painel>
        {carregando && <p>Carregando propostas...</p>}
        {erro && (
          <Alerta titulo="Não foi possível carregar as propostas" tom="danger">
            {erro}
          </Alerta>
        )}

        {!carregando && !erro && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Evento</th>
                <th>Item</th>
                <th>Fornecedor</th>
                <th>Valor</th>
                <th>Validade</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {propostas.map((proposta) => (
                <tr key={proposta.id_proposta}>
                  <td>{proposta.evento}</td>
                  <td>{proposta.item}</td>
                  <td>{proposta.fornecedor}</td>
                  <td>{formatarMoeda(proposta.valor_total)}</td>
                  <td>{proposta.validade}</td>
                  <td>
                    <Tag tom={TOM_STATUS_PROPOSTA[proposta.status] || 'info'}>
                      {ROTULOS_STATUS_PROPOSTA[proposta.status] || proposta.status}
                    </Tag>
                  </td>
                </tr>
              ))}
              {!propostas.length && (
                <tr>
                  <td colSpan={6}>Nenhuma proposta encontrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </Painel>
    </>
  )
}
