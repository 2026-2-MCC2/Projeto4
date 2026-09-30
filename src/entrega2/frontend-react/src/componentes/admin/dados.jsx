import { Avatar, Botao, Tag } from './primitivos'

export function TabelaUsuarios({
  usuarios,
  selecionados,
  aoAlternar,
  aoAlternarTodos,
}) {
  const todosMarcados = usuarios.every((u) => selecionados.has(u.id))

  return (
    <div className="admin-users-wrap">
      <BarraMassa quantidade={selecionados.size} />

      <div className="admin-panel admin-panel--flush">
        <table className="admin-table admin-table--users">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  aria-label="Selecionar todos"
                  checked={todosMarcados}
                  onChange={(e) => aoAlternarTodos(e.target.checked)}
                />
              </th>
              <th>Usuário / Nome</th>
              <th>E-mail</th>
              <th>Papel</th>
              <th>Status</th>
              <th>Data de Criação</th>
              <th>Último Acesso</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr
                key={usuario.id}
                className={usuario.sinalizado ? 'is-flagged' : undefined}
              >
                <td>
                  <input
                    type="checkbox"
                    aria-label={`Selecionar ${usuario.nome}`}
                    checked={selecionados.has(usuario.id)}
                    onChange={() => aoAlternar(usuario.id)}
                  />
                </td>
                <td className="admin-user-cell">
                  <Avatar iniciais={usuario.inicial} />
                  <div>
                    <strong>{usuario.nome}</strong>
                    <small>
                      {usuario.id}
                      {usuario.sinalizado ? ' (Flagged)' : ''}
                    </small>
                  </div>
                </td>
                <td>{usuario.email}</td>
                <td>
                  <Tag tom={usuario.papelTone}>{usuario.papel}</Tag>
                </td>
                <td>
                  {usuario.status === 'Bloqueado (Suspeita Fraude)' ? (
                    <Tag tom="danger">{usuario.status}</Tag>
                  ) : (
                    <span
                      className={`admin-status-pill admin-status-pill--${usuario.status === 'Ativo' ? 'ok' : 'off'}`}
                    >
                      {usuario.status}
                    </span>
                  )}
                </td>
                <td>{usuario.criadoEm}</td>
                <td>{usuario.ultimoAcesso}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="admin-table-footer">
          <span>
            Mostrando 1 a {usuarios.length} de 12.480 usuários
          </span>
          <div className="admin-table-footer__pages">
            <Botao>Anterior</Botao>
            <Botao className="is-active">1</Botao>
            <Botao>2</Botao>
            <Botao>3</Botao>
            <span>…</span>
            <Botao>42</Botao>
            <Botao>Próximo</Botao>
          </div>
        </div>
      </div>
    </div>
  )
}

function BarraMassa({ quantidade }) {
  if (quantidade === 0) return null

  return (
    <div className="admin-bulk-bar">
      <span className="admin-bulk-bar__icon">✓</span>
      <div>
        <strong>
          {quantidade}{' '}
          {quantidade === 1 ? 'usuário selecionado' : 'usuários selecionados'}
        </strong>
        <p>Ações em massa para os cadastros marcados</p>
      </div>
      <div className="admin-bulk-bar__actions">
        <Botao>Alterar Papel</Botao>
        <Botao>Desativar Selecionados</Botao>
        <Botao>Exportar CSV / PDF</Botao>
        <Botao variante="perigo">Excluir Selecionados</Botao>
      </div>
    </div>
  )
}

