import { useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { ClienteHeader } from '../../componentes/cliente/ClienteHeader'
import { SeletorTema } from '../../componentes/comum/SeletorTema'
import { temasPainel } from '../../utils/tema'
import { usuarioLogado } from '../../api/auth'

export function ClienteConfiguracoes() {
  const { tema, definirTema } = useOutletContext()
  const usuario = usuarioLogado()
  const [salvo, setSalvo] = useState(false)
  const [dados, setDados] = useState({
    nome: usuario?.nome || '',
    email: usuario?.email || '',
    pais: 'Brasil',
    cidade: '',
    senhaAtual: '',
    senhaNova: '',
  })

  const [notificacoes, setNotificacoes] = useState({ ofertas: true, custodia: true, promocoes: true })

  function alterar(campo, valor) {
    setDados((atual) => ({ ...atual, [campo]: valor }))
    setSalvo(false)
  }

  function alterarNotificacao(chave, valor) {
    setNotificacoes((atual) => ({ ...atual, [chave]: valor }))
    setSalvo(false)
  }

  return (
    <>
      <ClienteHeader
        titulo="Configurações"
        descricao="Senha, pagamentos, privacidade e ajuda."
        voltarParaPerfil
        nome={usuario?.nome}
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
          <h2>Aparência</h2>
          <SeletorTema temas={temasPainel} selecionado={tema} aoSelecionar={definirTema} nomeGrupo="tema-cliente" />
        </div>

        <div className="cliente-form-section">
          <h2>Notificações</h2>
          {[
            ['ofertas', 'Novas ofertas de ingressos', 'Avisos quando um evento salvo tiver nova oferta'],
            ['custodia', 'Atualizações de custódia', 'Avisos sobre liberação de pagamento e status da custódia'],
            ['promocoes', 'Novidades e promoções', 'Comunicações de marketing da TrocaTicket'],
          ].map(([chave, titulo, descricao]) => (
            <label className="cliente-toggle-row" key={chave}>
              <div><strong>{titulo}</strong><p>{descricao}</p></div>
              <input
                type="checkbox"
                checked={notificacoes[chave]}
                onChange={(e) => alterarNotificacao(chave, e.target.checked)}
              />
            </label>
          ))}
        </div>

        <button type="button" className="cliente-btn-comprar" onClick={() => setSalvo(true)}>
          {salvo ? 'Alterações salvas ✓' : 'Salvar Alterações'}
        </button>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
          Exibição apenas: ainda não existe uma rota no backend para salvar essas preferências.
        </p>
        <Link to="/cliente/perfil" className="cliente-voltar">← Voltar para Perfil</Link>
      </main>
    </>
  )
}
