<script setup lang="ts">
// IIT Bombay slide: heading and logo on top, projects with two small photos on the right, one large photo at the bottom.
const projects = [
  { title: 'Minimum viable digital twin', text: 'Requirements for new infrastructure digital twins, from city-level representation to real-time twins.' },
  { title: 'Construction robotics', text: 'Representing construction sites so that robots can easily navigate and work within them.' },
]
</script>

<template>
  <div class="bombay-work">
    <p class="kicker">Ongoing collaborations</p>
    <div class="bombay-head">
      <h1>Our work with IIT Bombay</h1>
      <div class="bombay-logos">
        <img src="/figures/logos/iit-bombay.png" alt="IIT Bombay logo" class="bombay-logo" />
        <img src="/figures/logos/tu-eindhoven.png" alt="TU Eindhoven logo" class="tue-logo" />
      </div>
    </div>

    <div class="bombay-top">
      <div class="bombay-projects">
        <div v-for="p in projects" :key="p.title" class="bombay-project">
          <h3>{{ p.title }}</h3>
          <p>{{ p.text }}</p>
        </div>
      </div>
      <div class="bombay-small">
        <img src="/figures/iit-bombay-poll.webp" alt="Workshop poll on digital twins" />
        <img src="/figures/iit-bombay-structure.webp" alt="Built environment department structure" />
        <img src="/figures/iit-bombay-foundation-model.webp" alt="Foundation data model for digital twins: process clarity and information requirements" />
      </div>
    </div>

    <img src="/figures/iit-bombay-group.webp" alt="Project team at IIT Bombay" class="bombay-large" />
  </div>
</template>

<style scoped>
.bombay-work { display: flex; flex-direction: column; gap: 12px; }
.bombay-work .kicker { margin: 0 0 -4px; }
.bombay-head { display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.bombay-head h1 { margin: 0; }
.bombay-work .bombay-logos { margin-top: 0 !important; }
.bombay-logos { position: absolute; top: 22px; right: 262px; display: flex; align-items: center; gap: 10px; }
.bombay-logo { height: 40px; width: auto; }
.tue-logo { height: 36px; width: auto; }
.bombay-top { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 28px; align-items: start; }
.bombay-project { padding: 8px 0 10px; border-top: 1px solid #d9e2e6; }
.bombay-project:first-child { border-top: 4px solid #00aeef; }
.bombay-project h3 { margin: 0; color: #007fa8; font: 700 var(--fs-body)/1.3 Arial, Helvetica, sans-serif; }
.bombay-project p { margin: 4px 0 0; color: #40525a; font-size: var(--fs-small); line-height: 1.4; }
.bombay-small { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
.bombay-small img { width: 100%; height: 130px; object-fit: cover; border-radius: 4px; }
.bombay-large { width: 100%; height: 215px; object-fit: cover; object-position: center 100%; border-radius: 4px; }
</style>
