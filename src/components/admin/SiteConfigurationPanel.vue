<template>
  <div class="admin-panel">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
      <div>
        <h2 class="admin-section-title">Configuration multi-tenant</h2>
        <p class="text-sm text-slate-600">Créez un tenant et personnalisez textes/images sans code.</p>
      </div>
      <button @click="save" :disabled="saving" class="admin-btn">{{ saving ? 'Enregistrement...' : 'Sauvegarder la configuration' }}</button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      <div>
        <label class="admin-field-label">Tenant actif</label>
        <input
          v-model="tenantSearch"
          list="tenant-list"
          class="admin-input w-full"
          placeholder="Rechercher un tenant par son nom"
          @change="switchTenantBySearch"
        />
        <datalist id="tenant-list">
          <option v-for="tenant in tenants" :key="tenant.slug" :value="tenant.name">{{ tenant.slug }}</option>
        </datalist>
      </div>
      <form class="flex gap-2 items-end" @submit.prevent="create">
        <div class="flex-1">
          <label class="admin-field-label">Créer un tenant</label>
          <input v-model="newTenantName" class="admin-input w-full" placeholder="Ex: Mariage-Awa-et-Sam" />
        </div>
        <button class="admin-btn admin-btn-muted" type="submit">Créer</button>
      </form>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input v-model="draft.coupleName" class="admin-input" placeholder="Nom des mariés" />
      <input v-model="draft.weddingLocation" class="admin-input" placeholder="Lieu du mariage" />
      <input v-model="draft.weddingDate" class="admin-input" placeholder="Date ISO (2025-08-15T14:00:00)" />
      <input v-model="draft.contactEmail" class="admin-input" placeholder="Email de contact" />
      <input v-model="draft.home.heroImageUrl" class="admin-input md:col-span-2" placeholder="URL image hero" />
      <input v-model="draft.home.subtitle" class="admin-input md:col-span-2" placeholder="Sous-titre home" />
      <input v-model="draft.home.cta" class="admin-input md:col-span-2" placeholder="Texte bouton CTA" />
      <input v-model="draft.galleryPage.title" class="admin-input" placeholder="Titre page galerie" />
      <input v-model="draft.galleryPage.subtitle" class="admin-input" placeholder="Sous-titre galerie" />
      <input v-model="draft.rsvpPage.title" class="admin-input" placeholder="Titre page RSVP" />
      <input v-model="draft.rsvpPage.subtitle" class="admin-input" placeholder="Sous-titre RSVP" />
    </div>

    <div class="mt-6 space-y-3">
      <h3 class="text-sm uppercase text-slate-500">Histoire du couple</h3>
      <input v-model="draft.home.storyTitle" class="admin-input" placeholder="Titre de la section histoire" />
      <input v-model="draft.home.storySubtitle" class="admin-input" placeholder="Sous-titre de la section histoire" />
      <textarea
        v-model="storyParagraphsText"
        rows="6"
        class="admin-input"
        placeholder="Un paragraphe par ligne"
      ></textarea>
      <input v-model="draft.home.storyCta" class="admin-input" placeholder="Texte du bouton histoire" />
      <input v-model="draft.home.storyModalTitle" class="admin-input" placeholder="Titre modal histoire" />
    </div>

    <div class="mt-6">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm uppercase text-slate-500">Carousel</h3>
        <button class="admin-btn admin-btn-muted" @click="addSlide" type="button">+ Ajouter un slide</button>
      </div>
      <div v-for="(item, index) in draft.carousel" :key="index" class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 border border-slate-200 rounded-2xl p-3 bg-slate-50/60">
        <input v-model="item.title" class="admin-input" :placeholder="`Titre slide ${index + 1}`" />
        <input v-model="item.alt" class="admin-input" :placeholder="`Alt slide ${index + 1}`" />
        <input v-model="item.caption" class="admin-input md:col-span-2" :placeholder="`Légende slide ${index + 1}`" />
        <select v-model="item.imageUrl" class="admin-input md:col-span-2">
          <option value="">Sélectionner une image de la galerie</option>
          <option v-for="photo in adminPhotos" :key="photo.id" :value="photo.url">{{ photo.titre || photo.url }}</option>
        </select>
        <input v-model="item.imageUrl" class="admin-input md:col-span-2" :placeholder="`Image URL slide ${index + 1}`" />
        <button class="text-rose-600 text-sm text-left" type="button" @click="removeSlide(index)">Supprimer ce slide</button>
      </div>
    </div>

    <p v-if="feedback" class="mt-3 text-sm text-slate-600">{{ feedback }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useSiteContent } from '@/composables/useSiteContent'
