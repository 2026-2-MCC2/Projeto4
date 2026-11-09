import { useState } from 'react'
import { api } from '../../../api/cliente'

// Botões de mudança de status (publicar/encerrar/cancelar) e exclusão do evento.
export function AcoesStatus({ evento, aoAtualizar, navegarParaLista }) {
  const [erro, setErro] = useState('')
  const [processando, setProcessando] = useState(false)

  async function mudarStatus(novoStatus, confirmar) {
    if (confirmar && !window.confirm(confirmar)) return
    setErro('')
    setProcessando(true)
    try {
      await api.patch(`/api/eventos/${evento.id_evento}/status`, { status: novoStatus })
      await aoAtualizar()
    } catch (e) {
      setErro(e.message)
    } finally {
      setProcessando(false)
    }
  }

  async function excluir() {
    if (!window.confirm('Excluir este evento? Essa ação não pode ser desfeita.')) return
    setErro('')
    setProcessando(true)
    try {
      await api.del(`/api/eventos/${evento.id_evento}`)
      navegarParaLista()
    } catch (e) {
      setErro(e.message)
      setProcessando(false)
    }
  }

  return (
    <div className="org-card">
      <div className="org-acoes">
        {evento.status === 'rascunho' && (
          <button className="org-botao" disabled={processando} onClick={() => mudarStatus('aberto')}>
            Publicar para cotação
          </button>
        )}
        {evento.status === 'aberto' && (
          <button className="org-botao" disabled={processando} onClick={() => mudarStatus('fechado')}>
            Encerrar cotação
          </button>
        )}
        {(evento.status === 'rascunho' || evento.status === 'aberto') && (
          <button
            className="org-botao secundario"
            disabled={processando}
            onClick={() => mudarStatus('cancelado', 'Cancelar este evento?')}
          >
            Cancelar evento
          </button>
        )}
        {evento.status === 'rascunho' && (
          <button className="org-botao secundario" disabled={processando} onClick={excluir}>
            Excluir evento
          </button>
        )}
      </div>
      {erro && <p role="alert" className="org-aviso">{erro}</p>}
    </div>
  )
}
