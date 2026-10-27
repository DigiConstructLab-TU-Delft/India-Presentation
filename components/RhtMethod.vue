<script setup lang="ts">
// Research method: engaged scholarship. Two cities, two workshops each, plus the stakeholder interviews.
const cities = [
  {
    name: 'Rotterdam, The Netherlands',
    tone: 'nl',
    workshops: [
      {
        title: 'Enhancing Water Resilience with Digital Twins in Rotterdam: Co-creation', when: '2025.6', photo: '/figures/method/workshop-rotterdam-1.jpg',
        points: ['Data & Modeling challenges', 'Monitoring & Decision-Making process', 'Digital Tools in Urban Governance', 'Stakeholder Communication'],
      },
      {
        title: 'Stakeholder Integration Strategy: Vision, Voice, Visualization with the serious game', when: '2025.12', photo: '/figures/method/workshop-rotterdam-2.jpg',
        points: ['Realistic decision behavior under uncertainty', 'Evidence for feature prioritization', 'Concrete interface requirements', 'Trust as a precondition for adoption'],
      },
    ],
  },
  {
    name: 'Tambaram City Municipal Corporation, Chennai, India',
    tone: 'in',
    workshops: [
      {
        title: 'Inception workshop: Engaging stakeholders to shape the project approach', when: '2025.7', photo: '/figures/method/workshop-tambaram-1.jpg',
        points: ['Integrated flood management & decision support', 'Address data gaps & strengthen the evidence base', 'Digital twins for real-time flood monitoring', 'Strengthen inter-agency coordination & community participation'],
      },
      {
        title: 'Visioning Workshop: Participatory mapping for flood resilience modelling of grey and BGI measures', when: '2026.1', photo: '/figures/method/workshop-tambaram-2.jpg',
        points: ['Identify location-specific flood mitigation measures', 'Prioritise both grey and BGI interventions', 'Strengthen drainage connectivity and stormwater conveyance', 'Enable real-time flood management through sensors and lake operations'],
      },
    ],
  },
]
</script>

<template>
  <div class="method">
    <div v-for="c in cities" :key="c.name" class="panel" :class="c.tone">
      <h3 class="city">{{ c.name }}</h3>
      <div v-for="(w, i) in c.workshops" :key="w.when" class="ws">
        <p class="wt"><b class="wn">Workshop {{ i + 1 }}</b> {{ w.title }} <span class="when">[{{ w.when }}]</span></p>
        <div class="row">
          <img :src="w.photo" :alt="`Workshop ${i + 1}, ${c.name}`" class="ph" />
          <ul><li v-for="p in w.points" :key="p">{{ p }}</li></ul>
        </div>
      </div>
      <p v-if="c.tone === 'in'" class="interviews">* Complemented with stakeholder interviews: 10 key informant interviews with government agencies and civic body representatives.</p>
    </div>
  </div>
</template>

<style scoped>
.method { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 4px; }
.panel { padding: 10px 14px 10px; border-radius: 12px; --a: #0b7bb5; --bg: #e3f4fd; background: var(--bg); }
.panel.in { --a: #2d7a2d; --bg: #e4f4da; }
.city { margin: 0 0 8px; color: var(--a); font-size: var(--fs-lead); line-height: 1.2; }
.ws + .ws { margin-top: 12px; }
.wt { margin: 0 0 5px; color: #1d2830; font-size: var(--fs-small) !important; font-weight: 700; line-height: 1.3 !important; }
.wn { color: var(--a); }
.when { color: var(--a); }
.row { display: grid; grid-template-columns: 140px 1fr; gap: 10px; align-items: center; }
.ph { display: block; width: 100%; height: 94px; object-fit: cover; border-radius: 4px; }
ul { margin: 0; padding-left: 1.1em; }
li { color: #40525a; font-size: var(--fs-small) !important; line-height: 1.3 !important; margin: 0 !important; }
.interviews { margin: 10px 0 0; color: var(--a); font-size: var(--fs-micro) !important; font-weight: 700; line-height: 1.3 !important; }
</style>
