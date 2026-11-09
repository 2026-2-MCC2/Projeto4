import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { OrganizadorMenu } from './OrganizadorMenu'
import { obterUsuario } from '../../api/auth'
import { lerTema, salvarTema } from '../../utils/tema'
import '../../styles/organizador.css'
export function OrganizadorLayout(){
  const u=obterUsuario()
  const [tema,setTema]=useState(()=>lerTema('organizador',u?.email))
  function definirTema(temaId){setTema(temaId);salvarTema('organizador',u?.email,temaId)}
  return <div className="org-layout" data-tema={tema||undefined}><OrganizadorMenu/><main className="org-main"><header className="org-topo"><span>INTERCÂMBIO SEGURO</span><span>{u?.nome||'Organizador'}</span></header><Outlet context={{tema,definirTema}}/></main></div>
}
