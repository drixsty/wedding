<template>
  <footer class="bg-neutral-950 text-neutral-300 pt-20 pb-10">
    <div class="max-w-6xl mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div class="space-y-4">
          <h3 class="text-2xl font-serif text-white tracking-wide">{{ content.coupleName }}</h3>
          <div class="text-sm text-neutral-400 space-y-1">
            <p>{{ weddingDate }}</p>
            <p>{{ content.weddingLocation }}</p>
          </div>
        </div>

        <div>
          <h4 class="text-sm uppercase tracking-widest text-neutral-500 mb-6">{{ content.footer.navigationTitle }}</h4>
          <ul class="space-y-3">
            <li v-for="link in navLinks" :key="link.to">
              <router-link :to="link.to" class="footer-link">{{ link.label }}</router-link>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="text-sm uppercase tracking-widest text-neutral-500 mb-6">{{ content.footer.contactTitle }}</h4>
          <p class="text-sm text-neutral-400 leading-relaxed">{{ content.footer.questions }}</p>
          <a :href="`mailto:${content.contactEmail}`" class="footer-link block mt-3">{{ content.contactEmail }}</a>
        </div>
      </div>

      <div class="border-t border-neutral-800 mt-16 pt-8 text-center text-xs text-neutral-500">
        <p>© {{ currentYear }} {{ content.coupleName }} — {{ content.footer.rights }}</p>
        <p class="mt-2 opacity-70">{{ content.footer.madeWithCare }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatDate } from '@/utils/formatters'
import { useSiteContent } from '@/composables/useSiteContent'

const { content } = useSiteContent()

const weddingDate = computed(() => formatDate(content.value.weddingDate, 'DD MMMM YYYY'))
const currentYear = new Date().getFullYear()

const navLinks = computed(() => [
  { to: '/', label: content.value.nav.home },
  { to: '/rsvp', label: content.value.nav.rsvp },
  { to: '/galerie', label: content.value.nav.gallery }
])
</script>

<style scoped>
.footer-link { position: relative; font-size: 0.9rem; color: #a3a3a3; transition: color 0.3s ease; }
.footer-link::after { content: ''; position: absolute; left: 0; bottom: -4px; width: 0%; height: 1px; background: #ffffff; transition: width 0.3s ease; }
.footer-link:hover { color: #ffffff; }
.footer-link:hover::after { width: 100%; }
</style>
