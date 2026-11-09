export const ROTULOS_STATUS = {
  rascunho: 'Rascunho',
  aberto: 'Em cotação',
  fechado: 'Fechado',
  cancelado: 'Cancelado',
}

export const CATEGORIAS_ITEM = ['iluminacao', 'alimentacao', 'bebida', 'seguranca', 'estrutura', 'outros']
export const TIPOS_CUSTO = ['fiscal', 'operacional', 'variavel', 'outro']
export const ROTULOS_CENARIO = { minimo: 'Público mínimo', maximo: 'Público máximo', esperado: 'Público esperado' }

// Mesmas categorias aceitas pelo backend (eventos.controller.js) e usadas
// no filtro da página pública /eventos.
export const CATEGORIAS_PUBLICACAO = [
  { valor: 'show', rotulo: 'Show' },
  { valor: 'festival', rotulo: 'Festival' },
  { valor: 'esporte', rotulo: 'Esporte' },
  { valor: 'teatro', rotulo: 'Teatro' },
  { valor: 'outros', rotulo: 'Outros' },
]
