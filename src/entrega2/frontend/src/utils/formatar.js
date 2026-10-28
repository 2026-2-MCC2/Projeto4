// Funções de formatação compartilhadas (antes duplicadas em vários arquivos).

export function moeda(n) {
  return Number(n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// Iniciais pro avatar a partir do nome (ex.: "Geovanna Tamagusko" -> "GT")
export function iniciaisDoNome(nome) {
  const partes = (nome || '').trim().split(/\s+/).filter(Boolean)
  if (partes.length === 0) return '?'
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
}

export function formatarData(valor) {
  if (!valor) return '—'
  const data = new Date(valor)
  if (Number.isNaN(data.getTime())) return valor
  return data.toLocaleDateString('pt-BR')
}
