import { useEffect, useState } from 'react'
import { api } from '../../../api/cliente'
import { moeda } from '../../../utils/formatar'

// Propostas recebidas de fornecedores — selecionar/desfazer seleção.
export function AbaPropostas({ evento }) {
  const [propostas, setPropostas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [processandoId, setProcessandoId] = useState(null)

  function carregar() {
    setCarregando(true)
    setErro('')
    return api
      .get(`/api/eventos/${evento.id_evento}/propostas`)
      .then(setPropostas)
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false))
  }

  useEffect(() => {
    carregar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evento.id_evento])

  async function selecionar(idProposta) {
    setErro('')
    setProcessandoId(idProposta)
    try {
      await api.patch(`/api/eventos/${evento.id_evento}/propostas/${idProposta}/selecionar`, {})
      await carregar()
    } catch (e) {
      setErro(e.message)
    } finally {
      setProcessandoId(null)
    }
  }

  async function desselecionar(idProposta) {
    setErro('')
    setProcessandoId(idProposta)
    try {
      await api.patch(`/api/eventos/${evento.id_evento}/propostas/${idProposta}/desselecionar`, {})
      await carregar()
    } catch (e) {
      setErro(e.message)
    } finally {
      setProcessandoId(null)
    }
  }

  return (
    <div className="org-card">
      <h2>Propostas recebidas</h2>
      {erro && <p role="alert" className="org-aviso">{erro}</p>}
      {carregando ? (
        <p>Carregando propostas...</p>
      ) : (
        <table className="org-tabela">
          <thead>
            <tr>
              <th>Item</th>
              <th>Fornecedor</th>
              <th>Valor</th>
              <th>Validade</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {propostas.map((p) => (
              <tr key={p.id_proposta}>
                <td>{p.item} {p.menor_valor && <span className="org-status">menor valor</span>}</td>
                <td>{p.fornecedor}</td>
                <td>{moeda(p.valor_total)}</td>
                <td>{p.validade}</td>
                <td>{p.status}</td>
                <td>
                  <div className="org-acoes">
                    {(p.status === 'enviada') && (
                      <button
                        className="org-botao secundario"
                        type="button"
                        disabled={processandoId === p.id_proposta}
                        onClick={() => selecionar(p.id_proposta)}
                      >
                        Selecionar
                      </button>
                    )}
                    {p.status === 'aceita' && (
                      <button
                        className="org-botao secundario"
                        type="button"
                        disabled={processandoId === p.id_proposta}
                        onClick={() => desselecionar(p.id_proposta)}
                      >
                        Desfazer seleção
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {!propostas.length && (
              <tr>
                <td colSpan={6}>Nenhuma proposta recebida ainda.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}
