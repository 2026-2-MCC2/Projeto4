import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { FornecedorMenu } from './FornecedorMenu'
import { obterUsuario } from '../../api/auth'
import { lerTema, salvarTema } from '../../utils/tema'
import '../../styles/fornecedor.css'

export function FornecedorLayout() {
  const usuario = obterUsuario()
  const [tema, setTema] = useState(() => lerTema('fornecedor', usuario?.email))

  function definirTema(temaId) {
    setTema(temaId)
    salvarTema('fornecedor', usuario?.email, temaId)
  }

  return <div className="fornecedor-layout" data-tema={tema || undefined}>
    <FornecedorMenu />
    <div className="fornecedor-area">
      <header className="fornecedor-topo">
        <span>Painel do Fornecedor</span>
        <span>{usuario?.nome || 'Fornecedor'}</span>
      </header>
      <main className="fornecedor-main"><Outlet context={{ tema, definirTema }} /></main>
    </div>
  </div>
}
