<!-- Atelier Registry: Updated for Timeless vision -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGuests } from '../../composables/useGuests'


const { guests, stats, loading, fetchGuests, fetchStats, updateGuestStatus, markInvitationSent, deleteGuest } = useGuests()

const filterStatus = ref('Tous')
const selectedGuests = ref<string[]>([])

const statCardsCount = computed(() => [
  { label: 'Invitations Totales', value: stats.value?.total_invites || 0, trend: '', iconType: 'users' },
  { label: 'Confirmations', value: stats.value?.confirmations_oui || 0, trend: `${Math.round((stats.value?.confirmations_oui || 0) / (stats.value?.total_invites || 1) * 100)}%`, iconType: 'check' },
  { label: 'Déclinaisons', value: stats.value?.confirmations_non || 0, trend: '', iconType: 'x' },
  { label: 'En Attente', value: stats.value?.en_attente || 0, trend: '', iconType: 'clock' }
])

const filteredGuests = computed(() => {
  if (filterStatus.value === 'Tous') return guests.value
  if (filterStatus.value === 'Oui') return guests.value.filter(g => g.presence_confirmee === true)
  if (filterStatus.value === 'Non') return guests.value.filter(g => g.presence_confirmee === false)
  return guests.value.filter(g => g.statut === 'en_attente')
})

const statusClass = (statut: string) => {
  if (statut === 'validé') return 'bg-emerald-50 text-emerald-600 border-emerald-100'
  if (statut === 'refusé') return 'bg-rose-50 text-rose-600 border-rose-100'
  return 'bg-stone-50 text-stone-600 border-stone-200'
}

const toggleSelectAll = (event: Event) => {
  const checked = (event.target as HTMLInputElement).checked
  selectedGuests.value = checked ? filteredGuests.value.map(g => g.id) : []
}

async function handleAction(guestId: string, action: 'validé' | 'refusé' | 'inviter' | 'supprimer') {
  if (action === 'validé' || action === 'refusé') await updateGuestStatus(guestId, action)
  else if (action === 'inviter') await markInvitationSent([guestId])
  else if (action === 'supprimer' && confirm('Supprimer cet invité ?')) await deleteGuest(guestId)
  await fetchStats()
}

async function bulkAction(action: 'validé' | 'refusé' | 'inviter') {
  if (selectedGuests.value.length === 0) return
  if (action === 'inviter') {
    await markInvitationSent(selectedGuests.value)
  } else {
    for (const id of selectedGuests.value) {
      await updateGuestStatus(id, action)
    }
  }
  selectedGuests.value = []
  await fetchStats()
}

onMounted(async () => {
  await fetchGuests()
  await fetchStats()
})
</script>

