import { useState } from 'react'
import {
  acoesAdministrativas,
  alertasDashboard,
  graficoAtividade,
  statusServicos,
} from '../../dados/admin'
import { CabecalhoPagina } from '../../componentes/admin/layout'
import {
  AcaoRapida,
  CartaoEstatistica,
  Painel,
} from '../../componentes/admin/primitivos'
import {
  BlocoAlertas,
  GraficoBarras,
  ListaStatus,
  TabelaAcoes,
} from '../../componentes/admin/dados'

const PERIODOS = ['Hoje', 'Semana', 'Mês']

export function AdminDashboard() {
  const [periodo, setPeriodo] = useState('Mês')

  return (
    <>
      <CabecalhoPagina
        eyebrow="Painel de Controle Central"
        titulo="Visão Geral do Sistema"
        descricao="Acompanhe a atividade geral da plataforma, métricas de crescimento e alertas de infraestrutura em tempo real."
        acoes={
          <div className="admin-page-head__actions">
            {PERIODOS.map((opcao) => (
              <button
                key={opcao}
                type="button"
                className={periodo === opcao ? 'is-active' : undefined}
                onClick={() => setPeriodo(opcao)}
              >
                {opcao}
              </button>
            ))}
          </div>
        }
      />

      <div className="admin-stats">
        <CartaoEstatistica
          rotulo="Total de Usuários"
          valor="12.480"
          detalhe="+12,4% vs. mês anterior"
        />
        <CartaoEstatistica
          rotulo="Usuários Ativos"
          valor="9.312"
          detalhe="Engajamento ativo em 30d"
        />
        <CartaoEstatistica
          rotulo="Novos no Período"
          valor="428"
          detalhe="+32 hoje"
        />
        <CartaoEstatistica
          rotulo="Volume sob Custódia"
          valor="R$ 842.150,00"
          detalhe="Protegido via Smart Escrow 2.4"
          escuro
        />
      </div>

      <div className="admin-grid">
        <div className="admin-col-main">
          <Painel>
            <h2>Atividade Recente da Rede</h2>
            <p>
              Acessos únicos vs. transações com validação de QR Code biométrico.
            </p>
            <GraficoBarras valores={graficoAtividade} />
          </Painel>

          <Painel>
            <h2>Últimas Ações Administrativas</h2>
            <p>Registros operacionais auditados das últimas 24 horas.</p>
            <TabelaAcoes acoes={acoesAdministrativas} />
          </Painel>
        </div>

        <div className="admin-col-side">
          <Painel>
            <h2>Ações Rápidas</h2>
            <AcaoRapida destaque>+ Novo Usuário Administrador</AcaoRapida>
            <AcaoRapida>Ver Relatórios Consolidados</AcaoRapida>
            <AcaoRapida>Auditoria de Acessos e Sessões</AcaoRapida>
          </Painel>

          <Painel>
            <h2>Alertas do Sistema</h2>
            <BlocoAlertas alertas={alertasDashboard} />
          </Painel>

          <Painel>
            <h2>Status dos Serviços</h2>
            <ListaStatus servicos={statusServicos} />
          </Painel>
        </div>
      </div>
    </>
  )
}
