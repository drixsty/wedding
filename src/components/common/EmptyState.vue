<template>
  <div
    class="app-card text-center relative overflow-hidden"
    :class="[
      compact ? 'px-4 py-6' : 'px-6 py-10',
      dark
        ? 'bg-white/5 border-white/10 text-ivoire/75'
        : 'bg-white/70 border-dore/20 text-marron/80'
    ]"
  >
    <div class="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(201,168,124,0.16),transparent_60%)]"></div>

    <div v-if="icon" class="relative mx-auto mb-4 h-14 w-14 rounded-2xl flex items-center justify-center text-2xl" :class="animated ? 'animate-float-soft' : ''">
      <span>{{ icon }}</span>
    </div>

    <p v-if="title" class="relative font-semibold" :class="dark ? 'text-ivoire' : 'text-marron'">{{ title }}</p>
    <p class="relative" :class="title ? 'mt-1' : ''">{{ description }}</p>
    <p v-if="hint" class="relative mt-2 text-xs" :class="dark ? 'text-ivoire/65' : 'text-marron/60'">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  description: string
  title?: string
  compact?: boolean
  dark?: boolean
  icon?: string
  hint?: string
  animated?: boolean
}

withDefaults(defineProps<Props>(), {
  title: '',
  compact: false,
  dark: false,
  icon: '',
  hint: '',
  animated: true
})
</script>
