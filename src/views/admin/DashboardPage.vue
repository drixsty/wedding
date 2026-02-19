<template>
  <div class="admin-page min-h-screen p-6">
    <div class="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
      <h1 class="text-3xl font-serif tracking-wide text-ivoire">{{ t('admin.dashboard.title') }}</h1>
      <div class="flex gap-4 items-center">
        <router-link to="/" class="lux-link text-ivoire/70 hover:text-ivoire text-sm">{{ t('admin.dashboard.viewSite') }}</router-link>
        <button @click="handleLogout" class="lux-button-sm lux-button-danger">{{ t('admin.dashboard.logout') }}</button>
      </div>
    </div>

    <div v-if="stats" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      <div class="lux-card border-l-4 border-green-500">
        <div class="text-xs text-ivoire/70 uppercase">{{ t('admin.dashboard.yesConfirmations') }}</div>
        <div class="text-2xl font-bold text-green-500">{{ stats.confirmations_oui }}</div>
        <div class="text-xs text-ivoire/60 mt-1">+ {{ stats.total_accompagnants }} {{ t('admin.dashboard.plusOnes') }}</div>
      </div>
      <div class="lux-card border-l-4 border-red-500">
        <div class="text-xs text-ivoire/70 uppercase">{{ t('admin.dashboard.noConfirmations') }}</div>
        <div class="text-2xl font-bold text-red-500">{{ stats.confirmations_non }}</div>
      </div>
      <div class="lux-card border-l-4 border-yellow-500">
        <div class="text-xs text-ivoire/70 uppercase">{{ t('admin.dashboard.pending') }}</div>
        <div class="text-2xl font-bold text-yellow-500">{{ stats.en_attente }}</div>
      </div>
      <div class="lux-card border-l-4 border-dore">
        <div class="text-xs text-ivoire/70 uppercase">{{ t('admin.dashboard.totalGuests') }}</div>
        <div class="text-2xl font-bold text-dore">{{ stats.total_invites }}</div>
      </div>
    </div>

    <div class="lux-card mb-4">
      <div class="flex flex-col md:flex-row gap-4 items-end">
        <div>
          <label class="text-xs text-ivoire/70 uppercase mb-1 block">{{ t('admin.dashboard.status') }}</label>
          <select v-model="filters.statut" class="lux-input w-full">
            <option value="">{{ t('admin.dashboard.all') }}</option>
            <option value="en_attente">{{ t('admin.dashboard.pending') }}</option>
            <option value="validé">{{ t('admin.dashboard.validated') }}</option>
            <option value="refusé">{{ t('admin.dashboard.refused') }}</option>
          </select>
        </div>
        <div>
          <label class="text-xs text-ivoire/70 uppercase mb-1 block">{{ t('admin.dashboard.attendance') }}</label>
          <select v-model="filters.presence" class="lux-input w-full">
            <option value="">{{ t('admin.dashboard.all') }}</option>
            <option :value="true">{{ t('admin.dashboard.yes') }}</option>
            <option :value="false">{{ t('admin.dashboard.no') }}</option>
          </select>
        </div>
        <div class="flex-1">
          <label class="text-xs text-ivoire/70 uppercase mb-1 block">{{ t('admin.dashboard.search') }}</label>
          <input v-model="filters.search" type="text" :placeholder="t('admin.dashboard.searchPlaceholder')" class="lux-input w-full" />
        </div>
        <div>
          <button @click="loadGuests" class="lux-button-sm">{{ t('admin.dashboard.searchAction') }}</button>
        </div>
      </div>
    </div>

    <div class="lux-card mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
        <div>
          <h2 class="text-lg font-serif">{{ t('admin.dashboard.themeTitle') }}</h2>
          <p class="text-sm text-ivoire/70">{{ t('admin.dashboard.themeDescription') }}</p>
        </div>
        <div class="flex gap-2">
          <button @click="syncThemeDraft" class="lux-button-sm lux-button-muted">{{ t('admin.dashboard.resetTheme') }}</button>
          <button @click="persistTheme" :disabled="themeSaving" class="lux-button-sm">
            {{ themeSaving ? t('admin.dashboard.themeSaving') : t('admin.dashboard.themeSave') }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="colorKey in themeColorKeys" :key="colorKey" class="bg-white/5 border border-white/10 rounded-xl p-3">
          <label :for="`theme-${colorKey}`" class="block text-xs uppercase text-ivoire/70 mb-2">
            {{ t(`admin.dashboard.themeColorLabels.${colorKey}`) }}
          </label>
          <div class="flex items-center gap-3">
            <input :id="`theme-${colorKey}`" v-model="themeDraft[colorKey]" type="color" class="h-10 w-14 rounded-lg border border-white/20 bg-transparent p-1" />
            <input v-model="themeDraft[colorKey]" type="text" class="lux-input flex-1 uppercase" placeholder="#FFFFFF" />
          </div>
        </div>
      </div>

      <p v-if="themeFeedback" class="mt-4 text-sm text-ivoire/80">{{ themeFeedback }}</p>
    </div>

    <div class="lux-card mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
        <div>
          <h2 class="text-lg font-serif">{{ t('admin.dashboard.galleryTitle') }}</h2>
          <p class="text-sm text-ivoire/70">{{ t('admin.dashboard.galleryDescription') }}</p>
        </div>
        <button @click="loadAdminPhotos" class="lux-button-sm lux-button-muted">{{ t('admin.dashboard.refreshGallery') }}</button>
      </div>

      <form class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4" @submit.prevent="handleAdminUpload">
        <div>
          <label class="text-xs text-ivoire/70 uppercase mb-1 block">{{ t('admin.dashboard.adminUploadTitle') }}</label>
          <input v-model="adminUploadForm.titre" type="text" class="lux-input w-full" :placeholder="t('admin.dashboard.adminUploadTitlePlaceholder')" required />
        </div>
        <div>
          <label class="text-xs text-ivoire/70 uppercase mb-1 block">{{ t('admin.dashboard.adminUploadCategory') }}</label>
          <select v-model="adminUploadForm.categorie" class="lux-input w-full" required>
            <option v-for="category in uploadableCategories" :key="category" :value="category">{{ t(`gallery.categories.${category}`) }}</option>
          </select>
        </div>
        <div class="md:col-span-2">
          <label class="text-xs text-ivoire/70 uppercase mb-1 block">{{ t('admin.dashboard.adminUploadDescription') }}</label>
          <textarea v-model="adminUploadForm.description" class="lux-input w-full" rows="3" :placeholder="t('admin.dashboard.adminUploadDescriptionPlaceholder')"></textarea>
        </div>
        <div class="md:col-span-2">
          <label class="text-xs text-ivoire/70 uppercase mb-1 block">{{ t('admin.dashboard.adminUploadImages') }}</label>
          <input ref="adminFileInput" type="file" multiple accept="image/*" class="lux-input w-full" @change="onAdminFilesChange" required />
          <p v-if="adminUploadFiles.length" class="text-xs text-ivoire/70 mt-2">{{ t('admin.dashboard.adminUploadSelected', { count: adminUploadFiles.length }) }}</p>
        </div>
        <div class="md:col-span-2 flex items-center gap-2">
          <button type="submit" class="lux-button-sm" :disabled="galleryUploading">{{ galleryUploading ? t('admin.dashboard.adminUploadInProgress') : t('admin.dashboard.adminUploadSubmit') }}</button>
          <p v-if="adminGalleryFeedback" class="text-sm" :class="adminGallerySuccess ? 'text-green-300' : 'text-red-300'">{{ adminGalleryFeedback }}</p>
        </div>
      </form>

      <div v-if="selectedPhotos.length > 0" class="flex flex-wrap items-center gap-2 mb-4">
        <button @click="bulkSetPhotoVisibility(true)" class="lux-button-sm bg-green-500 text-black hover:bg-green-600">{{ t('admin.dashboard.bulkPublishPhotos') }}</button>
        <button @click="bulkSetPhotoVisibility(false)" class="lux-button-sm bg-yellow-500 text-black hover:bg-yellow-600">{{ t('admin.dashboard.bulkHidePhotos') }}</button>
        <button @click="bulkDeletePhotos" class="lux-button-sm lux-button-muted">{{ t('admin.dashboard.bulkDeletePhotos') }}</button>
        <span class="text-ivoire/70 text-sm">{{ t('admin.dashboard.selectedPhotosCount', { count: selectedPhotos.length }) }}</span>
      </div>

      <div v-if="galleryLoading" class="p-8 text-center">
        <div class="inline-block w-8 h-8 border-4 border-dore/30 border-t-dore rounded-full animate-spin"></div>
      </div>
      <EmptyState v-else-if="adminPhotos.length === 0" :description="t('admin.dashboard.galleryEmpty')" dark compact />
      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <article v-for="photo in adminPhotos" :key="photo.id" class="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div class="p-3 pb-0">
            <label class="inline-flex items-center gap-2 text-xs text-ivoire/70">
              <input type="checkbox" :value="photo.id" v-model="selectedPhotos" />
              {{ t('admin.dashboard.selectPhoto') }}
            </label>
          </div>
          <img :src="photo.url" :alt="photo.titre || 'Photo'" class="w-full h-44 object-cover" />
          <div class="p-4 space-y-2">
            <div class="flex items-start justify-between gap-2">
              <div>
                <h3 class="font-semibold">{{ photo.titre || t('admin.dashboard.noTitle') }}</h3>
                <p class="text-xs text-ivoire/70">{{ photo.categorie }}</p>
              </div>
              <span class="text-[11px] px-2 py-1 rounded-full" :class="photo.uploaded_by_guest ? 'bg-dore/20 text-dore' : 'bg-ivoire/20 text-ivoire'">
                {{ photo.uploaded_by_guest ? t('admin.dashboard.guestUpload') : t('admin.dashboard.coupleUpload') }}
              </span>
            </div>
            <p class="text-sm text-ivoire/70 line-clamp-2">{{ photo.description }}</p>

            <div class="flex items-center justify-between pt-2">
              <button
                @click="togglePhotoVisibility(photo.id, !(photo.visible ?? true))"
                class="lux-button-sm"
                :class="photo.visible ? 'bg-green-500 text-black hover:bg-green-600' : 'bg-yellow-500 text-black hover:bg-yellow-600'"
              >
                {{ photo.visible ? t('admin.dashboard.hidePhoto') : t('admin.dashboard.showPhoto') }}
              </button>
              <button @click="removePhoto(photo.id)" class="text-red-300 hover:text-red-200 text-sm">{{ t('admin.dashboard.deletePhoto') }}</button>
            </div>
          </div>
        </article>
      </div>
    </div>

    <div v-if="selectedGuests.length > 0" class="flex gap-2 mb-4 flex-wrap">
      <button @click="groupValidate" class="lux-button-sm bg-green-500 text-black hover:bg-green-600">{{ t('admin.dashboard.bulkValidate') }}</button>
      <button @click="groupRefuse" class="lux-button-sm bg-red-500 text-black hover:bg-red-600">{{ t('admin.dashboard.bulkRefuse') }}</button>
      <button @click="groupDelete" class="lux-button-sm lux-button-muted">{{ t('admin.dashboard.bulkDelete') }}</button>
      <span class="ml-4 text-ivoire/70 text-sm self-center">{{ t('admin.dashboard.selectedCount', { count: selectedGuests.length }) }}</span>
    </div>

    <div class="lux-card overflow-x-auto">
      <div v-if="loading" class="p-8 text-center"><div class="inline-block w-8 h-8 border-4 border-dore/30 border-t-dore rounded-full animate-spin"></div></div>
      <EmptyState v-else-if="guests.length === 0" :description="t('admin.dashboard.noneFound')" dark />
      <div v-else>
        <table class="w-full table-auto border-collapse">
          <thead class="bg-white/10 text-ivoire/80 uppercase text-xs tracking-wider">
            <tr>
              <th class="px-4 py-3"><input type="checkbox" v-model="selectAll" /></th>
              <th class="px-4 py-3 text-left">{{ t('admin.dashboard.name') }}</th>
              <th class="px-4 py-3 text-left">{{ t('admin.dashboard.email') }}</th>
              <th class="px-4 py-3 text-left">{{ t('admin.dashboard.attendance') }}</th>
              <th class="px-4 py-3 text-center">{{ t('admin.dashboard.attendants') }}</th>
              <th class="px-4 py-3 text-left">{{ t('admin.dashboard.status') }}</th>
              <th class="px-4 py-3 text-left">{{ t('admin.dashboard.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="guest in filteredGuests" :key="guest.id" class="hover:bg-white/5 transition-colors">
              <td class="px-4 py-3 text-center"><input type="checkbox" :value="guest.id" v-model="selectedGuests" /></td>
              <td class="px-4 py-3">{{ guest.nom_complet }}</td>
              <td class="px-4 py-3 text-sm text-ivoire/60">{{ guest.email }}</td>
              <td class="px-4 py-3"><span :class="guest.presence_confirmee ? 'text-green-500' : 'text-red-500'">{{ guest.presence_confirmee ? t('admin.dashboard.yes') : t('admin.dashboard.no') }}</span></td>
              <td class="px-4 py-3 text-center">{{ guest.nombre_accompagnants }}</td>
              <td class="px-4 py-3"><span class="px-2 py-1 rounded-full text-xs font-medium" :class="statusClassMap[guest.statut]">{{ t(`admin.dashboard.statuses.${guest.statut}`) }}</span></td>
              <td class="px-4 py-3 flex gap-2">
                <button v-if="guest.statut !== 'validé'" @click="validateGuest(guest.id)" class="text-green-500 hover:text-green-400 text-sm" :title="t('admin.dashboard.validated')">✅</button>
                <button v-if="guest.statut !== 'refusé'" @click="refuseGuest(guest.id)" class="text-red-500 hover:text-red-400 text-sm" :title="t('admin.dashboard.refused')">❌</button>
                <button @click="deleteGuestConfirm(guest.id)" class="text-ivoire/70 hover:text-ivoire text-sm" :title="t('admin.dashboard.bulkDelete')">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useGuests } from '@/composables/useGuests'
import { useTheme } from '@/composables/useTheme'
import { useGallery } from '@/composables/useGallery'
import EmptyState from '@/components/common/EmptyState.vue'
import { THEME_COLOR_KEYS } from '@/constants/theme'
import { t } from '@/i18n'

const router = useRouter()
const { signOut } = useAuth()
const { guests, stats, loading, fetchGuests, fetchStats, updateGuestStatus, deleteGuest } = useGuests()
const { theme, saveTheme, sanitizeTheme } = useTheme()
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

const filters = reactive<{ statut: string; presence: boolean | ''; search: string }>({ statut: '', presence: '', search: '' })
const selectedGuests = ref<string[]>([])
const selectAll = ref(false)
const themeColorKeys = THEME_COLOR_KEYS
const themeDraft = ref(sanitizeTheme(theme.value))
const themeSaving = ref(false)
const themeFeedback = ref<string | null>(null)
const uploadableCategories = ['couple', 'family', 'friends', 'ceremony', 'reception']
const selectedPhotos = ref<string[]>([])
const adminFileInput = ref<HTMLInputElement | null>(null)
const adminUploadFiles = ref<File[]>([])
const adminUploadForm = ref({
  titre: '',
  description: '',
  categorie: 'couple'
})
const adminGalleryFeedback = ref<string | null>(null)
const adminGallerySuccess = ref(false)

const statusClassMap: Record<string, string> = {
  en_attente: 'bg-yellow-100 text-yellow-800',
  validé: 'bg-green-100 text-green-800',
  refusé: 'bg-red-100 text-red-800'
}

function syncThemeDraft() {
  themeDraft.value = sanitizeTheme(theme.value)
}

async function persistTheme() {
  themeSaving.value = true
  themeFeedback.value = null

  const { error } = await saveTheme(themeDraft.value)

  themeFeedback.value = error
    ? t('admin.dashboard.themeSaveError', { error })
    : t('admin.dashboard.themeSaveSuccess')

  themeSaving.value = false
}

const filteredGuests = computed(() => guests.value.filter(g => {
  const statusMatch = filters.statut ? g.statut === filters.statut : true
  const presenceMatch = filters.presence !== '' ? g.presence_confirmee === filters.presence : true
  const searchMatch = filters.search
    ? g.nom_complet.toLowerCase().includes(filters.search.toLowerCase()) || g.email.toLowerCase().includes(filters.search.toLowerCase())
    : true
  return statusMatch && presenceMatch && searchMatch
}))

async function loadGuests() {
  await fetchGuests(filters)
  await fetchStats()
  selectedGuests.value = []
  selectAll.value = false
}

async function loadAdminPhotos() {
  await fetchAdminPhotos()
  selectedPhotos.value = []
}

async function togglePhotoVisibility(photoId: string, visible: boolean) {
  await setPhotoVisibility(photoId, visible)
}

function onAdminFilesChange(event: Event) {
  const target = event.target as HTMLInputElement
  adminUploadFiles.value = Array.from(target.files || [])
}

function resetAdminUploadForm() {
  adminUploadForm.value = { titre: '', description: '', categorie: 'couple' }
  adminUploadFiles.value = []
  if (adminFileInput.value) {
    adminFileInput.value.value = ''
  }
}

async function handleAdminUpload() {
  adminGalleryFeedback.value = null

  if (adminUploadFiles.value.length === 0) {
    adminGallerySuccess.value = false
    adminGalleryFeedback.value = t('admin.dashboard.adminUploadFileRequired')
    return
  }

  const { error, data } = await uploadAdminPhotos(adminUploadFiles.value, adminUploadForm.value)
  const uploadedCount = data?.uploadedPhotos.length || 0
  const failedCount = data?.failedUploads.length || 0

  adminGallerySuccess.value = !error
  if (error) {
    adminGalleryFeedback.value = t('admin.dashboard.adminUploadError', { error })
  } else if (failedCount > 0) {
    adminGalleryFeedback.value = `${t('admin.dashboard.adminUploadSuccess', { count: uploadedCount })} ${failedCount} fichier(s) n'ont pas pu être envoyé(s).`
  } else {
    adminGalleryFeedback.value = t('admin.dashboard.adminUploadSuccess', { count: uploadedCount })
  }

  if (!error) {
    resetAdminUploadForm()
  }
}

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

async function validateGuest(id: string) {
  await updateGuestStatus(id, 'validé')
  loadGuests()
}

async function refuseGuest(id: string) {
  await updateGuestStatus(id, 'refusé')
  loadGuests()
}

async function deleteGuestConfirm(id: string) {
  if (confirm(t('admin.dashboard.confirmDeleteGuest'))) {
    await deleteGuest(id)
    loadGuests()
  }
}

async function groupValidate() {
  for (const id of selectedGuests.value) await updateGuestStatus(id, 'validé')
  loadGuests()
}

async function groupRefuse() {
  for (const id of selectedGuests.value) await updateGuestStatus(id, 'refusé')
  loadGuests()
}

async function groupDelete() {
  if (confirm(t('admin.dashboard.confirmDeleteGuests', { count: selectedGuests.value.length }))) {
    for (const id of selectedGuests.value) await deleteGuest(id)
    loadGuests()
  }
}

watch(theme, () => {
  syncThemeDraft()
}, { deep: true })

watch(selectAll, val => {
  selectedGuests.value = val ? filteredGuests.value.map(g => g.id) : []
})

async function handleLogout() {
  await signOut()
  router.push('/admin/login')
}

onMounted(async () => {
  await loadGuests()
  await loadAdminPhotos()
  syncThemeDraft()
})
</script>

<style scoped>
.admin-page {
  background: radial-gradient(circle at top, rgba(var(--color-dore-rgb), 0.2), transparent 50%),
  linear-gradient(180deg, var(--color-marron-dark) 0%, #1b1511 100%);
}

.lux-card {
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(12px);
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid rgba(var(--color-dore-rgb), 0.25);
  transition: all 0.3s ease;
}

.lux-card:hover { border-color: rgba(var(--color-dore-rgb), 0.45); }

.lux-input {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(var(--color-dore-rgb), 0.25);
  border-radius: 12px;
  padding: 0.6rem 0.8rem;
  color: white;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.lux-input::placeholder { color: rgba(255,255,255,0.5); }
.lux-input:focus { outline: none; border-color: rgba(var(--color-dore-rgb), 0.65); background: rgba(255,255,255,0.1); }

.lux-button-sm {
  background: var(--color-dore);
  color: #1f1a16;
  border-radius: 9999px;
  padding: 0.55rem 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.lux-button-sm:hover:not(:disabled) { transform: translateY(-1px); background: var(--color-dore-dark); color: white; }
.lux-button-sm:disabled { opacity: 0.6; cursor: not-allowed; }

.lux-button-muted { background: rgba(255,255,255,0.15); color: white; }
.lux-button-muted:hover:not(:disabled) { background: rgba(255,255,255,0.25); }

.lux-button-danger { background: rgba(220,38,38,0.15); color: #fecaca; }
.lux-button-danger:hover:not(:disabled) { background: rgba(220,38,38,0.25); color: #fee2e2; }

.lux-link { position: relative; }
.lux-link::after { content: ''; position: absolute; left: 0; bottom: -3px; width: 0; height: 1px; background: currentColor; transition: width .2s ease; }
.lux-link:hover::after { width: 100%; }
</style>
