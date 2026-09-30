import { Link } from 'react-router-dom'

export function EmConstrucao({ modulo, responsavel }) {
  return (
    <div className="admin-panel">
      <h1>{modulo} em construção</h1>
      <p>
        Esta área ainda não foi migrada para o React.{' '}
        {responsavel ? `Responsável: ${responsavel}.` : ''}
      </p>
      <p>
        As páginas em HTML continuam disponíveis em <code>/frontend/pages</code> até
        a migração.
      </p>
      <Link to="/admin">Voltar ao Painel Administrativo</Link>
    </div>
  )
}
