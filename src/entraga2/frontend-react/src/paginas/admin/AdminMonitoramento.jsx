import {
  alertasMonitoramento,
  servicos,
  usoRecursos,
} from '../../dados/admin'
import { CabecalhoPagina } from '../../componentes/admin/layout'
import {
  CartaoEstatistica,
  Chip,
  ListaChip,
  Painel,
} from '../../componentes/admin/primitivos'
import {
  BlocoAlertas,
  GradeServicos,
  LinhaProgresso,
} from '../../componentes/admin/dados'

export function AdminMonitoramento() {
  return (
    <>
      <CabecalhoPagina
        eyebrow="Cluster BR-EAST-1 · Última checagem: 15:42:08"
        titulo="Monitoramento de Infraestrutura & Serviços"
        descricao="Acompanhe em tempo real a saúde das APIs, microsserviços de custódia, carga de servidores e alertas operacionais."
      />

      <div className="admin-stats">
        <CartaoEstatistica
          rotulo="Pods Ativos"
          valor="48 / 48"
          detalhe="100% Saudáveis"
        />
        <CartaoEstatistica
          rotulo="Latência Global"
          valor="32 ms"
          detalhe="-4ms vs. ontem"
        />
        <CartaoEstatistica
          rotulo="Custódia Escrow"
          valor="R$ 1.84M"
          detalhe="420 transações em hold"
        />
        <CartaoEstatistica
          rotulo="Taxa de Erro (60m)"
          valor="0.02%"
          detalhe="Dentro do SLA (< 0.1%)"
          escuro
        />
      </div>

      <Painel>
        <h2>Status dos Serviços Principais</h2>
        <GradeServicos servicos={servicos} />
      </Painel>

      <div className="admin-grid">
        <div className="admin-col-main">
          <Painel>
            <h2>Uso de Recursos de Hardware &amp; Tráfego</h2>
            <p>Métricas consolidadas dos clusters Kubernetes.</p>
            {usoRecursos.map((uso) => (
              <LinhaProgresso key={uso.nome} uso={uso} />
            ))}
          </Painel>
        </div>

        <div className="admin-col-side">
          <Painel>
            <h2>Painel de Alertas Operacionais</h2>
            <BlocoAlertas alertas={alertasMonitoramento} />
          </Painel>

          <Painel>
            <h2>Redundância Criptográfica</h2>
            <p>
              Data Center Tier III — São Paulo. Failover automático em 3 zonas de
              disponibilidade com replicação síncrona zero data-loss.
            </p>
            <ListaChip>
              <Chip>Certificação SOC2 Tipo II</Chip>
              <Chip>HSM FIPS 140-2 L3</Chip>
            </ListaChip>
          </Painel>
        </div>
      </div>
    </>
  )
}
