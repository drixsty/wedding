<template>
  <section class="space-y-5 animate-fade-in">
    <div class="admin-panel">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Vue d'ensemble</p>
          <h2 class="admin-section-title">Pilotage administration</h2>
          <p class="text-sm text-slate-600">Suivez les priorités du jour et traitez les demandes en 3 étapes simples.</p>
        </div>
        <button class="admin-btn admin-btn-muted" @click="loadOverview">Actualiser</button>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
      <article class="admin-workflow-card">
        <p class="admin-badge">Étape 1</p>
        <h3 class="mt-3 font-semibold text-slate-900">Valider les RSVP en attente</h3>
        <p class="mt-1 text-sm text-slate-600">Traitez d'abord les réponses non confirmées pour garder votre liste propre.</p>
      </article>
      <article class="admin-workflow-card">
        <p class="admin-badge">Étape 2</p>
        <h3 class="mt-3 font-semibold text-slate-900">Vérifier les messages groupés</h3>
        <p class="mt-1 text-sm text-slate-600">Envoyez un rappel email/WhatsApp aux invités sélectionnés.</p>
      </article>
      <article class="admin-workflow-card">
        <p class="admin-badge">Étape 3</p>
        <h3 class="mt-3 font-semibold text-slate-900">Publier le contenu</h3>
        <p class="mt-1 text-sm text-slate-600">Appliquez vos changements de texte, thème et galerie en toute confiance.</p>
      </article>
    </div>

    <div v-if="stats" class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <article class="admin-panel border-l-4 border-emerald-500">
        <p class="admin-kpi-label">RSVP validés</p>
        <p class="admin-kpi-value text-emerald-600">{{ stats.confirmations_oui }}</p>
      </article>
      <article class="admin-panel border-l-4 border-amber-500">
        <p class="admin-kpi-label">En attente</p>
        <p class="admin-kpi-value text-amber-600">{{ stats.en_attente }}</p>
      </article>
      <article class="admin-panel border-l-4 border-violet-500">
        <p class="admin-kpi-label">Invitations envoyées</p>
        <p class="admin-kpi-value text-violet-600">{{ stats.invitations_envoyees }}</p>
      </article>
      <article class="admin-panel border-l-4 border-sky-500">
        <p class="admin-kpi-label">QR scannés</p>
        <p class="admin-kpi-value text-sky-600">{{ stats.qr_scannes }}</p>
      </article>
    </div>

    <div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <article class="admin-panel xl:col-span-2">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="admin-section-title">Demandes prioritaires</h3>
          <RouterLink to="/admin/dashboard/guests" class="admin-shell__link">Gérer les invités</RouterLink>
        </div>
        <div v-if="loading" class="py-8 text-sm text-slate-500">Chargement...</div>
        <ul v-else-if="pendingGuests.length > 0" class="space-y-3">
          <li v-for="guest in pendingGuests" :key="guest.id" class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div>
              <p class="font-semibold text-slate-900">{{ guest.nom_complet }}</p>
              <p class="text-xs text-slate-500">{{ guest.email }} · {{ formatDate(guest.created_at) }}</p>
            </div>
            <span class="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">En attente</span>
          </li>
        </ul>
        <EmptyState v-else description="Aucune validation prioritaire. Tout est à jour ✨" compact />
      </article>

      <article class="admin-panel">
        <h3 class="admin-section-title mb-4">Workflows rapides</h3>
        <div class="space-y-2">
          <RouterLink to="/admin/dashboard/guests" class="admin-quicklink">
            <span>Confirmer les RSVPs</span>
            <span>→</span>
          </RouterLink>
          <RouterLink to="/admin/dashboard/gallery" class="admin-quicklink">
            <span>Modérer les photos</span>
            <span>→</span>
          </RouterLink>
          <RouterLink to="/admin/dashboard/content" class="admin-quicklink">
            <span>Ajuster le contenu</span>
            <span>→</span>
          </RouterLink>
          <RouterLink to="/" class="admin-quicklink">
            <span>Prévisualiser le site</span>
            <span>→</span>
          </RouterLink>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { useGuests } from '@/composables/useGuests'

const { guests, stats, loading, fetchGuests, fetchStats } = useGuests()

const pendingGuests = computed(() => guests.value
  .filter(guest => guest.statut === 'en_attente')
  .slice(0, 6))

function formatDate(value: string | null) {
  if (!value) return 'Date indisponible'
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(value))
}

async function loadOverview() {
  await Promise.all([
    fetchGuests({ statut: 'en_attente' }),
    fetchStats()
  ])
}

onMounted(loadOverview)
</script>
