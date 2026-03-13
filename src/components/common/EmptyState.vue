<template>
  <div
    class="relative group overflow-hidden transition-all duration-1000 border border-stone/10 bg-white"
    :class="[
      compact ? 'p-8' : 'p-16',
      dark ? 'bg-ebony border-white/5 text-ivory/60' : 'bg-white text-stone'
    ]"
  >
    <!-- Background Texture -->
    <div class="absolute inset-0 opacity-[0.03] pointer-events-none" 
         :style="`background-image: url('data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3C/g%3E%3C/svg%3E');`"
    ></div>

    <div class="relative z-10 flex flex-col items-center text-center space-y-6">
      <div v-if="icon" class="w-16 h-16 border border-stone/10 rounded-full flex items-center justify-center text-2xl group-hover:border-gold-muted/30 transition-colors duration-700" :class="animated ? 'animate-float-soft' : ''">
        <span class="grayscale group-hover:grayscale-0 transition-all">{{ icon }}</span>
      </div>

      <div class="space-y-2">
        <h3 v-if="title" class="font-serif text-2xl tracking-tight" :class="dark ? 'text-ivory' : 'text-ebony'">
          {{ title }}
        </h3>
        <p class="text-[0.65rem] uppercase tracking-[0.3em] font-bold leading-relaxed max-w-xs mx-auto">
          {{ description }}
        </p>
      </div>

      <div v-if="hint" class="pt-4">
        <span class="inline-block h-px w-8 bg-gold-muted/20 mb-4 mx-auto"></span>
        <p class="text-[0.6rem] italic tracking-widest text-gold-muted/60">
          {{ hint }}
        </p>
      </div>
    </div>

    <!-- Decorative Corner -->
    <div class="absolute top-0 right-0 w-16 h-16 pointer-events-none">
      <div class="absolute top-4 right-4 w-px h-8 bg-stone/10 group-hover:bg-gold-muted/20 transition-colors duration-1000"></div>
      <div class="absolute top-4 right-4 w-8 h-px bg-stone/10 group-hover:bg-gold-muted/20 transition-colors duration-1000"></div>
    </div>
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
  icon: '✨',
  hint: '',
  animated: true
})
</script>

<style scoped>
@keyframes floatSoft {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
.animate-float-soft {
  animation: floatSoft 4s ease-in-out infinite;
}
</style>
