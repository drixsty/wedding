<template>
  <div class="relative h-[450px] overflow-hidden group shadow-editorial border border-stone/10 bg-ivory rounded-3xl">
    <img
      :src="location.image"
      :alt="location.name"
      class="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
      loading="lazy"
    />
    
    <!-- Editorial Overlay: STRENGTHENED for visibility -->
    <div class="absolute inset-0 bg-gradient-to-t from-ebony/95 via-ebony/60 to-transparent text-ivory flex flex-col justify-end p-4 md:p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-700 backdrop-blur-[1px]">
      <div class="space-y-3 md:space-y-4">
        <div class="flex items-center gap-2 md:gap-3">
          <span class="text-xl md:text-2xl">{{ location.icon }}</span>
          <h3 class="text-lg md:text-2xl font-serif leading-none">{{ location.name }}</h3>
        </div>
        
        <p class="text-[0.6rem] md:text-[0.65rem] uppercase tracking-widest text-ivory/80 leading-relaxed font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 line-clamp-2 md:line-clamp-none">
          {{ location.description }}
        </p>

        <div class="flex flex-col md:flex-row md:flex-wrap gap-2 md:gap-6 pt-1 md:pt-2">
          <div class="flex items-center gap-2 text-[0.55rem] md:text-[0.6rem] uppercase tracking-[0.2em] font-bold">
            <svg class="w-3 md:w-3.5 h-3 md:h-3.5 text-gold-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span class="truncate">{{ location.address }}</span>
          </div>
          <div class="flex items-center gap-2 text-[0.55rem] md:text-[0.6rem] uppercase tracking-[0.2em] font-bold">
            <svg class="w-3 md:w-3.5 h-3 md:h-3.5 text-gold-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            {{ location.time }}
          </div>
        </div>
      </div>
    </div>

    <!-- Active Indicator -->
    <div class="absolute top-6 right-6 w-8 h-8 rounded-full border border-ivory/20 flex items-center justify-center bg-ivory/5 opacity-0 group-hover:opacity-100 transition-all duration-700">
       <div class="w-1.5 h-1.5 rounded-full bg-gold-muted"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Location {
  name: string
  description: string
  address: string
  time: string
  icon: string
  image: string
}

defineProps<{
  location: Location
}>()
</script>