<template>
  <div class="space-y-20 animate-fade-in-up">
    <!-- Stat Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
      <div v-for="stat in statCardsCount" :key="stat.label" class="p-10 bg-white border border-stone/10 shadow-editorial group hover:shadow-floating transition-all duration-1000">
        <div class="flex justify-between items-start mb-6">
          <div class="p-3 border border-stone/10 text-gold-muted group-hover:border-gold-muted transition-colors">
            <!-- Inline SVGs -->
            <svg v-if="stat.iconType === 'users'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
            <svg v-else-if="stat.iconType === 'check'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <svg v-else-if="stat.iconType === 'x'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <span class="text-[0.6rem] uppercase tracking-widest text-stone font-bold">{{ stat.trend }}</span>
        </div>
        <p class="text-[0.65rem] uppercase tracking-widest text-stone font-bold mb-2">{{ stat.label }}</p>
        <p class="text-4xl font-serif text-ebony">{{ stat.value }}</p>
      </div>
    </div>

    <!-- Actions & Filters -->
    <div class="flex flex-col md:flex-row justify-between items-end gap-10 border-b border-stone/10 pb-12">
      <div class="space-y-4 max-w-md">
        <h2 class="text-2xl font-serif text-ebony">Registre des invités.</h2>
        <p class="text-[0.65rem] uppercase tracking-widest text-stone font-bold">Gérez vos confirmations et invitations avec précision.</p>
      </div>
      <div class="flex gap-6">
        <button v-for="status in ['Tous', 'Oui', 'Non', 'En attente']" :key="status" @click="filterStatus = status" class="text-[0.6rem] uppercase tracking-widest font-bold transition-all duration-500" :class="filterStatus === status ? 'text-ebony' : 'text-stone hover:text-gold-muted'">
          {{ status }}
        </button>
      </div>
    </div>

    <!-- Bulk Actions Floating Bar -->
    <div v-if="selectedGuests.length > 0" class="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-ebony text-ivory px-10 py-6 shadow-floating flex items-center gap-12 border border-stone/10 animate-fade-in-up">
      <div class="flex items-center gap-4 border-r border-ivory/10 pr-12">
        <span class="text-xl font-serif text-gold-muted">{{ selectedGuests.length }}</span>
        <span class="text-[0.6rem] uppercase tracking-widest font-bold">Sélectionnés</span>
      </div>
      <div class="flex gap-8">
        <button @click="bulkAction('validé')" class="text-[0.6rem] uppercase tracking-widest font-bold hover:text-emerald-400 transition-colors">Valider</button>
        <button @click="bulkAction('refusé')" class="text-[0.6rem] uppercase tracking-widest font-bold hover:text-rose-400 transition-colors">Refuser</button>
        <button @click="bulkAction('inviter')" class="text-[0.6rem] uppercase tracking-widest font-bold hover:text-gold-muted transition-colors">Inviter</button>
      </div>
    </div>

    <!-- Registry Table -->
    <div class="bg-white border border-stone/10 shadow-editorial overflow-hidden">
      <div v-if="loading && !guests.length" class="p-20 text-center">
        <div class="w-8 h-[1px] bg-stone mx-auto animate-pulse"></div>
      </div>
      <table v-else class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-stone/5 border-b border-stone/10">
            <th class="px-10 py-6 w-10">
              <input type="checkbox" @change="toggleSelectAll" :checked="selectedGuests.length === filteredGuests.length && filteredGuests.length > 0" class="w-4 h-4 rounded-none border-stone/20 text-ebony focus:ring-ebony bg-transparent" />
            </th>
            <th class="px-10 py-6 text-[0.6rem] uppercase tracking-widest text-stone font-bold">Invité</th>
            <th class="px-10 py-6 text-[0.6rem] uppercase tracking-widest text-stone font-bold">Statut</th>
            <th class="px-10 py-6 text-[0.6rem] uppercase tracking-widest text-stone font-bold">Accompagnants</th>
            <th class="px-10 py-6 text-[0.6rem] uppercase tracking-widest text-stone font-bold text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-stone/5">
          <tr v-for="guest in filteredGuests" :key="guest.id" class="group hover:bg-ivory transition-colors duration-500">
            <td class="px-10 py-8">
              <input type="checkbox" v-model="selectedGuests" :value="guest.id" class="w-4 h-4 rounded-none border-stone/20 text-ebony focus:ring-ebony bg-transparent" />
            </td>
            <td class="px-10 py-8">
              <div class="flex flex-col">
                <span class="text-lg font-serif text-ebony mb-1">{{ guest.nom_complet }}</span>
                <span class="text-[0.6rem] uppercase tracking-widest text-stone">{{ guest.email }}</span>
              </div>
            </td>
            <td class="px-10 py-8">
              <span class="px-4 py-1.5 text-[0.55rem] uppercase tracking-widest font-bold border transition-all" :class="statusClass(guest.statut)">
                {{ guest.statut === 'validé' ? 'Confirmé' : guest.statut === 'refusé' ? 'Refusé' : 'En attente' }}
              </span>
            </td>
            <td class="px-10 py-8">
              <span class="font-serif text-xl text-ebony">{{ guest.nombre_accompagnants || 0 }}</span>
            </td>
            <td class="px-10 py-8">
              <div class="flex justify-end gap-4 transition-opacity duration-500">
                <button @click="handleAction(guest.id, 'validé')" class="p-2 border border-stone/10 hover:border-emerald-500 hover:text-emerald-500 transition-all" title="Valider">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 shadow-sm"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </button>
                <button @click="handleAction(guest.id, 'refusé')" class="p-2 border border-stone/10 hover:border-rose-600 hover:text-rose-600 transition-all" title="Refuser">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 shadow-sm"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </button>
                <button @click="handleAction(guest.id, 'inviter')" class="p-2 border border-stone/10 hover:border-gold-muted hover:text-gold-muted transition-all" title="Envoi invitation" :class="{'opacity-20': guest.invitation_envoyee}">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 shadow-sm"><path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                </button>
                <button @click="handleAction(guest.id, 'supprimer')" class="p-2 border border-stone/10 hover:border-rose-600 hover:text-rose-600 transition-all" title="Supprimer">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 shadow-sm"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in-up { animation: fadeInUp 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
</style>
