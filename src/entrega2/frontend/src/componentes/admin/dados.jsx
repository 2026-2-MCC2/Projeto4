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
