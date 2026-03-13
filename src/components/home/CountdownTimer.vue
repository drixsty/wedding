<template>
  <div class="py-12 bg-ivory/50 border-y border-stone/10">
    <div class="container mx-auto px-6 max-w-4xl text-center">
      <div class="grid grid-cols-4 gap-4 md:gap-12">
        <div v-for="unit in timeUnits" :key="unit.label" class="space-y-1 group">
          <div class="overflow-hidden">
            <span class="block text-3xl md:text-5xl font-serif text-ebony animate-slide-up">
              {{ unit.value.toString().padStart(2, '0') }}
            </span>
          </div>
          <span class="block text-[0.55rem] uppercase tracking-widest text-stone font-bold group-hover:text-gold-muted transition-colors duration-700">
            {{ unit.label }}
          </span>
        </div>
      </div>
    </div>
  </div>
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
    { value: Math.max(0, Math.floor(d.asDays())), label: 'J' },
    { value: Math.max(0, d.hours()), label: 'H' },
    { value: Math.max(0, d.minutes()), label: 'M' },
    { value: Math.max(0, d.seconds()), label: 'S' }
  ]
})

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
@keyframes slideUp {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.animate-slide-up {
  animation: slideUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
