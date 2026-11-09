import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/base.css'
import './styles/admin.css'
import { App } from './App.jsx'

import './styles/base.css'
import './styles/admin.css'
import './styles/cliente.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