import { useTenant } from '@/composables/useTenant'
import { useTenants } from '@/composables/useTenants'
import { useTheme } from '@/composables/useTheme'
import { useGallery } from '@/composables/useGallery'

const { content, sanitizeContent, saveSiteContent, loadSiteContent } = useSiteContent()
const { loadTheme } = useTheme()
const { tenantSlug, setTenant } = useTenant()
const { tenants, fetchTenants, createTenant } = useTenants()
const { photos: adminPhotos, fetchAdminPhotos } = useGallery()

const draft = ref(sanitizeContent(content.value))
const feedback = ref<string | null>(null)
const saving = ref(false)
const selectedTenant = ref(tenantSlug.value)
const newTenantName = ref('')
const tenantSearch = ref('')

const storyParagraphsText = computed({
  get: () => draft.value.home.storyParagraphs.join('\n'),
  set: value => {
    draft.value.home.storyParagraphs = value.split('\n').map(line => line.trim()).filter(Boolean)
  }
})

function addSlide() {
  draft.value.carousel.push({
    title: 'Nouveau souvenir',
    caption: 'Ajoutez une légende',
    alt: 'Slide mariage',
    imageUrl: adminPhotos.value[0]?.url || ''
  })
}

function removeSlide(index: number) {
  draft.value.carousel.splice(index, 1)
}

async function refreshDraft() {
  await loadSiteContent()
  draft.value = sanitizeContent(content.value)
}

async function switchTenant() {
  setTenant(selectedTenant.value)
  await Promise.all([loadTheme(), refreshDraft(), fetchAdminPhotos()])
}

async function switchTenantBySearch() {
  const match = tenants.value.find(item => item.name.toLowerCase() === tenantSearch.value.toLowerCase())
  if (match) {
    selectedTenant.value = match.slug
    await switchTenant()
    return
  }

  if (tenantSearch.value.trim()) {
    newTenantName.value = tenantSearch.value
    await create()
  }
}

async function create() {
  feedback.value = null
  if (!newTenantName.value.trim()) {
    feedback.value = 'Le nom du tenant est requis.'
    return
  }

  const { error, data } = await createTenant(newTenantName.value)
  if (error || !data) {
    feedback.value = `Impossible de créer le tenant : ${error}`
    return
  }

  selectedTenant.value = data.slug
  setTenant(data.slug)
  tenantSearch.value = data.name
  newTenantName.value = ''
  await fetchTenants()
  await Promise.all([loadTheme(), refreshDraft(), fetchAdminPhotos()])
  feedback.value = `Tenant ${data.slug} créé.`
}

async function save() {
  saving.value = true
  feedback.value = null
  const { error } = await saveSiteContent(sanitizeContent(draft.value))
  feedback.value = error ? `Erreur de sauvegarde : ${error}` : 'Configuration enregistrée avec succès.'
  saving.value = false
}

onMounted(async () => {
  await fetchTenants()
  if (tenants.value.length === 0) {
    await createTenant('Default')
    await fetchTenants()
  }

  selectedTenant.value = tenantSlug.value
  const active = tenants.value.find(item => item.slug === tenantSlug.value)
  tenantSearch.value = active?.name || ''
  await Promise.all([refreshDraft(), fetchAdminPhotos()])
})
</script>
