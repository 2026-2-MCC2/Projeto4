import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/cliente'

const FORM_INICIAL = {
  nome: '',
  local: '',
  data: '',
  data_fim: '',
  descricao: '',
  publico_minimo: '',
  publico_maximo: '',
  margem_lucro: '',
}

// Monta o body da API a partir do formulário: campos opcionais vazios saem
// do objeto (não são enviados como string vazia) e os numéricos são convertidos.
function montarBody(form) {
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
  return body
}

export function OrganizadorCriarEvento() {
  const nav = useNavigate()
  const [form, setForm] = useState(FORM_INICIAL)
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function salvar(e) {
    e.preventDefault()
    setErro('')
    setEnviando(true)
    try {
      const evento = await api.post('/api/eventos', montarBody(form))
      nav(`/organizador/evento/${evento.id_evento}`)
    } catch (e) {
      setErro(e.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section>
      <div className="org-titulo">
        <div>
          <small>PLANEJAMENTO DE EVENTO · NOVO CADASTRO</small>
          <h1>Criar novo evento</h1>
          <p>Preencha os dados iniciais. O evento nasce como rascunho e pode ser editado depois.</p>
        </div>
      </div>

      <form className="org-form" onSubmit={salvar}>
        <h2>Informações gerais</h2>

        <label>
          Nome do evento *
          <input name="nome" value={form.nome} onChange={change} required maxLength={120} placeholder="Ex.: Festival de Verão São Paulo" />
        </label>

        <label>
          Local *
          <input name="local" value={form.local} onChange={change} required placeholder="Nome do espaço e endereço" />
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
            <input type="number" min="0" max="99.99" step="0.01" name="margem_lucro" value={form.margem_lucro} onChange={change} placeholder="0" />
          </label>
        </div>

        <label>
          Descrição
          <textarea name="descricao" value={form.descricao} onChange={change} maxLength={2000} rows={5} placeholder="Descreva seu evento" />
        </label>

        <div className="org-acoes">
          <button className="org-botao" type="submit" disabled={enviando}>
            {enviando ? 'Salvando...' : 'Criar evento'}
          </button>
          <button className="org-botao secundario" type="button" onClick={() => nav('/organizador')}>
            Cancelar
          </button>
        </div>

        {erro && <p role="alert" className="org-aviso">{erro}</p>}
      </form>
    </section>
  )
}
