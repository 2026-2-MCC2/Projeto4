import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ClienteHeader } from '../../componentes/cliente/ClienteHeader'

export function ClienteConfiguracoes() {
  const [salvo, setSalvo] = useState(false)
  const [dados, setDados] = useState({
    nome: 'Gabriel Souza',
    email: 'gabriel@exemplo.com',
    pais: 'Brasil',
    cidade: 'São Paulo',
    senhaAtual: '',
    senhaNova: '',
  })

  function alterar(campo, valor) {
    setDados((atual) => ({ ...atual, [campo]: valor }))
    setSalvo(false)
  }

  return (
    <>
      <ClienteHeader
        titulo="Configurações"
        descricao="Senha, pagamentos, privacidade e ajuda."
        voltarParaPerfil
      />

      <main className="cliente-main">
        <div className="cliente-form-section">
          <h2>Dados Pessoais</h2>
          <div className="cliente-field-grid">
            {[
              ['nome', 'Nome completo', 'text'],
              ['email', 'E-mail', 'email'],
              ['pais', 'País', 'text'],
              ['cidade', 'Cidade', 'text'],
            ].map(([campo, label, type]) => (
              <div className="cliente-field" key={campo}>
                <label htmlFor={campo}>{label}</label>
                <input id={campo} type={type} value={dados[campo]} onChange={(e) => alterar(campo, e.target.value)} />
              </div>
            ))}
          </div>
        </div>

        <div className="cliente-form-section">
          <h2>Segurança</h2>
          <div className="cliente-field-grid">
            <div className="cliente-field">
              <label htmlFor="senha-atual">Senha atual</label>
              <input id="senha-atual" type="password" placeholder="Digite sua senha atual" value={dados.senhaAtual} onChange={(e) => alterar('senhaAtual', e.target.value)} />
            </div>
            <div className="cliente-field">
              <label htmlFor="senha-nova">Nova senha</label>
              <input id="senha-nova" type="password" placeholder="Mínimo 8 caracteres" value={dados.senhaNova} onChange={(e) => alterar('senhaNova', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="cliente-form-section">
          <h2>Notificações</h2>
          {[
            ['Novas ofertas de ingressos', 'Avisos quando um evento salvo tiver nova oferta'],
            ['Atualizações de custódia', 'Avisos sobre liberação de pagamento e status da custódia'],
            ['Novidades e promoções', 'Comunicações de marketing da TrocaTicket'],
          ].map(([titulo, descricao]) => (
            <label className="cliente-toggle-row" key={titulo}>
              <div><strong>{titulo}</strong><p>{descricao}</p></div>
              <input type="checkbox" defaultChecked />
            </label>
          ))}
        </div>

        <button type="button" className="cliente-btn-comprar" onClick={() => setSalvo(true)}>
          {salvo ? 'Alterações salvas ✓' : 'Salvar Alterações'}
        </button>
        <Link to="/cliente/perfil" className="cliente-voltar">← Voltar para Perfil</Link>
      </main>
    </>
  )
}
