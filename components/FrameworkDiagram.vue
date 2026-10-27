<script setup lang="ts">
// The participation-to-implementation framework, drawn as vector graphics so it stays sharp at any size.
// It flows left to right, as in the original figure: 1 Input -> 2 Modelling and analysis -> 3 Implementation,
// with a monitoring feedback loop underneath. Each stage is tall so that the figure fits a narrow column.
const BLUE = '#1e7be0'

// boxes in the modelling panel: position, size, pictogram and text lines (bold title lines, then detail lines)
const boxes = [
  { k: 'flood', x: 316, y: 64, w: 176, h: 104, icon: 'wave', title: ['Flood', 'modelling'], sub: ['Compound flood', 'simulator'] },
  { k: 'traffic', x: 508, y: 64, w: 176, h: 104, icon: 'car', title: ['Traffic', 'modelling'], sub: ['Network and', 'traffic impacts'] },
  { k: 'build', x: 316, y: 196, w: 176, h: 104, icon: 'building', title: ['Impact on', 'buildings'], sub: ['Physical and', 'functional', 'impacts'] },
  { k: 'timp', x: 508, y: 196, w: 176, h: 104, icon: 'road', title: ['Traffic', 'impacts'], sub: ['Accessibility', 'and evacuation', 'capacity'] },
]
// city blocks of the input illustration: x, y (front-face top-left), width, height, depth of the roof
const blocks = [
  [60, 352, 34, 26, 8], [104, 340, 30, 22, 7], [150, 360, 40, 24, 9], [206, 346, 28, 30, 8], [250, 362, 36, 22, 8],
  [300, 334, 24, 44, 8], [338, 352, 52, 24, 9], [404, 340, 34, 30, 8], [76, 388, 36, 18, 7], [128, 392, 30, 16, 6],
  [372, 384, 40, 20, 8], [426, 372, 30, 24, 7],
]
const trees = [[44, 366], [186, 330], [232, 392], [322, 396], [452, 358], [96, 372], [276, 340]]
// skyline of the implementation illustration: x, width, height, colour
const skyline = [
  [1190, 30, 70, '#b9d3ea'], [1222, 26, 100, '#a3c4e1'], [1250, 34, 58, '#c3d9ee'], [1288, 24, 120, '#9bbfdc'],
  [1314, 38, 80, '#b2cfe8'], [1354, 28, 104, '#a3c4e1'], [1384, 30, 64, '#c3d9ee'], [1488, 28, 90, '#b2cfe8'], [1518, 34, 70, '#c3d9ee'], [1554, 30, 96, '#a3c4e1'],
]
</script>

