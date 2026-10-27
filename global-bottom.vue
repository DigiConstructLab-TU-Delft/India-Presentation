<template>
  <footer v-if="$nav.currentPage !== 1" class="tu-footer" :class="{ dark: $nav.currentLayout === 'section' }">
    <span class="tu-footer-course">TU Delft – India Collaboration · Digital Twinning of Civil Infrastructures</span>
    <span class="tu-footer-page">{{ $nav.currentPage }} / {{ $nav.total }}</span>
  </footer>
</template>
