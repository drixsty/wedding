<template>
  <section class="space-y-5 animate-fade-in">
    <div v-if="stats" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <article class="admin-panel border-l-4 border-emerald-500">
        <p class="admin-kpi-label">{{ t('admin.dashboard.yesConfirmations') }}</p>
        <p class="admin-kpi-value text-emerald-600">{{ stats.confirmations_oui }}</p>
        <p class="admin-kpi-meta">+ {{ stats.total_accompagnants }} {{ t('admin.dashboard.plusOnes') }}</p>
      </article>
      <article class="admin-panel border-l-4 border-rose-500"><p class="admin-kpi-label">{{ t('admin.dashboard.noConfirmations') }}</p><p class="admin-kpi-value text-rose-600">{{ stats.confirmations_non }}</p></article>
      <article class="admin-panel border-l-4 border-amber-500"><p class="admin-kpi-label">{{ t('admin.dashboard.pending') }}</p><p class="admin-kpi-value text-amber-600">{{ stats.en_attente }}</p></article>
      <article class="admin-panel border-l-4 border-violet-500"><p class="admin-kpi-label">{{ t('admin.dashboard.totalGuests') }}</p><p class="admin-kpi-value text-violet-600">{{ stats.total_invites }}</p></article>
    </div>

    <div class="admin-panel space-y-4">
      <div class="flex items-center justify-between gap-3 flex-wrap">
        <h2 class="admin-section-title">{{ t('admin.dashboard.bulkMessagingTitle') }}</h2>
        <button v-if="isMobile" class="admin-btn admin-btn-muted" @click="showScanner = true">{{ t('admin.dashboard.openScanner') }}</button>
      </div>
      <textarea v-model="bulkMessage" rows="3" class="admin-input" :placeholder="t('admin.dashboard.bulkMessagingPlaceholder')"></textarea>
      <div class="flex flex-wrap gap-2">
        <button class="admin-btn" @click="sendByEmail">{{ t('admin.dashboard.sendByEmail') }}</button>
        <button class="admin-btn admin-btn-muted" @click="sendByWhatsapp">{{ t('admin.dashboard.sendByWhatsapp') }}</button>
        <button class="admin-btn admin-btn-muted" @click="markInvitationSentSelected">{{ t('admin.dashboard.markInvitationsSent') }}</button>
      </div>
      <p class="text-sm text-slate-500">{{ t('admin.dashboard.bulkMessagingHint') }}</p>
      <p v-if="feedback" class="text-sm" :class="feedbackType === 'success' ? 'text-emerald-600' : 'text-rose-600'">{{ feedback }}</p>
    </div>

    <div class="admin-panel">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h2 class="admin-section-title">Filtrer les réponses</h2>
        <div class="flex flex-wrap gap-2">
          <button class="admin-btn-soft" @click="applyPreset('pending')">En attente</button>
          <button class="admin-btn-soft" @click="applyPreset('confirmed')">Confirmés</button>
          <button class="admin-btn-soft" @click="applyPreset('declined')">Refus</button>
          <button class="admin-btn-soft" @click="applyPreset('reset')">Réinitialiser</button>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-4 mt-4 md:grid-cols-4">
        <div>
          <label class="admin-field-label">{{ t('admin.dashboard.status') }}</label>
          <select v-model="filters.statut" class="admin-input w-full"><option value="">{{ t('admin.dashboard.all') }}</option><option value="en_attente">{{ t('admin.dashboard.pending') }}</option><option value="validé">{{ t('admin.dashboard.validated') }}</option><option value="refusé">{{ t('admin.dashboard.refused') }}</option></select>
        </div>
        <div>
          <label class="admin-field-label">{{ t('admin.dashboard.attendance') }}</label>
          <select v-model="filters.presence" class="admin-input w-full"><option value="">{{ t('admin.dashboard.all') }}</option><option :value="true">{{ t('admin.dashboard.yes') }}</option><option :value="false">{{ t('admin.dashboard.no') }}</option></select>
        </div>
        <div class="md:col-span-2">
          <label class="admin-field-label">{{ t('admin.dashboard.search') }}</label>
          <div class="flex gap-2"><input v-model="filters.search" type="text" :placeholder="t('admin.dashboard.searchPlaceholder')" class="admin-input w-full" /><button @click="loadGuests" class="admin-btn" :disabled="loading">{{ t('admin.dashboard.searchAction') }}</button></div>
        </div>
      </div>
    </div>

    <div v-if="selectedGuests.length > 0" class="admin-panel !p-4 flex gap-2 flex-wrap items-center">
      <button @click="groupValidate" class="admin-btn" :disabled="isBulkProcessing">{{ t('admin.dashboard.bulkValidate') }}</button>
      <button @click="groupRefuse" class="admin-btn admin-btn-muted" :disabled="isBulkProcessing">{{ t('admin.dashboard.bulkRefuse') }}</button>
      <button @click="groupDelete" class="admin-btn admin-btn-muted" :disabled="isBulkProcessing">{{ t('admin.dashboard.bulkDelete') }}</button>
      <span class="text-sm text-slate-600">{{ t('admin.dashboard.selectedCount', { count: selectedGuests.length }) }}</span>
    </div>

    <div class="admin-panel overflow-x-auto">
      <div v-if="loading" class="p-10 text-center">{{ t('gallery.loading') }}</div>
      <EmptyState v-else-if="guests.length === 0" :description="t('admin.dashboard.noneFound')" compact />
      <table v-else class="w-full text-sm min-w-[780px]">
        <thead class="bg-slate-100 text-slate-600 uppercase text-xs tracking-wide"><tr><th class="px-3 py-3"><input type="checkbox" v-model="selectAll" /></th><th class="px-3 py-3 text-left">{{ t('admin.dashboard.name') }}</th><th class="px-3 py-3 text-left">{{ t('admin.dashboard.email') }}</th><th class="px-3 py-3 text-left">{{ t('admin.dashboard.attendance') }}</th><th class="px-3 py-3 text-center">{{ t('admin.dashboard.attendants') }}</th><th class="px-3 py-3 text-left">{{ t('admin.dashboard.status') }}</th><th class="px-3 py-3 text-left">{{ t('admin.dashboard.actions') }}</th></tr></thead>
        <tbody>
          <tr v-for="guest in filteredGuests" :key="guest.id" class="border-t border-slate-100">
            <td class="px-3 py-3 text-center"><input type="checkbox" :value="guest.id" v-model="selectedGuests" /></td>
            <td class="px-3 py-3 font-medium text-slate-900">{{ guest.nom_complet }}</td><td class="px-3 py-3 text-slate-600">{{ guest.email }}</td>
            <td class="px-3 py-3"><span :class="guest.presence_confirmee ? 'text-emerald-600' : 'text-rose-600'">{{ guest.presence_confirmee ? t('admin.dashboard.yes') : t('admin.dashboard.no') }}</span></td>
            <td class="px-3 py-3 text-center text-slate-700">{{ guest.nombre_accompagnants }}</td>
            <td class="px-3 py-3"><span class="px-2 py-1 rounded-full text-xs font-semibold" :class="statusClassMap[guest.statut]">{{ t(`admin.dashboard.statuses.${guest.statut}`) }}</span></td>
            <td class="px-3 py-3 flex gap-2">
              <button v-if="guest.statut !== 'validé'" @click="validateGuest(guest.id)" class="admin-btn-soft">Valider</button>
              <button v-if="guest.statut !== 'refusé'" @click="refuseGuest(guest.id)" class="admin-btn-soft">Refuser</button>
              <button @click="deleteGuestConfirm(guest.id)" class="admin-btn-soft">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <QRScanner v-if="showScanner && isMobile" @close="showScanner = false" />
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useGuests } from '@/composables/useGuests'
import EmptyState from '@/components/common/EmptyState.vue'
import QRScanner from '@/components/admin/QRScanner.vue'
import { t } from '@/i18n'

