<template>
  <div class="admin-panel">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
      <div>
        <h2 class="admin-section-title">Configuration multi-tenant</h2>
        <p class="text-sm text-slate-600">Créez un tenant et personnalisez textes/images sans code.</p>
      </div>
      <button @click="save" :disabled="saving" class="admin-btn">{{ saving ? 'Enregistrement...' : 'Sauvegarder la configuration' }}</button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
      <div>
        <label class="admin-field-label">Tenant actif</label>
        <select v-model="selectedTenant" class="admin-input w-full" @change="switchTenant">
          <option v-for="tenant in tenants" :key="tenant.slug" :value="tenant.slug">{{ tenant.name }} ({{ tenant.slug }})</option>
        </select>
      </div>
      <form class="flex gap-2 items-end" @submit.prevent="create">
        <div class="flex-1">
          <label class="admin-field-label">Nouveau tenant</label>
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

    <div class="mt-6">
      <h3 class="text-sm uppercase text-slate-500 mb-3">Carousel</h3>
      <div v-for="(item, index) in draft.carousel" :key="index" class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 border border-slate-200 rounded-xl p-3 bg-slate-50/60">
        <input v-model="item.title" class="admin-input" :placeholder="`Titre slide ${index + 1}`" />
        <input v-model="item.alt" class="admin-input" :placeholder="`Alt slide ${index + 1}`" />
        <input v-model="item.caption" class="admin-input md:col-span-2" :placeholder="`Légende slide ${index + 1}`" />
        <input v-model="item.imageUrl" class="admin-input md:col-span-2" :placeholder="`Image URL slide ${index + 1}`" />
      </div>
    </div>

    <p v-if="feedback" class="mt-3 text-sm text-slate-600">{{ feedback }}</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useSiteContent } from '@/composables/useSiteContent'
import { useTenant } from '@/composables/useTenant'
import { useTenants } from '@/composables/useTenants'
import { useTheme } from '@/composables/useTheme'

const { content, sanitizeContent, saveSiteContent, loadSiteContent } = useSiteContent()
const { loadTheme } = useTheme()
const { tenantSlug, setTenant } = useTenant()
const { tenants, fetchTenants, createTenant } = useTenants()

const draft = ref(sanitizeContent(content.value))
const feedback = ref<string | null>(null)
const saving = ref(false)
const selectedTenant = ref(tenantSlug.value)
const newTenantName = ref('')

async function refreshDraft() {
  await loadSiteContent()
  draft.value = sanitizeContent(content.value)
}

async function switchTenant() {
  setTenant(selectedTenant.value)
  await Promise.all([loadTheme(), refreshDraft()])
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
  newTenantName.value = ''
  await fetchTenants()
  await Promise.all([loadTheme(), refreshDraft()])
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
  await refreshDraft()
})
</script>
