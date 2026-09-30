import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const raizProjeto = resolve(here, '..', '..')
const origem = resolve(raizProjeto, 'frontend', 'pages', 'css', 'style.css')
const destinoCss = resolve(here, '..', 'src', 'styles')
const destinoImagens = resolve(here, '..', 'public', 'images')

const header = `/* Gerado por scripts/split-admin-css.mjs a partir de frontend/pages/css/style.css
   Nao edite aqui: altere o style.css original e rode "npm run sync:css". */

`

mkdirSync(destinoCss, { recursive: true })
mkdirSync(resolve(destinoImagens, 'eventos'), { recursive: true })

const linhas = readFileSync(origem, 'utf8').split(/\r?\n/)

// Em vez de cortar por número de linha fixo (que quebra toda vez que o
// style.css cresce ou encolhe acima do ponto de corte), procuramos os
// marcadores "/* @split:... */" deixados no próprio arquivo.
function linhaDoMarcador(marcador) {
  const indice = linhas.findIndex((linha) => linha.trim() === marcador)
  if (indice === -1) {
    throw new Error(
      `Marcador "${marcador}" não encontrado em frontend/pages/css/style.css`,
    )
  }
  return indice
}

const inicioAdmin = linhaDoMarcador('/* @split:admin:inicio */')
const fimAdmin = linhaDoMarcador('/* @split:admin:fim */')
const inicioExtra = linhaDoMarcador('/* @split:base-extra:inicio */')
const fimExtra = linhaDoMarcador('/* @split:base-extra:fim */')

const base = [
  ...linhas.slice(0, inicioAdmin),
  '',
  ...linhas.slice(inicioExtra + 1, fimExtra),
]
const admin = linhas.slice(inicioAdmin + 1, fimAdmin)

writeFileSync(resolve(destinoCss, 'base.css'), header + base.join('\n') + '\n')
writeFileSync(resolve(destinoCss, 'admin.css'), header + admin.join('\n') + '\n')

for (const imagem of ['logo_navbar_web.png', 'logo_troca_ticket.png', 'logotipo_troca_ticket.png']) {
  writeFileSync(
    resolve(destinoImagens, imagem),
    readFileSync(resolve(raizProjeto, 'frontend', 'images', imagem)),
  )
}

for (const evento of ['evento-1.jpg', 'evento-2.jpg', 'evento-3.jpg', 'evento-4.jpg']) {
  writeFileSync(
    resolve(destinoImagens, 'eventos', evento),
    readFileSync(resolve(raizProjeto, 'frontend', 'images', 'eventos', evento)),
  )
}

console.log(`base.css  -> ${base.length} linhas`)
console.log(`admin.css -> ${admin.length} linhas`)
console.log('imagens copiadas para public/images')
