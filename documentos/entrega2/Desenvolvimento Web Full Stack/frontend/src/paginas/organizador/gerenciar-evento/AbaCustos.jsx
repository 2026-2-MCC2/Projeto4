import { useEffect, useState } from 'react'
import { api } from '../../../api/cliente'
import { moeda } from '../../../utils/formatar'
import { TIPOS_CUSTO } from './constantes'

// Custos do evento — editáveis até o evento ser cancelado.
export function AbaCustos({ evento }) {
  const podeEditar = evento.status !== 'cancelado'
  const [custos, setCustos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [form, setForm] = useState({ tipo: TIPOS_CUSTO[0], descricao: '', valor: '', por_participante: false })
  const [editandoId, setEditandoId] = useState(null)

  function carregar() {
    setCarregando(true)
    setErro('')
    return api
      .get(`/api/eventos/${evento.id_evento}/custos`)
      .then(setCustos)
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false))
  }

  useEffect(() => {
    carregar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evento.id_evento])

  function change(e) {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  function iniciarEdicao(custo) {
    setEditandoId(custo.id_custo)
    setForm({
      tipo: custo.tipo,
      descricao: custo.descricao,
      valor: custo.valor,
      por_participante: !!custo.por_participante,
    })
  }

  function cancelarEdicao() {
    setEditandoId(null)
    setForm({ tipo: TIPOS_CUSTO[0], descricao: '', valor: '', por_participante: false })
  }

  async function salvar(e) {
    e.preventDefault()
    setErro('')
    const body = {
      tipo: form.tipo,
      descricao: form.descricao,
      valor: Number(form.valor),
      por_participante: !!form.por_participante,
    }
    try {
      if (editandoId) {
        await api.put(`/api/eventos/${evento.id_evento}/custos/${editandoId}`, body)
      } else {
        await api.post(`/api/eventos/${evento.id_evento}/custos`, body)
      }
      cancelarEdicao()
      await carregar()
    } catch (e) {
      setErro(e.message)
    }
  }

  async function excluir(idCusto) {
    if (!window.confirm('Excluir este custo?')) return
    setErro('')
    try {
      await api.del(`/api/eventos/${evento.id_evento}/custos/${idCusto}`)
      await carregar()
    } catch (e) {
      setErro(e.message)
    }
  }

  return (
    <div className="org-card">
      <h2>Custos do evento</h2>
      {!podeEditar && <p className="org-nota">Evento cancelado: os custos não podem mais ser alterados.</p>}
      {erro && <p role="alert" className="org-aviso">{erro}</p>}
      {carregando ? (
        <p>Carregando custos...</p>
      ) : (
        <table className="org-tabela">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Descrição</th>
              <th>Valor</th>
              <th>Por participante</th>
              {podeEditar && <th>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {custos.map((c) => (
              <tr key={c.id_custo}>
                <td>{c.tipo}</td>
                <td>{c.descricao}</td>
                <td>{moeda(c.valor)}</td>
                <td>{c.por_participante ? 'Sim' : 'Não'}</td>
                {podeEditar && (
                  <td>
                    <div className="org-acoes">
                      <button className="org-botao secundario" type="button" onClick={() => iniciarEdicao(c)}>
                        Editar
                      </button>
                      <button className="org-botao secundario" type="button" onClick={() => excluir(c.id_custo)}>
                        Excluir
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {!custos.length && (
              <tr>
                <td colSpan={podeEditar ? 5 : 4}>Nenhum custo cadastrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {podeEditar && (
        <form className="org-form" onSubmit={salvar}>
          <h3>{editandoId ? 'Editar custo' : 'Novo custo'}</h3>
          <div className="org-form-grid">
            <label>
              Tipo *
              <select name="tipo" value={form.tipo} onChange={change}>
                {TIPOS_CUSTO.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Valor (R$) *
              <input type="number" min="0" step="0.01" name="valor" value={form.valor} onChange={change} required />
            </label>
          </div>
          <label>
            Descrição *
            <input name="descricao" value={form.descricao} onChange={change} required />
          </label>
          <label className="org-check">
            <input type="checkbox" name="por_participante" checked={form.por_participante} onChange={change} />
            Valor é por participante (multiplicado pelo público)
          </label>
          <div className="org-acoes">
            <button className="org-botao" type="submit">
              {editandoId ? 'Salvar edição' : 'Adicionar custo'}
            </button>
            {editandoId && (
              <button className="org-botao secundario" type="button" onClick={cancelarEdicao}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  )
}
