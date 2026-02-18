<template>
  <header
      :class="[
      'fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-4xl transition-all duration-500',
      scrolled ? 'py-2' : 'py-3'
    ]"
  >
    <div
        :class="[
        'rounded-2xl transition-all duration-500 border',
        scrolled
          ? 'bg-white/80 backdrop-blur-xl border-neutral-200 shadow-sm'
          : 'bg-white/40 backdrop-blur-md border-white/30'
      ]"
    >
      <nav class="px-6 py-4 flex items-center justify-between">
        <router-link
            to="/"
            class="font-serif tracking-wide transition-all duration-300"
            :class="scrolled ? 'text-neutral-900 text-lg' : 'text-neutral-800 text-xl'"
        >
          {{ coupleName }}
        </router-link>

        <div class="hidden md:flex items-center space-x-10">
          <router-link
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="nav-item"
              active-class="active-link"
          >
            <span>{{ link.label }}</span>
          </router-link>
        </div>

        <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden text-neutral-800"
        >
          <svg
              class="w-6 h-6 transition-transform duration-300"
              :class="mobileMenuOpen ? 'rotate-90' : ''"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
          >
            <path
                v-if="!mobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
            />
            <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </nav>

      <transition name="mobile">
        <div
            v-if="mobileMenuOpen"
            class="md:hidden px-6 pb-4 pt-2 space-y-4 border-t border-neutral-200"
        >
          <router-link
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              @click="mobileMenuOpen = false"
              class="block text-neutral-700 transition-colors duration-200 hover:text-neutral-900"
              active-class="font-semibold text-neutral-900"
          >
            {{ link.label }}
          </router-link>
        </div>
      </transition>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { t } from '@/i18n'

const mobileMenuOpen = ref(false)
const scrolled = ref(false)

const coupleName = import.meta.env.VITE_COUPLE_NAMES || t('defaults.coupleName')

const navLinks = [
  { to: '/', label: t('nav.home') },
  { to: '/galerie', label: t('nav.gallery') },
  { to: '/rsvp', label: t('nav.rsvp') }
]

const handleScroll = () => {
  scrolled.value = window.scrollY > 40
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.nav-item { position: relative; font-size: 0.9rem; font-weight: 500; color: #525252; transition: color 0.3s ease; }
.nav-item::after { content: ''; position: absolute; left: 0; bottom: -6px; width: 0%; height: 1.5px; background: #171717; transition: width 0.3s ease; }
.nav-item:hover { color: #171717; }
.nav-item:hover::after { width: 100%; }
.active-link { color: #171717; font-weight: 600; }
.active-link::after { width: 100%; }
.mobile-enter-active,.mobile-leave-active { transition: all 0.3s ease; }
.mobile-enter-from,.mobile-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
