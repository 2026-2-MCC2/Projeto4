export const adminAtual = {
  nome: 'Renata Castro',
  cargo: 'Super Admin',
  email: 'admin@trocaticket.com.br',
  iniciais: 'RC',
}

export const temasPainel = [
  {
    id: 'bilhete-dourado',
    nome: 'Bilhete Dourado',
    descricao: 'Luz quente de bilheteria e destaque âmbar.',
    cores: ['#FFF7ED', '#C2410C', '#431407'],
  },
  {
    id: 'palco-rubi',
    nome: 'Palco Rubi',
    descricao: 'Rosa profundo para uma noite em destaque.',
    cores: ['#FFF1F2', '#BE123C', '#4C0519'],
  },
  {
    id: 'camarote-oceano',
    nome: 'Camarote Oceano',
    descricao: 'Azul-esverdeado inspirado nas grandes turnês.',
    cores: ['#ECFEFF', '#0E7490', '#083344'],
  },
  {
    id: 'ultima-sessao',
    nome: 'Última Sessão',
    descricao: 'Modo escuro para navegar com pouca luz.',
    cores: ['#111923', '#C2410C', '#E6EEF6'],
  },
]

export const TOTAL_USUARIOS = 12480

export const usuarios = [
  {
    id: '#USR-89021',
    nome: 'Rodrigo Mendonça',
    email: 'rodrigo.m@live.com',
    papel: 'Organizador',
    papelTone: 'accent',
    status: 'Ativo',
    criadoEm: '12/03/2024',
    ultimoAcesso: 'Há 12 min',
    inicial: 'RM',
  },
  {
    id: '#USR-77341',
    nome: 'Carlos Mendes',
    email: 'carlos.mendes@liveprod.com.br',
    papel: 'Organizador',
    papelTone: 'accent',
    status: 'Ativo',
    criadoEm: '20/01/2024',
    ultimoAcesso: 'Há 1 hora',
    inicial: 'CM',
  },
  {
    id: '#USR-99201',
    nome: 'Gabriel Souza',
    email: 'gabriel@exemplo.com',
    papel: 'Usuário / Comprador',
    papelTone: 'info',
    status: 'Ativo',
    criadoEm: '05/02/2025',
    ultimoAcesso: 'Há 3 horas',
    inicial: 'GS',
  },
  {
    id: '#USR-54129',
    nome: 'Mariana Costa',
    email: 'mariana.costa@email.com',
    papel: 'Usuário / Vendedor',
    papelTone: 'info',
    status: 'Inativo',
    criadoEm: '18/11/2024',
    ultimoAcesso: 'Há 14 dias',
    inicial: 'MC',
  },
  {
    id: '#ADM-00042',
    nome: 'Felipe Alencar',
    email: 'felipe.alencar@security.com',
    papel: 'Administrador',
    papelTone: 'dark',
    status: 'Ativo',
    criadoEm: '10/10/2023',
    ultimoAcesso: 'Há 5 min',
    inicial: 'FA',
  },
  {
    id: '#USR-10443',
    nome: 'Luciana Paes',
    email: 'luciana.p@fakebox.net',
    papel: 'Usuário',
    papelTone: 'info',
    status: 'Bloqueado (Suspeita Fraude)',
    criadoEm: '01/02/2025',
    ultimoAcesso: 'Há 2 dias',
    sinalizado: true,
    inicial: 'LP',
  },
  {
    id: '#USR-65811',
    nome: 'Camila Lima',
    email: 'camila.lima@eventos.com',
    papel: 'Organizador',
    papelTone: 'accent',
    status: 'Ativo',
    criadoEm: '15/09/2024',
    ultimoAcesso: 'Ontem',
    inicial: 'CL',
  },
]

export const acoesAdministrativas = [
  {
    acao: 'Aprovação de Produtor',
    alvo: 'LiveNation Brasil (CNPJ 18.234.***)',
    operador: 'Renata Castro',
    horario: 'Há 18 min',
    status: 'Concluído',
    tom: 'ok',
  },
  {
    acao: 'Redefinição de Permissão',
    alvo: 'Auditor Financeiro #ADM-042',
    operador: 'Sistema (2FA)',
    horario: 'Há 42 min',
    status: 'Auditado',
    tom: 'warn',
  },
  {
    acao: 'Bloqueio Preventivo',
    alvo: 'Tentativa de bot (#BOT-9812)',
    operador: 'WAF Firewall',
    horario: 'Há 1h 10min',
    status: 'Bloqueado',
    tom: 'danger',
  },
]

