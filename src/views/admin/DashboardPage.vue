<template>
  <div class="min-h-screen bg-neutral-950 text-white p-6">
    <div class="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
      <h1 class="text-3xl font-serif tracking-wide">{{ t('admin.dashboard.title') }}</h1>
      <div class="flex gap-4 items-center">
        <router-link to="/" class="lux-link text-neutral-400 hover:text-white text-sm">{{ t('admin.dashboard.viewSite') }}</router-link>
        <button @click="handleLogout" class="lux-button-sm text-red-500 hover:text-red-400">{{ t('admin.dashboard.logout') }}</button>
      </div>
    </div>

    <div v-if="stats" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      <div class="lux-card border-l-4 border-green-500">
        <div class="text-xs text-neutral-400 uppercase">{{ t('admin.dashboard.yesConfirmations') }}</div>
        <div class="text-2xl font-bold text-green-500">{{ stats.confirmations_oui }}</div>
        <div class="text-xs text-neutral-500 mt-1">+ {{ stats.total_accompagnants }} {{ t('admin.dashboard.plusOnes') }}</div>
      </div>
      <div class="lux-card border-l-4 border-red-500">
        <div class="text-xs text-neutral-400 uppercase">{{ t('admin.dashboard.noConfirmations') }}</div>
        <div class="text-2xl font-bold text-red-500">{{ stats.confirmations_non }}</div>
      </div>
      <div class="lux-card border-l-4 border-yellow-500">
        <div class="text-xs text-neutral-400 uppercase">{{ t('admin.dashboard.pending') }}</div>
        <div class="text-2xl font-bold text-yellow-500">{{ stats.en_attente }}</div>
      </div>
      <div class="lux-card border-l-4 border-blue-500">
        <div class="text-xs text-neutral-400 uppercase">{{ t('admin.dashboard.totalGuests') }}</div>
        <div class="text-2xl font-bold text-blue-500">{{ stats.total_invites }}</div>
      </div>
    </div>

    <div class="lux-card mb-4">
      <div class="flex flex-col md:flex-row gap-4 items-end">
        <div>
          <label class="text-xs text-neutral-400 uppercase mb-1 block">{{ t('admin.dashboard.status') }}</label>
          <select v-model="filters.statut" class="lux-input w-full">
            <option value="">{{ t('admin.dashboard.all') }}</option>
            <option value="en_attente">{{ t('admin.dashboard.pending') }}</option>
            <option value="validé">{{ t('admin.dashboard.validated') }}</option>
            <option value="refusé">{{ t('admin.dashboard.refused') }}</option>
          </select>
        </div>
        <div>
          <label class="text-xs text-neutral-400 uppercase mb-1 block">{{ t('admin.dashboard.attendance') }}</label>
          <select v-model="filters.presence" class="lux-input w-full">
            <option value="">{{ t('admin.dashboard.all') }}</option>
            <option :value="true">✅ Oui</option>
            <option :value="false">❌ Non</option>
          </select>
        </div>
        <div class="flex-1">
          <label class="text-xs text-neutral-400 uppercase mb-1 block">{{ t('admin.dashboard.search') }}</label>
          <input v-model="filters.search" type="text" :placeholder="t('admin.dashboard.searchPlaceholder')" class="lux-input w-full" />
        </div>
        <div>
          <button @click="loadGuests" class="lux-button-sm w-full">{{ t('admin.dashboard.searchAction') }}</button>
        </div>
      </div>
    </div>

    <div v-if="selectedGuests.length > 0" class="flex gap-2 mb-4 flex-wrap">
      <button @click="groupValidate" class="lux-button-sm bg-green-500 text-black hover:bg-green-600">{{ t('admin.dashboard.bulkValidate') }}</button>
      <button @click="groupRefuse" class="lux-button-sm bg-red-500 text-black hover:bg-red-600">{{ t('admin.dashboard.bulkRefuse') }}</button>
      <button @click="groupDelete" class="lux-button-sm bg-neutral-700 text-white hover:bg-neutral-600">{{ t('admin.dashboard.bulkDelete') }}</button>
      <span class="ml-4 text-neutral-400 text-sm self-center">{{ t('admin.dashboard.selectedCount', { count: selectedGuests.length }) }}</span>
    </div>

    <div class="lux-card overflow-x-auto">
      <div v-if="loading" class="p-8 text-center"><div class="inline-block w-8 h-8 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin"></div></div>
      <div v-else-if="guests.length === 0" class="p-8 text-center text-neutral-400">{{ t('admin.dashboard.noneFound') }}</div>
      <div v-else>
        <table class="w-full table-auto border-collapse">
          <thead class="bg-white/10 text-neutral-300 uppercase text-xs tracking-wider">
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
              <td class="px-4 py-3 text-sm text-neutral-400">{{ guest.email }}</td>
              <td class="px-4 py-3"><span :class="guest.presence_confirmee ? 'text-green-500' : 'text-red-500'">{{ guest.presence_confirmee ? '✅ Oui' : '❌ Non' }}</span></td>
              <td class="px-4 py-3 text-center">{{ guest.nombre_accompagnants }}</td>
              <td class="px-4 py-3"><span class="px-2 py-1 rounded-full text-xs font-medium" :class="{ 'bg-yellow-100 text-yellow-800': guest.statut === 'en_attente', 'bg-green-100 text-green-800': guest.statut === 'validé', 'bg-red-100 text-red-800': guest.statut === 'refusé' }">{{ guest.statut }}</span></td>
              <td class="px-4 py-3 flex gap-2">
                <button v-if="guest.statut !== 'validé'" @click="validateGuest(guest.id)" class="text-green-500 hover:text-green-400 text-sm" :title="t('admin.dashboard.validated')">✅</button>
                <button v-if="guest.statut !== 'refusé'" @click="refuseGuest(guest.id)" class="text-red-500 hover:text-red-400 text-sm" :title="t('admin.dashboard.refused')">❌</button>
                <button @click="deleteGuestConfirm(guest.id)" class="text-neutral-400 hover:text-neutral-200 text-sm" :title="t('admin.dashboard.bulkDelete')">🗑️</button>
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
import { t } from '@/i18n'

