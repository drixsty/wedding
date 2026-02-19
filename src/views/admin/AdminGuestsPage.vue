<template>
  <section class="space-y-5 animate-fade-in">
    <div v-if="stats" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <article class="admin-panel border-l-4 border-emerald-500">
        <p class="admin-kpi-label">{{ t('admin.dashboard.yesConfirmations') }}</p>
        <p class="admin-kpi-value text-emerald-600">{{ stats.confirmations_oui }}</p>
        <p class="admin-kpi-meta">+ {{ stats.total_accompagnants }} {{ t('admin.dashboard.plusOnes') }}</p>
      </article>
      <article class="admin-panel border-l-4 border-rose-500">
        <p class="admin-kpi-label">{{ t('admin.dashboard.noConfirmations') }}</p>
        <p class="admin-kpi-value text-rose-600">{{ stats.confirmations_non }}</p>
      </article>
      <article class="admin-panel border-l-4 border-amber-500">
        <p class="admin-kpi-label">{{ t('admin.dashboard.pending') }}</p>
        <p class="admin-kpi-value text-amber-600">{{ stats.en_attente }}</p>
      </article>
      <article class="admin-panel border-l-4 border-violet-500">
        <p class="admin-kpi-label">{{ t('admin.dashboard.totalGuests') }}</p>
        <p class="admin-kpi-value text-violet-600">{{ stats.total_invites }}</p>
      </article>
    </div>

    <div class="admin-panel">
      <h2 class="admin-section-title">Filtrer les réponses</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        <div>
          <label class="admin-field-label">{{ t('admin.dashboard.status') }}</label>
          <select v-model="filters.statut" class="admin-input w-full">
            <option value="">{{ t('admin.dashboard.all') }}</option>
            <option value="en_attente">{{ t('admin.dashboard.pending') }}</option>
            <option value="validé">{{ t('admin.dashboard.validated') }}</option>
            <option value="refusé">{{ t('admin.dashboard.refused') }}</option>
          </select>
        </div>
        <div>
          <label class="admin-field-label">{{ t('admin.dashboard.attendance') }}</label>
          <select v-model="filters.presence" class="admin-input w-full">
            <option value="">{{ t('admin.dashboard.all') }}</option>
            <option :value="true">{{ t('admin.dashboard.yes') }}</option>
            <option :value="false">{{ t('admin.dashboard.no') }}</option>
          </select>
        </div>
        <div class="md:col-span-2">
          <label class="admin-field-label">{{ t('admin.dashboard.search') }}</label>
          <div class="flex gap-2">
            <input v-model="filters.search" type="text" :placeholder="t('admin.dashboard.searchPlaceholder')" class="admin-input w-full" />
            <button @click="loadGuests" class="admin-btn">{{ t('admin.dashboard.searchAction') }}</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedGuests.length > 0" class="admin-panel !p-4 flex gap-2 flex-wrap items-center">
      <button @click="groupValidate" class="admin-btn bg-emerald-500 text-white">{{ t('admin.dashboard.bulkValidate') }}</button>
      <button @click="groupRefuse" class="admin-btn bg-rose-500 text-white">{{ t('admin.dashboard.bulkRefuse') }}</button>
      <button @click="groupDelete" class="admin-btn admin-btn-muted">{{ t('admin.dashboard.bulkDelete') }}</button>
      <span class="text-sm text-slate-600">{{ t('admin.dashboard.selectedCount', { count: selectedGuests.length }) }}</span>
    </div>

    <div class="admin-panel overflow-x-auto">
      <div v-if="loading" class="p-10 text-center">Chargement...</div>
      <EmptyState v-else-if="guests.length === 0" :description="t('admin.dashboard.noneFound')" compact />
      <table v-else class="w-full text-sm min-w-[780px]">
        <thead class="bg-slate-100 text-slate-600 uppercase text-xs tracking-wide">
          <tr>
            <th class="px-3 py-3"><input type="checkbox" v-model="selectAll" /></th>
            <th class="px-3 py-3 text-left">{{ t('admin.dashboard.name') }}</th>
            <th class="px-3 py-3 text-left">{{ t('admin.dashboard.email') }}</th>
            <th class="px-3 py-3 text-left">{{ t('admin.dashboard.attendance') }}</th>
            <th class="px-3 py-3 text-center">{{ t('admin.dashboard.attendants') }}</th>
            <th class="px-3 py-3 text-left">{{ t('admin.dashboard.status') }}</th>
            <th class="px-3 py-3 text-left">{{ t('admin.dashboard.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="guest in filteredGuests" :key="guest.id" class="border-t border-slate-100">
            <td class="px-3 py-3 text-center"><input type="checkbox" :value="guest.id" v-model="selectedGuests" /></td>
            <td class="px-3 py-3 font-medium text-slate-900">{{ guest.nom_complet }}</td>
            <td class="px-3 py-3 text-slate-600">{{ guest.email }}</td>
            <td class="px-3 py-3"><span :class="guest.presence_confirmee ? 'text-emerald-600' : 'text-rose-600'">{{ guest.presence_confirmee ? t('admin.dashboard.yes') : t('admin.dashboard.no') }}</span></td>
            <td class="px-3 py-3 text-center text-slate-700">{{ guest.nombre_accompagnants }}</td>
            <td class="px-3 py-3"><span class="px-2 py-1 rounded-full text-xs font-semibold" :class="statusClassMap[guest.statut]">{{ t(`admin.dashboard.statuses.${guest.statut}`) }}</span></td>
            <td class="px-3 py-3 flex gap-2">
              <button v-if="guest.statut !== 'validé'" @click="validateGuest(guest.id)">✅</button>
              <button v-if="guest.statut !== 'refusé'" @click="refuseGuest(guest.id)">❌</button>
              <button @click="deleteGuestConfirm(guest.id)">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useGuests } from '@/composables/useGuests'
import EmptyState from '@/components/common/EmptyState.vue'
import { t } from '@/i18n'

const { guests, stats, loading, fetchGuests, fetchStats, updateGuestStatus, deleteGuest } = useGuests()
const filters = reactive<{ statut: string; presence: boolean | ''; search: string }>({ statut: '', presence: '', search: '' })
const selectedGuests = ref<string[]>([])
const selectAll = ref(false)

const statusClassMap: Record<string, string> = {
  en_attente: 'bg-amber-100 text-amber-800',
  validé: 'bg-emerald-100 text-emerald-800',
  refusé: 'bg-rose-100 text-rose-800'
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

async function validateGuest(id: string) { await updateGuestStatus(id, 'validé'); await loadGuests() }
async function refuseGuest(id: string) { await updateGuestStatus(id, 'refusé'); await loadGuests() }
async function deleteGuestConfirm(id: string) {
  if (confirm(t('admin.dashboard.confirmDeleteGuest'))) {
    await deleteGuest(id)
    await loadGuests()
  }
}
async function groupValidate() { for (const id of selectedGuests.value) await updateGuestStatus(id, 'validé'); await loadGuests() }
async function groupRefuse() { for (const id of selectedGuests.value) await updateGuestStatus(id, 'refusé'); await loadGuests() }
async function groupDelete() {
  if (confirm(t('admin.dashboard.confirmDeleteGuests', { count: selectedGuests.value.length }))) {
    for (const id of selectedGuests.value) await deleteGuest(id)
    await loadGuests()
  }
}

watch(selectAll, val => {
  selectedGuests.value = val ? filteredGuests.value.map(g => g.id) : []
})

onMounted(loadGuests)
</script>
