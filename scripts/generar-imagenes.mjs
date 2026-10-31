// scripts/generar-imagenes.mjs
// Genera una ilustración SVG para cada reloj del catálogo a partir de sus datos
// (forma de la caja, material, correa, color de esfera). Uso: npm run imagenes
// Las imágenes se pueden reemplazar luego por fotografías reales con el mismo nombre.
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const dirRelojes = 'content/relojes'
const dirSalida = 'public/images/relojes'
mkdirSync(dirSalida, { recursive: true })

// Color de esfera propio de algunos modelos
const esferas = {
  'tissot-everytime': '#f4f1ea', 'orient-bambino-v2': '#efe4cc', 'hamilton-jazzmaster-viewmatic': '#2b3a55',
  'citizen-eco-drive-corso': '#1d1d1f', 'fossil-minimalist': '#1f3b73', 'longines-la-grande-classique': '#fbfaf6',
  'seiko-prospex-turtle': '#111214', 'citizen-promaster-diver': '#173a7a', 'orient-kamasu': '#7a1424',
  'tag-heuer-aquaracer': '#16407a', 'invicta-pro-diver': '#151515', 'casio-duro-mdv106': '#101010',
  'citizen-promaster-tough': '#2a2f24', 'seiko-5-sports-skx': '#1c2b4a', 'timex-marlin-handwound': '#d9d9d6',
  'seiko-presage-cocktail': '#1e4f9c', 'hamilton-khaki-field': '#1a1a1a', 'bolsillo-railroad': '#f6f0dd',
  'rolex-datejust-41': '#2c3e64', 'omega-speedmaster-moonwatch': '#121212', 'tag-heuer-carrera': '#1b1b1d',
  'cartier-tank-must': '#f7f5ef', 'grand-seiko-snowflake': '#f2f3f5', 'nomos-tangente': '#f8f8f6',
  'casio-gshock-ga2100': '#0f0f0f'
}

// Colores de correa para modelos de silicona/resina
const correasColor = {
  'garmin-forerunner-265': '#2a6f97', 'samsung-galaxy-watch7': '#3b4252', 'apple-watch-series-10': '#c7b8a6',
  'google-pixel-watch-3': '#8fa89b', 'garmin-venu-3': '#555', 'timex-ironman-classic': '#222',
  'casio-gshock-gbd200': '#1b1b1b', 'seiko-prospex-turtle': '#1d1d1d', 'casio-duro-mdv106': '#202020',
  'citizen-promaster-diver': '#1c2c4c'
}

function colorCaja(r) {
  const m = r.materialCaja.toLowerCase()
  if (m.includes('oro')) return { base: '#d4af37', luz: '#f5dc8a', sombra: '#9c7c1e' }
  if (m.includes('titanio')) return { base: '#b9bec4', luz: '#e6e9ec', sombra: '#7d838a' }
  if (m.includes('resina') || m.includes('polímero')) return { base: '#26272b', luz: '#4a4c52', sombra: '#111' }
  if (m.includes('aluminio')) return { base: '#9aa0a6', luz: '#d5d9dd', sombra: '#5f656b' }
  if (m.includes('latón')) return { base: '#c9a646', luz: '#ecd58c', sombra: '#8a6d22' }
  return { base: '#c3c7cc', luz: '#eef0f2', sombra: '#80868d' }
}

function colorCorrea(r) {
  if (correasColor[r.slug]) return { tipo: 'liso', color: correasColor[r.slug] }
  const c = r.correa.toLowerCase()
  if (c.includes('cuero')) return { tipo: 'cuero', color: r.slug.includes('fossil') ? '#9a5b2c' : '#5b3a24' }
  if (c.includes('nylon') || c.includes('nato')) return { tipo: 'nato', color: '#4b5a3a' }
  if (c.includes('cadena')) return { tipo: 'cadena', color: '#c9a646' }
  if (c.includes('acero') || c.includes('jubilee') || c.includes('titanio') || c.includes('brazalete')) {
    return { tipo: 'metal', color: colorCaja(r).base }
  }
  return { tipo: 'liso', color: '#1f1f1f' }
}

