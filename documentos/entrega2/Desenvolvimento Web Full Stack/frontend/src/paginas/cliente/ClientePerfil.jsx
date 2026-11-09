import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClienteHeader } from '../../componentes/cliente/ClienteHeader'
import { usuarioLogado } from '../../api/auth'
import { listarMeusIngressos, listarMinhasRevendas } from '../../api/ingressos'
import { iniciaisDoNome } from '../../utils/formatar'

export function ClientePerfil() {
  const usuario = usuarioLogado()
  const [totalIngressos, setTotalIngressos] = useState(null)
  const [totalRevendas, setTotalRevendas] = useState(null)

  useEffect(() => {
    let ativo = true
    Promise.all([listarMeusIngressos(), listarMinhasRevendas()])
      .then(([ingressos, revendas]) => {
        if (!ativo) return
        setTotalIngressos(ingressos.length)
        setTotalRevendas(revendas.length)
      })
      .catch(() => { if (ativo) { setTotalIngressos(0); setTotalRevendas(0) } })
    return () => { ativo = false }
  }, [])

  const itens = [
    ['Dados Pessoais', 'Nome, e-mail, documento e localização', '/cliente/configuracoes'],
    ['Configurações', 'Senha, pagamentos, privacidade e ajuda', '/cliente/configuracoes'],
    ['Seus Ingressos', 'Calendário e lista dos ingressos que você comprou', '/cliente/seus-ingressos'],
    ['Suas Revendas', 'Pedidos de compra dos ingressos que você anunciou', '/cliente/suas-revendas'],
  ]

  return (
    <>
      <ClienteHeader titulo="Perfil" descricao="Gerencie sua conta e acompanhe sua atividade." nome={usuario?.nome} />

      <main className="cliente-main">
        <div className="cliente-perfil-card">
          <span className="cliente-perfil-card__avatar">{iniciaisDoNome(usuario?.nome)}</span>
          <div className="cliente-perfil-card__info">
            <h2>{usuario?.nome || 'Cliente'}</h2>
            <p><span className="cliente-tag cliente-tag--custodia">Conta Verificada</span> • {usuario?.email}</p>
          </div>
          <div className="cliente-perfil-card__stats">
            <div><strong>{totalIngressos ?? '—'}</strong><small>Tickets</small></div>
            <div><strong>{totalRevendas ?? '—'}</strong><small>Revendas</small></div>
          </div>
          <Link to="/cliente/configuracoes" className="cliente-btn-secundario-claro">Editar perfil</Link>
        </div>

        <div className="cliente-lista-head">
          <div>
            <h2>Minha conta</h2>
            <p>Acesse seus dados, ingressos e revendas</p>
          </div>
        </div>

        <div className="cliente-menu-list">
          {itens.map(([titulo, descricao, to]) => (
            <Link to={to} className="cliente-menu-item" key={titulo}>
              <span className="cliente-icone-quadrado">→</span>
              <span className="cliente-menu-item__texto">
                <strong>{titulo}</strong>
                <p>{descricao}</p>
              </span>
              <span>›</span>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}
