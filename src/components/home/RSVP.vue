<template>
  <section class="relative py-24 sm:py-32 bg-gradient-to-br from-gold via-brown to-brown-dark overflow-hidden">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-0 right-1/2 translate-x-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

    <div class="container mx-auto px-4 relative z-10 text-center max-w-4xl">
      <div class="inline-block mb-6 animate-pulse">
        <svg class="w-16 h-16 sm:w-20 sm:h-20 text-ivoire mx-auto" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
        </svg>
      </div>

      <h2 class="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-ivoire mb-4 sm:mb-6">
        Êtes-vous prêts à écrire ce souvenir avec nous ?
      </h2>

      <div class="w-20 h-1 bg-ivoire mx-auto mb-6 sm:mb-8 rounded-full"></div>

      <p class="text-lg sm:text-2xl text-ivoire/90 mb-2">
        Confirmez votre présence avant le
      </p>
      <p class="text-2xl sm:text-3xl md:text-4xl text-ivoire font-bold mb-6">
        {{ deadline }}
      </p>

      <p class="text-base sm:text-lg text-ivoire/80 mb-10 leading-relaxed">
        Votre présence est notre plus beau cadeau. En répondant maintenant, vous nous aidez à préparer une expérience sur-mesure : accueil, menu, animations et petites attentions pensées pour vous.
      </p>

      <router-link
          to="/rsvp"
          class="inline-flex items-center justify-center gap-3 bg-ivoire text-brown-dark font-semibold px-8 sm:px-12 py-3 sm:py-5 rounded-2xl text-lg sm:text-xl hover:bg-ivoire/90 transition-all duration-300 shadow-lg"
      >
        <svg class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        Je confirme ma présence
      </router-link>
    </div>
  </section>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import {formatDate} from '@/utils/formatters.ts'

const weddingDateRaw = import.meta.env.VITE_WEDDING_DATE || '2025-08-15T14:00:00'

const deadline = computed(() => {
  const deadlineDate = new Date(weddingDateRaw)
  deadlineDate.setDate(deadlineDate.getDate() - 30)
  return formatDate(deadlineDate, 'DD MMMM YYYY')
})
</script>

<style scoped>
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, #F5A623, #6B4226, #4B2E1E);
}
.text-ivoire {
  color: #FDF6EE;
}
.text-brown-dark {
  color: #4B2E1E;
}
</style>
