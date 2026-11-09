import { useId, useState } from 'react'
import { Botao } from './primitivos'

export function CampoInput({ rotulo, valorInicial, tipo = 'text' }) {
  const id = useId()
  return (
    <div className="admin-field">
      <label htmlFor={id}>{rotulo}</label>
      <input id={id} type={tipo} defaultValue={valorInicial} />
    </div>
  )
}

export function CampoSelect({ rotulo, opcoes }) {
  const id = useId()
  return (
    <div className="admin-field">
      <label htmlFor={id}>{rotulo}</label>
      <select id={id} defaultValue={opcoes[0]}>
        {opcoes.map((opcao) => (
          <option key={opcao}>{opcao}</option>
        ))}
      </select>
    </div>
  )
}

export function GradeCampos({ colunas = 2, children }) {
  return (
    <div
      className={[
        'admin-field-grid',
        colunas === 4 ? 'admin-field-grid--4' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}

export function Interruptor({ rotulo, descricao, ligado, aoAlternar, compacto = false }) {
  return (
    <div
      className={['admin-toggle-row', compacto ? 'admin-toggle-row--tight' : '']
        .filter(Boolean)
        .join(' ')}
    >
      <div>
        <strong>{rotulo}</strong>
        {descricao ? <p>{descricao}</p> : null}
      </div>
      <label className="admin-switch">
        <input
          type="checkbox"
          checked={ligado}
          onChange={(e) => aoAlternar(e.target.checked)}
        />
        <span />
      </label>
    </div>
  )
}

export function LinhaAtivo({ src, alt, nome, detalhe, acao = 'Substituir' }) {
  const idArquivo = useId()
  const [previa, setPrevia] = useState(null)
  const [nomeArquivo, setNomeArquivo] = useState(nome)

  function aoEscolherArquivo(e) {
    const arquivo = e.target.files?.[0]
    if (!arquivo) return
    setPrevia(URL.createObjectURL(arquivo))
    setNomeArquivo(arquivo.name)
  }

  return (
    <div className="admin-asset-row">
      <img src={previa || src} alt={alt} />
      <div>
        <strong>{nomeArquivo}</strong>
        <small>{previa ? 'Pré-visualização local (nada foi enviado ao servidor)' : detalhe}</small>
      </div>
      <input
        id={idArquivo}
        type="file"
        accept="image/*"
        onChange={aoEscolherArquivo}
        style={{ display: 'none' }}
      />
      <Botao onClick={() => document.getElementById(idArquivo)?.click()}>
        {acao}
      </Botao>
    </div>
  )
}

export function PaletaCores({ cores }) {
  return (
    <div className="admin-color-row">
      {cores.map((cor) => (
        <div key={cor.nome}>
          <span
            className="admin-swatch"
            style={
              cor.borda
                ? { background: cor.hex, border: '1px solid var(--border)' }
                : { background: cor.hex }
            }
          />
          {cor.nome}
          <small>{cor.hex}</small>
        </div>
      ))}
    </div>
  )
}

export function SelecaoTema({ temas, selecionado, aoSelecionar }) {
  return (
    <fieldset className="admin-theme-picker">
      <legend>Modo de cor do painel</legend>
      <div className="admin-theme-options">
        {temas.map((tema) => (
          <label className="admin-theme-option" key={tema.id}>
            <input
              type="radio"
              name="tema-admin"
              value={tema.id}
              checked={selecionado === tema.id}
              onChange={() => aoSelecionar(tema.id)}
            />
            <span className="admin-theme-option__swatches" aria-hidden="true">
              {tema.cores.map((cor) => (
                <span key={cor} style={{ backgroundColor: cor }} />
              ))}
            </span>
            <span className="admin-theme-option__copy">
              <strong>{tema.nome}</strong>
              <small>{tema.descricao}</small>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function gerarSufixoChave() {
  return Math.random().toString(36).slice(2, 14)
}

export function LinhaChaveApi({ rotulo, chave }) {
  const [valor, setValor] = useState(chave)
  const [copiado, setCopiado] = useState(false)

  async function copiar() {
    try {
      await navigator.clipboard.writeText(valor)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 1500)
    } catch {
      // clipboard indisponível (ex: contexto não seguro) — ignora silenciosamente
    }
  }

  function regenerar() {
    const prefixo = valor.split('_').slice(0, 2).join('_')
    setValor(`${prefixo}_${gerarSufixoChave()}••••••••••••`)
  }

  return (
    <div className="admin-field">
      <label>{rotulo}</label>
      <div className="admin-key-row">
        <code>{valor}</code>
        <Botao onClick={copiar}>{copiado ? 'Copiado ✓' : 'Copiar'}</Botao>
        <Botao onClick={regenerar}>Regenerar</Botao>
      </div>
    </div>
  )
}

export function ListaWebhooks({ webhooks }) {
  return (
    <ul className="admin-webhook-list">
      {webhooks.map((webhook) => (
        <li key={webhook.url}>
          <div>
            <strong>{webhook.url}</strong>
            <small>{webhook.descricao}</small>
          </div>
          <span className="admin-status-pill admin-status-pill--ok">
            {webhook.estado}
          </span>
        </li>
      ))}
    </ul>
  )
}

export function BarraFiltros({ children }) {
  return <div className="admin-panel admin-filterbar">{children}</div>
}

export function AbasSeveridade({ opcoes, ativa, aoTrocar }) {
  return (
    <div className="admin-severity-pills">
      {opcoes.map((opcao) => (
        <span
          key={opcao.rotulo}
          role="button"
          tabIndex={0}
          className={opcao.rotulo === ativa ? 'is-active' : undefined}
          onClick={() => aoTrocar(opcao.rotulo)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              aoTrocar(opcao.rotulo)
            }
          }}
        >
          {opcao.rotulo} ({opcao.total})
        </span>
      ))}
    </div>
  )
}

export function FormularioLoginAdmin({ aoEnviar, erro, carregando }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        aoEnviar(email, senha)
      }}
    >
      <div>
        <label htmlFor="admin-email">E-mail corporativo</label>
        <input
          type="email"
          id="admin-email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="admin-senha">Senha</label>
        <input
          type="password"
          id="admin-senha"
          name="senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Digite sua senha"
          required
        />
      </div>
      {erro && (
        <p role="alert" style={{ color: 'red' }}>
          {erro}
        </p>
      )}
      <button type="submit" className="admin-login-btn" disabled={carregando}>
        {carregando ? 'Entrando...' : 'Entrar no painel'}
      </button>
    </form>
  )
}
