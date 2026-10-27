<template>
  <header class="tu-header" :class="{ dark: $nav.currentLayout === 'section' }" aria-label="TU Delft">
    <img src="/figures/tu-delft-logo.svg" alt="TU Delft" class="tu-logo" />
  </header>
  <img src="/figures/idm-logo.jpg" alt="IDM – Integral Design and Management" class="idm-header-logo" :class="{ dark: $nav.currentLayout === 'section' }" />
  <!-- slides 2 to 7 (the Resilient Hydro Twin part): the Indian and Dutch partner institutions next to IDM -->
  <div v-if="$nav.currentPage >= 2 && $nav.currentPage <= 7" class="header-partners">
    <img src="/figures/logos/iit-madras-emblem.png" alt="IIT Madras" class="iitm" />
    <img src="/figures/logos/tu-eindhoven.png" alt="TU Eindhoven" class="tue" />
  </div>
</template>
