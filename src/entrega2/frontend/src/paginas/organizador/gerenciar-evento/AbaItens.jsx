import { useEffect, useState } from 'react'
import { api } from '../../../api/cliente'
import { CATEGORIAS_ITEM } from './constantes'

// Itens de custo — só editáveis enquanto o evento está em rascunho.
export function AbaItens({ evento }) {
  const podeEditar = evento.status === 'rascunho'
  const [itens, setItens] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [form, setForm] = useState({ nome: '', categoria: CATEGORIAS_ITEM[0], descricao: '' })
  const [editandoId, setEditandoId] = useState(null)

  function carregar() {
    setCarregando(true)
    setErro('')
    return api
      .get(`/api/eventos/${evento.id_evento}/itens`)
      .then(setItens)
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false))
  }

  useEffect(() => {
    carregar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evento.id_evento])

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function iniciarEdicao(item) {
    setEditandoId(item.id_item)
    setForm({ nome: item.nome, categoria: item.categoria, descricao: item.descricao || '' })
  }

  function cancelarEdicao() {
    setEditandoId(null)
    setForm({ nome: '', categoria: CATEGORIAS_ITEM[0], descricao: '' })
  }

  async function salvar(e) {
    e.preventDefault()
    setErro('')
    const body = { nome: form.nome, categoria: form.categoria }
    if (form.descricao) body.descricao = form.descricao
    try {
      if (editandoId) {
        await api.put(`/api/eventos/${evento.id_evento}/itens/${editandoId}`, body)
      } else {
        await api.post(`/api/eventos/${evento.id_evento}/itens`, body)
      }
      cancelarEdicao()
      await carregar()
    } catch (e) {
      setErro(e.message)
    }
  }

  async function excluir(idItem) {
    if (!window.confirm('Excluir este item de custo?')) return
    setErro('')
    try {
      await api.del(`/api/eventos/${evento.id_evento}/itens/${idItem}`)
      await carregar()
    } catch (e) {
      setErro(e.message)
    }
  }

  return (
    <div className="org-card">
      <h2>Itens de custo</h2>
      {!podeEditar && (
        <p className="org-nota">
          Os itens só podem ser alterados enquanto o evento está em rascunho. Exibindo somente leitura.
        </p>
      )}
      {erro && <p role="alert" className="org-aviso">{erro}</p>}
      {carregando ? (
        <p>Carregando itens...</p>
      ) : (
        <table className="org-tabela">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Descrição</th>
              {podeEditar && <th>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {itens.map((item) => (
              <tr key={item.id_item}>
                <td>{item.nome}</td>
                <td>{item.categoria}</td>
                <td>{item.descricao || '—'}</td>
                {podeEditar && (
                  <td>
                    <div className="org-acoes">
                      <button className="org-botao secundario" type="button" onClick={() => iniciarEdicao(item)}>
                        Editar
                      </button>
                      <button className="org-botao secundario" type="button" onClick={() => excluir(item.id_item)}>
                        Excluir
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {!itens.length && (
              <tr>
                <td colSpan={podeEditar ? 4 : 3}>Nenhum item cadastrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {podeEditar && (
        <form className="org-form" onSubmit={salvar}>
          <h3>{editandoId ? 'Editar item' : 'Novo item'}</h3>
          <div className="org-form-grid">
            <label>
              Nome *
              <input name="nome" value={form.nome} onChange={change} required />
            </label>
            <label>
              Categoria *
              <select name="categoria" value={form.categoria} onChange={change}>
                {CATEGORIAS_ITEM.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label>
            Descrição
            <input name="descricao" value={form.descricao} onChange={change} />
          </label>
          <div className="org-acoes">
            <button className="org-botao" type="submit">
              {editandoId ? 'Salvar edição' : 'Adicionar item'}
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
