import { useEffect, useState } from 'react'
import { api } from '../../api/cliente'
import { CabecalhoPagina } from '../../componentes/admin/layout'
import { CartaoEstatistica, Painel } from '../../componentes/admin/primitivos'
import { ListaStatus } from '../../componentes/admin/dados'

const ROTULO_TIPO = {
  organizador: 'Organizadores',
  fornecedor: 'Fornecedores',
  cliente: 'Clientes',
  administrador: 'Administradores',
}

const ROTULO_STATUS_EVENTO = {
  rascunho: 'Rascunho',
  aberto: 'Aberto',
  fechado: 'Fechado',
  cancelado: 'Cancelado',
}

const ROTULO_STATUS_PROPOSTA = {
  enviada: 'Enviada',
  aceita: 'Aceita',
  recusada: 'Recusada',
  cancelada: 'Cancelada',
}

function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor || 0)
}

function formatarTempoAtividade(segundos) {
  if (!segundos) return '—'
  const horas = Math.floor(segundos / 3600)
  const minutos = Math.floor((segundos % 3600) / 60)
  if (horas > 0) return `${horas}h ${minutos}min`
  return `${minutos} min`
}

export function AdminDashboard() {
  const [resumo, setResumo] = useState(null)
  const [monitoramento, setMonitoramento] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true

    async function carregar() {
      setCarregando(true)
      setErro('')
      try {
        const [dadosResumo, dadosMonitoramento] = await Promise.all([
          api.get('/api/relatorios/resumo'),
          api.get('/api/admin/monitoramento'),
        ])
        if (!ativo) return
        setResumo(dadosResumo)
        setMonitoramento(dadosMonitoramento)
      } catch (erroRequisicao) {
        if (!ativo) return
        setErro(erroRequisicao.message)
      } finally {
        if (ativo) setCarregando(false)
      }
    }

    carregar()
    return () => {
      ativo = false
    }
  }, [])

  const usuarios = resumo?.usuarios || []
  const eventos = resumo?.eventos || []
  const propostas = resumo?.propostas || []

  const totalUsuarios = usuarios.reduce((soma, item) => soma + item.total, 0)
  const totalPendentes = usuarios
    .filter((item) => item.status_cadastro === 'pendente')
    .reduce((soma, item) => soma + item.total, 0)
  const totalEventosAbertos = eventos.find((item) => item.status === 'aberto')?.total || 0
  const totalEventos = eventos.reduce((soma, item) => soma + item.total, 0)
  const propostaAceita = propostas.find((item) => item.status === 'aceita')
  const valorPropostasAceitas = propostaAceita?.valor_total || 0

  const usuariosPorTipo = Object.entries(
    usuarios.reduce((acc, item) => {
      acc[item.tipo] = (acc[item.tipo] || 0) + item.total
      return acc
    }, {}),
  )

  return (
    <>
      <CabecalhoPagina
        eyebrow="Painel de Controle Central"
        titulo="Visão Geral do Sistema"
        descricao="Números reais da plataforma: usuários, eventos e propostas registrados no banco de dados."
      />

      {erro && (
        <Painel role="alert">
          <p style={{ color: '#BE123C' }}>{erro}</p>
        </Painel>
      )}

      {carregando ? (
        <Painel>
          <p>Carregando dados do painel...</p>
        </Painel>
      ) : (
        <>
          <div className="admin-stats">
            <CartaoEstatistica
              rotulo="Total de Usuários"
              valor={String(totalUsuarios)}
              detalhe={`${totalPendentes} cadastro(s) pendente(s)`}
            />
            <CartaoEstatistica
              rotulo="Cadastros Pendentes"
              valor={String(totalPendentes)}
              detalhe="Aguardando aprovação de administrador"
            />
            <CartaoEstatistica
              rotulo="Eventos Abertos"
              valor={String(totalEventosAbertos)}
              detalhe={`${totalEventos} evento(s) no total`}
            />
            <CartaoEstatistica
              rotulo="Valor em Propostas Aceitas"
              valor={formatarMoeda(valorPropostasAceitas)}
              detalhe="Soma das propostas com status aceita"
              escuro
            />
          </div>

          <div className="admin-grid">
            <div className="admin-col-main">
              <Painel>
                <h2>Usuários por Tipo</h2>
                <p>Distribuição de cadastros por papel na plataforma.</p>
                <ListaStatus
                  servicos={usuariosPorTipo.map(([tipo, total]) => ({
                    nome: ROTULO_TIPO[tipo] || tipo,
                    valor: String(total),
                  }))}
                />
              </Painel>

              <Painel>
                <h2>Eventos por Status</h2>
                <p>Quantidade de eventos cadastrados em cada etapa.</p>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventos.map((item) => (
                      <tr key={item.status}>
                        <td>{ROTULO_STATUS_EVENTO[item.status] || item.status}</td>
                        <td>{item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Painel>

              <Painel>
                <h2>Propostas por Status</h2>
                <p>Propostas enviadas por fornecedores e seu valor total.</p>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Total</th>
                      <th>Valor Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {propostas.map((item) => (
                      <tr key={item.status}>
                        <td>{ROTULO_STATUS_PROPOSTA[item.status] || item.status}</td>
                        <td>{item.total}</td>
                        <td>{formatarMoeda(item.valor_total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Painel>
            </div>

            <div className="admin-col-side">
              <Painel>
                <h2>Status do Sistema</h2>
                {monitoramento ? (
                  <ListaStatus
                    servicos={[
                      {
                        nome: 'Tempo em Atividade',
                        valor: formatarTempoAtividade(monitoramento.tempo_atividade_segundos),
                      },
                      {
                        nome: 'Banco de Dados',
                        valor: monitoramento.banco.ok
                          ? `OK (${monitoramento.banco.latencia_ms}ms)`
                          : 'Indisponível',
                      },
                      {
                        nome: 'Memória Usada',
                        valor: `${monitoramento.memoria_mb.usada} MB / ${monitoramento.memoria_mb.total} MB`,
                      },
                      {
                        nome: 'Tickets Abertos',
                        valor: String(monitoramento.totais.tickets_abertos),
                      },
                    ]}
                  />
                ) : (
                  <p>Dados de monitoramento indisponíveis.</p>
                )}
              </Painel>
            </div>
          </div>
        </>
      )}
    </>
  )
}
