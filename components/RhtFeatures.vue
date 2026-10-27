<script setup lang="ts">
import { asset } from '../composables/asset'
import { computed, unref } from 'vue'
import { useSlideContext } from '@slidev/client'

// The planning interface, recorded from the live platform: base scenarios, then one result layer per click.
// The slide declares 4 clicks in its frontmatter.
const { $clicks } = useSlideContext() as any
const step = computed(() => Math.min(Number(unref($clicks)) || 0, 4))
const layers = [
  { chip: 'Base scenarios', cap: 'Base scenarios from the hydrologists: 10, 50, 100 and 300-year events, for Rotterdam and Chennai.' },
  { chip: 'Flood depth', cap: 'Flood depth for every cell, played hour by hour.', video: '/figures/rht/feat_flood.mp4' },
  { chip: 'Damage', cap: 'Delft-FIAT impact model: damage per building, in the same window.', video: '/figures/rht/feat_fiat.mp4' },
  { chip: 'Roads', cap: 'Impact on the road network: which roads lose function, which stay passable.', video: '/figures/rht/feat_roads.mp4' },
  { chip: 'Evacuation', cap: 'Agent-based evacuation: people, roads and shelters over time.', video: '/figures/rht/feat_abm.mp4' },
]
</script>

<template>
  <div class="feat">
    <div class="chips">
      <span v-for="(l, i) in layers" :key="l.chip" :class="{ on: step === i, done: step > i }">{{ l.chip }}</span>
    </div>
    <p class="cap">{{ layers[step].cap }}</p>
    <div class="screen">
      <div v-if="step === 0" class="pair">
        <img src="/figures/rht/feat_base_rdam.jpg" alt="Base scenario, Rotterdam" />
        <img src="/figures/rht/feat_base_chennai.jpg" alt="Base scenario, Chennai" />
      </div>
      <template v-for="(l, i) in layers" :key="l.chip">
        <video v-if="l.video && step === i" :src="asset(l.video)" autoplay muted loop playsinline></video>
      </template>
    </div>
  </div>
</template>

<style scoped>
.chips { display: flex; gap: 6px; }
.chips span { padding: 3px 11px; border: 1px solid #d9e2e6; border-radius: 12px; color: #64727a; font-size: var(--fs-micro); }
.chips span.done { color: #007fa8; border-color: #bfe6f3; }
.chips span.on { border-color: #00aeef; background: #eff9fc; color: #007fa8; font-weight: 700; }
.cap { margin: 6px 0 6px; color: #40525a; font-size: var(--fs-body) !important; }
.screen { height: 265px; border-radius: 6px; background: #f7fbfc; overflow: hidden; display: flex; align-items: center; justify-content: center; }
.screen video { width: 100%; height: 100%; object-fit: contain; }
.pair { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; width: 100%; height: 100%; }
.pair img { width: 100%; height: 100%; object-fit: contain; }
</style>
