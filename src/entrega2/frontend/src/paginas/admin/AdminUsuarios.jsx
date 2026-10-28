import { useEffect, useState } from 'react'
import { api } from '../../api/cliente'
import { CabecalhoPagina } from '../../componentes/admin/layout'
import { Avatar, Botao, MiniEstatisticas, Painel, Tag } from '../../componentes/admin/primitivos'
import { BarraFiltros } from '../../componentes/admin/formularios'
import { iniciaisDoNome, formatarData } from '../../utils/formatar'

const OPCOES_STATUS = [
  { valor: 'pendente', rotulo: 'Pendentes' },
  { valor: 'aprovado', rotulo: 'Aprovados' },
  { valor: 'recusado', rotulo: 'Recusados' },
]

const OPCOES_PAPEL = [
  { valor: '', rotulo: 'Papel: Todos' },
  { valor: 'organizador', rotulo: 'Organizador' },
  { valor: 'fornecedor', rotulo: 'Fornecedor' },
  { valor: 'cliente', rotulo: 'Cliente' },
]

const TOM_PAPEL = {
  organizador: 'accent',
  fornecedor: 'info',
  cliente: 'info',
}

const TOM_STATUS = {
  pendente: 'warn',
  aprovado: 'ok',
  recusado: 'danger',
}


export function AdminUsuarios() {
  const [statusFiltro, setStatusFiltro] = useState('pendente')
  const [papelFiltro, setPapelFiltro] = useState('')
  const [busca, setBusca] = useState('')
  const [cadastros, setCadastros] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [idEmAcao, setIdEmAcao] = useState(null)

  async function carregarCadastros(status) {
    setCarregando(true)
    setErro('')
    try {
      const dados = await api.get('/api/admin/cadastros', { status })
      setCadastros(dados)
    } catch (erroRequisicao) {
      setErro(erroRequisicao.message)
      setCadastros([])
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarCadastros(statusFiltro)
  }, [statusFiltro])

  async function decidir(id, decisao) {
    setIdEmAcao(id)
    setErro('')
    try {
      await api.patch(`/api/admin/cadastros/${id}`, { decisao })
      await carregarCadastros(statusFiltro)
    } catch (erroRequisicao) {
      setErro(erroRequisicao.message)
    } finally {
      setIdEmAcao(null)
    }
  }

  const cadastrosFiltrados = cadastros.filter((cadastro) => {
    if (papelFiltro && cadastro.tipo !== papelFiltro) return false
    if (busca) {
      const termo = busca.toLowerCase()
      const alvo = `${cadastro.nome} ${cadastro.email} ${cadastro.cpf || ''} ${cadastro.cnpj || ''}`.toLowerCase()
      if (!alvo.includes(termo)) return false
    }
    return true
  })

  const totalPendentes = cadastros.filter((c) => c.status_cadastro === 'pendente').length

  return (
    <>
      <CabecalhoPagina
        eyebrow="Segurança & Governança · Painel Geral"
        titulo="Gestão de Usuários e Acesso"
        descricao="Visualize, aprove ou recuse cadastros de organizadores, fornecedores e clientes na plataforma."
        acoes={
          <MiniEstatisticas
            itens={[
              { rotulo: 'Nesta Lista', valor: String(cadastros.length) },
              {
                rotulo: 'Pendentes',
                valor: String(totalPendentes),
                perigo: totalPendentes > 0,
              },
            ]}
          />
        }
      />

      <BarraFiltros>
        <input
          type="search"
          placeholder="Buscar por nome, e-mail ou documento..."
          aria-label="Buscar usuários"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <select
          aria-label="Filtrar por papel"
          value={papelFiltro}
          onChange={(e) => setPapelFiltro(e.target.value)}
        >
          {OPCOES_PAPEL.map((opcao) => (
            <option key={opcao.valor} value={opcao.valor}>
              {opcao.rotulo}
            </option>
          ))}
        </select>
        <select
          aria-label="Filtrar por status"
          value={statusFiltro}
          onChange={(e) => setStatusFiltro(e.target.value)}
        >
          {OPCOES_STATUS.map((opcao) => (
            <option key={opcao.valor} value={opcao.valor}>
              {opcao.rotulo}
            </option>
          ))}
        </select>
      </BarraFiltros>

      {erro && (
        <Painel role="alert">
          <p style={{ color: '#BE123C' }}>{erro}</p>
        </Painel>
      )}

      <div className="admin-panel admin-panel--flush">
        <table className="admin-table admin-table--users">
          <thead>
            <tr>
              <th>Usuário / Nome</th>
              <th>E-mail</th>
              <th>Papel</th>
              <th>Documento</th>
              <th>Status</th>
              <th>Criado em</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {carregando && (
              <tr>
                <td colSpan={7}>Carregando cadastros...</td>
              </tr>
            )}
            {!carregando && cadastrosFiltrados.length === 0 && (
              <tr>
                <td colSpan={7}>Nenhum cadastro encontrado para este filtro.</td>
              </tr>
            )}
            {!carregando &&
              cadastrosFiltrados.map((cadastro) => (
                <tr key={cadastro.id_usuario}>
                  <td className="admin-user-cell">
                    <Avatar iniciais={iniciaisDoNome(cadastro.nome)} />
                    <div>
                      <strong>{cadastro.nome}</strong>
                      <small>#USR-{cadastro.id_usuario}</small>
                    </div>
                  </td>
                  <td>{cadastro.email}</td>
                  <td>
                    <Tag tom={TOM_PAPEL[cadastro.tipo] || 'info'}>{cadastro.tipo}</Tag>
                  </td>
                  <td>{cadastro.cpf || cadastro.cnpj || '—'}</td>
                  <td>
                    <Tag tom={TOM_STATUS[cadastro.status_cadastro] || 'info'}>
                      {cadastro.status_cadastro}
                    </Tag>
                  </td>
                  <td>{formatarData(cadastro.criado_em)}</td>
                  <td>
                    {cadastro.status_cadastro === 'pendente' ? (
                      <span style={{ display: 'flex', gap: '8px' }}>
                        <Botao
                          variante="primario"
                          onClick={() => decidir(cadastro.id_usuario, 'aprovado')}
                          disabled={idEmAcao === cadastro.id_usuario}
                        >
                          Aprovar
                        </Botao>
                        <Botao
                          variante="perigo"
                          onClick={() => decidir(cadastro.id_usuario, 'recusado')}
                          disabled={idEmAcao === cadastro.id_usuario}
                        >
                          Recusar
                        </Botao>
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Painel className="admin-audit-note">
        <div>
          <strong>Auditoria de Cadastros</strong>
          <p>
            Aprovações e recusas de cadastro exigem administrador de nível
            master e são registradas no livro de auditoria do sistema.
          </p>
        </div>
      </Painel>
    </>
  )
}
