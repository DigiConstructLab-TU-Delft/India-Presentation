<script setup lang="ts">
import { asset } from '../composables/asset'
import { computed } from 'vue'

// Ongoing collaborations with Indian universities: one card per partner, with its logo and projects.
const props = defineProps<{ names: string[] }>()
const allPartners = [
  {
    name: 'IIT Madras',
    logo: '/figures/logos/iit-madras-emblem.png',
    projects: [
      { title: 'Resilient Hydro Twin', text: 'A participatory digital twin to improve flood resilience.', media: [{ type: 'image', src: '/figures/resilient-hydro-twin-group.webp', alt: 'Resilient Hydro Twin project team at the workshop' }, { type: 'video', src: '/figures/resilient-hydro-twin-evacuation.mp4' }] },
      { title: 'Construction digital twins', text: 'Real-time reconfiguration of construction site activities.', media: [{ type: 'image', src: '/figures/construction-digital-twins-group.webp', alt: 'Construction digital twins project team at IIT Madras' }, { type: 'image', src: '/figures/construction-robot-lab.jpg', alt: 'Robot lab at IIT Madras' }] },
    ],
  },
  {
    name: 'IIT Bombay',
    logo: '/figures/logos/iit-bombay.png',
    projects: [
      { title: 'Minimum viable digital twin', text: 'Requirements for new infrastructure digital twins, from city-level representation to real-time twins.' },
      { title: 'Construction robotics', text: 'Representing construction sites so that robots can easily navigate and work within them.', media: [{ type: 'image', src: '/figures/iit-bombay-group.webp', alt: 'Project team at IIT Bombay' }] },
    ],
  },
  {
    name: 'IIT Delhi',
    logo: '/figures/logos/iit-delhi.png',
    projects: [
      { title: 'Climate resilience and maintenance of buildings', text: 'Using digital twins to understand the impact of climate on buildings and to select maintenance approaches.', media: [{ type: 'image', src: '/figures/iit-delhi-group.webp', alt: 'Project team at the IIT Delhi collaboration workshop' }] },
    ],
  },
  {
    name: 'NIT Warangal',
    logo: '/figures/logos/nit-warangal.png',
    projects: [
      { title: 'Underground utilities', text: 'Representing underground utilities within a city-scale digital twin.', media: [{ type: 'image', src: '/figures/nit-warangal-group.jpg', alt: 'Project team at NIT Warangal' }] },
    ],
  },
]
// Videos play on load and stop two seconds before the end.
const stopBeforeEnd = (e: Event) => {
  const v = e.target as HTMLVideoElement
  if (v.duration && v.currentTime >= v.duration - 2) v.pause()
}
const partners = computed(() => allPartners.filter(p => props.names.includes(p.name)))
</script>

<template>
  <div class="partner-grid" :class="{ single: partners.length === 1 }">
    <img v-if="partners.length === 1" :src="asset(partners[0].logo)" :alt="`${partners[0].name} logo`" class="single-logo" />
    <article v-for="p in partners" :key="p.name" class="partner-card">
      <header v-if="partners.length > 1" class="partner-head">
        <img :src="asset(p.logo)" :alt="`${p.name} logo`" class="partner-logo" />
        <h2>{{ p.name }}</h2>
      </header>
      <div v-for="proj in p.projects" :key="proj.title" class="partner-project">
        <div class="partner-project-body">
          <div>
            <h3>{{ proj.title }}</h3>
            <p>{{ proj.text }}</p>
          </div>
          <div v-if="proj.media" class="project-media">
            <div v-for="m in proj.media" :key="m.src" class="media-tile">
              <video v-if="m.type === 'video'" :src="asset(m.src)" autoplay muted playsinline class="project-video" @timeupdate="stopBeforeEnd"></video>
              <img v-else :src="asset(m.src)" :alt="m.alt" class="project-photo" />
            </div>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<style scoped>
.partner-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 22px; margin-top: 14px; }
/* One partner per slide: logo top right beside IDM and TU Delft; each project has its topic on the left and its photos and video on the right. */
.partner-grid.single { grid-template-columns: 1fr; margin-top: 16px; }
.partner-grid.single .single-logo { position: absolute; top: 20px; right: 262px; height: 50px; width: auto; margin-top: 0 !important; }
.partner-grid.single .partner-card { display: block; padding: 14px 32px; border-top-width: 6px; }
.partner-grid.single .partner-project { margin-top: 0; padding: 10px 0; border-top: 1px solid #d9e2e6; }
.partner-grid.single .partner-project:first-child { padding-top: 0; border-top: 0; }
.partner-grid.single .partner-project-body { display: grid; grid-template-columns: 0.7fr 1.3fr; gap: 28px; align-items: center; }
.partner-grid.single .partner-project h3 { font-size: var(--fs-head); }
.partner-grid.single .partner-project p { font-size: var(--fs-lead); }
.partner-grid.single .project-media { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 0; }
.partner-grid.single .project-media > * { width: 100%; height: 115px; }
.media-tile { position: relative; height: 115px; border-radius: 4px; overflow: hidden; background: #fff; }
.media-tile > * { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; }

.partner-card { padding: 12px 18px; background: #f7fbfc; border-top: 4px solid #00aeef; border-radius: 6px; }
.partner-head { display: flex; align-items: center; gap: 14px; margin-bottom: 4px; }
.partner-logo { height: 40px; width: auto; max-width: 42%; object-fit: contain; }
.partner-head h2 { margin: 0; color: #010101; font: 700 var(--fs-lead)/1.2 Arial, Helvetica, sans-serif; }
.partner-project { padding: 6px 0 0; border-top: 1px solid #d9e2e6; margin-top: 6px; }
.partner-project h3 { margin: 0; color: #007fa8; font: 700 var(--fs-small)/1.3 Arial, Helvetica, sans-serif; letter-spacing: -0.01em; }
.partner-project p { margin: 2px 0 0; color: #40525a; font-size: var(--fs-micro); line-height: 1.35; }
.partner-project-body { display: block; }
.project-media { display: flex; gap: 10px; margin-top: 10px; }
.project-media > * { flex: 1; min-width: 0; height: 150px; border-radius: 4px; object-fit: contain; background: #fff; }
</style>
