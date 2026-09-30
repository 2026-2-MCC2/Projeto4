import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from './componentes/admin/layout'
import { EmConstrucao } from './paginas/EmConstrucao'
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
        <Route path="/" element={<Navigate to="/admin" replace />} />

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={<AdminLayout />}>
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

        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
