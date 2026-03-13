<template>
  <section class="max-w-6xl mx-auto space-y-24 animate-fade-in-up">
    <!-- Minimalist Category Filter & Action Bar -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-10 border-b border-stone/10 pb-10">
      <div class="flex flex-nowrap md:flex-wrap gap-4 md:gap-6 overflow-x-auto pb-4 md:pb-0 w-full no-scrollbar">
        <button v-for="cat in categories" :key="cat" @click="selectedCategory = cat" class="px-6 py-2.5 text-[0.6rem] uppercase tracking-[0.3em] font-bold transition-all duration-700 rounded-full whitespace-nowrap" :class="selectedCategory === cat ? 'bg-ebony text-ivory shadow-floating' : 'text-stone hover:text-ebony hover:bg-stone/10'">
          {{ t(`gallery.categories.${cat}`) }}
        </button>
      </div>
      
      <div class="text-[0.55rem] uppercase tracking-widest text-stone font-bold">
        {{ filteredPhotos.length }} Fragments affichés
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-12 gap-20">
      <!-- Standardized Grid: 3 Columns -->
      <div class="xl:col-span-8">
        <div v-if="loading" class="h-64 flex items-center justify-center">
            <div class="w-8 h-[1px] bg-stone animate-pulse"></div>
        </div>

        <EmptyState v-else-if="filteredPhotos.length === 0" :description="t('gallery.empty')" compact />

        <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          <div v-for="(photo, idx) in filteredPhotos" :key="photo.id" class="group relative aspect-[4/5] bg-stone/5 overflow-hidden transition-all duration-1000 cursor-pointer shadow-editorial hover:shadow-floating rounded-2xl" @click="openLightbox(idx)">
            <img :src="photo.url" :alt="photo.titre || ''" class="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110 grayscale group-hover:grayscale-0" />
            <div class="absolute inset-0 bg-ebony/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end p-8">
               <span class="text-[0.6rem] uppercase tracking-widest text-ivory/60 mb-2">{{ photo.categorie }}</span>
               <h3 class="text-xl font-serif text-ivory">{{ photo.titre }}</h3>
            </div>
          </div>
        </div>
      </div>

      <!-- Couture Upload SidePanel -->
      <aside class="xl:col-span-4 p-12 bg-white border border-stone/30 shadow-floating h-fit sticky top-32" v-reveal="{ delay: 200 }">
        <h2 class="font-serif text-3xl text-ebony mb-8">{{ t('gallery.uploadTitle') }}</h2>
        
        <form class="space-y-10" @submit.prevent="handleUpload">
          <div class="group border-b border-stone/30 focus-within:border-ebony transition-all duration-700 pb-2">
            <label class="text-[0.6rem] uppercase tracking-widest text-stone mb-2 block">{{ t('gallery.form.title') }}</label>
            <input v-model="uploadForm.titre" type="text" required class="w-full bg-transparent border-none p-0 text-sm font-serif text-ebony focus:ring-0 placeholder-stone/20" :placeholder="t('gallery.form.titlePlaceholder')" />
          </div>

          <div class="group border-b border-stone/30 focus-within:border-ebony transition-all duration-700 pb-2">
            <label class="text-[0.6rem] uppercase tracking-widest text-stone mb-2 block">{{ t('gallery.form.category') }}</label>
            <select v-model="uploadForm.categorie" class="w-full bg-transparent border-none p-0 text-sm font-sans font-bold text-ebony focus:ring-0 appearance-none uppercase tracking-widest" required>
              <option v-for="category in uploadableCategories" :key="category" :value="category">{{ t(`gallery.categories.${category}`) }}</option>
            </select>
          </div>

          <!-- Editorial Dropzone -->
          <div class="relative group cursor-pointer" @click="openFilePicker">
            <div class="w-full aspect-square border border-dashed border-stone/30 flex flex-col items-center justify-center gap-4 transition-all duration-700 group-hover:border-gold-muted group-hover:bg-ivory/50">
               <div class="w-10 h-10 rounded-full border border-stone/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-stone group-hover:text-gold-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4" /></svg>
               </div>
               <span class="text-[0.6rem] uppercase tracking-widest text-stone font-bold group-hover:text-ebony">{{ selectedFiles.length ? `${selectedFiles.length} Fichiers` : 'Déposer ici' }}</span>
            </div>
            <input ref="visitorFileInput" type="file" accept="image/*" multiple @change="onFileChange" class="sr-only" required />
          </div>

          <button type="submit" class="w-full py-5 bg-ebony text-ivory text-[0.65rem] uppercase tracking-[0.4em] font-bold hover:bg-gold-muted transition-all duration-700 shadow-floating disabled:opacity-20" :disabled="uploading">
            {{ uploading ? t('gallery.form.uploading') : t('gallery.form.submit') }}
          </button>
          
          <p v-if="uploadFeedback" class="text-[0.65rem] uppercase tracking-widest text-center" :class="uploadSuccess ? 'text-emerald-600' : 'text-danger'">{{ uploadFeedback }}</p>
        </form>
      </aside>
    </div>

    <!-- Minimalist Lightbox -->
    <Teleport to="body">
      <transition name="fade">
        <div v-if="lightboxOpen" class="fixed inset-0 z-[100] bg-ivory/98 backdrop-blur-xl flex items-center justify-center p-8 md:p-20" @click="closeLightbox">
          <button class="absolute top-10 right-10 text-ebony hover:text-gold-muted transition-colors"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M6 18L18 6M6 6l12 12" /></svg></button>
          
          <div class="relative w-full h-full flex items-center justify-center" @click.stop>
             <Transition name="fade-slide" mode="out-in">
                <div :key="currentPhoto?.id" class="w-full h-full flex flex-col md:flex-row items-center gap-16">
                   <div class="flex-1 h-full max-h-[70vh] flex items-center justify-center">
                      <img :src="currentPhoto?.url" class="max-w-full max-h-full shadow-floating grayscale-[0.3]" />
                   </div>
                   <div class="md:w-80 space-y-8">
                      <span class="text-[0.65rem] uppercase tracking-[0.6em] text-gold-muted font-bold block">{{ currentPhoto?.categorie }}</span>
                      <h3 class="text-4xl md:text-6xl font-serif text-ebony leading-tight">{{ currentPhoto?.titre }}</h3>
                      <p class="text-sm font-light leading-loose text-content-secondary italic">"{{ currentPhoto?.description || 'Instant de bonheur partagé.' }}"</p>
                   </div>
                </div>
             </Transition>
          </div>
        </div>
      </transition>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useGallery } from '@/composables/useGallery'
