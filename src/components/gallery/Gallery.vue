<template>
  <section class="w-full space-y-8 animate-fade-in-up">
    <div class="grid grid-cols-1 xl:grid-cols-[2fr,1fr] gap-8 items-start" v-reveal>
      <div class="space-y-6">
        <div class="flex flex-wrap justify-center xl:justify-start gap-3">
          <button
            v-for="category in categories"
            :key="category"
            @click="selectedCategory = category"
            class="px-5 py-2.5 rounded-lg font-medium transition-all duration-300 transform"
            :class="[
              selectedCategory === category
                ? 'bg-dore text-white scale-105 shadow-lg shadow-dore/30'
                : 'bg-white text-marron hover:bg-dore/10 border border-dore/30 hover:-translate-y-0.5'
            ]"
          >
            {{ categoryIllustrations[category] }} {{ t(`gallery.categories.${category}`) }}
          </button>
        </div>

        <div v-if="loading" class="text-center py-10">
          <div class="inline-block w-8 h-8 border-4 border-dore/30 border-t-dore rounded-full animate-spin"></div>
        </div>

        <EmptyState
          v-else-if="filteredPhotos.length === 0"
          :title="selectedCategory === 'all' ? t('gallery.emptyTitle') : t('gallery.emptyCategoryTitle', { category: t(`gallery.categories.${selectedCategory}`) })"
          :description="t('gallery.empty')"
          :hint="t('gallery.emptyHint')"
          :icon="categoryIllustrations[selectedCategory]"
        />

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            v-for="(photo, idx) in filteredPhotos"
            :key="photo.id"
            class="relative overflow-hidden rounded-lg transition-all duration-500 cursor-pointer group animate-fade-up hover:-translate-y-1 hover:shadow-xl"
            :style="{ 'animation-delay': `${idx * 90}ms` }"
            @click="openLightbox(idx)"
          >
            <img :src="photo.url" :alt="photo.titre || 'Photo souvenir'" class="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <h3 class="text-lg font-semibold text-white">{{ photo.titre }}</h3>
              <p class="text-sm text-white/80">{{ photo.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <aside class="upload-panel rounded-lg p-6 border border-dore/25 bg-gradient-to-b from-white/90 to-amber-50/60 backdrop-blur-sm" v-reveal="{ delay: 160 }">
        <h2 class="font-serif text-2xl text-marron-dark mb-2">{{ t('gallery.uploadTitle') }}</h2>
        <p class="text-sm text-marron/80 mb-5">{{ t('gallery.uploadSubtitle') }}</p>

        <form class="space-y-4" @submit.prevent="handleUpload">
          <div>
            <label class="block text-sm font-medium mb-1 text-marron-dark">{{ t('gallery.form.title') }}</label>
            <input v-model="uploadForm.titre" type="text" required class="field" :placeholder="t('gallery.form.titlePlaceholder')" />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1 text-marron-dark">{{ t('gallery.form.description') }}</label>
            <textarea v-model="uploadForm.description" rows="3" class="field" :placeholder="t('gallery.form.descriptionPlaceholder')"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1 text-marron-dark">{{ t('gallery.form.category') }}</label>
            <select v-model="uploadForm.categorie" class="field" required>
              <option v-for="category in uploadableCategories" :key="category" :value="category">
                {{ t(`gallery.categories.${category}`) }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1 text-marron-dark">{{ t('gallery.form.file') }}</label>
            <div
              class="dropzone"
              :class="{ 'dropzone-active': isDragging }"
              @dragover.prevent="onDragOver"
              @dragleave.prevent="onDragLeave"
              @drop.prevent="onDropFiles"
              @click="openFilePicker"
            >
              <div class="mx-auto w-14 h-14 rounded-2xl bg-dore/15 flex items-center justify-center text-2xl mb-3" :class="isDragging ? 'animate-pulse' : 'animate-float-soft'">📤</div>
              <p class="text-sm font-semibold text-marron-dark">{{ t('gallery.form.dropzoneTitle') }}</p>
              <p class="text-xs text-marron/70 mt-1">{{ t('gallery.form.dropzoneSubtitle') }}</p>
              <div class="mt-3 flex justify-center gap-2 text-xs text-marron/65">
                <span class="px-2 py-1 rounded-full bg-white/70">JPG</span>
                <span class="px-2 py-1 rounded-full bg-white/70">PNG</span>
                <span class="px-2 py-1 rounded-full bg-white/70">WEBP</span>
              </div>
              <p v-if="selectedFiles.length" class="mt-2 text-xs text-marron/80 font-medium">
                {{ t('gallery.form.selectedFiles', { count: selectedFiles.length }) }}
              </p>
            </div>
            <input ref="visitorFileInput" type="file" accept="image/*" multiple @change="onFileChange" class="sr-only" required />
          </div>

          <p v-if="uploadFeedback" class="text-sm" :class="uploadSuccess ? 'text-green-700' : 'text-red-700'">{{ uploadFeedback }}</p>

          <button type="submit" class="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-dore to-dore-dark text-marron-dark font-semibold hover:brightness-105 transition disabled:opacity-60 shadow-md shadow-dore/20" :disabled="uploading">
            {{ uploading ? t('gallery.form.uploading') : t('gallery.form.submit') }}
          </button>
          <p class="text-xs text-marron/75">{{ t('gallery.form.pendingHint') }}</p>
        </form>
      </aside>
    </div>

    <Teleport to="body">
      <transition name="fade-scale">
        <div
          v-if="lightboxOpen"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
          @click="closeLightbox"
        >
          <button @click.stop="closeLightbox" class="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <button v-if="currentIndex > 0" @click.stop="prevPhoto" class="absolute left-6 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
          </button>

          <button v-if="currentIndex < filteredPhotos.length - 1" @click.stop="nextPhoto" class="absolute right-6 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </button>

          <div @click.stop class="relative max-w-6xl w-full max-h-[90vh] flex items-center justify-center">
            <img :key="currentPhoto?.id" :src="currentPhoto?.url" :alt="currentPhoto?.titre || ''" class="max-w-full max-h-[80vh] rounded-lg shadow-xl object-cover" />
          </div>

          <div class="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 text-white rounded-md p-4 max-w-[90%] text-center">
            <h3 class="font-semibold text-lg">{{ currentPhoto?.titre }}</h3>
            <p class="text-sm text-white/80 mt-1">{{ currentPhoto?.description }}</p>
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
const isDragging = ref(false)

const categories = ['all', 'couple', 'family', 'friends', 'ceremony', 'reception']
const uploadableCategories = categories.filter(category => category !== 'all')
const categoryIllustrations: Record<string, string> = {
  all: '🖼️',
  couple: '💍',
  family: '👨‍👩‍👧‍👦',
  friends: '🥂',
  ceremony: '⛪',
  reception: '🎉'
}

const { photos, loading, uploading, fetchPublicPhotos, uploadVisitorPhotos } = useGallery()

const uploadForm = ref({
  titre: '',
  description: '',
  categorie: 'couple'
})

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

function nextPhoto() {
  if (currentIndex.value < filteredPhotos.value.length - 1) currentIndex.value++
}

function prevPhoto() {
  if (currentIndex.value > 0) currentIndex.value--
}

function setFiles(files: File[]) {
  selectedFiles.value = files.filter(file => file.type.startsWith('image/'))
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  setFiles(Array.from(target.files || []))
}

function openFilePicker() {
  visitorFileInput.value?.click()
}

function onDragOver() {
  isDragging.value = true
}

function onDragLeave() {
  isDragging.value = false
}

function onDropFiles(event: DragEvent) {
  isDragging.value = false
  setFiles(Array.from(event.dataTransfer?.files || []))
}

function resetUploadForm() {
  uploadForm.value = { titre: '', description: '', categorie: 'couple' }
  selectedFiles.value = []
  if (visitorFileInput.value) {
    visitorFileInput.value.value = ''
  }
}

async function handleUpload() {
  if (selectedFiles.value.length === 0) {
    uploadSuccess.value = false
    uploadFeedback.value = t('gallery.form.fileRequired')
    return
  }

  const { error, data } = await uploadVisitorPhotos(selectedFiles.value, uploadForm.value)

  uploadSuccess.value = !error
  uploadFeedback.value = error
    ? t('gallery.form.error', { error })
    : t('gallery.form.success', { count: data?.length || 0 })

  if (!error) {
    resetUploadForm()
  }
}

function handleKeyPress(e: KeyboardEvent) {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape') closeLightbox()
  else if (e.key === 'ArrowRight') nextPhoto()
  else if (e.key === 'ArrowLeft') prevPhoto()
}

onMounted(async () => {
  await fetchPublicPhotos()
  window.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.animate-fade-up { animation: fadeUp 0.6s forwards; }
@keyframes fadeUp {
  0% { opacity: 0; transform: translateY(16px); }
  100% { opacity: 1; transform: translateY(0); }
}

.upload-panel {
  box-shadow: 0 10px 35px rgba(43, 30, 18, 0.08);
}

.field {
  width: 100%;
  border: 1px solid rgba(var(--color-dore-rgb), 0.4);
  border-radius: 0.7rem;
  padding: 0.6rem 0.75rem;
  color: var(--color-marron-dark);
  background: rgba(255, 252, 245, 0.95);
}

.field:focus {
  outline: none;
  border-color: rgba(var(--color-dore-rgb), 0.95);
  box-shadow: 0 0 0 3px rgba(var(--color-dore-rgb), 0.2);
}

.field::placeholder {
  color: rgba(80, 57, 38, 0.45);
}

.dropzone {
  border: 1px dashed rgba(var(--color-dore-rgb), 0.55);
  border-radius: 0.7rem;
  background: rgba(255, 255, 255, 0.65);
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.25s ease;
}

.dropzone:hover {
  border-color: rgba(var(--color-dore-rgb), 0.85);
  background: rgba(255, 255, 255, 0.8);
}

.dropzone-active {
  border-color: rgba(var(--color-dore-rgb), 0.95);
  background: rgba(var(--color-dore-rgb), 0.12);
  box-shadow: 0 0 0 3px rgba(var(--color-dore-rgb), 0.2);
}

.fade-scale-enter-active,
.fade-scale-leave-active { transition: all 0.25s ease; }
.fade-scale-enter-from,
.fade-scale-leave-to { opacity: 0; transform: scale(0.97); }
</style>
