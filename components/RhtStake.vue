<script setup lang="ts">
// Who uses the twin and what they ask it. For each group, one person from Rotterdam and one from Tambaram (Chennai)
// asks a typical question.
const users = [
  {
    who: 'Government', role: 'gov', color: '#e8a13a', skill: 2, level: 'medium',
    does: 'authors and compares adaptation scenarios',
    voices: [
      { place: 'Rotterdam', org: 'Municipality of Rotterdam, Province of South Holland', asks: 'Which neighbourhoods are hit hardest? Is option A better than B, and at what cost?', tone: '#f1c9a5', hair: '#6b4a2f' },
      { place: 'Tambaram', org: 'city and state authorities', asks: 'Which wards flood first in a monsoon, and which drainage works matter most?', tone: '#b9825a', hair: '#1f1a17' },
    ],
  },
  {
    who: 'Operators', role: 'ops', color: '#00aeef', skill: 3, level: 'medium–high',
    does: 'checks critical assets and roads',
    voices: [
      { place: 'Rotterdam', org: 'water authorities, emergency responders', asks: 'Which roads and facilities lose function?', tone: '#e8b88f', hair: '#3b2a1c' },
      { place: 'Tambaram', org: 'drainage and disaster-management agencies', asks: 'Which routes to the relief shelters stay passable during the flood?', tone: '#9c6a46', hair: '#1f1a17' },
    ],
  },
  {
    who: 'Communities', role: 'com', color: '#0f8a5f', skill: 1, level: 'low–medium',
    does: 'consulted on scenarios, brings local knowledge',
    voices: [
      { place: 'Rotterdam', org: 'local organisations', asks: 'Is my street affected? What was assumed?', tone: '#f3d2b3', hair: '#b4772f', long: true },
      { place: 'Tambaram', org: 'residents and local organisations', asks: 'Will my street flood this monsoon? Where is the nearest safe shelter?', tone: '#c08a62', hair: '#1f1a17', long: true },
    ],
  },
  {
    who: 'Domain experts', role: 'exp', color: '#7c5cc4', skill: 4, level: 'high',
    does: 'sets up, runs and releases simulations',
    voices: [
      { place: 'Rotterdam', org: 'hydrological & transport modellers', asks: 'Is the model set-up sound for this scenario?', tone: '#efc7a4', hair: '#8a8a8a' },
      { place: 'Tambaram', org: 'IIT Madras modellers (MIKE+)', asks: 'Is the model credible with so little observed data?', tone: '#a9724b', hair: '#1f1a17', long: true },
    ],
  },
]
</script>

<template>
  <div class="who">
    <div v-for="u in users" :key="u.who" class="card" :style="{ '--c': u.color }">
      <h3>{{ u.who }}</h3>
      <div class="gauge">
        <span class="pips"><i v-for="n in 4" :key="n" :class="{ on: n <= u.skill }"></i></span>
        <span class="lvl">technical skill: {{ u.level }}</span>
      </div>
      <p class="does">{{ u.does }}</p>
      <div v-for="v in u.voices" :key="v.place" class="voice">
        <div class="av"><StakeAvatar :role="u.role" :tone="v.tone" :hair="v.hair" :color="u.color" :long="v.long" /></div>
        <div class="said">
          <span class="place" :class="{ in: v.place === 'Tambaram' }">{{ v.place }}</span>
          <span class="org">{{ v.org }}</span>
          <p class="bubble">&ldquo;{{ v.asks }}&rdquo;</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.who { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 6px; }
.card { padding: 12px 12px 10px; background: #f7fbfc; border-top: 5px solid var(--c); border-radius: 6px; }
.card h3 { margin: 0; color: #010101; font-size: var(--fs-head); line-height: 1.2; }
.gauge { display: flex; align-items: center; gap: 6px; margin: 4px 0 6px; }
.pips { display: inline-flex; gap: 3px; }
.pips i { width: 10px; height: 5px; border-radius: 3px; background: #d9e2e6; }
.pips i.on { background: var(--c); }
.lvl { color: #64727a; font-size: var(--fs-micro); }
.does { margin: 0 0 8px; color: #1d2830; font-size: var(--fs-small) !important; font-weight: 700; line-height: 1.3 !important; min-height: 2.6em; }
.voice { display: grid; grid-template-columns: 36px 1fr; gap: 8px; align-items: start; margin-top: 8px; padding-top: 8px; border-top: 1px solid #e3ecef; }
.av { width: 36px; height: 40px; }
.place { display: inline-block; padding: 1px 7px; border-radius: 9px; background: var(--c); color: #fff; font-size: var(--fs-micro); font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
.place.in { background: #1d2830; }
.org { display: block; margin: 2px 0 3px; color: #64727a; font-size: var(--fs-micro); line-height: 1.3; }
.bubble { position: relative; margin: 0 !important; padding: 5px 8px; border-radius: 8px; background: #fff; border: 1px solid #d9e2e6; color: #40525a; font-size: var(--fs-micro) !important; font-style: italic; line-height: 1.35 !important; }
.bubble::before { content: ''; position: absolute; left: -5px; top: 9px; width: 8px; height: 8px; background: #fff; border-left: 1px solid #d9e2e6; border-bottom: 1px solid #d9e2e6; transform: rotate(45deg); }
</style>
