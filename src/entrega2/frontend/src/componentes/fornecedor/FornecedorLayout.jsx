import { Outlet } from 'react-router-dom'
import { FornecedorMenu } from './FornecedorMenu'
import { obterUsuario } from '../../api/auth'
import '../../styles/fornecedor.css'

export function FornecedorLayout() {
  const usuario = obterUsuario()
  return <div className="fornecedor-layout">
    <FornecedorMenu />
    <div className="fornecedor-area">
      <header className="fornecedor-topo">
        <span>Painel do Fornecedor</span>
        <span>{usuario?.nome || 'Fornecedor'}</span>
      </header>
      <main className="fornecedor-main"><Outlet /></main>
    </div>
  </div>
}
