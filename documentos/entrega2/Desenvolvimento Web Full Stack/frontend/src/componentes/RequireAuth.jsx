import { Navigate } from 'react-router-dom'
import { estaAutenticado } from '../api/auth'

// Guarda genérica para rotas de organizador/fornecedor: só deixa passar
// quem tem um token válido do tipo certo (mesmo padrão do RequireAuthAdmin).
export function RequireAuth({ tipo, destino, children }) {
  if (!estaAutenticado(tipo)) {
    return <Navigate to={destino} replace />
  }
  return children
}
