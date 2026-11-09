import { useState } from 'react'

function formatarNumeroCartao(valor) {
  return valor.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ').trim()
}

function formatarValidade(valor) {
  const digitos = valor.replace(/\D/g, '').slice(0, 4)
  return digitos.length > 2 ? `${digitos.slice(0, 2)}/${digitos.slice(2)}` : digitos
}

function formatarPreco(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// Checkout simulado: não processa pagamento de verdade (sem gateway/PCI),
// só finge a etapa visual e, ao "aprovar", dispara a compra real na API.
export function ModalPagamento({ titulo, resumo, total, aoConfirmar, aoFechar, aoSucesso }) {
  const [etapa, setEtapa] = useState('formulario') // formulario | processando | aprovado
  const [numeroCartao, setNumeroCartao] = useState('')
  const [validade, setValidade] = useState('')
  const [cvv, setCvv] = useState('')
  const [nomeCartao, setNomeCartao] = useState('')
  const [erro, setErro] = useState('')

  async function confirmar(e) {
    e.preventDefault()
    setErro('')
    setEtapa('processando')
    try {
      await new Promise((resolve) => setTimeout(resolve, 1400))
      await aoConfirmar()
      setEtapa('aprovado')
      setTimeout(aoSucesso, 1200)
    } catch (erroRequisicao) {
      setErro(erroRequisicao.message)
      setEtapa('formulario')
    }
  }

  return (
    <div className="cliente-modal-backdrop" role="dialog" aria-modal="true" aria-label="Pagamento">
      <div className="cliente-modal">
        {etapa === 'aprovado' ? (
          <div className="cliente-modal__estado">
            <span className="cliente-modal__check">✓</span>
            <h2>Pagamento aprovado</h2>
            <p>Seu ingresso já está garantido e em custódia.</p>
          </div>
        ) : (
          <>
            <div className="cliente-modal__cabecalho">
              <h2>Finalizar pagamento</h2>
              <button type="button" className="cliente-modal__fechar" onClick={aoFechar} aria-label="Fechar" disabled={etapa === 'processando'}>
                ✕
              </button>
            </div>

            <div className="cliente-modal__resumo">
              <strong>{titulo}</strong>
              <span>{resumo}</span>
              <div className="cliente-modal__total">
                <span>Total</span>
                <strong>{formatarPreco(total)}</strong>
              </div>
            </div>

            <form onSubmit={confirmar}>
              <div className="cliente-field">
                <label htmlFor="numero-cartao">Número do cartão</label>
                <input
                  id="numero-cartao"
                  inputMode="numeric"
                  placeholder="0000 0000 0000 0000"
                  value={numeroCartao}
                  onChange={(e) => setNumeroCartao(formatarNumeroCartao(e.target.value))}
                  required
                  minLength={19}
                  disabled={etapa === 'processando'}
                />
              </div>

              <div className="cliente-field">
                <label htmlFor="nome-cartao">Nome impresso no cartão</label>
                <input
                  id="nome-cartao"
                  placeholder="Como está no cartão"
                  value={nomeCartao}
                  onChange={(e) => setNomeCartao(e.target.value)}
                  required
                  disabled={etapa === 'processando'}
                />
              </div>

              <div className="cliente-modal__linha">
                <div className="cliente-field">
                  <label htmlFor="validade-cartao">Validade</label>
                  <input
                    id="validade-cartao"
                    inputMode="numeric"
                    placeholder="MM/AA"
                    value={validade}
                    onChange={(e) => setValidade(formatarValidade(e.target.value))}
                    required
                    minLength={5}
                    disabled={etapa === 'processando'}
                  />
                </div>
                <div className="cliente-field">
                  <label htmlFor="cvv-cartao">CVV</label>
                  <input
                    id="cvv-cartao"
                    inputMode="numeric"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    required
                    minLength={3}
                    disabled={etapa === 'processando'}
                  />
                </div>
              </div>

              {erro && <p role="alert" style={{ color: '#BE123C', fontSize: '0.85rem' }}>{erro}</p>}

              <p className="cliente-modal__aviso">
                🔒 Ambiente de demonstração — nenhum dado de cartão é enviado ou armazenado de verdade.
              </p>

              <button type="submit" className="cliente-btn-comprar" disabled={etapa === 'processando'}>
                {etapa === 'processando' ? 'Processando pagamento...' : `Pagar ${formatarPreco(total)}`}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
