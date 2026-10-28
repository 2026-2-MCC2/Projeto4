import { useEffect, useState } from 'react'
import { api } from '../../../api/cliente'
import { moeda } from '../../../utils/formatar'
import { ROTULOS_CENARIO } from './constantes'

// Cálculo de ticket de equilíbrio / alvo por cenário — calcula sozinho ao abrir.
export function AbaTicket({ evento }) {
  const [publicoEsperado, setPublicoEsperado] = useState('')
  const [ticket, setTicket] = useState(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  async function calcular(publicoEsperadoAtual) {
    setErro('')
    setCarregando(true)
    setTicket(null)
    try {
      const query = publicoEsperadoAtual !== '' ? { publico_esperado: publicoEsperadoAtual } : undefined
      const dados = await api.get(`/api/eventos/${evento.id_evento}/ticket`, query)
      setTicket(dados)
    } catch (e) {
      if (e.status === 422) {
        setErro('Defina o público mínimo e máximo do evento antes de calcular o ticket.')
      } else {
        setErro(e.message)
      }
    } finally {
      setCarregando(false)
    }
  }

  // calcula sozinho assim que a aba abre, sem precisar clicar em nada
  useEffect(() => {
    calcular('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evento.id_evento])

  return (
    <div className="org-card">
      <h2>Ticket</h2>
      <form className="org-form" onSubmit={(e) => { e.preventDefault(); calcular(publicoEsperado) }}>
        <label>
          Público esperado (opcional)
          <input
            type="number"
            min="0"
            value={publicoEsperado}
            onChange={(e) => setPublicoEsperado(e.target.value)}
            placeholder="Entre o público mínimo e máximo"
          />
        </label>
        <div className="org-acoes">
          <button className="org-botao" type="submit" disabled={carregando}>
            {carregando ? 'Calculando...' : 'Recalcular'}
          </button>
        </div>
      </form>

      {carregando && !ticket && <p>Calculando ticket...</p>}
      {erro && <p role="alert" className="org-aviso">{erro}</p>}

      {ticket && (
        <>
          <p>
            Fórmula: {ticket.formula} · Arredondamento: {ticket.arredondamento} · Margem de lucro: {ticket.margem_lucro}%
          </p>
          {ticket.aviso && <p className="org-aviso">{ticket.aviso}</p>}
          <table className="org-tabela">
            <thead>
              <tr>
                <th>Cenário</th>
                <th>Público</th>
                <th>Custo total</th>
                <th>Ticket de equilíbrio</th>
                <th>Ticket-alvo</th>
                <th>Receita estimada</th>
                <th>Lucro estimado</th>
              </tr>
            </thead>
            <tbody>
              {ticket.cenarios.map((c) => (
                <tr key={c.cenario}>
                  <td>{ROTULOS_CENARIO[c.cenario] || c.cenario}</td>
                  <td>{c.publico}</td>
                  <td>{moeda(c.custo_total)}</td>
                  <td>{moeda(c.ticket_equilibrio)}</td>
                  <td>{moeda(c.ticket_alvo)}</td>
                  <td>{moeda(c.receita_estimada)}</td>
                  <td>{moeda(c.lucro_estimado)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}
