import { Navigate } from 'react-router-dom'
import { estaLogadoComoAdmin } from './autenticacao'

export function RequireAuthAdmin({ children }) {
  if (!estaLogadoComoAdmin()) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}
