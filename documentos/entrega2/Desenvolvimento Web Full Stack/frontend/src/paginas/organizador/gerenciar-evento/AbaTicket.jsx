import { useEffect, useState } from 'react'
import { api } from '../../../api/cliente'
import { moeda } from '../../../utils/formatar'
import { ROTULOS_CENARIO, CATEGORIAS_PUBLICACAO } from './constantes'

// Cálculo de ticket de equilíbrio / alvo por cenário — calcula sozinho ao abrir.
export function AbaTicket({ evento, aoAtualizar }) {
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

  // Publicação na vitrine pública (/eventos) — separado do cálculo de ticket,
  // mas reaproveita o ticket-alvo calculado acima como sugestão de preço.
  const [pub, setPub] = useState({
    categoria: evento.categoria || '',
    imagem_url: evento.imagem_url || '',
    preco_ingresso: evento.preco_ingresso ?? '',
    ingressos_total: evento.ingressos_total ?? evento.publico_maximo ?? '',
    publicado_para_venda: evento.publicado_para_venda || false,
  })
  const [pubErro, setPubErro] = useState('')
  const [pubSucesso, setPubSucesso] = useState('')
  const [pubEnviando, setPubEnviando] = useState(false)

  function changePub(e) {
    const { name, value, type, checked } = e.target
    setPub((atual) => ({ ...atual, [name]: type === 'checkbox' ? checked : value }))
  }

  async function salvarPublicacao(e) {
    e.preventDefault()
    setPubErro('')
    setPubSucesso('')
    setPubEnviando(true)
    try {
      await api.patch(`/api/eventos/${evento.id_evento}/publicacao`, {
        categoria: pub.categoria,
        imagem_url: pub.imagem_url || null,
        preco_ingresso: pub.preco_ingresso !== '' ? Number(pub.preco_ingresso) : null,
        ingressos_total: pub.ingressos_total !== '' ? Number(pub.ingressos_total) : null,
        publicado_para_venda: pub.publicado_para_venda,
      })
      setPubSucesso(pub.publicado_para_venda ? 'Evento publicado para o público.' : 'Publicação atualizada.')
      if (aoAtualizar) await aoAtualizar()
    } catch (erroSalvar) {
      setPubErro(erroSalvar.message)
    } finally {
      setPubEnviando(false)
    }
  }

  return (
    <>
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

    <div className="org-card">
      <h2>Publicação para o público</h2>
      <p className="org-nota">
        Defina o que os clientes veem na vitrine pública (página /eventos) e publique quando estiver pronto para vender.
      </p>
      {evento.publicado_para_venda && (
        <p className="org-sucesso">
          Publicado — {evento.ingressos_vendidos} de {evento.ingressos_total} ingresso(s) vendido(s).
        </p>
      )}

      <form className="org-form" onSubmit={salvarPublicacao}>
        <div className="org-form-grid">
          <label>
            Categoria *
            <select name="categoria" value={pub.categoria} onChange={changePub} required>
              <option value="">Selecione...</option>
              {CATEGORIAS_PUBLICACAO.map((c) => (
                <option key={c.valor} value={c.valor}>{c.rotulo}</option>
              ))}
            </select>
          </label>
          <label>
            Preço do ingresso (R$)
            <input
              type="number" min="0" step="0.01" name="preco_ingresso"
              value={pub.preco_ingresso} onChange={changePub}
            />
          </label>
          <label>
            Quantidade total de ingressos
            <input
              type="number" min={evento.ingressos_vendidos || 0} name="ingressos_total"
              value={pub.ingressos_total} onChange={changePub}
            />
          </label>
          <label>
            Imagem (caminho ou URL)
            <input
              type="text" name="imagem_url" value={pub.imagem_url} onChange={changePub}
              placeholder="/images/eventos/evento-1.jpg"
            />
          </label>
        </div>

        {ticket && !ticket.erro && (
          <p className="org-nota">
            Usar como preço:{' '}
            {ticket.cenarios.map((c) => (
              <button
                key={c.cenario}
                type="button"
                className="org-botao secundario"
                onClick={() => setPub((atual) => ({ ...atual, preco_ingresso: c.ticket_alvo }))}
              >
                {ROTULOS_CENARIO[c.cenario] || c.cenario}: {moeda(c.ticket_alvo)}
              </button>
            ))}
          </p>
        )}

        <label className="org-check">
          <input
            type="checkbox" name="publicado_para_venda"
            checked={pub.publicado_para_venda} onChange={changePub}
          />
          Publicado (visível para clientes comprarem)
        </label>

        <div className="org-acoes">
          <button className="org-botao" type="submit" disabled={pubEnviando}>
            {pubEnviando ? 'Salvando...' : 'Salvar publicação'}
          </button>
        </div>
        {pubErro && <p role="alert" className="org-aviso">{pubErro}</p>}
        {pubSucesso && <p role="status" className="org-sucesso">{pubSucesso}</p>}
      </form>
    </div>
    </>
  )
}