import EmptyState from '@/components/common/EmptyState.vue'
import { t } from '@/i18n'

const selectedCategory = ref('all')
const lightboxOpen = ref(false)
const currentIndex = ref(0)
const selectedFiles = ref<File[]>([])
const visitorFileInput = ref<HTMLInputElement | null>(null)
const uploadFeedback = ref('')
const uploadSuccess = ref(false)

const categories = ['all', 'couple', 'family', 'friends', 'ceremony', 'reception']
const uploadableCategories = categories.filter(category => category !== 'all')

const { photos, loading, uploading, fetchPublicPhotos, uploadVisitorPhotos } = useGallery()

const uploadForm = ref({ titre: '', description: '', categorie: 'couple' })

const filteredPhotos = computed(() => {
  if (selectedCategory.value === 'all') return photos.value
  return photos.value.filter(photo => photo.categorie === selectedCategory.value)
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

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  selectedFiles.value = Array.from(target.files || []).filter(file => file.type.startsWith('image/'))
}

function openFilePicker() { visitorFileInput.value?.click() }

async function handleUpload() {
  if (selectedFiles.value.length === 0) return
  const { error } = await uploadVisitorPhotos(selectedFiles.value, uploadForm.value)
  uploadSuccess.value = !error
  uploadFeedback.value = error ? 'Erreur' : 'Transmis'
  if (!error) {
    uploadForm.value = { titre: '', description: '', categorie: 'couple' }
    selectedFiles.value = []
  }
}

function handleKeyPress(e: KeyboardEvent) {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape') closeLightbox()
  else if (e.key === 'ArrowRight' && currentIndex.value < filteredPhotos.value.length - 1) currentIndex.value++
  else if (e.key === 'ArrowLeft' && currentIndex.value > 0) currentIndex.value--
}

onMounted(async () => {
  await fetchPublicPhotos()
  window.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
})
</script>

<style scoped>
.animate-fade-in-up { animation: fadeInUp 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }

.animate-scale-in-x {
  animation: scaleInX 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  transform-origin: left;
}
@keyframes scaleInX {
  from { transform: scaleX(0); opacity: 0; }
  to { transform: scaleX(1); opacity: 1; }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.8s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.fade-slide-enter-active, .fade-slide-leave-active { transition: all 1s cubic-bezier(0.16, 1, 0.3, 1); }
.fade-slide-enter-from { opacity: 0; transform: translateX(40px); }
.fade-slide-leave-to { opacity: 0; transform: translateX(-40px); }
</style>
