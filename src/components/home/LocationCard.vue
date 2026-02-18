<template>
  <div class="relative h-80 rounded-2xl overflow-hidden shadow-lg group">
    <!-- Image de fond -->
    <img
        :src="location.image"
        :alt="location.name"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
    />

    <!-- Overlay sombre pour lisibilité -->
    <div class="absolute inset-0 bg-black/40"></div>

    <!-- Texte par-dessus -->
    <div class="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end text-white">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-2xl sm:text-3xl">{{ location.icon }}</span>
        <h3 class="text-xl sm:text-2xl font-semibold">{{ location.name }}</h3>
      </div>
      <p class="text-sm sm:text-base mb-2 line-clamp-3">
        {{ location.description }}
      </p>
      <div class="flex items-center text-xs sm:text-sm opacity-80 mb-1">
        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
        </svg>
        {{ location.address }}
      </div>
      <div class="flex items-center text-xs sm:text-sm opacity-80">
        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
        </svg>
        {{ location.time }}
      </div>
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

<style scoped>
/* Pour couper les textes longs sur mobile */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
