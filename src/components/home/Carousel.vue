<template>
  <section class="relative w-full overflow-hidden">
    <!-- Slides -->
    <div class="relative w-full h-80 sm:h-[400px] md:h-[500px] lg:h-[600px]">
      <transition-group name="fade-slide" tag="div" class="relative h-full">
        <div
            v-for="(image, index) in images"
            :key="index"
            v-show="currentIndex === index"
            class="absolute inset-0"
        >
          <!-- Image -->
          <img
              :src="image.url"
              :alt="image.alt"
              class="w-full h-full object-cover"
          />

          <!-- Overlay for readability -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>

          <!-- Caption -->
          <div class="absolute bottom-6 left-6 right-6 text-center sm:text-left">
            <h3 class="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white animate-fade-in-up">
              {{ image.title }}
            </h3>
            <p class="text-sm sm:text-base md:text-lg text-white/80 animate-fade-in-up delay-100 mt-1">
              {{ image.caption }}
            </p>
          </div>
        </div>
      </transition-group>
    </div>

    <!-- Navigation Arrows -->
    <button
        @click="prev"
        class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface-elevated/90 hover:bg-surface-elevated flex items-center justify-center text-content-primary hover:text-dore transition-all duration-300"
        aria-label="Image précédente"
    >
      <svg class="w-5 sm:w-6 h-5 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <button
        @click="next"
        class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface-elevated/90 hover:bg-surface-elevated flex items-center justify-center text-content-primary hover:text-dore transition-all duration-300"
        aria-label="Image suivante"
    >
      <svg class="w-5 sm:w-6 h-5 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>

    <!-- Dots Indicators -->
    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
      <button
          v-for="(_, idx) in images"
          :key="idx"
          @click="goTo(idx)"
          class="transition-all duration-300 rounded-full"
          :class="currentIndex === idx ? 'bg-dore w-6 h-2 sm:w-8 sm:h-2' : 'bg-surface-elevated/60 hover:bg-surface-elevated/80 w-3 h-3'"
          :aria-label="`Aller à l'image ${idx + 1}`"
      ></button>
    </div>

    <!-- Autoplay Toggle -->
    <button
        v-if="autoplay"
        @click="toggleAutoplay"
        class="absolute top-4 right-4 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface-elevated/90 hover:bg-surface-elevated flex items-center justify-center text-content-primary hover:text-dore transition-all duration-300"
        :aria-label="isPlaying ? 'Pause' : 'Play'"
    >
      <svg v-if="isPlaying" class="w-5 sm:w-6 h-5 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
      </svg>
      <svg v-else class="w-5 sm:w-6 h-5 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z"/>
      </svg>
    </button>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface CarouselImage {
  url: string
  alt: string
  title: string
  caption: string
}

interface Props {
  images: CarouselImage[]
  autoplay?: boolean
  interval?: number
}

const props = withDefaults(defineProps<Props>(), {
  autoplay: true,
  interval: 5000
})

const currentIndex = ref(0)
const isPlaying = ref(props.autoplay)
let intervalId: ReturnType<typeof setInterval> | null = null

function next() {
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

function prev() {
  currentIndex.value = currentIndex.value === 0 ? props.images.length - 1 : currentIndex.value - 1
}

function goTo(index: number) {
  currentIndex.value = index
}

function startAutoplay() {
  stopAutoplay()
  intervalId = setInterval(next, props.interval)
}

function stopAutoplay() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

function toggleAutoplay() {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value) startAutoplay()
  else stopAutoplay()
}

onMounted(() => {
  if (props.autoplay && isPlaying.value) startAutoplay()
})

onUnmounted(() => stopAutoplay())
</script>

<style scoped>
/* Fade + Slide Animation */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.fade-slide-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.fade-slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

/* Text animation */
@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(15px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease forwards;
}
.animate-fade-in-up.delay-100 {
  animation-delay: 0.1s;
}
</style>
