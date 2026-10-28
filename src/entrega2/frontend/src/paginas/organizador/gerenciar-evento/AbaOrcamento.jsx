import { useEffect, useState } from 'react'
import { api } from '../../../api/cliente'
import { moeda } from '../../../utils/formatar'

// Orçamento consolidado do evento (propostas aceitas + custos cadastrados).
export function AbaOrcamento({ evento }) {
  const [orcamento, setOrcamento] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  function carregar() {
    setCarregando(true)
    setErro('')
    return api
      .get(`/api/eventos/${evento.id_evento}/orcamento`)
      .then(setOrcamento)
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false))
  }

  useEffect(() => {
    carregar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evento.id_evento])

  return (
    <div className="org-card">
      <h2>Orçamento</h2>
      {erro && <p role="alert" className="org-aviso">{erro}</p>}
      {carregando ? (
        <p>Carregando orçamento...</p>
      ) : orcamento ? (
        <>
          <dl>
            <dt>Total de propostas aceitas</dt>
            <dd>{moeda(orcamento.total_propostas)}</dd>
            <dt>Total de custos fixos</dt>
            <dd>{moeda(orcamento.total_custos_fixos)}</dd>
            <dt>Custo fixo total (itens + custos fixos)</dt>
            <dd>{moeda(orcamento.custo_fixo_total)}</dd>
            <dt>Custo por participante</dt>
            <dd>{moeda(orcamento.custo_por_participante)}</dd>
            <dt>Itens sem proposta selecionada</dt>
            <dd>{orcamento.itens_sem_proposta}</dd>
          </dl>

          <h3>Itens</h3>
          <table className="org-tabela">
            <thead>
              <tr>
                <th>Item</th>
                <th>Categoria</th>
                <th>Fornecedor</th>
                <th>Valor da proposta</th>
              </tr>
            </thead>
            <tbody>
              {orcamento.itens.map((i) => (
                <tr key={i.id_item}>
                  <td>{i.nome}</td>
                  <td>{i.categoria}</td>
                  <td>{i.fornecedor || '—'}</td>
                  <td>{i.valor_proposta != null ? moeda(i.valor_proposta) : 'sem proposta selecionada'}</td>
                </tr>
              ))}
              {!orcamento.itens.length && (
                <tr>
                  <td colSpan={4}>Nenhum item cadastrado.</td>
                </tr>
              )}
            </tbody>
          </table>

          <h3>Custos</h3>
          <table className="org-tabela">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Por participante</th>
              </tr>
            </thead>
            <tbody>
              {orcamento.custos.map((c) => (
                <tr key={c.id_custo}>
                  <td>{c.tipo}</td>
                  <td>{c.descricao}</td>
                  <td>{moeda(c.valor)}</td>
                  <td>{c.por_participante ? 'Sim' : 'Não'}</td>
                </tr>
              ))}
              {!orcamento.custos.length && (
                <tr>
                  <td colSpan={4}>Nenhum custo cadastrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      ) : null}
    </div>
  )
}
