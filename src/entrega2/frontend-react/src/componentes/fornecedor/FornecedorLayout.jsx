import { Outlet } from 'react-router-dom'
import { FornecedorMenu } from './FornecedorMenu'
import '../../styles/fornecedor.css'

export function FornecedorLayout() {
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado') || 'null')
  return <div className="fornecedor-layout">
    <FornecedorMenu />
    <div className="fornecedor-area">
      <header className="fornecedor-topo">
        <span>Painel do Fornecedor</span>
        <span>{usuario?.nome || 'Fernanda Lima'}</span>
      </header>
      <main className="fornecedor-main"><Outlet /></main>
    </div>
  </div>
}
