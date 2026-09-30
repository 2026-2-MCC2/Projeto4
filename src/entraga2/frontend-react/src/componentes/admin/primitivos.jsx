const CLASSES_BOTAO = {
  primario: 'admin-btn-primary',
  fantasma: 'admin-btn-ghost',
  perigo: 'is-danger',
  suave: '',
}

export function Botao({ variante = 'fantasma', className = '', ...props }) {
  return (
    <button
      type="button"
      {...props}
      className={[CLASSES_BOTAO[variante], className].filter(Boolean).join(' ')}
    />
  )
}

export function Tag({ tom = 'info', children, className = '' }) {
  return (
    <span className={['admin-tag', `admin-tag--${tom}`, className].join(' ')}>
      {children}
    </span>
  )
}

export function StatusPill({ tom = 'ok', children }) {
  return (
    <span className={`admin-status-pill admin-status-pill--${tom}`}>{children}</span>
  )
}

export function Avatar({ iniciais, tamanho = 'normal', mudo = false }) {
  const classes = ['admin-avatar']
  if (tamanho === 'sm') classes.push('admin-avatar--sm')
  if (mudo) classes.push('admin-avatar--muted')
  return <span className={classes.join(' ')}>{iniciais}</span>
}

export function Painel({ children, className = '', ...props }) {
  return (
    <section
      {...props}
      className={['admin-panel', className].filter(Boolean).join(' ')}
    >
      {children}
    </section>
  )
}

export function CabecalhoPainel({ eyebrow, titulo, descricao, children }) {
  return (
    <div className="admin-panel__head">
      <div>
        {eyebrow ? <span className="admin-eyebrow">{eyebrow}</span> : null}
        <h2>{titulo}</h2>
        {descricao ? <p>{descricao}</p> : null}
      </div>
      {children}
    </div>
  )
}

export function RodapePainel({ children }) {
  return <div className="admin-panel__foot">{children}</div>
}

export function CartaoEstatistica({ rotulo, valor, detalhe, escuro = false }) {
  return (
    <div
      className={['admin-stat-card', escuro ? 'admin-stat-card--dark' : '']
        .filter(Boolean)
        .join(' ')}
    >
      <span>{rotulo}</span>
      <strong>{valor}</strong>
      <small>{detalhe}</small>
    </div>
  )
}

export function MiniEstatisticas({ itens, alinhadoAoInicio = false }) {
  return (
    <div
      className={[
        'admin-mini-stats',
        alinhadoAoInicio ? 'admin-mini-stats--start' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {itens.map((item) => (
        <div key={item.rotulo}>
          <span>{item.rotulo}</span>
          <strong className={item.perigo ? 'is-danger' : undefined}>
            {item.valor}
          </strong>
        </div>
      ))}
    </div>
  )
}

export function Alerta({ titulo, children, tom }) {
  return (
    <div
      className={['admin-alert', tom ? `admin-alert--${tom}` : '']
        .filter(Boolean)
        .join(' ')}
    >
      <strong>{titulo}</strong>
      <p>{children}</p>
    </div>
  )
}

export function ListaChip({ children }) {
  return <div className="admin-chip-list">{children}</div>
}

export function Chip({ children }) {
  return <span className="admin-chip">{children}</span>
}

export function Dica({ children }) {
  return <small className="admin-hint">{children}</small>
}

export function AcaoRapida({ children, destaque = false, className = '', aoClicar }) {
  const classes = [
    'admin-quick-action',
    destaque ? 'admin-quick-action--primary' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (aoClicar) {
    return (
      <button type="button" className={classes} onClick={aoClicar}>
        {children}
      </button>
    )
  }

  return (
    <a
      href="#"
      className={classes}
      onClick={(e) => {
        e.preventDefault()
        aoClicar?.()
      }}
    >
      {children}
    </a>
  )
}