const { guests, stats, loading, fetchGuests, fetchStats, updateGuestStatus, deleteGuest, markInvitationSent } = useGuests()
const filters = reactive<{ statut: string; presence: boolean | ''; search: string }>({ statut: '', presence: '', search: '' })
const selectedGuests = ref<string[]>([])
const selectAll = ref(false)
const bulkMessage = ref('Bonjour, voici votre invitation numérique. Nous avons hâte de célébrer avec vous ✨')
const showScanner = ref(false)
const isMobile = window.matchMedia('(max-width: 1024px)').matches
const feedback = ref<string | null>(null)
const feedbackType = ref<'success' | 'error'>('success')
const isBulkProcessing = ref(false)

const statusClassMap: Record<string, string> = { en_attente: 'bg-amber-100 text-amber-800', validé: 'bg-emerald-100 text-emerald-800', refusé: 'bg-rose-100 text-rose-800' }

const filteredGuests = computed(() => guests.value.filter(g => {
  const statusMatch = filters.statut ? g.statut === filters.statut : true
  const presenceMatch = filters.presence !== '' ? g.presence_confirmee === filters.presence : true
  const searchMatch = filters.search ? g.nom_complet.toLowerCase().includes(filters.search.toLowerCase()) || g.email.toLowerCase().includes(filters.search.toLowerCase()) : true
  return statusMatch && presenceMatch && searchMatch
}))

