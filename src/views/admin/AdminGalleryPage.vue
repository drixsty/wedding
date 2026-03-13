<template>
  <section class="space-y-20 animate-fade-in-up">
    <!-- Workflow Guidance: Atelier Style -->
    <div class="grid grid-cols-1 gap-10 md:grid-cols-3">
      <article v-for="(step, idx) in ['Import officiel', 'Modération', 'Nettoyage']" :key="step" class="bg-white p-10 border border-stone/10 shadow-editorial group hover:shadow-floating transition-all duration-700">
        <div class="w-10 h-10 border border-stone/10 text-stone flex items-center justify-center mb-6 group-hover:border-ebony group-hover:text-ebony transition-all">
           <span class="text-[0.6rem] font-bold font-serif">0{{ idx + 1 }}</span>
        </div>
        <p class="text-[0.65rem] uppercase tracking-widest text-ebony font-bold">{{ step }}</p>
        <p class="mt-4 text-[0.6rem] text-stone uppercase tracking-widest leading-loose">Processus de curation pour une galerie impeccable.</p>
      </article>
    </div>

    <!-- Upload Section -->
    <div class="bg-white p-12 border border-stone/10 shadow-editorial">
      <div class="flex flex-wrap items-center justify-between gap-10 mb-16">
        <div class="space-y-4">
          <h2 class="text-3xl font-serif text-ebony">{{ t('admin.dashboard.galleryManagementTitle') }}</h2>
          <p class="text-[0.65rem] uppercase tracking-widest text-stone font-bold">{{ t('admin.dashboard.galleryManagementDescription') }}</p>
        </div>
        <button @click="loadAdminPhotos" class="flex items-center gap-3 text-[0.6rem] uppercase tracking-[0.3em] font-bold text-stone hover:text-ebony transition-all group">
           <span class="border-b border-stone/20 group-hover:border-ebony pb-1">{{ t('admin.dashboard.refreshGallery') }}</span>
           <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 transition-transform duration-700 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>
      </div>

      <form class="grid grid-cols-1 md:grid-cols-2 gap-16" @submit.prevent="handleAdminUpload">
        <div class="space-y-10">
          <div class="group border-b border-stone/30 focus-within:border-ebony transition-all duration-700 pb-2">
            <label class="text-[0.6rem] uppercase tracking-widest text-stone mb-2 block">{{ t('admin.dashboard.adminUploadTitle') }}</label>
            <input v-model="adminUploadForm.titre" type="text" class="w-full bg-transparent border-none p-0 text-sm font-serif text-ebony focus:ring-0 placeholder-stone/20" :placeholder="t('admin.dashboard.adminUploadTitlePlaceholder')" required />
          </div>
          <div class="group border-b border-stone/30 focus-within:border-ebony transition-all duration-700 pb-2">
            <label class="text-[0.6rem] uppercase tracking-widest text-stone mb-2 block">{{ t('admin.dashboard.adminUploadCategory') }}</label>
            <select v-model="adminUploadForm.categorie" class="w-full bg-transparent border-none p-0 text-xs font-bold uppercase tracking-widest text-ebony focus:ring-0 appearance-none" required>
              <option v-for="category in uploadableCategories" :key="category" :value="category">{{ category }}</option>
            </select>
          </div>
          <div class="relative group cursor-pointer" @click="adminFileInput?.click()">
            <div class="w-full py-16 border border-dashed border-stone/30 flex flex-col items-center justify-center gap-4 transition-all duration-700 group-hover:border-gold-muted group-hover:bg-ivory/50">
                <div class="w-10 h-10 rounded-full border border-stone/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-stone group-hover:text-gold-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                </div>
                <p class="text-[0.6rem] uppercase tracking-widest font-bold text-stone group-hover:text-ebony">Sélectionner ou déposer</p>
            </div>
            <input ref="adminFileInput" type="file" multiple accept="image/*" class="sr-only" @change="onAdminFilesChange" required />
            <p v-if="adminUploadFiles.length > 0" class="mt-4 text-[0.65rem] text-gold-muted font-bold tracking-widest uppercase">{{ adminUploadFiles.length }} Fichiers prêts</p>
          </div>
        </div>

        <div class="space-y-10 flex flex-col">
          <div class="group border-b border-stone/30 focus-within:border-ebony transition-all duration-700 pb-2">
            <label class="text-[0.6rem] uppercase tracking-widest text-stone mb-2 block">{{ t('admin.dashboard.adminUploadDescription') }}</label>
            <textarea v-model="adminUploadForm.description" class="w-full bg-transparent border-none p-0 text-sm font-serif text-ebony focus:ring-0 placeholder-stone/20 leading-relaxed" rows="5" :placeholder="t('admin.dashboard.adminUploadDescriptionPlaceholder')"></textarea>
          </div>
          <div class="mt-auto pt-10">
            <button type="submit" class="w-full relative py-6 bg-ebony text-ivory text-[0.65rem] uppercase tracking-[0.5em] font-bold overflow-hidden group shadow-floating disabled:opacity-20" :disabled="galleryUploading">
              <span class="relative z-10">{{ galleryUploading ? t('admin.dashboard.adminUploadInProgress') : t('admin.dashboard.adminUploadSubmit') }}</span>
              <div class="absolute inset-0 bg-gold-muted transform translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
            </button>
            <p v-if="adminGalleryFeedback" class="mt-4 text-[0.65rem] uppercase tracking-widest text-center" :class="adminGallerySuccess ? 'text-emerald-600' : 'text-rose-600'">{{ adminGalleryFeedback }}</p>
          </div>
        </div>
      </form>
    </div>

    <!-- Bulk Selection Bar -->
    <div v-if="selectedPhotos.length > 0" class="fixed bottom-10 left-1/2 -translate-x-1/2 z-30 bg-ebony text-ivory px-10 py-6 shadow-floating flex items-center gap-12 animate-fade-in-up border border-stone/10">
      <div class="flex items-center gap-4">
        <div class="w-8 h-8 border border-ivory/20 flex items-center justify-center font-bold text-xs">{{ selectedPhotos.length }}</div>
        <span class="text-[0.6rem] uppercase tracking-widest font-bold">Sélection</span>
      </div>
      <div class="flex gap-8">
        <button @click="bulkSetPhotoVisibility(true)" class="text-[0.6rem] uppercase tracking-widest font-bold hover:text-emerald-400 transition-colors">Publier</button>
        <button @click="bulkSetPhotoVisibility(false)" class="text-[0.6rem] uppercase tracking-widest font-bold hover:text-stone transition-colors">Masquer</button>
        <button @click="bulkDeletePhotos" class="text-[0.6rem] uppercase tracking-widest font-bold text-rose-600 hover:brightness-125 transition-all">Supprimer</button>
      </div>
    </div>

    <!-- Gallery Grid: The Atelier Archive -->
    <div v-if="galleryLoading" class="p-20 text-center"><div class="w-8 h-[1px] bg-stone mx-auto animate-pulse"></div></div>
    <EmptyState v-else-if="adminPhotos.length === 0" :description="t('admin.dashboard.galleryEmpty')" compact />
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
      <article v-for="photo in adminPhotos" :key="photo.id" class="group bg-white border border-stone/10 shadow-editorial overflow-hidden flex flex-col transition-all duration-700 hover:shadow-floating">
        <div class="relative aspect-square overflow-hidden bg-ivory">
          <img :src="photo.url" :alt="photo.titre || ''" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[2s]" />
          <div class="absolute inset-0 bg-ebony/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div class="absolute top-4 left-4">
            <input type="checkbox" :value="photo.id" v-model="selectedPhotos" class="w-4 h-4 border-stone/20 text-ebony focus:ring-ebony" />
          </div>

          <div class="absolute top-4 right-4 capitalize">
            <span class="px-2 py-1 bg-white/80 backdrop-blur-sm border border-stone/10 text-[0.5rem] font-bold tracking-widest text-ebony">
              {{ photo.uploaded_by_guest ? 'Invité' : 'Couple' }}
            </span>
          </div>

          <!-- Hover Actions -->
          <div class="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 flex gap-4">
            <button @click="togglePhotoVisibility(photo.id, !(photo.visible ?? true))" class="flex-1 py-3 bg-white text-[0.55rem] font-bold uppercase tracking-widest text-ebony border border-stone/10 hover:border-ebony transition-all">
               {{ photo.visible ? 'Masquer' : 'Afficher' }}
            </button>
            <button @click="removePhoto(photo.id)" class="px-4 bg-white text-rose-600 border border-stone/10 hover:border-rose-600 transition-all">
               <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7" /></svg>
            </button>
          </div>
        </div>

        <div class="p-8 space-y-4">
           <div class="flex justify-between items-start">
              <h3 class="font-serif text-lg text-ebony truncate max-w-[70%]">{{ photo.titre || 'Untethered' }}</h3>
              <span class="text-[0.55rem] font-bold text-gold-muted uppercase tracking-widest">{{ photo.categorie }}</span>
           </div>
           
           <div class="flex items-center justify-between pt-4 border-t border-stone/5">
              <div class="flex items-center gap-2">
                 <div class="w-1 h-1 rounded-full" :class="photo.visible ? 'bg-emerald-500' : 'bg-rose-600'"></div>
                 <span class="text-[0.55rem] font-bold text-stone uppercase tracking-widest">{{ photo.visible ? 'En ligne' : 'Privé' }}</span>
              </div>
              <span class="text-[0.5rem] text-stone tracking-widest uppercase">{{ formatDateShort(photo.created_at) }}</span>
           </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useGallery } from '@/composables/useGallery'
