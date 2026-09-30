import { useState } from 'react'
import { usuarios } from '../../dados/admin'
import { CabecalhoPagina } from '../../componentes/admin/layout'
import {
  AcaoRapida,
  MiniEstatisticas,
  Painel,
} from '../../componentes/admin/primitivos'
import { BarraFiltros } from '../../componentes/admin/formularios'
import { TabelaUsuarios } from '../../componentes/admin/dados'

const OPCOES_PAPEL = ['Papel: Todos', 'Administrador', 'Organizador', 'Usuário']

const OPCOES_STATUS = ['Status: Todos', 'Ativo', 'Inativo', 'Bloqueado']

export function AdminUsuarios() {
  const [selecionados, setSelecionados] = useState(
    new Set(['#USR-89021', '#USR-77341', '#USR-10443']),
  )

  function aoAlternar(id) {
    setSelecionados((atuais) => {
      const proximos = new Set(atuais)
      if (proximos.has(id)) {
        proximos.delete(id)
      } else {
        proximos.add(id)
      }
      return proximos
    })
  }

  function aoAlternarTodos(marcado) {
    setSelecionados(marcado ? new Set(usuarios.map((u) => u.id)) : new Set())
  }

  return (
    <>
      <CabecalhoPagina
        eyebrow="Segurança & Governança · Painel Geral"
        titulo="Gestão de Usuários e Acesso"
        descricao="Visualize, gerencie e audite todos os usuários registrados, papéis atribuídos e status operacionais na plataforma de custódia."
        acoes={
          <MiniEstatisticas
            itens={[
              { rotulo: 'Total Geral', valor: '12.480' },
              { rotulo: 'Ativos Hoje', valor: '9.124' },
              { rotulo: 'Bloqueados', valor: '38', perigo: true },
            ]}
          />
        }
      />

      <BarraFiltros>
        <input
          type="search"
          placeholder="Buscar por nome, e-mail ou documento..."
          aria-label="Buscar usuários"
        />
        <select aria-label="Filtrar por papel" defaultValue={OPCOES_PAPEL[0]}>
          {OPCOES_PAPEL.map((opcao) => (
            <option key={opcao}>{opcao}</option>
          ))}
        </select>
        <select aria-label="Filtrar por status" defaultValue={OPCOES_STATUS[0]}>
          {OPCOES_STATUS.map((opcao) => (
            <option key={opcao}>{opcao}</option>
          ))}
        </select>
        <AcaoRapida destaque className="admin-filterbar__new">
          + Novo Usuário
        </AcaoRapida>
      </BarraFiltros>

      <TabelaUsuarios
        usuarios={usuarios}
        selecionados={selecionados}
        aoAlternar={aoAlternar}
        aoAlternarTodos={aoAlternarTodos}
      />

      <Painel className="admin-audit-note">
        <div>
          <strong>Auditoria de Permissões e LGPD</strong>
          <p>
            Todas as concessões de acesso de Administrador e Organizador exigem
            autenticação em duas etapas e são salvas no livro de auditoria
            contínua.
          </p>
        </div>
        <a href="#" onClick={(e) => e.preventDefault()}>
          Ver logs de acesso →
        </a>
      </Painel>
    </>
  )
}