function forma(r) {
  if (r.slug === 'cartier-tank-must') return 'rectangular'
  if (r.slug === 'casio-gshock-ga2100') return 'octogonal'
  if (r.slug === 'bolsillo-railroad') return 'bolsillo'
  if (['apple-watch-series-10'].includes(r.slug)) return 'cuadrada'
  if (r.slug.startsWith('casio-a168') || r.slug.startsWith('casio-f91w') || r.slug === 'timex-ironman-classic' || r.slug === 'casio-gshock-gbd200') return 'digital'
  return 'redonda'
}

const esClaro = hex => {
  const n = parseInt(hex.slice(1), 16)
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  return (r * 299 + g * 587 + b * 114) / 1000 > 150
}

function correaSVG(c, ancho, xc) {
  const x = xc - ancho / 2
  const defs = `<linearGradient id="gCorrea" x1="0" x2="1"><stop offset="0" stop-color="${c.color}" stop-opacity=".85"/><stop offset=".5" stop-color="${c.color}"/><stop offset="1" stop-color="${c.color}" stop-opacity=".85"/></linearGradient>`
  let extra = ''
  if (c.tipo === 'metal') {
    for (let y = 10; y < 490; y += 26) {
      extra += `<rect x="${x}" y="${y}" width="${ancho}" height="22" rx="4" fill="${c.color}" stroke="#00000033"/>`
      extra += `<rect x="${x + ancho / 3}" y="${y}" width="${ancho / 3}" height="22" fill="#ffffff22"/>`
    }
    return { defs, svg: extra }
  }
  if (c.tipo === 'cadena') return { defs, svg: '' }
  let svg = `<rect x="${x}" y="0" width="${ancho}" height="500" rx="18" fill="url(#gCorrea)"/>`
  if (c.tipo === 'cuero') {
    svg += `<rect x="${x + 6}" y="0" width="${ancho - 12}" height="500" rx="14" fill="none" stroke="#f3e2c7" stroke-opacity=".55" stroke-dasharray="6 6"/>`
    for (const y of [400, 430, 460]) svg += `<circle cx="${xc}" cy="${y}" r="4" fill="#00000066"/>`
  }
  if (c.tipo === 'nato') {
    svg += `<rect x="${xc - 8}" y="0" width="16" height="500" fill="#c9b27c" opacity=".7"/>`
  }
  if (c.tipo === 'liso') {
    for (const y of [395, 425, 455]) svg += `<circle cx="${xc}" cy="${y}" r="4" fill="#00000077"/>`
  }
  return { defs, svg }
}

function marcasHora(cx, cy, radio, colorMarca, romanos = false) {
  let s = ''
  const rom = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI']
  for (let i = 0; i < 12; i++) {
    const a = (i * 30 - 90) * Math.PI / 180
    if (romanos) {
      const x = cx + Math.cos(a) * (radio - 14), y = cy + Math.sin(a) * (radio - 14) + 5
      s += `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" font-size="13" font-family="Georgia,serif" text-anchor="middle" fill="${colorMarca}">${rom[i]}</text>`
    } else {
      const largo = i % 3 === 0 ? 16 : 9
      const x1 = cx + Math.cos(a) * (radio - 4), y1 = cy + Math.sin(a) * (radio - 4)
      const x2 = cx + Math.cos(a) * (radio - 4 - largo), y2 = cy + Math.sin(a) * (radio - 4 - largo)
      s += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${colorMarca}" stroke-width="${i % 3 === 0 ? 5 : 3}" stroke-linecap="round"/>`
    }
  }
  return s
}

function agujas(cx, cy, radio, color, segundero = '#c0392b') {
  const ang = (deg, largo, ancho, col) => {
    const a = (deg - 90) * Math.PI / 180
    return `<line x1="${cx}" y1="${cy}" x2="${(cx + Math.cos(a) * largo).toFixed(1)}" y2="${(cy + Math.sin(a) * largo).toFixed(1)}" stroke="${col}" stroke-width="${ancho}" stroke-linecap="round"/>`
  }
  // 10:09:30, la hora típica de las fotografías de relojes
  return ang(304.5, radio * 0.5, 7, color) + ang(54, radio * 0.75, 5, color) + ang(180, radio * 0.82, 2, segundero) +
    `<circle cx="${cx}" cy="${cy}" r="6" fill="${color}"/><circle cx="${cx}" cy="${cy}" r="2.5" fill="${segundero}"/>`
}

