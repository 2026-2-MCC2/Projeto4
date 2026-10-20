import { Link } from 'react-router-dom'
import { propostasIniciais, servicosIniciais } from '../../dados/fornecedor'

export function FornecedorInicio() {
  return <>
    <div className="fornecedor-page-head">
      <div><h1>Olá, fornecedor!</h1><p>Acompanhe suas propostas, contratos ativos e o desempenho dos seus serviços na plataforma.</p></div>
      <Link className="fornecedor-btn" to="/fornecedor/servicos/novo">+ Cadastrar novo serviço</Link>
    </div>
    <div className="fornecedor-stats">
      <article><span>Propostas recebidas</span><strong>12</strong><small>4 aguardando resposta</small></article>
      <article><span>Contratos ativos</span><strong>5</strong><small>Para os próximos 30 dias</small></article>
      <article><span>Avaliação média</span><strong>4,8 ★</strong><small>Baseado em 38 avaliações</small></article>
      <article className="escuro"><span>Faturamento do mês</span><strong>R$ 18.400,00</strong><small>Custódia liberada automaticamente</small></article>
    </div>
    <div className="fornecedor-grid">
      <section className="fornecedor-panel"><h2>Propostas recentes</h2>
        {propostasIniciais.map(p => <div className="fornecedor-lista-item" key={p.id}><div><strong>{p.evento}</strong><small>{p.servico}</small></div><span className="fornecedor-tag">{p.status}</span></div>)}
        <Link className="fornecedor-link-secundario" to="/fornecedor/propostas">Ver todas as propostas</Link>
      </section>
      <section className="fornecedor-panel"><h2>Meus serviços cadastrados</h2>
        {servicosIniciais.map(s => <div className="fornecedor-lista-item" key={s.id}><strong>{s.nome}</strong><small>{s.preco}</small></div>)}
        <Link className="fornecedor-link-secundario" to="/fornecedor/servicos/novo">+ Adicionar outro serviço</Link>
      </section>
    </div>
  </>
}
