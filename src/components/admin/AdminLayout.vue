<template>
  <div class="admin-shell min-h-screen">
    <header class="admin-shell__header">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Administration</p>
        <h1 class="text-2xl md:text-3xl font-serif text-slate-900">{{ t('admin.dashboard.title') }}</h1>
      </div>
      <div class="flex items-center gap-2">
        <router-link to="/" class="admin-shell__link">{{ t('admin.dashboard.viewSite') }}</router-link>
        <button @click="handleLogout" class="admin-shell__logout">{{ t('admin.dashboard.logout') }}</button>
      </div>
    </header>

    <nav class="admin-shell__nav" aria-label="Navigation administration">
      <router-link v-for="item in navItems" :key="item.to" :to="item.to" class="admin-shell__tab" active-class="admin-shell__tab--active">
        <span>{{ item.icon }}</span>
        {{ item.label }}
      </router-link>
    </nav>

    <main class="pb-10">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { t } from '@/i18n'

const router = useRouter()
const { signOut } = useAuth()

const navItems = [
  { to: '/admin/dashboard/guests', label: 'Invités & RSVP', icon: '👥' },
  { to: '/admin/dashboard/content', label: 'Contenus & thème', icon: '🎨' },
  { to: '/admin/dashboard/gallery', label: 'Galerie photos', icon: '🖼️' }
]

async function handleLogout() {
  await signOut()
  router.push('/admin/login')
}
</script>