const router = useRouter()
const { signOut } = useAuth()
const { guests, stats, loading, fetchGuests, fetchStats, updateGuestStatus, deleteGuest } = useGuests()

const filters = reactive<{ statut: string; presence: '' | boolean; search: string }>({ statut: '', presence: '', search: '' })
const selectedGuests = ref<string[]>([])
const selectAll = ref(false)

const filteredGuests = computed(() => guests.value.filter(g => {
  const statusMatch = filters.statut ? g.statut === filters.statut : true
  const presenceMatch = filters.presence !== '' ? g.presence_confirmee === filters.presence : true
  const searchMatch = filters.search ? g.nom_complet.toLowerCase().includes(filters.search.toLowerCase()) || g.email.toLowerCase().includes(filters.search.toLowerCase()) : true
  return statusMatch && presenceMatch && searchMatch
}))

async function loadGuests() { await fetchGuests(filters); await fetchStats(); selectedGuests.value = []; selectAll.value = false }
async function validateGuest(id: string) { await updateGuestStatus(id, 'validé'); loadGuests() }
async function refuseGuest(id: string) { await updateGuestStatus(id, 'refusé'); loadGuests() }
async function deleteGuestConfirm(id: string) { if(confirm(t('admin.dashboard.confirmDeleteGuest'))) { await deleteGuest(id); loadGuests() } }
async function groupValidate() { for(const id of selectedGuests.value) await updateGuestStatus(id, 'validé'); loadGuests() }
async function groupRefuse() { for(const id of selectedGuests.value) await updateGuestStatus(id, 'refusé'); loadGuests() }
async function groupDelete() { if(confirm(t('admin.dashboard.confirmDeleteGuests', { count: selectedGuests.value.length }))) { for(const id of selectedGuests.value) await deleteGuest(id); loadGuests() } }

watch(selectAll, val => { selectedGuests.value = val ? filteredGuests.value.map(g => g.id) : [] })
async function handleLogout() { await signOut(); router.push('/admin/login') }
onMounted(loadGuests)
</script>

<style scoped>
.lux-card { background: rgba(255,255,255,0.03); backdrop-blur: 12px; border-radius: 1rem; padding: 1.5rem; border: 1px solid rgba(255,255,255,0.1); transition: all 0.3s ease; }
.lux-card:hover { border-color: rgba(255,255,255,0.2); }
.lux-input { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; padding: 0.6rem 0.8rem; color: white; font-size: 0.9rem; transition: all 0.3s ease; }
.lux-input::placeholder { color: rgba(255,255,255,0.3); }
.lux-input:focus { outline: none; border-color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.07); }
.lux-button-sm { background: white; color: black; border-radius: 9999px; padding: 0.55rem 1rem; font-size: 0.8rem; font-weight: 600; transition: all 0.3s ease; }
.lux-button-sm:hover { transform: translateY(-1px); }
.lux-link { position: relative; }
.lux-link::after { content: ''; position: absolute; left: 0; bottom: -3px; width: 0; height: 1px; background: currentColor; transition: width .2s ease; }
.lux-link:hover::after { width: 100%; }
</style>
