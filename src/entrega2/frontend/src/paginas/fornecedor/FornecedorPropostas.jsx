import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../../api/cliente'

const ROTULOS_STATUS = {
  enviada: 'Enviada',
  aceita: 'Aceita',
  recusada: 'Recusada',
  cancelada: 'Cancelada',
}

function classeTag(status) {
  if (status === 'aceita') return 'fornecedor-tag ok'
  if (status === 'recusada') return 'fornecedor-tag erro'
  if (status === 'cancelada') return 'fornecedor-tag neutro'
  return 'fornecedor-tag aviso'
}

const FORM_VAZIO = { id_item: '', valor_total: '', descricao: '', validade: '', observacoes: '' }

export function FornecedorPropostas() {
  const [params] = useSearchParams()
  const idEventoInicial = params.get('evento') || ''
  const idItemInicial = params.get('item') || ''

  const [idEvento, setIdEvento] = useState(idEventoInicial)
  const [itensEvento, setItensEvento] = useState([])
  const [carregandoItens, setCarregandoItens] = useState(false)
  const [erroItens, setErroItens] = useState('')

  const [form, setForm] = useState({ ...FORM_VAZIO, id_item: idItemInicial })
  const [editandoId, setEditandoId] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [erroForm, setErroForm] = useState('')

  const [propostas, setPropostas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erroLista, setErroLista] = useState('')

  function carregarPropostas() {
    setCarregando(true)
    setErroLista('')
    return api.get('/api/fornecedor/propostas')
      .then((dados) => setPropostas(Array.isArray(dados) ? dados : []))
      .catch((e) => setErroLista(e.message))
      .finally(() => setCarregando(false))
  }

  useEffect(() => {
    carregarPropostas()
  }, [])

  useEffect(() => {
    if (!idEvento) {
      setItensEvento([])
      return
    }
    let ativo = true
    setCarregandoItens(true)
    setErroItens('')
    api.get(`/api/fornecedor/eventos/${idEvento}`)
      .then((dados) => {
        if (ativo) setItensEvento(Array.isArray(dados.itens) ? dados.itens : [])
      })
      .catch((e) => {
        if (ativo) setErroItens(e.message)
      })
      .finally(() => {
        if (ativo) setCarregandoItens(false)
      })
    return () => {
      ativo = false
    }
  }, [idEvento])

  function atualizarCampo(campo, valor) {
    setForm(prev => ({ ...prev, [campo]: valor }))
  }

  function iniciarEdicao(p) {
    setEditandoId(p.id_proposta)
    setIdEvento(String(p.id_evento))
    setForm({
      id_item: String(p.id_item),
      valor_total: String(p.valor_total),
      descricao: p.descricao || '',
      validade: p.validade ? p.validade.slice(0, 10) : '',
      observacoes: p.observacoes || '',
    })
    setErroForm('')
    setMensagem('')
  }

  function cancelarEdicao() {
    setEditandoId(null)
    setForm({ ...FORM_VAZIO })
    setErroForm('')
  }

  async function enviar(e) {
    e.preventDefault()
    setErroForm('')
    setMensagem('')

    if (!editandoId && !form.id_item) {
      setErroForm('Selecione o item de custo para o qual deseja enviar a proposta.')
      return
    }
    if (!form.valor_total || Number(form.valor_total) <= 0) {
      setErroForm('Informe um valor maior que zero.')
      return
    }
    if (!form.descricao.trim()) {
      setErroForm('Descreva o que está sendo oferecido.')
      return
    }
    if (!form.validade) {
      setErroForm('Informe a validade da proposta.')
      return
    }

    const corpo = {
      valor_total: Number(form.valor_total),
      descricao: form.descricao.trim(),
      validade: form.validade,
      observacoes: form.observacoes.trim() || undefined,
    }

    setEnviando(true)
    try {
      if (editandoId) {
        await api.put(`/api/fornecedor/propostas/${editandoId}`, corpo)
        setMensagem('Proposta atualizada com sucesso.')
      } else {
        await api.post('/api/fornecedor/propostas', { id_item: Number(form.id_item), ...corpo })
        setMensagem('Proposta enviada com sucesso.')
      }
      setEditandoId(null)
      setForm({ ...FORM_VAZIO })
      await carregarPropostas()
    } catch (e) {
      setErroForm(e.message)
    } finally {
      setEnviando(false)
    }
  }

  async function cancelarProposta(p) {
    if (!window.confirm(`Cancelar a proposta enviada para "${p.item}"?`)) return
    try {
      await api.patch(`/api/fornecedor/propostas/${p.id_proposta}/cancelar`)
      await carregarPropostas()
    } catch (e) {
      setErroLista(e.message)
    }
  }

  return <>
    <div className="fornecedor-page-head"><div><h1>Minhas propostas</h1><p>Envie e acompanhe suas propostas para os eventos.</p></div></div>

    <section className="fornecedor-panel">
      <h2>{editandoId ? 'Editar proposta' : 'Enviar nova proposta'}</h2>
      <form className="fornecedor-form" onSubmit={enviar}>
        <label>
          ID do evento
          <input
            value={idEvento}
            onChange={e => setIdEvento(e.target.value.replace(/\D/g, ''))}
            placeholder="Informe o ID do evento (ex.: visto na lista de oportunidades)"
            disabled={!!editandoId}
            required
          />
        </label>

        {carregandoItens && <p>Carregando itens do evento...</p>}
        {erroItens && <p className="fornecedor-mensagem erro">{erroItens}</p>}

        {!editandoId && idEvento && !carregandoItens && !erroItens && (
          <label>
            Item de custo
            <select value={form.id_item} onChange={e => atualizarCampo('id_item', e.target.value)} required>
              <option value="">Selecione um item</option>
              {itensEvento.map(item => <option value={item.id_item} key={item.id_item} disabled={!!item.minha_proposta}>
                {item.nome}{item.minha_proposta ? ` (${item.status_proposta === 'aceita' ? 'já aceita' : 'já enviada'})` : ''}
              </option>)}
            </select>
          </label>
        )}

        <label>Valor da proposta (R$)
          <input type="number" min="0.01" step="0.01" value={form.valor_total} onChange={e => atualizarCampo('valor_total', e.target.value)} required />
        </label>
        <label>Descrição da proposta
          <textarea value={form.descricao} onChange={e => atualizarCampo('descricao', e.target.value)} placeholder="Digite os detalhes da sua proposta..." rows="4" maxLength={2000} required />
        </label>
        <label>Validade da proposta
          <input type="date" value={form.validade} onChange={e => atualizarCampo('validade', e.target.value)} required />
        </label>
        <label>Observações (opcional)
          <textarea value={form.observacoes} onChange={e => atualizarCampo('observacoes', e.target.value)} placeholder="Informações adicionais" rows="3" maxLength={2000} />
        </label>

        <div className="fornecedor-evento-linha">
          <button className="fornecedor-btn" type="submit" disabled={enviando}>
            {enviando ? 'Enviando...' : editandoId ? 'Salvar alterações' : 'Enviar proposta'}
          </button>
          {editandoId && <button type="button" className="fornecedor-btn secundario" onClick={cancelarEdicao}>Cancelar edição</button>}
        </div>
        {erroForm && <p role="status" className="fornecedor-mensagem erro">{erroForm}</p>}
        {mensagem && <p role="status" className="fornecedor-mensagem">{mensagem}</p>}
      </form>
    </section>

    <section className="fornecedor-panel fornecedor-propostas-enviadas">
      <h2>Propostas enviadas</h2>
      {carregando && <p>Carregando propostas...</p>}
      {erroLista && <p className="fornecedor-mensagem erro">{erroLista}</p>}
      {!carregando && !erroLista && <>
        {propostas.map(p => <div className="fornecedor-proposta-item" key={p.id_proposta}>
          <div>
            <strong>{p.evento}</strong>
            <small>Item: {p.item}</small>
            <small>Enviada em: {new Date(p.data_proposta).toLocaleDateString('pt-BR')} · Validade: {p.validade ? p.validade.slice(0, 10).split('-').reverse().join('/') : ''}</small>
          </div>
          <div className="fornecedor-evento-direita">
            <strong>{Number(p.valor_total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
            <span className={classeTag(p.status)}>{ROTULOS_STATUS[p.status] || p.status}</span>
            {p.status === 'enviada' && <div className="fornecedor-evento-linha">
              <button type="button" className="fornecedor-btn secundario" onClick={() => iniciarEdicao(p)}>Editar</button>
              <button type="button" className="fornecedor-btn secundario" onClick={() => cancelarProposta(p)}>Cancelar</button>
            </div>}
          </div>
        </div>)}
        {!propostas.length && <p className="fornecedor-vazio">Você ainda não enviou nenhuma proposta.</p>}
      </>}
    </section>
  </>
}