<template>
  <svg viewBox="0 0 1000 575" class="fw" role="img" aria-label="Framework, flowing left to right: 1 Input (participatory workshops for selecting adaptation scenarios with digital twins), 2 Modelling and analysis (flood modelling, traffic modelling, impact on buildings, traffic impacts, evacuation modelling and analysis, policy analysis based on resilience scores), 3 Implementation (prioritised adaptation measures: design, planning and implementation), with monitoring and feedback of real-world data returning to the input.">
    <defs>
      <marker id="fw-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto">
        <path d="M0 0 L10 5 L0 10 Z" :fill="BLUE" />
      </marker>
      <clipPath id="fw-in"><rect x="36" y="196" width="430" height="216" rx="14" /></clipPath>
      <clipPath id="fw-out"><rect x="1187" y="232" width="400" height="178" rx="14" /></clipPath>
      <linearGradient id="fw-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d7ecfb" /><stop offset="1" stop-color="#f0f8fd" /></linearGradient>

      <!-- pictograms, drawn around (0,0) in a 40 x 40 box -->
      <g id="fw-wave">
        <path d="M-18 -2 C-14 -13 -2 -15 5 -7 C1 -7 -1 -3 3 0 C9 3 14 0 18 -5 V14 H-18 Z" fill="#1e88e5" />
        <path d="M-18 6 q9 -7 18 0 t18 0 M-18 12 q9 -7 18 0 t18 0" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" />
      </g>
      <g id="fw-car">
        <path d="M-19 8 V-1 L-13 -10 H13 L19 -1 V8 Z" fill="#0d47a1" />
        <path d="M-10 -2 L-6.5 -8 H6.5 L10 -2 Z" fill="#fff" />
        <circle cx="-11" cy="9" r="4.5" fill="#0d47a1" stroke="#fff" stroke-width="1.5" /><circle cx="11" cy="9" r="4.5" fill="#0d47a1" stroke="#fff" stroke-width="1.5" />
      </g>
      <g id="fw-building">
        <rect x="-11" y="-19" width="22" height="38" fill="#1565c0" />
        <path d="M-6 -13h4v4h-4zM2 -13h4v4h-4zM-6 -5h4v4h-4zM2 -5h4v4h-4zM-6 3h4v4h-4zM2 3h4v4h-4zM-3 11h6v8h-6z" fill="#fff" />
      </g>
      <g id="fw-road">
        <path d="M-6 -19 H6 L19 19 H-19 Z" fill="#1565c0" />
        <path d="M0 -15v6M0 -3v7M0 11v6" stroke="#fff" stroke-width="3" stroke-linecap="round" />
      </g>
      <g id="fw-clip">
        <rect x="-13" y="-16" width="26" height="33" rx="3.5" fill="none" stroke="#0d47a1" stroke-width="3" />
        <rect x="-6" y="-20" width="12" height="8" rx="2.5" fill="#0d47a1" />
        <path d="M-7 -3h14M-7 4h14M-7 11h8" stroke="#0d47a1" stroke-width="2.6" stroke-linecap="round" />
      </g>
      <g id="fw-bars">
        <rect x="-18" y="2" width="9" height="15" fill="#1e88e5" /><rect x="-6" y="-6" width="9" height="23" fill="#1565c0" /><rect x="6" y="-16" width="9" height="33" fill="#0d47a1" />
      </g>
    </defs>

    <!-- 1 Input -->
    <rect x="8" y="10" width="256" height="468" rx="26" fill="#fdf1d6" />
    <rect x="22" y="20" width="124" height="36" rx="18" fill="#f8c555" />
    <text x="42" y="45" class="pill">1. Input</text>
    <text x="24" y="98" class="h1">Participatory</text>
    <text x="24" y="126" class="h1">workshops</text>
    <text x="24" y="158" class="h2">for selecting</text>
    <text x="24" y="180" class="h2">adaptation scenarios</text>
    <text x="24" y="202" class="h2">with digital twins</text>
    <!-- illustration: a stylised city on a river with four pinned themes -->
    <g transform="translate(14,262) scale(0.58) translate(-36,-196)">
      <g clip-path="url(#fw-in)">
        <rect x="36" y="196" width="430" height="216" fill="#fdf6e6" />
        <polygon points="36,372 190,318 466,336 466,412 36,412" fill="#e8edf1" />
        <path d="M36 392 C110 372 190 396 280 380 S420 356 466 352 V376 C410 392 330 410 250 408 S96 420 36 414 Z" fill="#8ccbee" />
        <path d="M60 402 C140 392 220 404 300 394" fill="none" stroke="#c3e5f7" stroke-width="3" />
        <g v-for="(b, i) in blocks" :key="i">
          <polygon :points="`${b[0]},${b[1]} ${b[0] + b[4]},${b[1] - b[4] * 0.6} ${b[0] + b[2] + b[4]},${b[1] - b[4] * 0.6} ${b[0] + b[2]},${b[1]}`" fill="#ffffff" />
          <rect :x="b[0]" :y="b[1]" :width="b[2]" :height="b[3]" fill="#d3dce4" />
          <rect :x="b[0] + b[2]" :y="b[1] - b[4] * 0.6" :width="b[4]" :height="b[3]" fill="#b9c6d1" />
        </g>
        <g v-for="(t, i) in trees" :key="'t' + i"><circle :cx="t[0]" :cy="t[1]" r="9" fill="#6bbf5d" /><circle :cx="t[0] - 3" :cy="t[1] - 3" r="5" fill="#8ad276" /></g>
      </g>
      <g v-for="c in [{ x: 58, y: 214, k: 'home' }, { x: 158, y: 194, k: 'wave' }, { x: 266, y: 194, k: 'tree' }, { x: 358, y: 204, k: 'build' }]" :key="c.k">
        <line :x1="c.x + 40" :y1="c.y + 68" :x2="c.x + 40" :y2="c.k === 'home' ? 342 : 330" stroke="#0d47a1" stroke-width="3" />
        <circle :cx="c.x + 40" :cy="c.k === 'home' ? 342 : 330" r="6" fill="#0d47a1" />
        <rect :x="c.x" :y="c.y" width="80" height="68" rx="12" fill="#fff" stroke="#d8e2ea" stroke-width="2" />
        <g :transform="`translate(${c.x + 40},${c.y + 34})`">
          <template v-if="c.k === 'home'">
            <path d="M-18 4 L0 -14 L18 4 V18 H-18 Z" fill="#1565c0" /><rect x="-5" y="6" width="10" height="12" fill="#fff" />
            <rect x="10" y="-22" width="14" height="18" rx="5" fill="#fff" stroke="#1e88e5" stroke-width="2.4" /><path d="M17 -18 q4 5 0 9 q-4 -4 0 -9z" fill="#1e88e5" />
          </template>
          <use v-else-if="c.k === 'wave'" href="#fw-wave" transform="scale(1.15)" />
          <template v-else-if="c.k === 'tree'">
            <rect x="-3" y="6" width="6" height="14" fill="#8a5a2b" /><circle cx="0" cy="-4" r="15" fill="#3f9d3c" /><circle cx="-6" cy="-8" r="7" fill="#5fb857" />
          </template>
          <template v-else>
            <rect x="-16" y="-4" width="20" height="24" fill="#1565c0" /><path d="M-11 0h4v4h-4zM-3 0h4v4h-4zM-11 8h4v4h-4zM-3 8h4v4h-4z" fill="#fff" />
            <path d="M6 -4 L22 -18 M14 -18 H22 V-10" fill="none" stroke="#1565c0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
          </template>
        </g>
      </g>
    </g>
    <path d="M266 244 H296" :stroke="BLUE" stroke-width="5" fill="none" marker-end="url(#fw-arrow)" />

    <!-- 2 Modelling and analysis -->
    <rect x="300" y="10" width="400" height="468" rx="26" fill="#dff3d9" />
    <rect x="314" y="20" width="294" height="34" rx="17" fill="#b6e2a4" />
    <text x="332" y="44" class="pill">2. Modelling and analysis</text>
    <g v-for="b in boxes" :key="b.k">
      <rect :x="b.x" :y="b.y" :width="b.w" :height="b.h" rx="12" fill="#fff" />
      <circle :cx="b.x + 27" :cy="b.y + 30" r="21" fill="#d9eefb" />
      <g :transform="`translate(${b.x + 27},${b.y + 30}) scale(0.75)`"><use :href="`#fw-${b.icon}`" /></g>
      <text v-for="(l, i) in b.title" :key="'t' + i" :x="b.x + 56" :y="b.y + 26 + i * 20" class="bt">{{ l }}</text>
      <text v-for="(l, i) in b.sub" :key="'s' + i" :x="b.x + 12" :y="b.y + 72 + i * 15" class="bs">{{ l }}</text>
    </g>
    <rect x="316" y="330" width="368" height="72" rx="12" fill="#fff" />
    <circle cx="346" cy="366" r="22" fill="#d9eefb" /><g transform="translate(346,366) scale(0.78)"><use href="#fw-clip" /></g>
    <text x="382" y="358" class="bt">Evacuation modelling and analysis</text>
    <text x="382" y="381" class="bs">Evacuation routes, timing and capacity</text>
    <rect x="316" y="416" width="368" height="54" rx="12" fill="#fff" />
    <circle cx="346" cy="443" r="22" fill="#d9eefb" /><g transform="translate(346,443) scale(0.78)"><use href="#fw-bars" /></g>
    <text x="382" y="438" class="bt">Policy analysis on resilience scores</text>
    <text x="382" y="458" class="bs">Compare options and prioritise interventions</text>
    <!-- flows inside panel 2 -->
    <path d="M494 116 H504" :stroke="BLUE" stroke-width="4" fill="none" marker-end="url(#fw-arrow)" />
    <path d="M404 170 V192" :stroke="BLUE" stroke-width="4" fill="none" marker-end="url(#fw-arrow)" />
    <path d="M596 170 V192" :stroke="BLUE" stroke-width="4" fill="none" marker-end="url(#fw-arrow)" />
    <path d="M404 302 V312 H596 V302 M500 312 V326" :stroke="BLUE" stroke-width="4" fill="none" stroke-linejoin="round" marker-end="url(#fw-arrow)" />
    <path d="M500 404 V412" :stroke="BLUE" stroke-width="4" fill="none" marker-end="url(#fw-arrow)" />
    <path d="M702 244 H732" :stroke="BLUE" stroke-width="5" fill="none" marker-end="url(#fw-arrow)" />

    <!-- 3 Implementation -->
    <rect x="736" y="10" width="256" height="468" rx="26" fill="#cfe8fa" />
    <rect x="750" y="20" width="204" height="36" rx="18" fill="#8ccbef" />
    <text x="768" y="45" class="pill">3. Implementation</text>
    <text x="752" y="98" class="h1">Prioritised</text>
    <text x="752" y="126" class="h1">adaptation</text>
    <text x="752" y="154" class="h1">measures</text>
    <text x="752" y="186" class="h2">Design, planning</text>
    <text x="752" y="208" class="h2">and implementation</text>
    <g transform="translate(750,290) scale(0.58) translate(-1187,-232)">
      <g clip-path="url(#fw-out)">
        <rect x="1187" y="232" width="400" height="178" fill="url(#fw-sky)" />
        <ellipse cx="1260" cy="262" rx="38" ry="9" fill="#fff" opacity="0.9" /><ellipse cx="1500" cy="248" rx="44" ry="10" fill="#fff" opacity="0.9" />
        <rect v-for="(s, i) in skyline" :key="i" :x="s[0]" :y="388 - s[2]" :width="s[1]" :height="s[2] + 10" :fill="s[3]" />
        <path d="M1535 388 V232 M1505 244 H1580 M1535 232 L1505 244 M1580 244 V262" fill="none" stroke="#4d6a80" stroke-width="3" />
        <rect x="1290" y="318" width="120" height="70" fill="#fff" /><path d="M1296 328h108M1296 342h108M1296 356h108M1296 370h108" stroke="#7fb4e0" stroke-width="5" />
        <rect x="1420" y="338" width="100" height="50" fill="#f4f9fd" /><path d="M1426 348h88M1426 360h88M1426 372h88" stroke="#7fb4e0" stroke-width="4" />
        <rect x="1308" y="306" width="60" height="14" fill="#e3eef8" />
        <path d="M1187 392 C1260 376 1340 394 1420 388 S1540 378 1587 384 V410 H1187 Z" fill="#7cc66b" />
        <path d="M1187 400 C1290 388 1400 410 1587 396 V410 H1187 Z" fill="#4ea6e2" />
        <path d="M1210 404 q30 -6 60 0 M1380 402 q30 -6 60 0" fill="none" stroke="#9ed2f3" stroke-width="2.5" stroke-linecap="round" />
        <g v-for="x in [1215, 1262, 1470, 1556]" :key="x"><rect :x="x - 2" y="372" width="4" height="14" fill="#7a5a34" /><circle :cx="x" cy="366" r="11" fill="#3f9d3c" /><circle :cx="x - 3" cy="362" r="6" fill="#5fb857" /></g>
      </g>
    </g>

    <!-- monitoring and feedback: from the implementation back to the input -->
    <path d="M864 480 V536 H712 M288 536 H136 V484" :stroke="BLUE" stroke-width="5" fill="none" stroke-linejoin="round" marker-end="url(#fw-arrow)" />
    <rect x="288" y="515" width="424" height="42" rx="12" fill="#fff" :stroke="BLUE" stroke-width="3" />
    <text x="500" y="542" class="fb">Monitoring and feedback (real-world data)</text>
  </svg>
</template>

<style scoped>
.fw { display: block; width: 100%; height: auto; font-family: Arial, Helvetica, sans-serif; }
.pill { font-size: 19px; font-weight: 700; fill: #1d2830; }
.h1 { font-size: 26px; font-weight: 700; fill: #1d2830; }
.h2 { font-size: 17px; fill: #1d2830; }
.bt { font-size: 17px; font-weight: 700; fill: #1d2830; }
.bs { font-size: 14px; fill: #3b4a54; }
.fb { font-size: 18px; font-weight: 700; fill: #1565c0; text-anchor: middle; }
</style>
