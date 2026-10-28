import { useEffect, useMemo, useState } from 'react'
import { api } from '../../api/cliente'
import { CabecalhoPagina } from '../../componentes/admin/layout'
import { Painel, Alerta, Tag } from '../../componentes/admin/primitivos'
import { BarraFiltros } from '../../componentes/admin/formularios'

function formatarDataHora(valor) {
  if (!valor) return '—'
  const data = new Date(valor)
  if (Number.isNaN(data.getTime())) return String(valor)
  return data.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function AdminLogs() {
  const [logs, setLogs] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [filtroAcao, setFiltroAcao] = useState('Todas')

  useEffect(() => {
    let ativo = true
    setCarregando(true)
    setErro('')
    api
      .get('/api/admin/logs')
      .then((dados) => {
        if (ativo) setLogs(Array.isArray(dados) ? dados : [])
      })
      .catch((err) => {
        if (ativo) setErro(err.message || 'Não foi possível carregar os logs.')
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })
    return () => {
      ativo = false
    }
  }, [])

  const acoesDisponiveis = useMemo(() => {
    const unicas = new Set(logs.map((log) => log.acao).filter(Boolean))
    return ['Todas', ...Array.from(unicas).sort()]
  }, [logs])

  const logsFiltrados = useMemo(() => {
    if (filtroAcao === 'Todas') return logs
    return logs.filter((log) => log.acao === filtroAcao)
  }, [logs, filtroAcao])

  return (
    <>
      <CabecalhoPagina
        eyebrow="Auditoria do sistema"
        titulo="Logs e Auditoria"
        descricao="Registro das ações administrativas, eventos e acessos realizados no sistema."
      />

      <BarraFiltros>
        <div className="admin-field" style={{ minWidth: 220 }}>
          <label htmlFor="filtro-acao-log">Filtrar por ação</label>
          <select
            id="filtro-acao-log"
            value={filtroAcao}
            onChange={(e) => setFiltroAcao(e.target.value)}
          >
            {acoesDisponiveis.map((acao) => (
              <option key={acao} value={acao}>
                {acao}
              </option>
            ))}
          </select>
        </div>
        <small className="admin-hint">
          {logsFiltrados.length} de {logs.length} registro(s)
        </small>
      </BarraFiltros>

      {erro ? (
        <Alerta titulo="Erro ao carregar logs" tom="danger">
          {erro}
        </Alerta>
      ) : null}

      <Painel className="admin-panel--flush">
        {carregando ? (
          <p style={{ padding: '1rem' }}>Carregando logs…</p>
        ) : logsFiltrados.length === 0 ? (
          <p style={{ padding: '1rem' }}>Nenhum log encontrado.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Data/Hora</th>
                <th>Ação</th>
                <th>Responsável</th>
                <th>Detalhe</th>
              </tr>
            </thead>
            <tbody>
              {logsFiltrados.map((log) => (
                <tr key={log.id_log}>
                  <td>{formatarDataHora(log.criado_em)}</td>
                  <td>
                    <Tag tom="info">{log.acao}</Tag>
                  </td>
                  <td>
                    {log.id_usuario == null
                      ? 'Sistema'
                      : `${log.usuario || 'Usuário removido'}${
                          log.tipo_usuario ? ` (${log.tipo_usuario})` : ''
                        }`}
                  </td>
                  <td>{log.detalhe || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Painel>
    </>
  )
}
