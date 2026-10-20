import { Link } from 'react-router-dom'
import { ClienteHeader } from '../../componentes/cliente/ClienteHeader'

export function ClientePerfil() {
  const itens = [
    ['Dados Pessoais', 'Nome, e-mail, documento e localização', '/cliente/configuracoes'],
    ['Configurações', 'Senha, pagamentos, privacidade e ajuda', '/cliente/configuracoes'],
    ['Seus Ingressos', 'Calendário e lista dos ingressos que você comprou', '/cliente/seus-ingressos'],
    ['Suas Revendas', 'Pedidos de compra dos ingressos que você anunciou', '/cliente/suas-revendas'],
  ]

  return (
    <>
      <ClienteHeader titulo="Perfil" descricao="Gerencie sua conta e acompanhe sua atividade." />

      <main className="cliente-main">
        <div className="cliente-perfil-card">
          <span className="cliente-perfil-card__avatar">GS</span>
          <div className="cliente-perfil-card__info">
            <h2>Gabriel Souza</h2>
            <p><span className="cliente-tag cliente-tag--custodia">Conta Verificada</span> • São Paulo, Brasil</p>
          </div>
          <div className="cliente-perfil-card__stats">
            <div><strong>12</strong><small>Tickets</small></div>
            <div><strong>5</strong><small>Revendas</small></div>
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
