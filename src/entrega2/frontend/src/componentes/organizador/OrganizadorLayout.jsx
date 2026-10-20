import { Outlet } from 'react-router-dom'
import { OrganizadorMenu } from './OrganizadorMenu'
import '../../styles/organizador.css'
export function OrganizadorLayout(){const u=JSON.parse(localStorage.getItem('usuarioLogado')||'null');return <div className="org-layout"><OrganizadorMenu/><main className="org-main"><header className="org-topo"><span>INTERCÂMBIO SEGURO</span><span>{u?.nome||'Organizador'}</span></header><Outlet/></main></div>}
