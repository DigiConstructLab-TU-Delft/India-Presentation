<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, unref, watch } from 'vue'
import { useSlideContext } from '@slidev/client'
import { asset } from '../composables/asset'

// From an inundation raster to a planning answer, as in the original CIB W78 slide: a 640 x 400 m block of Rotterdam-Zuid,
// scenario 6, built up one click at a time:
//   0 raster cells  ->  1 + building footprints  ->  2 buildings coloured wet / dry  ->  3 knowledge graph for one building
//   ->  4 the SPARQL query, typed out  ->  5 the answer, counting up.
// The slide declares 5 clicks in its frontmatter.
const { $clicks, $nav, $page, $renderContext } = useSlideContext() as any
const step = computed(() => Math.min(Number(unref($clicks)) || 0, 6))
const active = computed(() => unref($renderContext) === 'slide' && unref($nav).currentPage === unref($page))

interface Building { id: number; p: number[][]; d: number; dmg: number }
interface Block { w: number; h: number; cell: number; cells: number[][]; buildings: Building[] }
const block = ref<Block | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const nf = new Intl.NumberFormat('en-US')

// Layout in one 1000 x 480 frame: map on the left (560 x 350 at 20,40), graph / query / answer on the right.
const MAP = { x: 20, y: 40, w: 560, h: 350 }
const S = 2 // canvas pixels per metre (canvas is 1280 x 800)
const U = MAP.w / 640 // frame units per metre

const area = (p: number[][]) => Math.abs(p.reduce((a, q, i) => { const r = p[(i + 1) % p.length]; return a + q[0] * r[1] - r[0] * q[1] }, 0) / 2)
const centre = (p: number[][]) => [p.reduce((a, q) => a + q[0], 0) / p.length, p.reduce((a, q) => a + q[1], 0) / p.length]
// the featured building: a sizeable wet one at mid-range depth, closest to the block centre
const feature = computed(() => {
  const B = block.value
  if (!B) return null
  const cands = B.buildings.filter((b) => b.d >= 0.2 && area(b.p) > 60)
  const dist = (b: Building) => { const [x, y] = centre(b.p); return Math.hypot(x - B.w * 0.62, y - B.h * 0.45) }
  return cands.sort((a, b) => dist(a) - dist(b))[0] || B.buildings[0]
})
const wet = computed(() => (block.value ? block.value.buildings.filter((b) => b.d > 0.1).length : 0))

// depth ramp on the dark map (as in the original), 0.1 m to 1.2 m+
const GLOW: [number, number[]][] = [[0.1, [103, 232, 249]], [0.3, [56, 189, 248]], [0.6, [59, 130, 246]], [1.2, [99, 102, 241]]]
function glow(d: number) {
  if (d <= GLOW[0][0]) return GLOW[0][1]
  for (let k = 1; k < GLOW.length; k++) {
    if (d <= GLOW[k][0]) {
      const f = (d - GLOW[k - 1][0]) / (GLOW[k][0] - GLOW[k - 1][0])
      return GLOW[k - 1][1].map((c, j) => Math.round(c + (GLOW[k][1][j] - c) * f))
    }
  }
  return GLOW[GLOW.length - 1][1]
}