export const graficoAtividade = [40, 55, 45, 70, 60, 85, 100]

export const alertasDashboard = [
  {
    titulo: 'Tentativas de Login Falhas',
    descricao:
      '5 credenciais inválidas consecutivas para a conta rodrigo.m@live.com. Há 14 min.',
    tom: 'danger',
  },
  {
    titulo: 'Uso Elevado de CPU',
    descricao:
      'Cluster de validação biométrica de QR Code operando com alta concorrência (88%). Há 35 min.',
    tom: 'warn',
  },
]

export const statusServicos = [
  { nome: 'API Emissão Ingressos', valor: '24ms' },
  { nome: 'Gateway de Pagamentos PIX', valor: '110ms' },
  { nome: 'Custódia Blockchain Escrow', valor: 'Ativo' },
]

export const perfis = [
  {
    tag: 'Super Admin',
    tagTone: 'dark',
    nome: 'Administrador',
    descricao: 'Acesso total e irrestrito ao sistema.',
    membros: '5 membros associados',
    ativo: true,
  },
  {
    tag: 'Catálogo',
    tagTone: 'accent',
    nome: 'Editor / Curador',
    descricao: 'Gestão de catálogo de eventos e conteúdo público.',
    membros: '12 membros',
  },
  {
    tag: 'Parceiros',
    tagTone: 'accent',
    nome: 'Organizador',
    descricao: 'Gestão de eventos próprios, fornecedores e propostas.',
    membros: '1.840 membros',
  },
  {
    tag: 'Atendimento',
    tagTone: 'info',
    nome: 'Suporte / Atendimento',
    descricao: 'Mediação de disputas e tickets de usuários.',
    membros: '24 membros',
  },
  {
    tag: 'Compliance',
    tagTone: 'info',
    nome: 'Auditor de Custódia Escrow',
    descricao: 'Visualização e liberação de liquidação financeira.',
    membros: '3 membros',
  },
]

export const permissoesSuperAdmin = [
  {
    modulo: 'Financeiro e Custódia (Escrow)',
    detalhe: 'Liberação de repasse, retenção e estornos Pix',
    ver: true,
    criar: true,
    editar: true,
    excluir: true,
    acesso: 'Total',
    acessoTone: 'dark',
  },
  {
    modulo: 'Usuários',
    detalhe: 'Perfis, bloqueios e validação documental (KYC)',
    ver: true,
    criar: true,
    editar: true,
    excluir: true,
    acesso: 'Total',
    acessoTone: 'dark',
  },
  {
    modulo: 'Eventos',
    detalhe: 'Aprovação, moderação de datas e categorias',
    ver: true,
    criar: true,
    editar: true,
    excluir: false,
    acesso: 'Parcial',
    acessoTone: 'accent',
  },
  {
    modulo: 'Ingressos',
    detalhe: 'Lotes, revendas secundárias e integridade de QR',
    ver: true,
    criar: true,
    editar: true,
    excluir: true,
    acesso: 'Total',
    acessoTone: 'dark',
  },
  {
    modulo: 'Configurações do Sistema',
    detalhe: 'Taxas percentuais, limites e parâmetros do gateway',
    ver: true,
    criar: false,
    editar: true,
    excluir: false,
    acesso: 'Crítico',
    acessoTone: 'warn',
  },
  {
    modulo: 'Logs e Auditoria',
    detalhe: 'Rastreabilidade completa de ações e assinaturas',
    ver: true,
    criar: false,
    editar: false,
    excluir: false,
    acesso: 'Imutável',
    acessoTone: 'info',
  },
]

export const membrosSuperAdmin = [
  { iniciais: 'FA', nome: 'Felipe Alencar' },
  { iniciais: 'RC', nome: 'Renata Castro (Você)' },
]

