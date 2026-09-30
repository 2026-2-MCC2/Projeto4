import { useEffect, useState } from 'react'
import {
  abasConfiguracoes,
  paletasMarca,
  temasPainel,
  webhooks,
} from '../../dados/admin'
import {
  Abas,
  CabecalhoPagina,
  RodapeFixo,
} from '../../componentes/admin/layout'
import { useRodapeAdmin } from '../../componentes/admin/contexto-layout'
import {
  Botao,
  CabecalhoPainel,
  Dica,
  MiniEstatisticas,
  Painel,
  Tag,
} from '../../componentes/admin/primitivos'
import {
  CampoInput,
  CampoSelect,
  GradeCampos,
  Interruptor,
  LinhaAtivo,
  LinhaChaveApi,
  ListaWebhooks,
  PaletaCores,
  SelecaoTema,
} from '../../componentes/admin/formularios'

export function AdminConfiguracoes() {
  const [aba, setAba] = useState(abasConfiguracoes[0])
  const [manutencao, setManutencao] = useState(false)
  const [doisFatores, setDoisFatores] = useState(true)
  const { definirRodape, temaAdmin, definirTemaAdmin } = useRodapeAdmin()

  useEffect(() => {
    definirRodape(
      <RodapeFixo>
        <span>
          ⚠ Modificações no fuso ou e-mail exigem reinicialização dos workers de
          mensageria
        </span>
        <div>
          <Botao>Descartar Alterações</Botao>
          <Botao variante="primario">Salvar Configurações</Botao>
        </div>
      </RodapeFixo>,
    )

    return () => definirRodape(null)
  }, [definirRodape])

  return (
    <>
      <CabecalhoPagina
        eyebrow="Painel de Controle Central"
        titulo="Configurações do Sistema"
        descricao="Gerencie preferências globais de operação, integrações financeiras, políticas rigorosas de custódia e infraestrutura de comunicação."
        acoes={
          <MiniEstatisticas
            itens={[
              { rotulo: 'Configurações', valor: 'Sincronizadas' },
              { rotulo: 'Versão', valor: 'v2.4.12-prod' },
            ]}
          />
        }
      />

      <Abas abas={abasConfiguracoes} ativa={aba} aoTrocar={setAba} />

      <Painel>
        <CabecalhoPainel
          titulo="1. Preferências Gerais da Plataforma"
          descricao="Defina informações públicas fundamentais e os parâmetros regionais de operação."
        >
          <Tag tom="info">Geral</Tag>
        </CabecalhoPainel>
        <GradeCampos>
          <CampoInput
            rotulo="Nome Oficial do Sistema"
            valorInicial="TrocaTicket - Intercâmbio Seguro de Ingressos"
          />
          <CampoInput
            rotulo="E-mail de Contato Suporte"
            tipo="email"
            valorInicial="suporte@trocaticket.com.br"
          />
          <CampoSelect
            rotulo="Idioma Padrão"
            opcoes={['Português (Brasil) - pt_BR']}
          />
          <CampoSelect
            rotulo="Fuso Horário Operacional"
            opcoes={['Horário de Brasília (GMT-03:00)']}
          />
        </GradeCampos>
        <Interruptor
          rotulo="Modo de Manutenção"
          descricao="Impede novos depósitos em custódia e compras no marketplace; apenas administradores acessam."
          ligado={manutencao}
          aoAlternar={setManutencao}
        />
      </Painel>

      <Painel>
        <CabecalhoPainel
          titulo="2. Personalização de Marca"
          descricao="Gerencie ativos visuais e identidades cromáticas exibidas para compradores e vendedores."
        >
          <Tag tom="accent">Identidade</Tag>
        </CabecalhoPainel>
        <GradeCampos>
          <div className="admin-field">
            <label>Logotipo Oficial da Plataforma</label>
            <LinhaAtivo
              src="/images/logo_navbar_web.png"
              alt="Logo atual"
              nome="logo_trocaticket_vector.svg"
              detalhe="SVG Vetorial / 240x64px"
            />
          </div>
          <div className="admin-field">
            <label>Paleta de Cores do Ecossistema</label>
            <PaletaCores cores={paletasMarca} />
          </div>
        </GradeCampos>
        <SelecaoTema
          temas={temasPainel}
          selecionado={temaAdmin}
          aoSelecionar={definirTemaAdmin}
        />
      </Painel>

      <Painel>
        <CabecalhoPainel
          titulo="3. Integrações & Chaves de API"
          descricao="Conecte gateways bancários (PIX), motores antifraude e endpoints de webhook em tempo real."
        >
          <Tag tom="dark">REST API v1</Tag>
        </CabecalhoPainel>
        <GradeCampos>
          <LinhaChaveApi
            rotulo="Chave de Produção API (Live)"
            chave="sk_live_9482••••••••••••"
          />
          <LinhaChaveApi
            rotulo="Chave Sandbox / Ambiente de Testes"
            chave="sk_test_1092••••••••••••"
          />
        </GradeCampos>
        <label>Webhooks Ativos de Notificação</label>
        <ListaWebhooks webhooks={webhooks} />
        <Botao>+ Adicionar Webhook</Botao>
      </Painel>

      <Painel>
        <CabecalhoPainel
          titulo="4. E-mail Transacional (SMTP)"
          descricao="Configuração do servidor de disparo de tokens 2FA, ingressos nominais e comprovantes."
        >
          <Tag tom="ok">Conectado (SendGrid)</Tag>
        </CabecalhoPainel>
        <GradeCampos colunas={4}>
          <CampoInput rotulo="Servidor SMTP" valorInicial="smtp.sendgrid.net" />
          <CampoInput rotulo="Porta de Comunicação" valorInicial="587 (TLS)" />
          <CampoInput rotulo="Usuário SMTP" valorInicial="apikey_trocaticket_mailer" />
          <CampoInput
            rotulo="Senha / API Token"
            tipo="password"
            valorInicial="senha-de-exemplo"
          />
        </GradeCampos>
        <div className="admin-toggle-row">
          <div>
            <strong>✓ Último teste de envio bem-sucedido há 2h</strong>
            <p>Latência: 312ms</p>
          </div>
          <Botao>Enviar E-mail de Teste</Botao>
        </div>
      </Painel>

      <Painel>
        <CabecalhoPainel
          titulo="5. Segurança e Políticas de Acesso"
          descricao="Diretrizes obrigatórias de senha, autenticação multifator e renovação de tokens de sessão."
        >
          <Tag tom="warn">Nível Bancário</Tag>
        </CabecalhoPainel>
        <GradeCampos>
          <div className="admin-field">
            <label>Política de Senhas dos Usuários</label>
            <Dica>
              Comprimento mínimo: 8 caracteres · Maiúsculas e minúsculas · Dígitos
              numéricos · Caracteres especiais (@#$%)
            </Dica>
          </div>
          <div className="admin-field">
            <Interruptor
              rotulo="Autenticação em 2 Fatores (2FA)"
              ligado={doisFatores}
              aoAlternar={setDoisFatores}
              compacto
            />
            <Dica>Obrigatório para Admins e Organizadores.</Dica>
          </div>
          <CampoSelect
            rotulo="Expiração de Sessão por Inatividade"
            opcoes={['30 minutos']}
          />
        </GradeCampos>
      </Painel>
    </>
  )
}