const selectedGuestsData = computed(() => guests.value.filter(guest => selectedGuests.value.includes(guest.id)))

function setFeedback(message: string, type: 'success' | 'error' = 'success') {
  feedback.value = message
  feedbackType.value = type
}

async function loadGuests() {
  await fetchGuests(filters)
  await fetchStats()
  selectedGuests.value = []
  selectAll.value = false
}
async function validateGuest(id: string) { await updateGuestStatus(id, 'validé'); await loadGuests() }
async function refuseGuest(id: string) { await updateGuestStatus(id, 'refusé'); await loadGuests() }
async function deleteGuestConfirm(id: string) { if (confirm(t('admin.dashboard.confirmDeleteGuest'))) { await deleteGuest(id); await loadGuests() } }
async function groupValidate() {
  isBulkProcessing.value = true
  const results = await Promise.allSettled(selectedGuests.value.map(id => updateGuestStatus(id, 'validé')))
  const failed = results.filter(result => result.status === 'fulfilled' && result.value.error).length
  setFeedback(failed > 0 ? `Validation partielle (${failed} erreur${failed > 1 ? 's' : ''}).` : 'Invités validés.', failed > 0 ? 'error' : 'success')
  await loadGuests()
  isBulkProcessing.value = false
}

async function groupRefuse() {
  isBulkProcessing.value = true
  const results = await Promise.allSettled(selectedGuests.value.map(id => updateGuestStatus(id, 'refusé')))
  const failed = results.filter(result => result.status === 'fulfilled' && result.value.error).length
  setFeedback(failed > 0 ? `Mise à jour partielle (${failed} erreur${failed > 1 ? 's' : ''}).` : 'Invités refusés.', failed > 0 ? 'error' : 'success')
  await loadGuests()
  isBulkProcessing.value = false
}

async function groupDelete() {
  if (!confirm(t('admin.dashboard.confirmDeleteGuests', { count: selectedGuests.value.length }))) return
  isBulkProcessing.value = true
  const results = await Promise.allSettled(selectedGuests.value.map(id => deleteGuest(id)))
  const failed = results.filter(result => result.status === 'fulfilled' && result.value.error).length
  setFeedback(failed > 0 ? `Suppression partielle (${failed} erreur${failed > 1 ? 's' : ''}).` : 'Invités supprimés.', failed > 0 ? 'error' : 'success')
  await loadGuests()
  isBulkProcessing.value = false
}

async function markInvitationSentSelected() {
  if (selectedGuests.value.length === 0) return
  const { error } = await markInvitationSent(selectedGuests.value)
  setFeedback(error ? `Erreur d'envoi: ${error}` : 'Invitations marquées comme envoyées.', error ? 'error' : 'success')
  await loadGuests()
}

function sendByEmail() {
  if (selectedGuestsData.value.length === 0) return
  const recipients = selectedGuestsData.value.map(guest => guest.email).filter(Boolean).join(',')
  const subject = encodeURIComponent('Votre faire-part numérique')
  const body = encodeURIComponent(bulkMessage.value)
  window.open(`mailto:${recipients}?subject=${subject}&body=${body}`, '_blank')
}

function sendByWhatsapp() {
  if (selectedGuestsData.value.length === 0) return
  const payload = selectedGuestsData.value
    .map(guest => `${guest.nom_complet} (${guest.telephone || 'sans numéro'})`)
    .join('\n')
  const text = encodeURIComponent(`${bulkMessage.value}\n\nInvités:\n${payload}`)
  window.open(`https://wa.me/?text=${text}`, '_blank')
}

function applyPreset(preset: 'pending' | 'confirmed' | 'declined' | 'reset') {
  if (preset === 'pending') {
    filters.statut = 'en_attente'
    filters.presence = ''
  }
  if (preset === 'confirmed') {
    filters.statut = 'validé'
    filters.presence = true
  }
  if (preset === 'declined') {
    filters.statut = 'refusé'
    filters.presence = false
  }
  if (preset === 'reset') {
    filters.statut = ''
    filters.presence = ''
    filters.search = ''
  }
  loadGuests()
}

watch(selectAll, val => { selectedGuests.value = val ? filteredGuests.value.map(g => g.id) : [] })
onMounted(loadGuests)
</script>