export const eventosLog = [
  {
    id: 'LOG-1',
    titulo: 'Liberação de Repasse de Custódia — Escrow',
    descricao:
      'Recurso: Festival de Verão 2025 · Transação #TRX-84920 · R$ 38.500,00 liquidados via FIDO2 Token Físico.',
    origem: 'Renata Castro (#ADM-001, Super Admin) · São Paulo, SP · Chrome / macOS',
    status: 'Concluído',
    statusComo: 'pill',
    tom: 'ok',
    horario: 'Hoje, 14:35 · há 8 min',
    iniciais: 'RC',
  },
  {
    id: 'LOG-2',
    titulo: 'Tentativa de brute force bloqueada',
    descricao:
      'Endpoint /api/v1/admin/auth (64 requisições / 30s) · Sistema WAF, automático via Cloud Security.',
    origem: 'Campinas, SP · Python-Requests · 187.32.14.88',
    status: 'Bloqueado',
    statusComo: 'tag',
    tom: 'danger',
    horario: 'Hoje, 14:10 · há 33 min',
    iniciais: 'WAF',
    avatarMudo: true,
  },
  {
    id: 'LOG-3',
    titulo: 'Publicação de novo lote de ingressos',
    descricao: 'Evento: Rock Sessions SP · 450 ingressos (Lote 2 - Pista Premium).',
    origem: 'Rodrigo Mendonça (#USR-9482, Organizador) · São Paulo, SP · Safari / iOS 17',
    status: 'Concluído',
    statusComo: 'pill',
    tom: 'ok',
    horario: 'Hoje, 13:42 · há 1 hora',
    iniciais: 'RM',
  },
  {
    id: 'LOG-4',
    titulo: 'Redefinição de senha de usuário',
    descricao:
      'Ação administrativa aplicada sobre conta de terceiro, com confirmação em duas etapas.',
    origem: 'Felipe Alencar (#ADM-042, Admin Nível 2) · Belo Horizonte, MG',
    status: 'Auditado',
    statusComo: 'tag',
    tom: 'warn',
    horario: 'Hoje, 11:20 · há 3 horas',
    iniciais: 'FA',
  },
]

export const servicos = [
  {
    nome: 'API Emissão de Ingressos',
    detalhe: 'Core Engine v2.4.1',
    estado: 'Operacional',
    estadoComo: 'pill',
    estadoTone: 'ok',
    uptime: '99.98%',
    latencia: '24 ms',
  },
  {
    nome: 'PostgreSQL Cluster',
    detalhe: 'Multi-AZ Master + 2 Read',
    estado: 'Operacional',
    estadoComo: 'pill',
    estadoTone: 'ok',
    uptime: '100%',
    latencia: '8 ms',
  },
  {
    nome: 'Gateway PIX & Cartão',
    detalhe: 'Bacen SPI / Adquirência',
    estado: 'Operacional',
    estadoComo: 'pill',
    estadoTone: 'ok',
    uptime: '99.85%',
    latencia: '110 ms',
  },
  {
    nome: 'Custódia & Criptografia',
    detalhe: 'Smart Lockers / HSM',
    estado: 'Operacional',
    estadoComo: 'pill',
    estadoTone: 'ok',
    uptime: '99.92%',
    latencia: '45 ms',
  },
  {
    nome: 'Envio de E-mail (SMTP)',
    detalhe: 'Fila moderada / Retry',
    estado: 'Degradação',
    estadoComo: 'tag',
    estadoTone: 'warn',
    uptime: '97.40%',
    latencia: '380 ms',
    degradado: true,
  },
]

export const usoRecursos = [
  {
    nome: 'Memória RAM',
    valor: '48%',
    percentual: 48,
    detalhe: '15.4 GB / 32 GB em uso · Buffer livre: 16.6 GB',
  },
  {
    nome: 'Armazenamento em Disco',
    valor: '35%',
    percentual: 35,
    detalhe: '350 GB / 1 TB utilizado · Volume NVMe · 650 GB livres',
  },
  {
    nome: 'Pods de Validação QR Code',
    valor: '64%',
    percentual: 64,
    detalhe: 'Pico recente registrado · Cluster A: 58% · Cluster B: 71%',
  },
  {
    nome: 'Throughput de Requisições',
    valor: '2.450 req/min',
    percentual: 82,
    detalhe: 'Taxa de falha: 0.02% (nominal)',
  },
]

export const alertasMonitoramento = [
  {
    titulo: 'Fila de E-mails Transacionais com 142 mensagens pendentes',
    descricao:
      'Taxa de throttling temporário no endpoint SMTP (SendGrid retry queue). Detectado há 12 min · Microsserviço de Notificações.',
    tom: 'warn',
  },
  {
    titulo: 'Pico de tráfego em /api/v1/tickets/validate',
    descricao: 'Excedeu limite de burst momentaneamente.',
    tom: 'info',
  },
]

