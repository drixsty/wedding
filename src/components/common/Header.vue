<template>
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-700',
      scrolled ? 'bg-ivory/80 backdrop-blur-xl border-b border-stone/10 py-6' : 'bg-transparent py-10'
    ]"
  >
    <div class="container mx-auto px-10 flex items-center justify-between">
      <router-link to="/" class="group flex items-center gap-3">
        <div class="w-8 h-8 border border-ebony flex items-center justify-center font-serif text-lg font-bold group-hover:bg-ebony group-hover:text-ivory transition-all duration-700">W.</div>
        <span class="text-[0.65rem] uppercase tracking-[0.4em] text-ebony font-bold">Atelier</span>
      </router-link>

      <nav class="hidden md:flex items-center gap-12">
        <router-link v-for="link in navLinks" :key="link.to" :to="link.to" class="text-[0.6rem] uppercase tracking-[0.4em] text-ebony font-bold hover:text-gold-muted transition-colors relative group">
          {{ link.label }}
          <div class="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold-muted transition-all duration-700 group-hover:w-full"></div>
        </router-link>
        <router-link to="/rsvp" class="px-8 py-2.5 border border-ebony text-[0.6rem] uppercase tracking-[0.4em] text-ebony font-bold hover:bg-ebony hover:text-ivory transition-all duration-700 shadow-sm">
          Invitation
        </router-link>
      </nav>

      <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden group flex flex-col gap-1.5 items-end">
        <div class="w-8 h-[1px] bg-ebony transition-all duration-500 group-hover:w-12"></div>
        <div class="w-5 h-[1px] bg-ebony transition-all duration-500 group-hover:w-12"></div>
      </button>
    </div>

    <!-- Mobile Menu Overlay -->
    <transition name="fade">
      <div v-if="mobileMenuOpen" class="fixed inset-0 z-[60] bg-ivory flex flex-col items-center justify-center space-y-12">
        <button @click="mobileMenuOpen = false" class="absolute top-10 right-10 text-[0.6rem] uppercase tracking-widest font-bold text-stone">Fermer</button>
        <nav class="flex flex-col items-center gap-10">
          <router-link v-for="link in navLinks" :key="link.to" :to="link.to" @click="mobileMenuOpen = false" class="text-3xl font-serif text-ebony">{{ link.label }}</router-link>
          <router-link to="/rsvp" @click="mobileMenuOpen = false" class="text-3xl font-serif text-ebony">Invitation</router-link>
        </nav>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const scrolled = ref(false)
const mobileMenuOpen = ref(false)

const navLinks = computed(() => [
  { to: '/', label: 'Accueil' },
  { to: '/gallery', label: 'Galerie' },
  { to: '/admin/dashboard/guests', label: 'Espace' }
])

const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.8s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
