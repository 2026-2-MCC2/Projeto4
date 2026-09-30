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
          path="/cliente/*"
          element={<EmConstrucao modulo="Área do Cliente" />}
        />
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
