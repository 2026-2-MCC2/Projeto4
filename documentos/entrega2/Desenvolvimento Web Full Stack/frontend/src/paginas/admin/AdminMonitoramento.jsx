import { useCallback, useEffect, useState } from 'react'
import { api } from '../../api/cliente'
import { CabecalhoPagina } from '../../componentes/admin/layout'
import { Botao, CartaoEstatistica, Painel, Alerta, StatusPill } from '../../componentes/admin/primitivos'
import { LinhaProgresso } from '../../componentes/admin/dados'

function formatarTempoAtividade(segundosTotais) {
  if (!Number.isFinite(segundosTotais)) return '—'
  const dias = Math.floor(segundosTotais / 86400)
  const horas = Math.floor((segundosTotais % 86400) / 3600)
  const minutos = Math.floor((segundosTotais % 3600) / 60)

  if (dias > 0) return `${dias} dia${dias === 1 ? '' : 's'}, ${horas}h`
  if (horas > 0) return `${horas}h ${minutos}min`
  if (minutos > 0) return `${minutos}min`
  return `${segundosTotais}s`
}

export function AdminMonitoramento() {
  const [dados, setDados] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState(null)

  const carregar = useCallback(() => {
    setCarregando(true)
    setErro('')
    api
      .get('/api/admin/monitoramento')
      .then((resposta) => {
        setDados(resposta)
        setUltimaAtualizacao(new Date())
      })
      .catch((err) => {
        setErro(err.message || 'Não foi possível carregar os dados de monitoramento.')
      })
      .finally(() => setCarregando(false))
  }, [])

  useEffect(() => {
    carregar()
  }, [carregar])

  const memoriaPercentual =
    dados && dados.memoria_mb.total > 0
      ? Math.round((dados.memoria_mb.usada / dados.memoria_mb.total) * 100)
      : 0

  return (
    <>
      <CabecalhoPagina
        eyebrow={
          ultimaAtualizacao
            ? `Última checagem: ${ultimaAtualizacao.toLocaleTimeString('pt-BR')}`
            : 'Monitoramento'
        }
        titulo="Monitoramento do Sistema"
        descricao="Métricas reais do processo (tempo de atividade, memória), latência do banco de dados e totais de uso da plataforma."
        acoes={
          <Botao onClick={carregar} disabled={carregando}>
            {carregando ? 'Atualizando…' : '↻ Atualizar'}
          </Botao>
        }
      />

      {erro ? (
        <Alerta titulo="Erro ao carregar monitoramento" tom="danger">
          {erro}
        </Alerta>
      ) : null}

      {carregando && !dados ? (
        <Painel>
          <p>Carregando métricas…</p>
        </Painel>
      ) : dados ? (
        <>
          <div className="admin-stats">
            <CartaoEstatistica
              rotulo="Tempo de Atividade"
              valor={formatarTempoAtividade(dados.tempo_atividade_segundos)}
              detalhe="Desde o último restart do processo"
            />
            <CartaoEstatistica
              rotulo="Banco de Dados"
              valor={dados.banco.ok ? 'OK' : 'Com falha'}
              detalhe={`Latência: ${dados.banco.latencia_ms} ms`}
              escuro={!dados.banco.ok}
            />
            <CartaoEstatistica
              rotulo="Usuários"
              valor={dados.totais.usuarios}
              detalhe="Total cadastrado"
            />
            <CartaoEstatistica
              rotulo="Eventos"
              valor={dados.totais.eventos}
              detalhe="Total cadastrado"
            />
            <CartaoEstatistica
              rotulo="Propostas"
              valor={dados.totais.propostas}
              detalhe="Total cadastrado"
            />
            <CartaoEstatistica
              rotulo="Tickets Abertos"
              valor={dados.totais.tickets_abertos}
              detalhe="Aberto ou em andamento"
            />
          </div>

          <div className="admin-grid">
            <div className="admin-col-main">
              <Painel>
                <h2>Uso de Memória do Processo</h2>
                <p>Memória heap utilizada pelo processo Node.js do backend.</p>
                <LinhaProgresso
                  uso={{
                    nome: 'Memória RAM (heap)',
                    valor: `${dados.memoria_mb.usada} MB / ${dados.memoria_mb.total} MB`,
                    percentual: memoriaPercentual,
                    detalhe: `${dados.memoria_mb.usada} MB usados de ${dados.memoria_mb.total} MB alocados`,
                  }}
                />
              </Painel>
            </div>

            <div className="admin-col-side">
              <Painel>
                <h2>Status do Banco de Dados</h2>
                <p>
                  Verificação feita a cada carregamento desta página, via consulta
                  simples ao PostgreSQL.
                </p>
                <StatusPill tom={dados.banco.ok ? 'ok' : 'off'}>
                  {dados.banco.ok ? 'Conectado' : 'Falha na conexão'}
                </StatusPill>
                <p style={{ marginTop: '0.5rem' }}>
                  Latência medida: <strong>{dados.banco.latencia_ms} ms</strong>
                </p>
              </Painel>
            </div>
          </div>
        </>
      ) : null}
    </>
  )
}
