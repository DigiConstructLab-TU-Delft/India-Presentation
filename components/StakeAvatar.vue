<script lang="ts">
// A small illustrated person for a stakeholder group: head and shoulders with one telling accessory per role.
// gov: shirt and tie · ops: hard hat and hi-vis vest · com: casual clothes · exp: glasses and laptop.
let counter = 0
</script>

<script setup lang="ts">
const props = defineProps<{ role: 'gov' | 'ops' | 'com' | 'exp'; tone: string; hair: string; color: string; long?: boolean }>()
const uid = `sa-${++counter}`
</script>

<template>
  <svg viewBox="0 0 48 52" class="avatar" aria-hidden="true">
    <defs><clipPath :id="uid"><circle cx="24" cy="26" r="24" /></clipPath></defs>
    <circle cx="24" cy="26" r="24" fill="#eef4f7" />
    <g :clip-path="`url(#${uid})`">
      <path d="M4 53 C4 40 12 35 24 35 C36 35 44 40 44 53 Z" :fill="color" />
      <rect x="21" y="28" width="6" height="9" :fill="tone" />
      <!-- role clothing -->
      <template v-if="role === 'gov'">
        <path d="M17 35 L24 42 L31 35 Z" fill="#fff" /><path d="M24 38 l-2.4 3.6 2.4 9 2.4 -9z" fill="#1d2830" />
      </template>
      <template v-else-if="role === 'ops'">
        <path d="M8 46 q16 -7 32 0" fill="none" stroke="#fff6a8" stroke-width="2.4" /><path d="M5 51 q19 -8 38 0" fill="none" stroke="#fff6a8" stroke-width="2.4" />
      </template>
      <template v-else-if="role === 'com'">
        <path d="M18.5 35.5 q5.5 5.5 11 0" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" />
      </template>
      <template v-else>
        <rect x="12" y="43" width="24" height="10" rx="1.8" fill="#cfd8de" /><rect x="14.5" y="44.5" width="19" height="6.5" fill="#8fb5cf" />
      </template>
      <!-- head, hair and face -->
      <ellipse cx="24" cy="22" rx="8.6" ry="9.6" :fill="tone" />
      <path d="M15.2 21 C14.6 11.5 20.5 8 24 8 C28 8 33.4 11.5 32.8 21 C30.4 15.6 17.6 15.6 15.2 21 Z" :fill="hair" />
      <template v-if="long">
        <path d="M15.2 20 C13.6 29 14.6 33.5 17.4 35 L19.4 22.5 Z" :fill="hair" /><path d="M32.8 20 C34.4 29 33.4 33.5 30.6 35 L28.6 22.5 Z" :fill="hair" />
      </template>
      <circle cx="20.6" cy="22.6" r="1" fill="#2a2a2a" /><circle cx="27.4" cy="22.6" r="1" fill="#2a2a2a" />
      <path d="M21.2 27 q2.8 2.2 5.6 0" fill="none" stroke="#7a3b2e" stroke-width="1.1" stroke-linecap="round" />
      <!-- role accessories on the head -->
      <template v-if="role === 'ops'">
        <path d="M13.4 19 A10.6 10.6 0 0 1 34.6 19 Z" fill="#f7c331" /><rect x="10.5" y="18.4" width="27" height="3.2" rx="1.4" fill="#e2a91c" /><rect x="22.6" y="7.6" width="2.8" height="6" fill="#e2a91c" />
      </template>
      <template v-if="role === 'exp'">
        <circle cx="20.4" cy="22.4" r="3.3" fill="none" stroke="#1d2830" stroke-width="1.2" /><circle cx="27.6" cy="22.4" r="3.3" fill="none" stroke="#1d2830" stroke-width="1.2" /><path d="M23.7 22.4 h0.6" stroke="#1d2830" stroke-width="1.2" />
      </template>
    </g>
  </svg>
</template>

<style scoped>
.avatar { display: block; width: 100%; height: 100%; }
</style>
