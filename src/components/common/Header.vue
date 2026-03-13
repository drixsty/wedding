<template>
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-700',
      scrolled ? 'bg-ivory/80 backdrop-blur-xl border-b border-stone/10 py-6' : 'bg-transparent py-10'
    ]"
  >
    <div class="container mx-auto px-6 md:px-10 flex items-center justify-between">
      <router-link to="/" class="group flex items-center gap-3">
        <div class="w-8 h-8 md:w-10 md:h-10 border border-ebony flex items-center justify-center font-serif text-lg md:text-xl font-bold group-hover:bg-ebony group-hover:text-ivory transition-all duration-700">W.</div>
        <span class="text-[0.6rem] md:text-[0.65rem] uppercase tracking-[0.4em] text-ebony font-bold">Atelier</span>
      </router-link>

      <nav class="hidden md:flex items-center gap-8 lg:gap-12">
        <router-link v-for="link in navLinks" :key="link.to" :to="link.to" class="text-[0.6rem] uppercase tracking-[0.4em] text-ebony font-bold hover:text-gold-muted transition-colors relative group">
          {{ link.label }}
          <div class="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold-muted transition-all duration-700 group-hover:w-full"></div>
        </router-link>
        <router-link to="/rsvp" class="px-6 lg:px-8 py-2.5 border border-ebony text-[0.6rem] uppercase tracking-[0.4em] text-ebony font-bold hover:bg-ebony hover:text-ivory transition-all duration-700 shadow-sm">
          Invitation
        </router-link>
      </nav>

      <button @click="mobileMenuOpen = !mobileMenuOpen" class="lg:hidden group flex flex-col gap-1.5 items-end relative z-[70] p-2 -mr-2">
        <div class="w-8 h-[1px] bg-ebony transition-all duration-500 shadow-sm" :class="{ 'rotate-45 translate-y-2 w-8': mobileMenuOpen, 'group-hover:w-12': !mobileMenuOpen }"></div>
        <div class="w-5 h-[1px] bg-ebony transition-all duration-500 shadow-sm" :class="{ 'opacity-0': mobileMenuOpen, 'group-hover:w-12': !mobileMenuOpen }"></div>
        <div class="w-8 h-[1px] bg-ebony transition-all duration-500 shadow-sm" :class="{ '-rotate-45 -translate-y-2 w-8': mobileMenuOpen, 'group-hover:w-12': !mobileMenuOpen }"></div>
      </button>
    </div>

    <!-- Mobile Menu Overlay -->
    <transition name="menu-fade">
      <div v-if="mobileMenuOpen" class="fixed inset-0 z-[60] bg-ivory/98 backdrop-blur-xl flex flex-col items-center justify-center">
        <nav class="flex flex-col items-center gap-12">
          <router-link 
            v-for="(link, idx) in navLinks" 
            :key="link.to" 
            :to="link.to" 
            @click="mobileMenuOpen = false" 
            class="text-4xl font-serif text-ebony hover:text-gold-muted transition-colors translate-y-10 animate-fade-in"
            :style="{ animationDelay: `${idx * 0.1}s` }"
          >
            {{ link.label }}
          </router-link>
          <router-link 
            to="/rsvp" 
            @click="mobileMenuOpen = false" 
            class="text-4xl font-serif text-ebony hover:text-gold-muted transition-colors translate-y-10 animate-fade-in"
            style="animation-delay: 0.3s"
          >
            Invitation
          </router-link>
        </nav>
        
        <!-- Decoration in menu -->
        <div class="absolute bottom-20 left-1/2 -translate-x-1/2 w-12 h-[1px] bg-gold-muted/30"></div>
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
.menu-fade-enter-active, .menu-fade-leave-active { 
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1); 
}
.menu-fade-enter-from, .menu-fade-leave-to { 
  opacity: 0; 
}

@keyframes fadeInSlide {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  opacity: 0;
  animation: fadeInSlide 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
