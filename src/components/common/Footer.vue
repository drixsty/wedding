<template>
  <footer class="py-24 border-t border-stone/20 bg-ivory">
    <div class="container mx-auto px-10">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-20">
        <div class="md:col-span-5 space-y-10">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 border border-ebony flex items-center justify-center font-serif text-xl font-bold">W.</div>
            <span class="text-sm font-bold uppercase tracking-[0.4em] text-ebony">Atelier</span>
          </div>
          <p class="text-[0.65rem] uppercase tracking-widest text-stone leading-loose max-w-sm font-bold">
            Une célébration de l'élégance et de la promesse éternelle. Conçu pour durer, inspiré par l'art.
          </p>
        </div>

        <div class="md:col-span-3 space-y-8">
          <h4 class="text-[0.6rem] uppercase tracking-[0.5em] text-gold-muted font-bold">Exploration</h4>
          <ul class="space-y-4">
            <li v-for="link in navLinks" :key="link.to">
              <router-link :to="link.to" class="text-[0.65rem] uppercase tracking-widest text-ebony font-bold hover:text-gold-muted transition-colors">{{ link.label }}</router-link>
            </li>
          </ul>
        </div>

        <div class="md:col-span-4 space-y-8 text-right md:text-left">
          <h4 class="text-[0.6rem] uppercase tracking-[0.5em] text-gold-muted font-bold">Contact & Support</h4>
          <p class="text-[0.65rem] uppercase tracking-widest text-stone leading-loose font-bold">{{ content.footer.questions }}</p>
          <a :href="`mailto:${content.contactEmail}`" class="inline-block text-[0.65rem] uppercase tracking-widest text-ebony font-bold border-b border-ebony/20 pb-1 hover:border-ebony transition-all">{{ content.contactEmail }}</a>
        </div>
      </div>

      <div class="mt-24 pt-10 border-t border-stone/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p class="text-[0.55rem] uppercase tracking-widest text-stone font-bold">© {{ currentYear }} {{ content.coupleName }} — Tous droits réservés</p>
        <div class="flex gap-8">
           <span class="text-[0.55rem] uppercase tracking-widest text-stone font-bold">Design by Timeless Atelier</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSiteContent } from '@/composables/useSiteContent'

const { content } = useSiteContent()
const currentYear = new Date().getFullYear()

const navLinks = computed(() => [
  { to: '/', label: 'Archives' },
  { to: '/gallery', label: 'Curation' },
  { to: '/rsvp', label: 'Cérémonie' }
])
</script>