import EmptyState from '@/components/common/EmptyState.vue'
import { t } from '@/i18n'
import dayjs from 'dayjs'

const {
  photos: adminPhotos,
  loading: galleryLoading,
  fetchAdminPhotos,
  uploadAdminPhotos,
  setPhotoVisibility,
  setPhotosVisibility,
  deletePhoto,
  deletePhotos,
  uploading: galleryUploading
} = useGallery()

const uploadableCategories = ['couple', 'family', 'friends', 'ceremony', 'reception']
const selectedPhotos = ref<string[]>([])
const adminFileInput = ref<HTMLInputElement | null>(null)
const adminUploadFiles = ref<File[]>([])
const adminUploadForm = ref({ titre: '', description: '', categorie: 'couple' })
const adminGalleryFeedback = ref<string | null>(null)
const adminGallerySuccess = ref(false)

const formatDateShort = (date: string) => date ? dayjs(date).format('DD.MM.YY') : '--.--.--'

async function loadAdminPhotos() {
  await fetchAdminPhotos()
  selectedPhotos.value = []
}

function onAdminFilesChange(event: Event) {
  const target = event.target as HTMLInputElement
  adminUploadFiles.value = Array.from(target.files || [])
}

function resetAdminUploadForm() {
  adminUploadForm.value = { titre: '', description: '', categorie: 'couple' }
  adminUploadFiles.value = []
  if (adminFileInput.value) adminFileInput.value.value = ''
}

