<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div class="relative">
      <div class="w-16 h-16 border-4 border-dore/30 border-t-dore rounded-full animate-spin"></div>
      <div v-if="text" class="mt-4 text-marron text-center">
        {{ text }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  text?: string
  fullScreen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  text: '',
  fullScreen: false
})

const containerClass = props.fullScreen ? 'min-h-screen' : 'py-12'
</script>
