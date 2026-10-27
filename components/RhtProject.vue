<script setup lang="ts">
// The project: two contrasting deltas, the goal and what a participatory digital twin is.
</script>

<template>
  <div>
    <p class="rsub"><b>Participatory digital twins for flood resilience</b> · Netherlands × India · NWO–DST Merian Fund · TU/e, TU Delft, IIT Madras and partners</p>
    <div class="rgrid two">
      <div class="rcard">
        <img src="/figures/rht/live_rotterdam.jpg" alt="Rotterdam, 1/100-year flood depth" class="rmedia photo" />
        <h3>Rotterdam</h3>
        <p>Data-rich; compound coastal–river–rain flooding. 1/100-yr flood depth.</p>
      </div>
      <div class="rcard">
        <img src="/figures/rht/live_chennai.jpg" alt="Tambaram, Chennai, 1/100-year flood depth" class="rmedia photo" />
        <h3>Tambaram, Chennai</h3>
        <p>Monsoon-driven; data-scarce. 1/100-yr flood depth.</p>
      </div>
    </div>
    <p class="goal"><b>Goal:</b> let planners, operators and communities explore flood scenarios and adaptation measures together.</p>
    <div class="definition">
      <p class="term">Participatory digital twin</p>
      <p class="text">A <b>digitally mediated social space</b> where people bring local knowledge, explore flood scenarios, and co-create interventions to strengthen flood resilience</p>
    </div>
  </div>
</template>

<style scoped>
.two { grid-template-columns: 1fr 1fr; }
.photo { height: 125px; margin-bottom: 6px; }
.goal { margin: 10px 0 8px; font-size: var(--fs-body) !important; color: #1d2830; }
.definition { padding: 8px 14px; border-left: 4px solid #00aeef; border-radius: 4px; background: #eff9fc; text-align: center; }
.definition p { margin: 0 !important; color: #1d2830; }
.definition .term { font-size: var(--fs-body) !important; font-weight: 700; }
.definition .text { margin-top: 2px !important; font-size: var(--fs-body) !important; line-height: 1.35 !important; }
</style>
