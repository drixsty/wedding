<template>
  <section class="bg-ivoire/10 backdrop-blur-md rounded-2xl bg-gradient-to-b from-brown-dark/60 to-brown-dark relative overflow-hidden">
    <div class="container mx-auto px-4 text-center">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 justify-center">
        <div
            v-for="unit in timeUnits"
            :key="unit.label"
            class="sm:p-8 flex flex-col items-center justify-center group"
        >
          <span class="text-3xl sm:text-4xl md:text-5xl font-bold text-ivoire animate-pulse">
            {{ unit.value }}
          </span>
          <span class="mt-2 text-sm sm:text-base text-ivoire/70 tracking-wide uppercase">
            {{ unit.label }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

const weddingDate = import.meta.env.VITE_WEDDING_DATE || '2026-07-23T14:00:00'
const now = ref(Date.now())
let interval: ReturnType<typeof setInterval>

const timeUnits = computed(() => {
  const diff = dayjs(weddingDate).diff(dayjs(now.value))
  const d = dayjs.duration(diff)

  return [
    { value: Math.max(0, Math.floor(d.asDays())), label: 'Jours' },
    { value: Math.max(0, d.hours()), label: 'Heures' },
    { value: Math.max(0, d.minutes()), label: 'Minutes' },
    { value: Math.max(0, d.seconds()), label: 'Secondes' }
  ]
})

// Mise à jour toutes les secondes
onMounted(() => {
  interval = setInterval(() => {
    now.value = Date.now()
  }, 1000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<style scoped>
.text-ivoire {
  color: #FDF6EE;
}
.bg-brown-dark {
  background-color: #4B2E1E;
}
</style>
