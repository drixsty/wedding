<template>
  <div class="admin-shell">
    <div class="admin-dashboard-frame">
      <aside class="admin-sidebar">
        <div>
          <p class="admin-sidebar__eyebrow">Wedding Suite</p>
          <h1 class="admin-sidebar__brand">Backoffice</h1>
          <p class="admin-sidebar__caption">Pilotez vos invités et votre galerie depuis une interface unifiée.</p>
        </div>

        <nav class="admin-sidebar__nav" aria-label="Navigation administration">
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="admin-sidebar__tab"
            active-class="admin-sidebar__tab--active"
          >
            <span class="text-base">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </router-link>
        </nav>

        <div class="admin-sidebar__card">
          <p class="text-xs uppercase tracking-[0.16em] text-slate-500">Conseil du jour</p>
          <p class="mt-2 text-sm text-slate-600">Pensez à relancer les invités "En attente" avant d'exporter vos confirmations.</p>
        </div>

        <div class="flex gap-2">
          <router-link to="/" class="admin-shell__link flex-1 text-center">Prévisualiser</router-link>
          <button @click="handleLogout" class="admin-shell__logout">Déconnexion</button>
        </div>
      </aside>

      <div class="admin-main">
        <header class="admin-shell__header">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Dashboard mariage</p>
            <h2 class="text-2xl font-semibold text-slate-900 md:text-3xl">{{ currentTitle }}</h2>
          </div>
          <div class="admin-shell__search">{{ currentDate }}</div>
        </header>

        <main class="pb-8">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const router = useRouter()
const { signOut } = useAuth()

const navItems = [
  { to: '/admin/dashboard/guests', label: 'Invitations & RSVP', icon: '📋' },
  { to: '/admin/dashboard/gallery', label: 'Galerie & modération', icon: '🖼️' }
]

const currentTitle = computed(() => navItems.find(item => route.path.startsWith(item.to))?.label || 'Administration')
const currentDate = computed(() => new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date()))

async function handleLogout() {
  await signOut()
  router.push('/admin/login')
}
</script>
