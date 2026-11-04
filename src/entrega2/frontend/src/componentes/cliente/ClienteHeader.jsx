import { useState } from 'react'
import { Link } from 'react-router-dom'
import { iniciaisDoNome } from '../../utils/formatar'

export function ClienteHeader({ titulo, descricao, voltarParaPerfil = false, nome = 'Visitante' }) {
  const [notificacoesAbertas, setNotificacoesAbertas] = useState(false)

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
        <div className="cliente-notificacoes">
          <button
            type="button"
            className="cliente-icon-btn"
            aria-label="Notificações"
            aria-expanded={notificacoesAbertas}
            onClick={() => setNotificacoesAbertas((aberto) => !aberto)}
          >
            🔔
          </button>

          {notificacoesAbertas && (
            <div className="cliente-notificacoes__painel" role="menu">
              <strong>Notificações</strong>
              <p>Você não tem notificações no momento.</p>
            </div>
          )}
        </div>

        <div className="cliente-topbar__user">
          <span className="admin-avatar">{iniciaisDoNome(nome)}</span>
          <div>
            <strong>{nome}</strong>
            <small><span className="cliente-dot-ok" /> Conta Verificada</small>
          </div>
        </div>
      </div>
    </header>
  )
}
