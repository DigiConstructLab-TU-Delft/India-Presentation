<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, unref, watch } from 'vue'
import { useSlideContext } from '@slidev/client'
import { asset } from '../composables/asset'

// Building an intervention scenario. One screen recording, one segment per step: each click highlights its step
// and plays its part of the clip (looping inside the segment); the last step holds on the final frame.
// The slide declares 4 clicks in its frontmatter.
const { $clicks, $nav, $page, $renderContext } = useSlideContext() as any
const step = computed(() => Math.min(Number(unref($clicks)) || 0, 4))
const active = computed(() => unref($renderContext) === 'slide' && unref($nav).currentPage === unref($page))

const steps = [
  { t: 'Start from a base scenario', d: 'the hazard, such as a 100-year event, is the hydrologists’ work' },
  { t: 'Draw an intervention', d: 'pick a blue, green or grey measure from the catalogue and draw it on the map' },
  { t: 'Add it and name the scenario', d: 'several measures can go into one package, with a description and rainfall' },
  { t: 'Save the scenario', d: 'it is stored with its author and time, and flagged for simulation' },
  { t: 'A hydrologist runs it', d: 'reviews the set-up, runs SFINCS and Delft-FIAT, and releases the results to the same map. A human stays in the loop.' },
]
// [start, end] in clip seconds; a null end plays to the end of the clip and holds; null means hold the last frame.
const SEGMENTS: ([number, number | null] | null)[] = [[0, 10.5], [10.8, 20], [20, 30.5], [30.5, null], null]

const video = ref<HTMLVideoElement | null>(null)
let blobUrl = ''

function apply() {
  const v = video.value
  if (!v) return
  const seg = SEGMENTS[step.value]
  if (!active.value) { v.pause(); return }
  if (seg) { v.currentTime = seg[0]; v.play().catch(() => {}) }
  else { v.pause(); if (v.duration) v.currentTime = Math.max(0, v.duration - 0.05) }
}
function onTime() {
  const v = video.value
  const seg = SEGMENTS[step.value]
  if (!v || !seg || seg[1] === null) return
  if (v.currentTime >= seg[1]) { v.currentTime = seg[0]; v.play().catch(() => {}) }
}

watch([step, active], apply)
onMounted(() => {
  const v = video.value
  if (!v) return
  // Load the clip into memory so it can seek, even on static servers without byte-range support.
  fetch(asset('/figures/rht/feat_scenario.mp4'))
    .then((r) => r.blob())
    .then((b) => {
      blobUrl = URL.createObjectURL(b)
      v.addEventListener('loadedmetadata', apply, { once: true })
      v.src = blobUrl
    })
    .catch(() => apply())
  v.addEventListener('loadedmetadata', apply, { once: true })
})
onBeforeUnmount(() => { if (blobUrl) URL.revokeObjectURL(blobUrl) })
</script>

<template>
  <div class="scn">
    <div class="screen">
      <video ref="video" src="/figures/rht/feat_scenario.mp4" muted playsinline preload="auto" class="vid" @timeupdate="onTime"></video>
      <span class="badge" :class="{ on: step === 4 }">Queued for the hydrologist</span>
    </div>
    <ol>
      <li v-for="(s, i) in steps" :key="s.t" :class="{ now: step === i, done: step > i }">
        <b>{{ s.t }}</b><span>{{ s.d }}</span>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.scn { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 24px; align-items: center; }
.screen { position: relative; border-radius: 6px; overflow: hidden; background: #f7fbfc; }
.vid { display: block; width: 100%; height: 280px; object-fit: contain; }
.badge { position: absolute; right: 10px; bottom: 10px; padding: 4px 12px; border-radius: 999px; background: #b45309; color: #fff; font-size: var(--fs-micro); font-weight: 700; opacity: 0; transform: translateY(6px); transition: opacity 0.4s ease, transform 0.4s ease; }
.badge.on { opacity: 1; transform: none; }
ol { margin: 0; padding: 0; list-style: none; counter-reset: s; }
li { position: relative; margin-bottom: 7px; padding: 6px 10px 6px 36px; border-left: 3px solid #d9e2e6; background: #f7fbfc; counter-increment: s; opacity: 0.45; transition: opacity 0.4s ease, border-color 0.4s ease, background 0.4s ease; }
li.done { opacity: 0.75; border-left-color: #9ed9ee; }
li.now { opacity: 1; border-left-color: #00aeef; background: #eff9fc; box-shadow: 0 1px 6px rgba(0, 174, 239, 0.18); }
li::before { content: counter(s); position: absolute; left: 10px; top: 6px; color: #007fa8; font-size: var(--fs-body); font-weight: 700; }
li b { display: block; color: #010101; font-size: var(--fs-body); }
li span { display: block; margin-top: 1px; color: #40525a; font-size: var(--fs-micro); line-height: 1.35; }
</style>
