<template>
  <div class="admin-shell min-h-screen">
    <header class="admin-shell__header">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Espace d'administration</p>
        <h1 class="text-2xl font-serif text-slate-900 md:text-3xl">{{ currentTitle }}</h1>
        <p class="text-sm text-slate-500">Interface minimaliste pensée pour piloter rapidement tout le site.</p>
      </div>
      <div class="flex items-center gap-2">
        <router-link to="/" class="admin-shell__link">Voir le site</router-link>
        <button @click="handleLogout" class="admin-shell__logout">Déconnexion</button>
      </div>
    </header>

    <nav class="admin-shell__nav" aria-label="Navigation administration">
      <router-link
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="admin-shell__tab"
        active-class="admin-shell__tab--active"
      >
        <span>{{ item.icon }}</span>
        <span>{{ item.label }}</span>
      </router-link>
    </nav>

    <main class="pb-10">
      <router-view />
    </main>
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
  { to: '/admin/dashboard/overview', label: 'Dashboard', icon: '◈' },
  { to: '/admin/dashboard/guests', label: 'Invités & RSVP', icon: '◉' },
  { to: '/admin/dashboard/content', label: 'Contenus & thème', icon: '◎' },
  { to: '/admin/dashboard/gallery', label: 'Galerie photos', icon: '◌' }
]

const currentTitle = computed(() => navItems.find(item => route.path.startsWith(item.to))?.label || 'Administration')

async function handleLogout() {
  await signOut()
  router.push('/admin/login')
}
</script>
