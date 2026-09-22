<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.65"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path v-for="(path, index) in paths[name]" :key="index" :d="path" />
  </svg>
</template>
<script setup lang="ts">
defineProps<{ name: keyof typeof paths }>()
const paths = {
  spark: [
    'M12 3c1.3 5.1 3.9 7.7 9 9-5.1 1.3-7.7 3.9-9 9-1.3-5.1-3.9-7.7-9-9 5.1-1.3 7.7-3.9 9-9Z',
    'M20 2v4M18 4h4',
  ],
  plus: ['M12 5v14M5 12h14'],
  layers: ['m12 3 9 5-9 5-9-5 9-5Z', 'm3 12 9 5 9-5M3 16l9 5 9-5'],
  search: ['M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0ZM15 15l6 6'],
  info: ['M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 11v6M12 7h.01'],
  chart: ['M4 3v17h17M8 15v-4M13 15V7M18 15V4'],
  chat: ['M20 11.5a8 8 0 0 1-8 8H4l1.5-4A8 8 0 1 1 20 11.5Z', 'M8 11h8M8 14h5'],
  panel: ['M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1ZM9 4v16'],
  moon: ['M20.5 13.2A8.6 8.6 0 0 1 10.8 3.5a8.6 8.6 0 1 0 9.7 9.7Z'],
  sun: [
    'M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19',
  ],
  arrow: ['M12 19V5M6 11l6-6 6 6'],
  diagonal: ['M7 17 17 7M7 7h10v10'],
  down: ['m8 10 4 4 4-4'],
  clip: ['m8 13 7-7a3 3 0 0 1 4 4L9 20a5 5 0 0 1-7-7L13 2', 'm5 16 10-10'],
  write: ['m15 4 5 5M4 20l5-1L20 8a2 2 0 0 0-5-5L4 14v6Z'],
  code: ['m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16'],
  book: ['M12 5v15M12 5C8 2 3 4 3 4v15s5-2 9 1c4-3 9-1 9-1V4s-5-2-9 1Z'],
  compass: ['M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z', 'm16 8-2 6-6 2 2-6 6-2Z'],
  copy: ['M8 8h12v13H8V8Z', 'M16 8V3H3v13h5'],
  check: ['m5 12 4 4L19 6'],
  refresh: ['M20 7v5h-5M4 17v-5h5', 'M6 7a7 7 0 0 1 12-1l2 6M4 12l2 6a7 7 0 0 0 12-1'],
  close: ['m6 6 12 12M6 18 18 6'],
  leaf: ['M19 3c-1 5 2 10-3 15-3 3-8 3-10 0S4 11 8 8c3-2 6-1 11-5Z', 'M4 22 15 10'],
} as const
</script>
