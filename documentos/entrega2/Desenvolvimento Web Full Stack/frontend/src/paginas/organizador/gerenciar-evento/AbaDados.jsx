import { useState } from 'react'
import { api } from '../../../api/cliente'
import { ROTULOS_STATUS } from './constantes'

// Dados do evento (edição via PUT) — fica somente leitura fora de rascunho/aberto.
export function AbaDados({ evento, aoSalvar }) {
  const podeEditar = evento.status === 'rascunho' || evento.status === 'aberto'
  const [form, setForm] = useState({
    nome: evento.nome || '',
    local: evento.local || '',
    data: evento.data ? evento.data.slice(0, 10) : '',
    data_fim: evento.data_fim ? evento.data_fim.slice(0, 10) : '',
    descricao: evento.descricao || '',
    publico_minimo: evento.publico_minimo ?? '',
    publico_maximo: evento.publico_maximo ?? '',
    margem_lucro: evento.margem_lucro ?? '',
  })
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [enviando, setEnviando] = useState(false)

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function salvar(e) {
    e.preventDefault()
    setErro('')
    setSucesso('')
    setEnviando(true)
    const body = {
      nome: form.nome,
      local: form.local,
      data: form.data,
    }
    if (form.data_fim) body.data_fim = form.data_fim
    if (form.descricao) body.descricao = form.descricao
    if (form.publico_minimo !== '') body.publico_minimo = Number(form.publico_minimo)
    if (form.publico_maximo !== '') body.publico_maximo = Number(form.publico_maximo)
    if (form.margem_lucro !== '') body.margem_lucro = Number(form.margem_lucro)
    try {
      await api.put(`/api/eventos/${evento.id_evento}`, body)
      setSucesso('Dados atualizados.')
      await aoSalvar()
    } catch (e) {
      setErro(e.message)
    } finally {
      setEnviando(false)
    }
  }

  if (!podeEditar) {
    return (
      <div className="org-card">
        <p className="org-nota">
          Este evento está <b>{ROTULOS_STATUS[evento.status] || evento.status}</b> e não pode mais ser editado.
        </p>
        <dl>
          <dt>Nome</dt>
          <dd>{evento.nome}</dd>
          <dt>Local</dt>
          <dd>{evento.local}</dd>
          <dt>Data</dt>
          <dd>{evento.data}{evento.data_fim ? ` até ${evento.data_fim}` : ''}</dd>
          <dt>Descrição</dt>
          <dd>{evento.descricao || '—'}</dd>
          <dt>Público</dt>
          <dd>{evento.publico_minimo ?? '—'} a {evento.publico_maximo ?? '—'}</dd>
          <dt>Margem de lucro</dt>
          <dd>{evento.margem_lucro ?? 0}%</dd>
        </dl>
      </div>
    )
  }

  return (
    <form className="org-form" onSubmit={salvar}>
      <label>
        Nome do evento *
        <input name="nome" value={form.nome} onChange={change} required maxLength={120} />
      </label>
      <label>
        Local *
        <input name="local" value={form.local} onChange={change} required />
      </label>
      <div className="org-form-grid">
        <label>
          Data de início *
          <input type="date" name="data" value={form.data} onChange={change} required />
        </label>
        <label>
          Data de término
          <input type="date" name="data_fim" value={form.data_fim} onChange={change} />
        </label>
        <label>
          Público mínimo
          <input type="number" min="0" name="publico_minimo" value={form.publico_minimo} onChange={change} />
        </label>
        <label>
          Público máximo
          <input type="number" min="0" name="publico_maximo" value={form.publico_maximo} onChange={change} />
        </label>
        <label>
          Margem de lucro (%)
          <input type="number" min="0" max="99.99" step="0.01" name="margem_lucro" value={form.margem_lucro} onChange={change} />
        </label>
      </div>
      <label>
        Descrição
        <textarea name="descricao" value={form.descricao} onChange={change} maxLength={2000} rows={4} />
      </label>
      <div className="org-acoes">
        <button className="org-botao" type="submit" disabled={enviando}>
          {enviando ? 'Salvando...' : 'Salvar alterações'}
        </button>
      </div>
      {erro && <p role="alert" className="org-aviso">{erro}</p>}
      {sucesso && <p role="status" className="org-sucesso">{sucesso}</p>}
    </form>
  )
}
