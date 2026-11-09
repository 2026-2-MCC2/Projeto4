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

export const paletasMarca = [
  { nome: 'Primária (Ações)', hex: '#EA580C' },
  { nome: 'Secundária (Custódia)', hex: '#0F172A' },
  { nome: 'Fundo', hex: '#F8FAFC', borda: true },
]
