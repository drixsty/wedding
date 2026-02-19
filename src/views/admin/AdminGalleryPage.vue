<template>
  <section class="space-y-5 animate-fade-in">
    <div class="admin-panel">
      <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 class="admin-section-title">{{ t('admin.dashboard.galleryManagementTitle') }}</h2>
          <p class="text-sm text-slate-600">{{ t('admin.dashboard.galleryManagementDescription') }}</p>
        </div>
        <button @click="loadAdminPhotos" class="admin-btn admin-btn-muted">{{ t('admin.dashboard.refreshGallery') }}</button>
      </div>

      <form class="grid grid-cols-1 md:grid-cols-2 gap-4" @submit.prevent="handleAdminUpload">
        <div>
          <label class="admin-field-label">{{ t('admin.dashboard.adminUploadTitle') }}</label>
          <input v-model="adminUploadForm.titre" type="text" class="admin-input w-full" :placeholder="t('admin.dashboard.adminUploadTitlePlaceholder')" required />
        </div>
        <div>
          <label class="admin-field-label">{{ t('admin.dashboard.adminUploadCategory') }}</label>
          <select v-model="adminUploadForm.categorie" class="admin-input w-full" required>
            <option v-for="category in uploadableCategories" :key="category" :value="category">{{ category }}</option>
          </select>
        </div>
        <div class="md:col-span-2">
          <label class="admin-field-label">{{ t('admin.dashboard.adminUploadDescription') }}</label>
          <textarea v-model="adminUploadForm.description" class="admin-input w-full" rows="3" :placeholder="t('admin.dashboard.adminUploadDescriptionPlaceholder')"></textarea>
        </div>
        <div class="md:col-span-2">
          <label class="admin-field-label">{{ t('admin.dashboard.adminUploadImages') }}</label>
          <input ref="adminFileInput" type="file" multiple accept="image/*" class="admin-input w-full" @change="onAdminFilesChange" required />
        </div>
        <div class="md:col-span-2 flex flex-wrap items-center gap-2">
          <button type="submit" class="admin-btn" :disabled="galleryUploading">{{ galleryUploading ? t('admin.dashboard.adminUploadInProgress') : t('admin.dashboard.adminUploadSubmit') }}</button>
          <p v-if="adminGalleryFeedback" class="text-sm" :class="adminGallerySuccess ? 'text-emerald-600' : 'text-rose-600'">{{ adminGalleryFeedback }}</p>
        </div>
      </form>
    </div>

    <div v-if="selectedPhotos.length > 0" class="admin-panel !p-4 flex gap-2 flex-wrap items-center">
      <button @click="bulkSetPhotoVisibility(true)" class="admin-btn bg-emerald-500 text-white">{{ t('admin.dashboard.bulkPublishPhotos') }}</button>
      <button @click="bulkSetPhotoVisibility(false)" class="admin-btn bg-amber-500 text-white">{{ t('admin.dashboard.bulkHidePhotos') }}</button>
      <button @click="bulkDeletePhotos" class="admin-btn admin-btn-muted">{{ t('admin.dashboard.bulkDeletePhotos') }}</button>
      <span class="text-slate-600 text-sm">{{ t('admin.dashboard.selectedPhotosCount', { count: selectedPhotos.length }) }}</span>
    </div>

    <div class="admin-panel">
      <div v-if="galleryLoading" class="p-10 text-center">Chargement...</div>
      <EmptyState v-else-if="adminPhotos.length === 0" :description="t('admin.dashboard.galleryEmpty')" compact />
      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <article v-for="photo in adminPhotos" :key="photo.id" class="rounded-xl border border-slate-200 overflow-hidden bg-white">
          <div class="p-3 pb-0">
            <label class="inline-flex items-center gap-2 text-xs text-slate-500">
              <input type="checkbox" :value="photo.id" v-model="selectedPhotos" />
              {{ t('admin.dashboard.selectPhoto') }}
            </label>
          </div>
          <img :src="photo.url" :alt="photo.titre || 'Photo'" class="w-full h-44 object-cover" />
          <div class="p-4 space-y-2">
            <div class="flex items-start justify-between gap-2">
              <div>
                <h3 class="font-semibold text-slate-900">{{ photo.titre || t('admin.dashboard.noTitle') }}</h3>
                <p class="text-xs text-slate-500">{{ photo.categorie }}</p>
              </div>
              <span class="text-[11px] px-2 py-1 rounded-full" :class="photo.uploaded_by_guest ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-700'">
                {{ photo.uploaded_by_guest ? t('admin.dashboard.guestUpload') : t('admin.dashboard.coupleUpload') }}
              </span>
            </div>
            <p class="text-sm text-slate-600 line-clamp-2">{{ photo.description }}</p>
            <div class="flex items-center justify-between pt-2">
              <button
                @click="togglePhotoVisibility(photo.id, !(photo.visible ?? true))"
                class="admin-btn"
                :class="photo.visible ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'"
              >
                {{ photo.visible ? t('admin.dashboard.hidePhoto') : t('admin.dashboard.showPhoto') }}
              </button>
              <button @click="removePhoto(photo.id)" class="text-rose-600 text-sm">{{ t('admin.dashboard.deletePhoto') }}</button>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useGallery } from '@/composables/useGallery'
import EmptyState from '@/components/common/EmptyState.vue'
import { t } from '@/i18n'

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

  const { error, data } = await uploadAdminPhotos(adminUploadFiles.value, adminUploadForm.value)
  adminGallerySuccess.value = !error
  adminGalleryFeedback.value = error
    ? t('admin.dashboard.adminUploadError', { error })
    : t('admin.dashboard.adminUploadSuccess', { count: data?.length || 0 })

  if (!error) resetAdminUploadForm()
}

async function togglePhotoVisibility(photoId: string, visible: boolean) { await setPhotoVisibility(photoId, visible) }

async function bulkSetPhotoVisibility(visible: boolean) {
  if (selectedPhotos.value.length === 0) return
  const selectedCount = selectedPhotos.value.length
  const { error } = await setPhotosVisibility(selectedPhotos.value, visible)
  adminGallerySuccess.value = !error
  adminGalleryFeedback.value = error
    ? t('admin.dashboard.adminUploadError', { error })
    : t('admin.dashboard.bulkPhotosUpdated', { count: selectedCount })
  selectedPhotos.value = []
}

async function bulkDeletePhotos() {
  if (selectedPhotos.value.length === 0) return
  const selectedCount = selectedPhotos.value.length
  if (confirm(t('admin.dashboard.confirmDeletePhotos', { count: selectedCount }))) {
    const { error } = await deletePhotos(selectedPhotos.value)
    adminGallerySuccess.value = !error
    adminGalleryFeedback.value = error
      ? t('admin.dashboard.adminUploadError', { error })
      : t('admin.dashboard.bulkPhotosDeleted', { count: selectedCount })
    selectedPhotos.value = []
  }
}

async function removePhoto(photoId: string) {
  if (confirm(t('admin.dashboard.confirmDeletePhoto'))) {
    await deletePhoto(photoId)
    selectedPhotos.value = selectedPhotos.value.filter(id => id !== photoId)
  }
}

onMounted(loadAdminPhotos)
</script>
