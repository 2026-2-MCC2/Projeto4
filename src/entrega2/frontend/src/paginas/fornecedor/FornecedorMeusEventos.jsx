import { eventosContratados } from '../../dados/fornecedor'

export function FornecedorMeusEventos() {
  return <>
    <div className="fornecedor-page-head"><div><h1>Meus eventos</h1><p>Eventos em que seu serviço foi contratado, com custódia garantida até a entrega.</p></div></div>
    <ul className="fornecedor-eventos-lista">{eventosContratados.map(e => <li key={e.id} className="fornecedor-evento-card"><div><strong>{e.nome}</strong><small>{e.data} · {e.local}</small><small>Cliente: {e.cliente} · Serviço: {e.servico}</small></div><div className="fornecedor-evento-direita"><strong>{e.valor}</strong><span className={`fornecedor-tag ${e.status === 'Confirmado' ? 'ok' : e.status === 'Em andamento' ? 'aviso' : ''}`}>{e.status}</span></div></li>)}</ul>
  </>
}