async function handleAdminUpload() {
  adminGalleryFeedback.value = null
  if (adminUploadFiles.value.length === 0) {
    adminGallerySuccess.value = false
    adminGalleryFeedback.value = t('admin.dashboard.adminUploadFileRequired')
    return
  }

  const { error } = await uploadAdminPhotos(adminUploadFiles.value, adminUploadForm.value)
  adminGallerySuccess.value = !error
  adminGalleryFeedback.value = error ? 'Erreur de transfert' : 'Transfert réussi'
  if (!error) resetAdminUploadForm()
}

async function togglePhotoVisibility(photoId: string, visible: boolean) { await setPhotoVisibility(photoId, visible) }

async function bulkSetPhotoVisibility(visible: boolean) {
  if (selectedPhotos.value.length === 0) return
  await setPhotosVisibility(selectedPhotos.value, visible)
  selectedPhotos.value = []
}

async function bulkDeletePhotos() {
  if (selectedPhotos.value.length === 0) return
  if (confirm('Confirmer la suppression ?')) {
    await deletePhotos(selectedPhotos.value)
    selectedPhotos.value = []
  }
}

async function removePhoto(photoId: string) {
  if (confirm('Confirmer la suppression ?')) {
    await deletePhoto(photoId)
    selectedPhotos.value = selectedPhotos.value.filter(id => id !== photoId)
  }
}

onMounted(loadAdminPhotos)
</script>

<style scoped>
.animate-fade-in-up { animation: fadeInUp 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
</style>