export const tickets = [
  {
    id: '#TCK-3921',
    categoria: 'Mediação de Custódia',
    quando: 'Há 18 min',
    titulo: 'Divergência na liberação do QR Code da Pista Premium',
    solicitante: 'Gabriel Souza',
    perfilSolicitante: 'Comprador',
    iniciais: 'GS',
    prioridade: 'Alta',
    prioridadeTone: 'danger',
    status: 'Em Andamento',
    statusTone: 'warn',
  },
  {
    id: '#TCK-3918',
    categoria: 'Gestão de Lotes',
    quando: 'Há 1h',
    titulo: 'Aumento de lote para Festival de Verão 2025',
    solicitante: 'Rodrigo Mendonça',
    perfilSolicitante: 'Organizador',
    iniciais: 'RM',
    prioridade: 'Média',
    prioridadeTone: 'accent',
    status: 'Aberto',
    statusTone: 'info',
  },
  {
    id: '#TCK-3912',
    categoria: 'Reembolso / Chargeback',
    quando: 'Há 2h',
    titulo: 'Solicitação de estorno por cancelamento de atração',
    solicitante: 'Camila Lima',
    perfilSolicitante: 'Compradora',
    iniciais: 'CL',
    prioridade: 'Alta',
    prioridadeTone: 'danger',
    status: 'Aberto',
    statusTone: 'info',
  },
  {
    id: '#TCK-3890',
    categoria: 'Financeiro & Repasse',
    quando: 'Ontem',
    titulo: 'Homologação de conta bancária para repasse',
    solicitante: 'Carlos Mendes',
    perfilSolicitante: 'Produtor',
    iniciais: 'CM',
    prioridade: 'Baixa',
    prioridadeTone: 'info',
    status: 'Em Andamento',
    statusTone: 'warn',
  },
]

export const ticketSelecionado = {
  id: '#TCK-3921',
  eyebrow: 'Mediação · Escrow Ativa',
  titulo: 'Divergência na liberação do QR Code da Pista Premium',
  resumo:
    'Contrato vinculado #CUST-9820-BR · Festival de Verão 2025, Pista Premium · Vendedor: Camila Organizações ME · Comprador: Gabriel Souza.',
  estado: 'Operacional',
  metricas: [
    { rotulo: 'Custódia Bloqueada', valor: 'R$ 14.890,00' },
    { rotulo: 'Valor sob Custódia', valor: 'R$ 294,00' },
    { rotulo: 'Tempo Médio SLA', valor: '14 min' },
  ],
  mensagens: [
    {
      iniciais: 'GS',
      autor: 'Gabriel Souza',
      papel: 'Comprador',
      quando: 'há 18 min',
      interno: false,
      texto: 'Olá, efetuei o pagamento do ingresso para o Festival de Verão 2025 via cartão de crédito. O valor de R$ 294,00 foi debitado do meu limite e no extrato consta em custódia pelo TrocaTicket, porém o QR code dinâmico ainda não foi emitido no app para minha carteira. Poderiam checar o que ocorreu?',
      anexo: '📎 comprovante_transacao_pix_card.pdf · 240 KB',
    },
    {
      iniciais: 'RC',
      autor: 'Renata Castro (Você)',
      papel: 'Super Admin',
      quando: 'há 10 min',
      interno: true,
      texto: 'Gateway confirmou liquidação às 14:19:02 UTC. Falha pontual no webhook da catraca parceira (código HTTP 504). Não houve duplicidade no débito. Custódia permanece íntegra na conta garantida #9941.',
    },
  ],
}

export const webhooks = [
  {
    url: 'https://api.trocaticket.com/v1/escrow/events',
    descricao: 'Dispara quando o saldo da custódia é bloqueado ou liquidado.',
    estado: 'Ativo (200 OK)',
  },
  {
    url: 'https://webhook.pagamentos.com.br/pix',
    descricao: 'Recepção de notificações assíncronas do Banco Central / BACEN.',
    estado: 'Ativo (200 OK)',
  },
]

export const abasConfiguracoes = [
  'Gerais',
  'Marca & Visual',
  'Integrações & APIs',
  'E-mail (SMTP)',
  'Segurança & Acesso',
]

export const filtrosSeveridade = [
  { rotulo: 'Todos', total: '1.842' },
  { rotulo: 'Info', total: '1.620' },
  { rotulo: 'Alerta', total: '208' },
  { rotulo: 'Crítico', total: '14' },
]

export const paletasMarca = [
  { nome: 'Primária (Ações)', hex: '#EA580C' },
  { nome: 'Secundária (Custódia)', hex: '#0F172A' },
  { nome: 'Fundo', hex: '#F8FAFC', borda: true },
]
