import { NavLink } from 'react-router-dom'
const links = [
 {to:'/organizador',label:'Meus eventos',end:true},
 {to:'/organizador/criar-evento',label:'Criar evento'},
 {to:'/organizador/fornecedores',label:'Fornecedores'},
 {to:'/organizador/publicar',label:'Publicar evento'},
 {to:'/organizador/configuracoes',label:'Configurações'},
]
export function OrganizadorMenu(){return <aside className="org-menu"><h2>TrocaTicket</h2><p>GESTÃO DO ORGANIZADOR</p><nav>{links.map(l=><NavLink key={l.to} to={l.to} end={l.end} className={({isActive})=>isActive?'org-link ativo':'org-link'}>{l.label}</NavLink>)}</nav><NavLink className="org-sair" to="/login" onClick={()=>localStorage.removeItem('usuarioLogado')}>Sair da conta</NavLink></aside>}
