import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/cliente'
import { ROTULOS_STATUS } from './gerenciar-evento/constantes'
import { AcoesStatus } from './gerenciar-evento/AcoesStatus'
import { AbaDados } from './gerenciar-evento/AbaDados'
import { AbaItens } from './gerenciar-evento/AbaItens'
import { AbaCustos } from './gerenciar-evento/AbaCustos'
import { AbaPropostas } from './gerenciar-evento/AbaPropostas'
import { AbaOrcamento } from './gerenciar-evento/AbaOrcamento'
import { AbaTicket } from './gerenciar-evento/AbaTicket'

const ABAS = [
  { chave: 'dados', rotulo: 'Dados do evento' },
  { chave: 'itens', rotulo: 'Itens de custo' },
  { chave: 'custos', rotulo: 'Custos do evento' },
  { chave: 'propostas', rotulo: 'Propostas recebidas' },
  { chave: 'orcamento', rotulo: 'Orçamento' },
  { chave: 'ticket', rotulo: 'Ticket' },
]

// Tela de gestão de um evento: carrega o evento e organiza as 6 abas (cada
// uma é seu próprio componente em ./gerenciar-evento/, pra esse arquivo ficar
// só a orquestração — detalhes de cada aba em ./gerenciar-evento/AbaX.jsx).
export function OrganizadorGerenciarEvento() {
  const { id } = useParams()
  const nav = useNavigate()

  const [evento, setEvento] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erroCarregamento, setErroCarregamento] = useState('')
  const [aba, setAba] = useState('dados')

  const carregarEvento = () => {
    setCarregando(true)
    setErroCarregamento('')
    return api
      .get(`/api/eventos/${id}`)
      .then((dados) => setEvento(dados))
      .catch((e) => setErroCarregamento(e.message))
      .finally(() => setCarregando(false))
  }

  useEffect(() => {
    carregarEvento()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (carregando) {
    return (
      <section>
        <p>Carregando evento...</p>
      </section>
    )
  }

  if (erroCarregamento || !evento) {
    return (
      <section>
        <p className="org-aviso">{erroCarregamento || 'Evento não encontrado.'}</p>
        <Link className="org-botao secundario" to="/organizador">
          Voltar para meus eventos
        </Link>
      </section>
    )
  }

  return (
    <section>
      <div className="org-titulo">
        <div>
          <small>GESTÃO DO EVENTO</small>
          <h1>{evento.nome}</h1>
          <p>
            <span className={evento.status === 'rascunho' ? 'org-status rascunho' : 'org-status'}>
              {ROTULOS_STATUS[evento.status] || evento.status}
            </span>{' '}
            · {evento.data} · {evento.local}
          </p>
        </div>
      </div>

      <AcoesStatus evento={evento} aoAtualizar={carregarEvento} navegarParaLista={() => nav('/organizador')} />

      <div className="org-abas" role="tablist">
        {ABAS.map((a) => (
          <button
            key={a.chave}
            type="button"
            role="tab"
            aria-selected={aba === a.chave}
            className={aba === a.chave ? 'org-aba ativa' : 'org-aba'}
            onClick={() => setAba(a.chave)}
          >
            {a.rotulo}
          </button>
        ))}
      </div>

      {aba === 'dados' && <AbaDados evento={evento} aoSalvar={carregarEvento} />}
      {aba === 'itens' && <AbaItens evento={evento} />}
      {aba === 'custos' && <AbaCustos evento={evento} />}
      {aba === 'propostas' && <AbaPropostas evento={evento} />}
      {aba === 'orcamento' && <AbaOrcamento evento={evento} />}
      {aba === 'ticket' && <AbaTicket evento={evento} />}
    </section>
  )
}
