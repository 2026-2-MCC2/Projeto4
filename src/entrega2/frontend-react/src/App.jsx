import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { RequireAuthAdmin } from './componentes/admin/RequireAuthAdmin'
import { AdminLayout } from './componentes/admin/layout'
import { EmConstrucao } from './paginas/EmConstrucao'
import { Cadastro } from './paginas/Cadastro'
import { Eventos } from './paginas/Eventos'
import { Inicio } from './paginas/Inicio'
import { Login } from './paginas/Login'
import { AdminConfiguracoes } from './paginas/admin/AdminConfiguracoes'
import { AdminDashboard } from './paginas/admin/AdminDashboard'
import { AdminLogin } from './paginas/admin/AdminLogin'
import { AdminLogs } from './paginas/admin/AdminLogs'
import { AdminMonitoramento } from './paginas/admin/AdminMonitoramento'
import { AdminPapeis } from './paginas/admin/AdminPapeis'
import { AdminTickets } from './paginas/admin/AdminTickets'
import { AdminUsuarios } from './paginas/admin/AdminUsuarios'

import { ClienteLayout } from './componentes/cliente/ClienteLayout'

import { ClienteInicio } from './paginas/cliente/ClienteInicio'
import { ClienteIngressos } from './paginas/cliente/ClienteIngressos'
import { ClienteVerIngresso } from './paginas/cliente/ClienteVerIngresso'
import { ClienteCompras } from './paginas/cliente/ClienteCompras'
import { ClientePerfil } from './paginas/cliente/ClientePerfil'
import { ClienteSeusIngressos } from './paginas/cliente/ClienteSeusIngressos'
import { ClienteSuasRevendas } from './paginas/cliente/ClienteSuasRevendas'
import { ClienteConfiguracoes } from './paginas/cliente/ClienteConfiguracoes'
import { Cliente404 } from './paginas/cliente/Cliente404'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/eventos" element={<Eventos />} />

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <RequireAuthAdmin>
              <AdminLayout />
            </RequireAuthAdmin>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="usuarios" element={<AdminUsuarios />} />
          <Route path="papeis" element={<AdminPapeis />} />
          <Route path="configuracoes" element={<AdminConfiguracoes />} />
          <Route path="logs" element={<AdminLogs />} />
          <Route path="monitoramento" element={<AdminMonitoramento />} />
          <Route path="tickets" element={<AdminTickets />} />
        </Route>

        <Route
          path="/fornecedor/*"
          element={<EmConstrucao modulo="Área do Fornecedor" />}
        />
        <Route
          path="/organizador/*"
          element={<EmConstrucao modulo="Área do Organizador" />}
        />
        <Route
          path="/revenda/*"
          element={<EmConstrucao modulo="Revenda de Ingressos" />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

<Route path="/cliente" element={<ClienteLayout />}>

<Route index element={<ClienteInicio />} />

<Route
  path="ingressos"
  element={<ClienteIngressos />}
/>

<Route
  path="ingressos/:id"
  element={<ClienteVerIngresso />}
/>

<Route
  path="compras"
  element={<ClienteCompras />}
/>

<Route
  path="perfil"
  element={<ClientePerfil />}
/>

<Route
  path="seus-ingressos"
  element={<ClienteSeusIngressos />}
/>

<Route
  path="suas-revendas"
  element={<ClienteSuasRevendas />}
/>

<Route
  path="configuracoes"
  element={<ClienteConfiguracoes />}
/>

<Route
  path="*"
  element={<Cliente404 />}
/>

</Route>