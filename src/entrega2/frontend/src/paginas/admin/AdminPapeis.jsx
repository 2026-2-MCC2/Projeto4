import { useEffect, useState } from 'react'
import { api } from '../../api/cliente'
import { CabecalhoPagina } from '../../componentes/admin/layout'
import {
  Alerta,
  Avatar,
  Botao,
  CabecalhoPainel,
  CartaoEstatistica,
  Painel,
  Tag,
} from '../../componentes/admin/primitivos'

function formatarData(data) {
  if (!data) return ''
  try {
    return new Date(data).toLocaleDateString('pt-BR')
  } catch {
    return data
  }
}

function iniciaisDoNome(nome) {
  const partes = (nome || '').trim().split(/\s+/).filter(Boolean)
  if (partes.length === 0) return '?'
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
}

const ROTULO_TIPO = {
  cliente: 'Cliente',
  organizador: 'Organizador',
  fornecedor: 'Fornecedor',
  administrador: 'Administrador',
}

const ROTULO_STATUS_CADASTRO = {
  aprovado: 'Aprovado',
  pendente: 'Pendente',
  recusado: 'Recusado',
}

export function AdminPapeis() {
  const [usuariosPorTipo, setUsuariosPorTipo] = useState([])
  const [administradores, setAdministradores] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [erroAcao, setErroAcao] = useState('')
  const [alterandoId, setAlterandoId] = useState(null)

  async function carregar() {
    setCarregando(true)
    setErro('')
    try {
      const dados = await api.get('/api/admin/papeis')
      setUsuariosPorTipo(dados.usuarios_por_tipo || [])
      setAdministradores(dados.administradores || [])
    } catch (e) {
      setErro(e.message)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  async function aoTrocarNivel(idUsuario, nivelAtual) {
    const novoNivel = nivelAtual === 'master' ? 'suporte' : 'master'
    setAlterandoId(idUsuario)
    setErroAcao('')
    try {
      await api.patch(`/api/admin/administradores/${idUsuario}/nivel`, {
        nivel_acesso: novoNivel,
      })
      await carregar()
    } catch (e) {
      setErroAcao(e.message)
    } finally {
      setAlterandoId(null)
    }
  }

  const totalUsuarios = usuariosPorTipo.reduce((soma, item) => soma + Number(item.total), 0)

  return (
    <>
      <CabecalhoPagina
        eyebrow="Governança & Segurança"
        titulo="Papéis e Permissões"
        descricao="Veja quantos usuários existem de cada tipo e gerencie o nível de acesso dos administradores."
      />

      {erro ? (
        <Alerta titulo="Erro ao carregar papéis" tom="danger">
          {erro}
        </Alerta>
      ) : null}

      <Painel>
        <CabecalhoPainel
          titulo="Usuários por tipo e status"
          descricao="Contagem real de cadastros no banco de dados."
        >
          <Tag tom="info">{totalUsuarios} usuários</Tag>
        </CabecalhoPainel>

        {carregando ? (
          <p>Carregando...</p>
        ) : usuariosPorTipo.length === 0 ? (
          <p>Nenhum usuário cadastrado.</p>
        ) : (
          <div className="admin-stats-grid">
            {usuariosPorTipo.map((item) => (
              <CartaoEstatistica
                key={`${item.tipo}-${item.status_cadastro}`}
                rotulo={ROTULO_TIPO[item.tipo] || item.tipo}
                valor={String(item.total)}
                detalhe={ROTULO_STATUS_CADASTRO[item.status_cadastro] || item.status_cadastro}
              />
            ))}
          </div>
        )}
      </Painel>

      <Painel>
        <CabecalhoPainel
          titulo="Administradores"
          descricao="Nível 'master' tem acesso total e pode aprovar/recusar cadastros e alterar níveis. Nível 'suporte' é mais restrito."
        >
          <Tag tom="info">{administradores.length} administradores</Tag>
        </CabecalhoPainel>

        {erroAcao ? (
          <Alerta titulo="Não foi possível alterar o nível" tom="danger">
            {erroAcao}
          </Alerta>
        ) : null}

        {carregando ? (
          <p>Carregando...</p>
        ) : administradores.length === 0 ? (
          <p>Nenhum administrador cadastrado.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Administrador</th>
                <th>E-mail</th>
                <th>Nível de acesso</th>
                <th>Criado em</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {administradores.map((admin) => (
                <tr key={admin.id_usuario}>
                  <td className="admin-user-cell">
                    <Avatar iniciais={iniciaisDoNome(admin.nome)} />
                    <strong>{admin.nome}</strong>
                  </td>
                  <td>{admin.email}</td>
                  <td>
                    <Tag tom={admin.nivel_acesso === 'master' ? 'dark' : 'info'}>
                      {admin.nivel_acesso}
                    </Tag>
                  </td>
                  <td>{formatarData(admin.criado_em)}</td>
                  <td>
                    <Botao
                      disabled={alterandoId === admin.id_usuario}
                      onClick={() => aoTrocarNivel(admin.id_usuario, admin.nivel_acesso)}
                    >
                      {alterandoId === admin.id_usuario
                        ? 'Alterando...'
                        : admin.nivel_acesso === 'master'
                          ? 'Rebaixar a suporte'
                          : 'Promover a master'}
                    </Botao>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Painel>
    </>
  )
}
