import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/cliente'

const moeda = (n) => Number(n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const ROTULOS_STATUS = {
  enviada: 'Aguardando decisão',
  aceita: 'Aceita',
  recusada: 'Recusada',
  cancelada: 'Cancelada pelo fornecedor',
}

export function OrganizadorPropostas() {
  const [propostas, setPropostas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [filtro, setFiltro] = useState('enviada')

  useEffect(() => {
    let ativo = true
    setCarregando(true)
    setErro('')
    api.get('/api/eventos/propostas')
      .then((dados) => {
        if (ativo) setPropostas(Array.isArray(dados) ? dados : [])
      })
      .catch((e) => {
        if (ativo) setErro(e.message)
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })
    return () => { ativo = false }
  }, [])

  const lista = filtro ? propostas.filter((p) => p.status === filtro) : propostas
  const pendentes = propostas.filter((p) => p.status === 'enviada').length

  return (
    <section>
      <div className="org-titulo">
        <div>
          <small>PAINEL DO ORGANIZADOR</small>
          <h1>Propostas recebidas</h1>
          <p>Todas as propostas de fornecedores, de todos os seus eventos, num só lugar.</p>
        </div>
      </div>

      <div className="org-filtro">
        <label htmlFor="filtro-propostas">Status</label>
        <select id="filtro-propostas" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
          <option value="">Todas</option>
          <option value="enviada">Aguardando decisão ({pendentes})</option>
          <option value="aceita">Aceitas</option>
          <option value="recusada">Recusadas</option>
          <option value="cancelada">Canceladas</option>
        </select>
      </div>

      {carregando && <p>Carregando propostas...</p>}
      {erro && <p className="org-aviso">{erro}</p>}

      {!carregando && !erro && (
        <table className="org-tabela">
          <thead>
            <tr>
              <th>Evento</th>
              <th>Item</th>
              <th>Fornecedor</th>
              <th>Valor</th>
              <th>Validade</th>
              <th>Status</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((p) => (
              <tr key={p.id_proposta}>
                <td>{p.evento}</td>
                <td>{p.item}</td>
                <td>{p.fornecedor}</td>
                <td>{moeda(p.valor_total)}</td>
                <td>{p.validade}</td>
                <td>{ROTULOS_STATUS[p.status] || p.status}</td>
                <td>
                  <Link className="org-botao secundario" to={`/organizador/evento/${p.id_evento}`}>
                    Ver evento
                  </Link>
                </td>
              </tr>
            ))}
            {!lista.length && (
              <tr>
                <td colSpan={7}>Nenhuma proposta encontrada para este filtro.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </section>
  )
}
