import { Link } from 'react-router-dom'

export function ClienteHeader({ titulo, descricao, voltarParaPerfil = false, nome = 'Gabriel S.' }) {
  return (
    <header className="cliente-topbar">
      <div>
        {voltarParaPerfil && (
          <Link to="/cliente/perfil" className="cliente-voltar">
            ← Voltar para Perfil
          </Link>
        )}
        <h1>{titulo}</h1>
        <p>{descricao}</p>
      </div>

      <div className="cliente-topbar__actions">
        <button type="button" className="cliente-icon-btn" aria-label="Notificações">
          🔔
          <span className="cliente-badge-dot" />
        </button>

        <div className="cliente-topbar__user">
          <span className="admin-avatar">GS</span>
          <div>
            <strong>{nome}</strong>
            <small><span className="cliente-dot-ok" /> Conta Verificada</small>
          </div>
        </div>
      </div>
    </header>
  )
}
