<template>
  <div class="min-h-screen bg-ivory flex flex-col font-sans selection:bg-ebony selection:text-ivory">
    <!-- Atelier Header Navigation -->
    <header class="h-24 bg-white/80 backdrop-blur-xl border-b border-stone/10 flex items-center justify-between px-16 sticky top-0 z-50">
      <div class="flex items-center gap-12">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 border border-ebony flex items-center justify-center font-serif text-xl font-bold">W.</div>
          <span class="text-sm font-bold uppercase tracking-[0.4em] text-ebony">Atelier</span>
        </div>

        <nav class="flex items-center gap-8 ml-12">
          <router-link v-for="item in navItems" :key="item.to" :to="item.to" class="flex items-center gap-3 px-4 py-2 transition-all duration-700 group relative" :class="route.path.startsWith(item.to) ? 'text-ebony' : 'text-stone'">
            <component :is="item.iconComponent" class="w-4 h-4 transition-colors duration-700" :class="route.path.startsWith(item.to) ? 'text-gold-muted' : 'group-hover:text-ebony'" />
            <span class="text-[0.65rem] uppercase tracking-[0.3em] font-bold">{{ item.label }}</span>
            <div v-if="route.path.startsWith(item.to)" class="absolute -bottom-7 left-0 w-full h-[2px] bg-gold-muted animate-scale-in-x"></div>
          </router-link>
        </nav>
      </div>

      <div class="flex items-center gap-10">
        <div class="flex items-center gap-12">
          <div class="flex items-center gap-4 border-l border-stone/10 pl-10">
            <div class="text-right">
              <p class="text-[0.6rem] font-bold text-ebony tracking-widest uppercase">Concierge</p>
              <p class="text-[0.5rem] text-stone tracking-widest uppercase">Admin</p>
            </div>
            <div class="w-10 h-10 border border-stone/20 overflow-hidden">
               <img src="https://ui-avatars.com/api/?name=W&background=F9F7F2&color=1A1A1A&bold=true" alt="Avatar" />
            </div>
          </div>
          <button @click="handleLogout" class="flex items-center gap-3 text-stone hover:text-ebony transition-colors duration-700 group">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7" /></svg>
            <span class="text-[0.6rem] uppercase tracking-widest font-bold">Quitter</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Workspace -->
    <main class="flex-1">
      <div class="p-16 max-w-7xl mx-auto">
        <div class="mb-20 space-y-4" v-reveal>
          <div class="flex items-center gap-4 mb-2">
            <span class="text-[0.6rem] uppercase tracking-[0.4em] text-gold-muted font-bold">Workspace</span>
            <div class="h-[1px] w-8 bg-gold-muted/30"></div>
          </div>
          <h1 class="text-4xl md:text-6xl font-serif text-ebony leading-tight">{{ currentTitle }}.</h1>
        </div>
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const router = useRouter()
const { signOut } = useAuth()

const GuestIcon = defineComponent({ render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '1.5', d: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' })]) })
const GalleryIcon = defineComponent({ render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '1.5', d: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' })]) })

const navItems = [
  { to: '/admin/dashboard/guests', label: 'Invitations', iconComponent: GuestIcon },
  { to: '/admin/dashboard/gallery', label: 'Visibilité', iconComponent: GalleryIcon }
]

const currentTitle = computed(() => navItems.find(item => route.path.startsWith(item.to))?.label || 'Espace de Travail')

async function handleLogout() {
  await signOut()
  router.push('/admin/login')
}
</script>

<style scoped>
.animate-scale-in-x {
  animation: scaleInX 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  transform-origin: left;
}
@keyframes scaleInX {
  from { transform: scaleX(0); opacity: 0; }
  to { transform: scaleX(1); opacity: 1; }
}
</style>
