<template>
  <div
    class="app-card text-center"
    :class="[
      compact ? 'px-4 py-6' : 'px-6 py-10',
      dark
        ? 'bg-white/5 border-white/10 text-ivoire/75'
        : 'bg-white/70 border-dore/20 text-marron/80'
    ]"
  >
    <p v-if="title" class="font-semibold" :class="dark ? 'text-ivoire' : 'text-marron'">{{ title }}</p>
    <p :class="title ? 'mt-1' : ''">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  description: string
  title?: string
  compact?: boolean
  dark?: boolean
}

withDefaults(defineProps<Props>(), {
  title: '',
  compact: false,
  dark: false
})
</script>