// drawing state eases towards the target of the current step
const st = { cell: 0, outline: 0, fill: 0, dim: 0 }
const tgt = { ...st }
let raf = 0
function targets() {
  const s = step.value
  Object.assign(tgt, { cell: s <= 1 ? 1 : 0, outline: s >= 1 ? 1 : 0, fill: s >= 2 ? 1 : 0, dim: s === 3 ? 1 : s >= 4 ? 0.6 : 0 })
}
function draw() {
  const B = block.value, cv = canvas.value, feat = feature.value
  if (!B || !cv) return
  const ctx = cv.getContext('2d')!
  for (const k of Object.keys(st) as (keyof typeof st)[]) st[k] += (tgt[k] - st[k]) * 0.08
  ctx.clearRect(0, 0, cv.width, cv.height)
  ctx.fillStyle = '#0a1426'
  ctx.fillRect(0, 0, cv.width, cv.height)
  if (st.cell > 0.01) {
    const c = B.cell * S
    for (const [x, y, h] of B.cells) {
      if (h < 0.05) continue
      const [r, g, b] = glow(h)
      ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(0.95, 0.15 + h) * st.cell})`
      ctx.fillRect(x * S - c / 2, y * S - c / 2, c + 0.5, c + 0.5)
    }
  }
  for (const b of B.buildings) {
    ctx.beginPath()
    b.p.forEach(([x, y], i) => (i ? ctx.lineTo(x * S, y * S) : ctx.moveTo(x * S, y * S)))
    ctx.closePath()
    const isFeat = b === feat
    const dim = isFeat ? 1 : 1 - 0.75 * st.dim
    if (st.fill > 0.01) {
      if (b.d > 0.1) { const [r, g, bl] = glow(b.d); ctx.fillStyle = `rgba(${r},${g},${bl},${st.fill * dim})` }
      else ctx.fillStyle = `rgba(30,41,59,${st.fill * dim})`
      ctx.fill()
    }
    if (st.outline > 0.01) { ctx.strokeStyle = `rgba(226,232,240,${0.55 * st.outline * dim})`; ctx.lineWidth = 1.5; ctx.stroke() }
    if (isFeat && st.dim > 0.05) { ctx.strokeStyle = `rgba(245,181,68,${st.dim})`; ctx.lineWidth = 5; ctx.stroke() }
  }
}
function loop() {
  draw()
  const settled = (Object.keys(st) as (keyof typeof st)[]).every((k) => Math.abs(tgt[k] - st[k]) < 0.004)
  raf = settled ? 0 : requestAnimationFrame(loop)
}
function kick() { if (!raf) raf = requestAnimationFrame(loop) }

// the SPARQL query (Listing 1), typed out with its markup intact
const Q = `<span class="k">PREFIX</span> rht:  &lt;https://resilienthydrotwin.org/ontology#&gt;
<span class="k">PREFIX</span> inst: &lt;…/ontology/instances#&gt;

<span class="k">SELECT</span> (<span class="k">COUNT</span>(?b) <span class="k">AS</span> ?flooded)
       (<span class="k">SUM</span>(?dmg) <span class="k">AS</span> ?damage)
<span class="k">WHERE</span> {
  ?imp a <span class="p">rht:FloodImpact</span> ;
       <span class="p">rht:inScenario</span>  <span class="v">inst:scenario_rotterdam_6_…</span> ;
       <span class="p">rht:onBuilding</span>  ?b ;
       <span class="p">rht:inundationDepth</span> ?d ;
       <span class="p">rht:damageTotal</span> ?dmg .
  <span class="k">FILTER</span>(?d &gt; <span class="v">0.1</span>) }`
const codeHtml = ref('')
let typeTimer = 0
function typeCode(on: boolean) {
  clearInterval(typeTimer)
  if (!on) { codeHtml.value = ''; return }
  const parts = Q.split(/(<[^>]+>|&[a-z]+;)/)
  let pi = 0, ci = 0, out = ''
  typeTimer = window.setInterval(() => {
    for (let k = 0; k < 6 && pi < parts.length; k++) {
      const p = parts[pi]
      if (p.startsWith('<') || p.startsWith('&')) { out += p; pi++; continue }
      if (ci < p.length) out += p[ci++]
      else { pi++; ci = 0 }
    }
    codeHtml.value = out + '<span class="cur">▍</span>'
    if (pi >= parts.length) { clearInterval(typeTimer); codeHtml.value = out }
  }, 16)
}

// the answer counts up when the last step arrives
const ans = ref({ n: 0, eur: 0 })
let countRaf = 0
function countUp() {
  cancelAnimationFrame(countRaf)
  const t0 = performance.now()
  const tick = (now: number) => {
    const f = Math.min(1, (now - t0) / 1400), e = 1 - Math.pow(1 - f, 3)
    ans.value = { n: 16265 * e, eur: 745.96 * e }
    if (f < 1) countRaf = requestAnimationFrame(tick)
  }
  countRaf = requestAnimationFrame(tick)
}

let last = -1
watch([step, active], () => {
  targets()
  const s = step.value
  if (!active.value) {
    Object.assign(st, tgt); draw()
    clearInterval(typeTimer)
    codeHtml.value = s >= 4 ? Q : ''
    ans.value = s === 5 ? { n: 16265, eur: 745.96 } : { n: 0, eur: 0 }
    last = s
    return
  }
  kick()
  if (s >= 4 && !(last >= 4)) typeCode(true)
  if (s < 4) typeCode(false)
  if (s === 5 && last !== 5) countUp()
  if (s !== 5) { cancelAnimationFrame(countRaf); ans.value = { n: 0, eur: 0 } }
  last = s
})
onMounted(async () => {
  const r = await fetch(asset('/figures/rht/graph_block.json'))
  block.value = await r.json()
  targets()
  Object.assign(st, tgt)
  requestAnimationFrame(draw)
  if (step.value >= 4) codeHtml.value = Q
  if (step.value === 5) ans.value = { n: 16265, eur: 745.96 }
  last = step.value
})
onBeforeUnmount(() => { cancelAnimationFrame(raf); cancelAnimationFrame(countRaf); clearInterval(typeTimer) })

const heads = ['A raster is hard to read…', '…plus the city model…', '…to impacts per building…', '…to a knowledge graph…', '…to a planning answer', '…to a planning answer', '…to a planning answer']
const caption = computed(() => {
  const n = nf.format(block.value?.buildings.length ?? 0)
  return [
    '<b>The simulation output:</b> water depth in 25 m cells. Which buildings are flooded, and what does it cost? Unless you are an expert, <b>the raster can’t say</b>.',
    `<b>City model:</b> ${n} footprints (OSM, enriched with the BAG registry), with the same IDs in every scenario.`,
    `<b>Delft-FIAT</b> samples the depth at each building and applies JRC depth–damage functions: <b>${nf.format(wet.value)}</b> of ${n} buildings are wet.`,
    'Each wet building → an <b>rht:FloodImpact</b> (a SOSA observation) linked to the building, the scenario and its provenance. The raw depth is stored, so the threshold is a query parameter.',
    'A planning question becomes a <b>graph query</b>: the same building entities across every scenario.',
    'A planning question becomes a <b>graph query</b>: the same building entities across every scenario.',
    'A planning question becomes a <b>graph query</b>: the same building entities across every scenario.',
  ][step.value]
})
const legend = computed(() => (step.value >= 2 ? 'Delft-FIAT depth per building · grey = dry' : 'SFINCS max depth, 25 m cells'))

// knowledge graph for the featured building, in frame units
const nodes = computed(() => {
  const f = feature.value
  const id = f ? f.id : 0
  const d = f ? f.d.toFixed(2) : '0.00'
  const dmg = f ? nf.format(f.dmg) : '0'
  return [
    { k: 'bld', x: 672, y: 92, t: `inst:rotterdam_building_${id}`, s: 'a geo:Feature · WKT footprint', c: '#e2e8f0' },
    { k: 'imp', x: 800, y: 196, t: `inst:impact_s6_${id}`, s: 'a rht:FloodImpact, sosa:Observation', c: '#22d3ee' },
    { k: 'scn', x: 800, y: 340, t: 'inst:scenario_rotterdam_6', s: 'hazard + interventions + author', c: '#f5b544' },
    { k: 'dep', x: 650, y: 290, t: `${d} m`, s: 'xsd:decimal', c: '#fde68a', lit: true },
    { k: 'dmg', x: 940, y: 290, t: `€ ${dmg}`, s: 'xsd:decimal', c: '#fda4af', lit: true },
    { k: 'bag', x: 928, y: 92, t: 'BAG pand', s: 'year · status · use', c: '#a7f3d0' },
    { k: 'prv', x: 800, y: 420, t: 'model configuration', s: 'prov:Entity — grid, sources, solver', c: '#c4b5fd' },
  ]
})
const edges: [string, string, string][] = [['imp', 'bld', 'rht:onBuilding'], ['imp', 'scn', 'rht:inScenario'], ['imp', 'dep', 'rht:inundationDepth'], ['imp', 'dmg', 'rht:damageTotal'], ['bld', 'bag', 'rht:matchesPand'], ['scn', 'prv', 'prov:used']]
const at = (k: string) => nodes.value.find((n) => n.k === k)!
const nodeW = (n: { t: string; s: string }) => Math.max(n.t.length * 6.1, n.s.length * 4.9) + 24
// connector from the highlighted building on the map to its graph node
const connector = computed(() => {
  const f = feature.value
  if (!f) return ''
  const [cx, cy] = centre(f.p)
  const bx = MAP.x + cx * U, by = MAP.y + cy * U
  const n = at('bld')
  const ex = n.x - nodeW(n) / 2
  return `M${bx} ${by} C ${bx + 110} ${by - 70}, ${ex - 80} ${n.y}, ${ex} ${n.y}`
})
</script>

<template>
  <div>
    <h1 class="head">{{ heads[step] }}</h1>
    <div class="frame">
      <div class="legend"><span>0.1 m</span><i></i><span>1.2 m+</span><em>{{ legend }}</em></div>
      <canvas ref="canvas" width="1280" height="800" class="map"></canvas>
      <p class="cap" v-html="caption"></p>

      <svg viewBox="0 0 1000 480" class="kg" :class="{ on: step === 3 }" aria-hidden="true">
        <path :d="connector" class="conn" fill="none" stroke="#f5b544" stroke-width="2" stroke-dasharray="400" />
        <g v-for="(e, i) in edges" :key="e[0] + e[1]">
          <line :x1="at(e[0]).x" :y1="at(e[0]).y" :x2="at(e[1]).x" :y2="at(e[1]).y" class="edge" :style="{ '--d': `${0.3 + i * 0.18}s` }" stroke="#475569" stroke-width="2" stroke-dasharray="400" />
          <text :x="(at(e[0]).x + at(e[1]).x) / 2" :y="(at(e[0]).y + at(e[1]).y) / 2 - 5" class="el" :style="{ '--d': `${0.6 + i * 0.18}s` }">{{ e[2] }}</text>
        </g>
        <g v-for="(n, i) in nodes" :key="n.k" class="node" :style="{ '--x': `${n.x}px`, '--y': `${n.y}px`, '--d': `${0.1 + i * 0.12}s` }">
          <rect :x="-nodeW(n) / 2" y="-22" :width="nodeW(n)" height="44" :rx="n.lit ? 8 : 22" fill="#0b1628" :stroke="n.c" stroke-width="2" />
          <text y="-3" class="nt" :fill="n.c">{{ n.t }}</text>
          <text y="14" class="ns">{{ n.s }}</text>
        </g>
      </svg>

      <pre class="code" :class="{ on: step === 4 || step === 5 }" v-html="codeHtml"></pre>
      <div class="answer" :class="{ on: step === 5 }">
        <div class="card"><div class="v">{{ nf.format(Math.round(ans.n)) }}</div><div class="l">buildings flooded &gt; 0.1 m</div></div>
        <div class="card"><div class="v rose">€{{ ans.eur.toFixed(0) }}M</div><div class="l">estimated damage</div></div>
      </div>
      <div class="klayer" :class="{ on: step === 6 }">
        <h3>The knowledge layer behind the planning interface</h3>
        <p>In the prepare phase, stakeholders need more than maps. How can simulation outputs be kept as <b>queryable, traceable records</b> that they can compare, question and revisit?</p>
        <ul>
          <li>scenarios as stored objects with provenance</li>
          <li>per-building outcomes in a knowledge graph</li>
          <li>the twin as a <b>boundary object</b> between experts and stakeholders</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.head { margin: 0 0 4px !important; }
/* everything is positioned in a 1000 x 480 frame */
.frame { position: relative; width: 100%; aspect-ratio: 1000 / 480; }
.frame > * { position: absolute; }
.legend { left: 2%; top: 0; display: flex; align-items: center; gap: 6px; color: #64727a; font-size: var(--fs-micro); }
.legend i { width: 90px; height: 6px; border-radius: 3px; background: linear-gradient(90deg, #67e8f9, #38bdf8, #3b82f6, #6366f1); }
.legend em { margin-left: 8px; font-style: normal; color: #40525a; }
.map { left: 2%; top: 8.33%; width: 56%; height: auto; border-radius: 6px; box-shadow: 0 1px 6px rgba(1, 1, 1, 0.18); }
.cap { left: 2%; top: 83.5%; width: 56%; margin: 0 !important; color: #40525a; font-size: var(--fs-small) !important; line-height: 1.4 !important; }
.kg { left: 0; top: 0; width: 100%; height: 100%; pointer-events: none; }
.conn { stroke-dashoffset: 400; opacity: 0; transition: stroke-dashoffset 0.8s ease, opacity 0.4s; }
.kg.on .conn { stroke-dashoffset: 0; opacity: 1; transition-delay: 0.05s; }
.edge { stroke-dashoffset: 400; transition: stroke-dashoffset 0.8s ease; }
.kg.on .edge { stroke-dashoffset: 0; transition-delay: var(--d); }
.el { fill: #64727a; font-size: 8.5px; text-anchor: middle; font-family: Menlo, Consolas, monospace; opacity: 0; transition: opacity 0.5s ease; }
.kg.on .el { opacity: 1; transition-delay: var(--d); }
.node { opacity: 0; transform: translate(var(--x), var(--y)) scale(0.6); transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); }
.kg.on .node { opacity: 1; transform: translate(var(--x), var(--y)) scale(1); transition-delay: var(--d); }
.nt { font-size: 10.5px; font-weight: 700; text-anchor: middle; font-family: Menlo, Consolas, monospace; }
.ns { fill: #94a3b8; font-size: 8.4px; text-anchor: middle; }
.code { left: 61%; top: 8.33%; width: 37.5%; margin: 0; padding: 11px 13px; border: 1px solid #1e293b; border-radius: 10px; background: rgba(2, 6, 14, 0.92); color: #cbd5e1; font: 0.34em/1.6 Menlo, Consolas, monospace; white-space: pre; opacity: 0; transition: opacity 0.5s; min-height: 48%; }
.code.on { opacity: 1; }
.code :deep(.k) { color: #c084fc; }
.code :deep(.p) { color: #7dd3fc; }
.code :deep(.v) { color: #fde68a; }
.code :deep(.cur) { color: #22d3ee; }
.answer { left: 61%; top: 68%; width: 37.5%; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; opacity: 0; transition: opacity 0.5s; }
.answer.on { opacity: 1; }
.klayer { left: 61%; top: 8.33%; width: 37.5%; height: 82.4%; display: flex; flex-direction: column; justify-content: space-between; padding-left: 18px; border-left: 4px solid #00aeef; opacity: 0; transform: translateY(8px); transition: opacity 0.5s ease, transform 0.5s ease; pointer-events: none; }
.klayer.on { opacity: 1; transform: none; }
.klayer h3 { margin: 0; color: #010101; font-size: 1.15em; line-height: 1.15; }
.klayer p { margin: 0 !important; color: #40525a; font-size: var(--fs-lead) !important; line-height: 1.45 !important; }
.klayer ul { margin: 0; padding-left: 1.2em; list-style: disc; display: flex; flex-direction: column; gap: 22px; }
.klayer li { color: #1d2830; font-size: var(--fs-lead) !important; line-height: 1.4 !important; }
.klayer li::marker { color: #00aeef; }
.card { padding: 9px 12px; border: 1px solid #d9e2e6; border-radius: 10px; background: #fff; }
.card .v { color: #007fa8; font-size: 1.15em; font-weight: 800; line-height: 1; }
.card .v.rose { color: #d6345a; }
.card .l { margin-top: 4px; color: #40525a; font-size: var(--fs-micro); }
</style>
