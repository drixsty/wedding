<template>
  <section class="w-full">
    <!-- Filter Tabs -->
    <div class="flex flex-wrap justify-center gap-4 mb-10">
      <button
          v-for="category in categories"
          :key="category"
          @click="selectedCategory = category"
          class="px-6 py-3 rounded-2xl font-medium transition-all duration-300 transform"
          :class="[
          selectedCategory === category
            ? 'bg-dore text-white scale-105 animate-fade-in-up'
            : 'bg-white text-marron hover:bg-dore/10 border border-dore/30'
        ]"
      >
        {{ category }}
      </button>
    </div>

    <!-- Masonry Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
          v-for="(photo, idx) in filteredPhotos"
          :key="photo.id"
          class="relative overflow-hidden rounded-2xl transition-all duration-500 cursor-pointer group animate-fade-up"
          :style="{ 'animation-delay': `${idx * 100}ms` }"
          @click="openLightbox(idx)"
      >
        <img
            :src="photo.url"
            :alt="photo.title"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
        />
        <div
            class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4"
        >
          <h3 class="text-lg font-semibold text-white">{{ photo.title }}</h3>
          <p class="text-sm text-white/80">{{ photo.description }}</p>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <transition name="fade-scale">
        <div
            v-if="lightboxOpen"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
            @click="closeLightbox"
        >
          <!-- Close Button -->
          <button
              @click.stop="closeLightbox"
              class="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-200 animate-fade-in"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Prev/Next -->
          <button
              v-if="currentIndex > 0"
              @click.stop="prevPhoto"
              class="absolute left-6 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition duration-200 animate-fade-in"
          >
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
              v-if="currentIndex < filteredPhotos.length - 1"
              @click.stop="nextPhoto"
              class="absolute right-6 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition duration-200 animate-fade-in"
          >
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <!-- Image -->
          <div @click.stop class="relative max-w-6xl w-full max-h-[90vh] flex items-center justify-center">
            <transition name="fade-scale" mode="out-in">
              <img
                  :key="currentPhoto?.id"
                  :src="currentPhoto?.url"
                  :alt="currentPhoto?.title"
                  class="max-w-full max-h-[80vh] rounded-2xl shadow-xl object-cover animate-fade-in-up"
              />
            </transition>
          </div>

          <!-- Caption -->
          <div
              class="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 text-white rounded-md p-4 max-w-[90%] text-center animate-fade-in-up"
          >
            <h3 class="font-semibold text-lg">{{ currentPhoto?.title }}</h3>
            <p class="text-sm text-white/80 mt-1">{{ currentPhoto?.description }}</p>
          </div>
        </div>
      </transition>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Photo {
  id: string
  url: string
  title: string
  description: string
  category: string
}

const selectedCategory = ref('Tous')
const lightboxOpen = ref(false)
const currentIndex = ref(0)

const categories = ['Tous', 'Couple', 'Famille', 'Amis', 'Cérémonie', 'Réception']
const photos = ref<Photo[]>([
  { id: '1', url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80', title: 'Notre Rencontre', description: 'Le jour où tout a commencé', category: 'Couple' },
  { id: '2', url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80', title: 'Voyage en Afrique', description: 'Safari inoubliable au Kenya', category: 'Couple' },
  { id: '3', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80', title: 'Famille Réunie', description: 'Nos deux familles ensemble', category: 'Famille' },
  { id: '4', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80', title: 'Soirée entre Amis', description: 'Célébration avec nos proches', category: 'Amis' },
  { id: '5', url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80', title: 'La Demande', description: 'Moment magique à Marrakech', category: 'Couple' },
  { id: '6', url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80', title: 'Fiançailles', description: 'Entourés de nos familles', category: 'Famille' }
])

const filteredPhotos = computed(() => {
  if (selectedCategory.value === 'Tous') return photos.value
  return photos.value.filter(photo => photo.category === selectedCategory.value)
})

const currentPhoto = computed(() => filteredPhotos.value[currentIndex.value] || null)

function openLightbox(idx: number) {
  currentIndex.value = idx
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}
function closeLightbox() {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}
function nextPhoto() {
  if (currentIndex.value < filteredPhotos.value.length - 1) currentIndex.value++
}
function prevPhoto() {
  if (currentIndex.value > 0) currentIndex.value--
}

function handleKeyPress(e: KeyboardEvent) {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape') closeLightbox()
  else if (e.key === 'ArrowRight') nextPhoto()
  else if (e.key === 'ArrowLeft') prevPhoto()
}

onMounted(() => window.addEventListener('keydown', handleKeyPress))
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* Fade + translate animations */
@keyframes fadeUp {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-up {
  animation: fadeUp 0.6s forwards;
}

@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.5s forwards;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
.animate-fade-in {
  animation: fadeIn 0.5s forwards;
}
</style>
