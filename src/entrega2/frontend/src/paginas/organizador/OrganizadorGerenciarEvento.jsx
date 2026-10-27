import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/cliente'

const moeda = (n) =>
  Number(n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const ROTULOS_STATUS = {
  rascunho: 'Rascunho',
  aberto: 'Em cotação',
  fechado: 'Fechado',
  cancelado: 'Cancelado',
}

const CATEGORIAS_ITEM = ['iluminacao', 'alimentacao', 'bebida', 'seguranca', 'estrutura', 'outros']
const TIPOS_CUSTO = ['fiscal', 'operacional', 'variavel', 'outro']

const ABAS = [
  { chave: 'dados', rotulo: 'Dados do evento' },
  { chave: 'itens', rotulo: 'Itens de custo' },
  { chave: 'custos', rotulo: 'Custos do evento' },
  { chave: 'propostas', rotulo: 'Propostas recebidas' },
  { chave: 'orcamento', rotulo: 'Orçamento' },
  { chave: 'ticket', rotulo: 'Ticket' },
]

export function OrganizadorGerenciarEvento() {
  const { id } = useParams()
  const nav = useNavigate()

  const [evento, setEvento] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erroCarregamento, setErroCarregamento] = useState('')
  const [aba, setAba] = useState('dados')

  const carregarEvento = () => {
    setCarregando(true)
    setErroCarregamento('')
    return api
      .get(`/api/eventos/${id}`)
      .then((dados) => setEvento(dados))
      .catch((e) => setErroCarregamento(e.message))
      .finally(() => setCarregando(false))
  }

  useEffect(() => {
    carregarEvento()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (carregando) {
    return (
      <section>
        <p>Carregando evento...</p>
      </section>
    )
  }

  if (erroCarregamento || !evento) {
    return (
      <section>
        <p className="org-aviso">{erroCarregamento || 'Evento não encontrado.'}</p>
        <Link className="org-botao secundario" to="/organizador">
          Voltar para meus eventos
        </Link>
      </section>
    )
  }

  return (
    <section>
      <div className="org-titulo">
        <div>
          <small>GESTÃO DO EVENTO</small>
          <h1>{evento.nome}</h1>
          <p>
            <span className={evento.status === 'rascunho' ? 'org-status rascunho' : 'org-status'}>
              {ROTULOS_STATUS[evento.status] || evento.status}
            </span>{' '}
            · {evento.data} · {evento.local}
          </p>
        </div>
      </div>

      <AcoesStatus evento={evento} aoAtualizar={carregarEvento} navegarParaLista={() => nav('/organizador')} />

      <div className="org-abas" role="tablist">
        {ABAS.map((a) => (
          <button
            key={a.chave}
            type="button"
            role="tab"
            aria-selected={aba === a.chave}
            className={aba === a.chave ? 'org-aba ativa' : 'org-aba'}
            onClick={() => setAba(a.chave)}
          >
            {a.rotulo}
          </button>
        ))}
      </div>

      {aba === 'dados' && <AbaDados evento={evento} aoSalvar={carregarEvento} />}
      {aba === 'itens' && <AbaItens evento={evento} />}
      {aba === 'custos' && <AbaCustos evento={evento} />}
      {aba === 'propostas' && <AbaPropostas evento={evento} />}
      {aba === 'orcamento' && <AbaOrcamento evento={evento} />}
      {aba === 'ticket' && <AbaTicket evento={evento} />}
    </section>
  )
}

// ---------------------------------------------------------------------------
// Ações de mudança de status / exclusão do evento
// ---------------------------------------------------------------------------
function AcoesStatus({ evento, aoAtualizar, navegarParaLista }) {
  const [erro, setErro] = useState('')
  const [processando, setProcessando] = useState(false)

  async function mudarStatus(novoStatus, confirmar) {
    if (confirmar && !window.confirm(confirmar)) return
    setErro('')
    setProcessando(true)
    try {
      await api.patch(`/api/eventos/${evento.id_evento}/status`, { status: novoStatus })
      await aoAtualizar()
    } catch (e) {
      setErro(e.message)
    } finally {
      setProcessando(false)
    }
  }

  async function excluir() {
    if (!window.confirm('Excluir este evento? Essa ação não pode ser desfeita.')) return
    setErro('')
    setProcessando(true)
    try {
      await api.del(`/api/eventos/${evento.id_evento}`)
      navegarParaLista()
    } catch (e) {
      setErro(e.message)
      setProcessando(false)
    }
  }

  return (
    <div className="org-card">
      <div className="org-acoes">
        {evento.status === 'rascunho' && (
          <button className="org-botao" disabled={processando} onClick={() => mudarStatus('aberto')}>
            Publicar para cotação
          </button>
        )}
        {evento.status === 'aberto' && (
          <button className="org-botao" disabled={processando} onClick={() => mudarStatus('fechado')}>
            Encerrar cotação
          </button>
        )}
        {(evento.status === 'rascunho' || evento.status === 'aberto') && (
          <button
            className="org-botao secundario"
            disabled={processando}
            onClick={() => mudarStatus('cancelado', 'Cancelar este evento?')}
          >
            Cancelar evento
          </button>
        )}
        {evento.status === 'rascunho' && (
          <button className="org-botao secundario" disabled={processando} onClick={excluir}>
            Excluir evento
          </button>
        )}
      </div>
      {erro && <p role="alert" className="org-aviso">{erro}</p>}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Dados do evento (edição via PUT)
// ---------------------------------------------------------------------------
function AbaDados({ evento, aoSalvar }) {
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

// ---------------------------------------------------------------------------
// Itens de custo
// ---------------------------------------------------------------------------
function AbaItens({ evento }) {
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

// ---------------------------------------------------------------------------
// Custos do evento
// ---------------------------------------------------------------------------
function AbaCustos({ evento }) {
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

// ---------------------------------------------------------------------------
// Propostas recebidas
// ---------------------------------------------------------------------------
function AbaPropostas({ evento }) {
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

// ---------------------------------------------------------------------------
// Orçamento
// ---------------------------------------------------------------------------
function AbaOrcamento({ evento }) {
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

// ---------------------------------------------------------------------------
// Ticket (cálculo de ticket de equilíbrio / alvo por cenário)
// ---------------------------------------------------------------------------
const ROTULOS_CENARIO = { minimo: 'Público mínimo', maximo: 'Público máximo', esperado: 'Público esperado' }

function AbaTicket({ evento }) {
  const [publicoEsperado, setPublicoEsperado] = useState('')
  const [ticket, setTicket] = useState(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  async function calcular(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    setTicket(null)
    try {
      const query = publicoEsperado !== '' ? { publico_esperado: publicoEsperado } : undefined
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

  return (
    <div className="org-card">
      <h2>Ticket</h2>
      <form className="org-form" onSubmit={calcular}>
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
            {carregando ? 'Calculando...' : 'Calcular ticket'}
          </button>
        </div>
      </form>

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
