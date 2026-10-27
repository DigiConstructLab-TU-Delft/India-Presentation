<script setup lang="ts">
// The idea: the co-creation picture on the left (one third) and the framework figure on the right (two thirds).
</script>

<template>
  <div class="loop">
    <figure class="pic">
      <img src="/figures/flood-resilience-codesign.webp" alt="Co-creating flood resilience scenarios around a shared river model" />
      <figcaption>Co-creating flood resilience scenarios with stakeholders</figcaption>
    </figure>
    <FrameworkDiagram class="fig" />
  </div>
</template>

<style scoped>
.loop { display: grid; grid-template-columns: 1fr 2fr; gap: 20px; align-items: center; }
.pic { margin: 0; }
.pic img { display: block; width: 100%; height: auto; border-radius: 6px; }
.pic figcaption { margin-top: 6px; color: #64727a; font-size: var(--fs-micro); line-height: 1.35; }
.fig { display: block; width: 100%; max-height: 360px; }
</style>