export function TabelaAcoes({ acoes }) {
  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Ação executada</th>
          <th>Alvo / entidade</th>
          <th>Operador</th>
          <th>Horário</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {acoes.map((acao) => (
          <tr key={`${acao.acao}-${acao.horario}`}>
            <td>{acao.acao}</td>
            <td>{acao.alvo}</td>
            <td>{acao.operador}</td>
            <td>{acao.horario}</td>
            <td>
              <Tag tom={acao.tom}>{acao.status}</Tag>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function TabelaPermissoes({ permissoes }) {
  return (
    <table className="admin-table admin-perm-table">
      <thead>
        <tr>
          <th>Módulo do sistema</th>
          <th>Ver</th>
          <th>Criar</th>
          <th>Editar</th>
          <th>Excluir</th>
          <th>Acesso</th>
        </tr>
      </thead>
      <tbody>
        {permissoes.map((permissao) => (
          <tr key={permissao.modulo}>
            <td>
              <strong>{permissao.modulo}</strong>
              <small>{permissao.detalhe}</small>
            </td>
            <td>{permissao.ver ? '✔' : '—'}</td>
            <td>{permissao.criar ? '✔' : '—'}</td>
            <td>{permissao.editar ? '✔' : '—'}</td>
            <td>{permissao.excluir ? '✔' : '—'}</td>
            <td>
              <Tag tom={permissao.acessoTone}>{permissao.acesso}</Tag>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function GradePerfis({ perfis }) {
  return (
    <div className="admin-role-grid">
      {perfis.map((perfil) => (
        <div
          key={perfil.nome}
          className={[
            'admin-role-card',
            perfil.ativo ? 'admin-role-card--active' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <Tag tom={perfil.tagTone}>{perfil.tag}</Tag>
          <h3>{perfil.nome}</h3>
          <p>{perfil.descricao}</p>
          <small>{perfil.membros}</small>
        </div>
      ))}
      <a
        href="#"
        className="admin-role-card admin-role-card--new"
        onClick={(e) => e.preventDefault()}
      >
        <span>+</span>
        Criar Novo Perfil Customizado
      </a>
    </div>
  )
}

export function ListaLogs({ eventos }) {
  return (
    <ul className="admin-log-list">
      {eventos.map((evento) => (
        <li key={evento.id}>
          <Avatar iniciais={evento.iniciais} mudo={evento.avatarMudo} />
          <div className="admin-log-item__body">
            <strong>{evento.titulo}</strong>
            <p>{evento.descricao}</p>
            <small>{evento.origem}</small>
          </div>
          <div className="admin-log-item__meta">
            {evento.statusComo === 'pill' ? (
              <span className="admin-status-pill admin-status-pill--ok">
                {evento.status}
              </span>
            ) : (
              <Tag tom={evento.tom}>{evento.status}</Tag>
            )}
            <small>{evento.horario}</small>
          </div>
        </li>
      ))}
    </ul>
  )
}

export function GradeServicos({ servicos }) {
  return (
    <div className="admin-service-grid">
      {servicos.map((servico) => (
        <div
          key={servico.nome}
          className={[
            'admin-service-card',
            servico.degradado ? 'admin-service-card--warn' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <div className="admin-service-card__head">
            {servico.estadoComo === 'pill' ? (
              <span className="admin-status-pill admin-status-pill--ok">
                {servico.estado}
              </span>
            ) : (
              <Tag tom={servico.estadoTone}>{servico.estado}</Tag>
            )}
          </div>
          <strong>{servico.nome}</strong>
          <small>{servico.detalhe}</small>
          <div className="admin-service-card__metrics">
            <span>
              Uptime <strong>{servico.uptime}</strong>
            </span>
            <span>
              Latência <strong>{servico.latencia}</strong>
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export function ListaStatus({ servicos }) {
  return (
    <ul className="admin-status-list">
      {servicos.map((servico) => (
        <li key={servico.nome}>
          <span>{servico.nome}</span>
          <strong>{servico.valor}</strong>
        </li>
      ))}
    </ul>
  )
}

export function GraficoBarras({ valores }) {
  return (
    <div className="admin-chart" role="img" aria-label="Gráfico de atividade da rede">
      {valores.map((valor, i) => (
        <span key={i} style={{ height: `${valor}%` }} />
      ))}
    </div>
  )
}

export function LinhaProgresso({ uso }) {
  return (
    <div className="admin-progress-row">
      <div className="admin-progress-row__label">
        <span>{uso.nome}</span>
        <strong>{uso.valor}</strong>
      </div>
      <div className="admin-progress">
        <span style={{ width: `${uso.percentual}%` }} />
      </div>
      <small>{uso.detalhe}</small>
    </div>
  )
}

export function ListaTickets({ tickets, selecionado, aoSelecionar }) {
  return (
    <div className="admin-panel admin-panel--flush">
      <ul className="admin-ticket-list">
        {tickets.map((ticket) => (
          <li
            key={ticket.id}
            role="button"
            tabIndex={0}
            onClick={() => aoSelecionar(ticket.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                aoSelecionar(ticket.id)
              }
            }}
            className={[
              'admin-ticket-list__item',
              ticket.id === selecionado ? 'admin-ticket-list__item--active' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div className="admin-ticket-list__id">
              <strong>{ticket.id}</strong>
              <small>
                {ticket.categoria} · {ticket.quando}
              </small>
            </div>
            <div className="admin-ticket-list__body">
              <strong>{ticket.titulo}</strong>
              <span>
                <Avatar iniciais={ticket.iniciais} tamanho="sm" />{' '}
                {ticket.solicitante} ({ticket.perfilSolicitante})
              </span>
            </div>
            <div className="admin-ticket-list__tags">
              <Tag tom={ticket.prioridadeTone}>{ticket.prioridade}</Tag>
              <Tag tom={ticket.statusTone}>{ticket.status}</Tag>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function BlocoAlertas({ alertas }) {
  return (
    <>
      {alertas.map((alerta) => (
        <div
          key={alerta.titulo}
          className={['admin-alert', alerta.tom ? `admin-alert--${alerta.tom}` : '']
            .filter(Boolean)
            .join(' ')}
        >
          <strong>{alerta.titulo}</strong>
          <p>{alerta.descricao}</p>
        </div>
      ))}
    </>
  )
}