function biselBuceo(cx, cy, rExt, rInt, color) {
  let s = `<circle cx="${cx}" cy="${cy}" r="${rExt}" fill="${color}"/>`
  for (let i = 0; i < 60; i++) {
    const a = (i * 6 - 90) * Math.PI / 180
    const l = i % 5 === 0 ? 12 : 5
    const x1 = cx + Math.cos(a) * (rExt - 3), y1 = cy + Math.sin(a) * (rExt - 3)
    const x2 = cx + Math.cos(a) * (rExt - 3 - l), y2 = cy + Math.sin(a) * (rExt - 3 - l)
    if (i === 0) continue
    s += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#f2f2f2" stroke-width="${i % 5 === 0 ? 3 : 1.5}"/>`
  }
  s += `<polygon points="${cx - 9},${cy - rExt + 4} ${cx + 9},${cy - rExt + 4} ${cx},${cy - rExt + 18}" fill="#f2f2f2"/>`
  s += `<circle cx="${cx}" cy="${cy}" r="${rInt}" fill="none" stroke="#00000055" stroke-width="2"/>`
  return s
}

function generar(r) {
  const caja = colorCaja(r)
  const correa = colorCorrea(r)
  const f = forma(r)
  const esfera = esferas[r.slug] || (f === 'digital' ? '#b9c4a8' : '#1c1c1e')
  const marca = esClaro(esfera) ? '#2b2b2b' : '#f1f1f1'
  const cx = 200, cy = 250
  const anchoCorrea = f === 'rectangular' ? 92 : 112
  const c = correaSVG(correa, anchoCorrea, cx)
  const marcaTexto = `<text x="${cx}" y="${cy - 40}" font-size="${r.marca.length > 10 ? 9 : 13}" font-family="Raleway,Arial,sans-serif" font-weight="600" letter-spacing="${r.marca.length > 10 ? 1 : 2}" text-anchor="middle" fill="${marca}">${r.marca.toUpperCase()}</text>`
  let cuerpo = ''

  if (f === 'redonda' || f === 'octogonal') {
    const buceo = r.categoria === 'buceo' || r.slug === 'seiko-5-sports-skx' || r.slug === 'citizen-promaster-tough'
    const rCaja = 112
    cuerpo += `<rect x="${cx - 70}" y="${cy - 128}" width="140" height="256" rx="20" fill="${caja.sombra}"/>`
    cuerpo += `<rect x="${cx + rCaja - 8}" y="${cy - 14}" width="22" height="28" rx="5" fill="${caja.base}" stroke="${caja.sombra}"/>`
    if (f === 'octogonal') {
      const pts = []
      for (let i = 0; i < 8; i++) {
        const a = (i * 45 + 22.5) * Math.PI / 180
        pts.push(`${(cx + Math.cos(a) * (rCaja + 6)).toFixed(1)},${(cy + Math.sin(a) * (rCaja + 6)).toFixed(1)}`)
      }
      cuerpo += `<polygon points="${pts.join(' ')}" fill="url(#gCaja)" stroke="${caja.sombra}" stroke-width="3"/>`
    } else {
      cuerpo += `<circle cx="${cx}" cy="${cy}" r="${rCaja}" fill="url(#gCaja)" stroke="${caja.sombra}" stroke-width="3"/>`
    }
    let rEsfera = 92
    if (buceo) {
      const colorBisel = r.slug === 'orient-kamasu' ? '#5e0f1b' : r.slug.includes('aquaracer') || r.slug.includes('citizen-promaster-diver') ? '#123468' : '#151515'
      cuerpo += biselBuceo(cx, cy, 104, 82, colorBisel)
      rEsfera = 80
    } else if (r.slug === 'rolex-datejust-41') {
      for (let i = 0; i < 72; i++) {
        const a = (i * 5) * Math.PI / 180
        cuerpo += `<line x1="${(cx + Math.cos(a) * 92).toFixed(1)}" y1="${(cy + Math.sin(a) * 92).toFixed(1)}" x2="${(cx + Math.cos(a) * 104).toFixed(1)}" y2="${(cy + Math.sin(a) * 104).toFixed(1)}" stroke="#ffffff" stroke-opacity=".7" stroke-width="2"/>`
      }
    } else if (r.slug === 'omega-speedmaster-moonwatch' || r.slug === 'tag-heuer-carrera') {
      cuerpo += `<circle cx="${cx}" cy="${cy}" r="104" fill="#111"/><text font-size="8" fill="#ddd" font-family="Arial"><textPath href="#arcoTaqui">TACHYMETRE 500 400 300 200 150 120 100 90 80 70 60</textPath></text>`
    }
    cuerpo += `<circle cx="${cx}" cy="${cy}" r="${rEsfera}" fill="url(#gEsfera)"/>`
    if (r.slug === 'grand-seiko-snowflake' || r.slug === 'seiko-presage-cocktail') {
      for (let i = 0; i < 40; i++) {
        const a = i * 9 * Math.PI / 180
        cuerpo += `<line x1="${cx}" y1="${cy}" x2="${(cx + Math.cos(a) * rEsfera).toFixed(1)}" y2="${(cy + Math.sin(a) * rEsfera).toFixed(1)}" stroke="#ffffff" stroke-opacity=".08" stroke-width="3"/>`
      }
    }
    cuerpo += marcasHora(cx, cy, rEsfera, marca, /longines|bambino|bolsillo/.test(r.slug))
    if (r.slug === 'omega-speedmaster-moonwatch' || r.slug === 'tag-heuer-carrera') {
      for (const [dx, dy] of [[-34, 0], [34, 0], [0, 34]]) {
        cuerpo += `<circle cx="${cx + dx}" cy="${cy + dy}" r="16" fill="none" stroke="${marca}" stroke-opacity=".7"/>`
      }
    }
    if (f === 'octogonal') {
      cuerpo += `<rect x="${cx - 36}" y="${cy + 20}" width="72" height="26" rx="3" fill="#9aa58c"/><text x="${cx}" y="${cy + 39}" font-size="16" font-family="monospace" text-anchor="middle" fill="#1d2418">10:09</text>`
    }
    cuerpo += marcaTexto
    cuerpo += agujas(cx, cy, rEsfera, marca, r.categoria === 'buceo' ? '#e67e22' : '#c0392b')
  } else if (f === 'rectangular') {
    cuerpo += `<rect x="${cx - 62}" y="${cy - 92}" width="124" height="184" rx="10" fill="url(#gCaja)" stroke="${caja.sombra}" stroke-width="3"/>`
    cuerpo += `<rect x="${cx - 48}" y="${cy - 78}" width="96" height="156" rx="4" fill="url(#gEsfera)"/>`
    cuerpo += `<rect x="${cx - 40}" y="${cy - 70}" width="80" height="140" fill="none" stroke="#222" stroke-width="1"/>`
    const rom = [['XII', 0, -58], ['III', 32, 5], ['VI', 0, 66], ['IX', -32, 5]]
    for (const [t, dx, dy] of rom) cuerpo += `<text x="${cx + dx}" y="${cy + dy}" font-size="14" font-family="Georgia,serif" text-anchor="middle" fill="#222">${t}</text>`
    cuerpo += `<circle cx="${cx + 68}" cy="${cy}" r="9" fill="${caja.base}" stroke="${caja.sombra}"/><circle cx="${cx + 72}" cy="${cy}" r="5" fill="#1f4fa8"/>`
    cuerpo += `<text x="${cx}" y="${cy - 25}" font-size="11" font-family="Georgia,serif" text-anchor="middle" fill="#222" letter-spacing="1">${r.marca}</text>`
    cuerpo += agujas(cx, cy, 70, '#1f3f8f', '#1f3f8f')
  } else if (f === 'cuadrada' || f === 'digital' || r.categoria === 'smartwatches') {
    // Pantalla rectangular (smartwatches cuadrados y digitales retro)
    const w = f === 'digital' ? 150 : 168, h = f === 'digital' ? 140 : 196
    cuerpo += `<rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="${f === 'digital' ? 18 : 44}" fill="url(#gCaja)" stroke="${caja.sombra}" stroke-width="3"/>`
    if (f === 'digital') {
      cuerpo += `<rect x="${cx - 50}" y="${cy - 30}" width="100" height="60" rx="4" fill="#b9c4a8" stroke="#555"/>`
      cuerpo += `<text x="${cx}" y="${cy + 12}" font-size="30" font-family="monospace" text-anchor="middle" fill="#1d2418">10:09</text>`
      cuerpo += `<text x="${cx}" y="${cy - 40}" font-size="12" font-family="Arial" font-weight="bold" text-anchor="middle" fill="#e8e8e8">${r.marca.toUpperCase()}</text>`
      for (const [x, y] of [[cx - w / 2 - 6, cy - 35], [cx - w / 2 - 6, cy + 25], [cx + w / 2 - 2, cy - 35], [cx + w / 2 - 2, cy + 25]]) {
        cuerpo += `<rect x="${x}" y="${y}" width="8" height="12" rx="2" fill="${caja.sombra}"/>`
      }
    } else {
      cuerpo += `<rect x="${cx - w / 2 + 10}" y="${cy - h / 2 + 10}" width="${w - 20}" height="${h - 20}" rx="36" fill="#050505"/>`
      cuerpo += `<text x="${cx}" y="${cy - 10}" font-size="44" font-family="Arial" font-weight="300" text-anchor="middle" fill="#fff">10:09</text>`
      cuerpo += `<circle cx="${cx - 40}" cy="${cy + 40}" r="16" fill="none" stroke="#e74c3c" stroke-width="5" stroke-dasharray="70 30"/>`
      cuerpo += `<circle cx="${cx}" cy="${cy + 40}" r="16" fill="none" stroke="#2ecc71" stroke-width="5" stroke-dasharray="55 45"/>`
      cuerpo += `<circle cx="${cx + 40}" cy="${cy + 40}" r="16" fill="none" stroke="#3498db" stroke-width="5" stroke-dasharray="85 15"/>`
      cuerpo += `<rect x="${cx + w / 2 - 2}" y="${cy - 40}" width="12" height="28" rx="5" fill="${caja.base}"/>`
    }
  } else if (f === 'bolsillo') {
    cuerpo += `<path d="M ${cx} ${cy - 125} C ${cx - 80} ${cy - 200}, ${cx - 140} ${cy - 160}, ${cx - 150} ${cy - 250}" stroke="${caja.base}" stroke-width="6" fill="none" stroke-dasharray="10 4"/>`
    cuerpo += `<circle cx="${cx}" cy="${cy - 132}" r="16" fill="none" stroke="${caja.base}" stroke-width="6"/>`
    cuerpo += `<rect x="${cx - 9}" y="${cy - 130}" width="18" height="20" rx="4" fill="${caja.base}"/>`
    cuerpo += `<circle cx="${cx}" cy="${cy}" r="118" fill="url(#gCaja)" stroke="${caja.sombra}" stroke-width="3"/>`
    cuerpo += `<circle cx="${cx}" cy="${cy}" r="100" fill="url(#gEsfera)"/>`
    for (let i = 1; i <= 12; i++) {
      const a = (i * 30 - 90) * Math.PI / 180
      cuerpo += `<text x="${(cx + Math.cos(a) * 82).toFixed(1)}" y="${(cy + Math.sin(a) * 82 + 6).toFixed(1)}" font-size="16" font-family="Georgia,serif" text-anchor="middle" fill="#2b2b2b">${i}</text>`
    }
    cuerpo += `<circle cx="${cx}" cy="${cy + 45}" r="18" fill="none" stroke="#2b2b2b" stroke-opacity=".6"/>`
    cuerpo += agujas(cx, cy, 90, '#1b1b1b', '#1b1b1b')
  }

  const fondo = '#f6f4ef'
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500" role="img" aria-label="${r.marca} ${r.nombre.replace(/"/g, '')}">
<defs>
${c.defs}
<radialGradient id="gCaja" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="${caja.luz}"/><stop offset=".55" stop-color="${caja.base}"/><stop offset="1" stop-color="${caja.sombra}"/></radialGradient>
<radialGradient id="gEsfera" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="${esfera}" stop-opacity=".85"/><stop offset="1" stop-color="${esfera}"/></radialGradient>
<path id="arcoTaqui" d="M ${cx - 97} ${cy} A 97 97 0 1 1 ${cx + 97} ${cy}"/>
</defs>
<rect width="400" height="500" fill="${fondo}"/>
${f === 'bolsillo' ? '' : c.svg}
${cuerpo}
</svg>
`
}

let n = 0
for (const archivo of readdirSync(dirRelojes).filter(a => a.endsWith('.json'))) {
  const reloj = JSON.parse(readFileSync(join(dirRelojes, archivo), 'utf8'))
  writeFileSync(join(dirSalida, `${reloj.slug}.svg`), generar(reloj))
  n++
}
console.log(`${n} imágenes generadas en ${dirSalida}`)
