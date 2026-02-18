<template>
  <div class="min-h-screen">
    <!-- Hero Section Ultra-Moderne -->

    <section class="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-gray-900">
      <!-- Background Image + Overlay -->
      <div class="absolute inset-0 z-0">
        <img
            src="https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=1920&q=80"
            alt="Mariage"
            class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-black/25"></div>
      </div>

      <!-- Content -->
      <div class="relative z-10 text-center px-4 max-w-3xl mx-auto space-y-6">

        <!-- Couple Names -->
        <h1
            class="text-5xl sm:text-6xl md:text-7xl font-serif font-extrabold text-white tracking-tight transform transition-all duration-1000 ease-out opacity-0 scale-90 animate-fade-in-up"
            style="animation-delay: 200ms;"
        >
          {{ coupleName }}
        </h1>

        <!-- Subtitle -->
        <p class="text-lg sm:text-xl text-white/80 italic animate-fade-in-up delay-300">
          {{ t('home.subtitle') }}
        </p>

        <p class="text-lg sm:text-xl text-white/90 animate-fade-in-up delay-400">
          {{ weddingDateFormatted }} • {{ weddingLocation }}
        </p>

        <!-- Countdown Timer -->
        <CountdownTimer class="animate-fade-in-up delay-500"/>

        <!-- CTA Button -->
        <router-link
            to="/rsvp"
            class="mt-8 inline-block bg-white text-gray-900 font-semibold px-8 py-3 rounded-xl hover:bg-white/90 transition transform hover:scale-105 duration-300 animate-fade-in-up delay-500"
        >
          {{ t('home.cta') }}
        </router-link>
      </div>
    </section>

    <!-- Story Section Enhanced -->
    <NotreHistoire/>

    <!-- Carousel Section with better design -->
    <section class="relative py-24 bg-white overflow-hidden w-full">
      <!-- Top Gradient Accent -->
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent"></div>

      <!-- Section Header -->
      <div class="text-center mb-12 sm:mb-16">
        <h2 class="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900">
          {{ t('home.momentsTitle') }}
        </h2>
        <p class="text-neutral-500 mt-3 text-sm sm:text-base">
          {{ t('home.momentsSubtitle') }}
        </p>
      </div>

      <!-- Carousel Full Width -->
      <div class="w-full">
        <Carousel
            :images="carouselImages"
            :autoplay="true"
            :interval="5000"
            class="w-full rounded-none shadow-none"
        />
      </div>
    </section>

    <!-- Ceremony Locations -->
    <CeremonyLocations />

    <!-- Timeline Section -->
    <Timeline />

    <!-- FAQ Section -->
    <FAQ />

    <RSVP/>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CountdownTimer from '@/components/home/CountdownTimer.vue'
import Carousel from '@/components/home/Carousel.vue'
import CeremonyLocations from '@/components/home/CeremonyLocations.vue'
import Timeline from '@/components/home/Timeline.vue'
import FAQ from '@/components/home/FAQ.vue'
import { formatDate } from '@/utils/formatters'
import NotreHistoire from "@/components/home/NotreHistoire.vue";
import RSVP from "@/components/home/RSVP.vue";
import { t } from '@/i18n'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)


const coupleName = import.meta.env.VITE_COUPLE_NAMES || t('defaults.coupleName')
const weddingLocation = import.meta.env.VITE_WEDDING_LOCATION || t('defaults.weddingLocation')
const weddingDateRaw = import.meta.env.VITE_WEDDING_DATE || t('defaults.weddingDate')

const weddingDateFormatted = computed(() => 
  formatDate(weddingDateRaw, 'DD MMMM YYYY [à] HH[h]mm')
)

const carouselImages = [
  {
    url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200&q=80',
    alt: 'Notre rencontre',
    title: 'La Rencontre Magique',
    caption: 'Paris, Festival Afrobeat - Le jour où tout a commencé'
  },
  {
    url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=80',
    alt: 'Notre voyage',
    title: 'Découverte de l\'Afrique',
    caption: 'Un voyage inoubliable sur les terres de nos ancêtres'
  },
  {
    url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1200&q=80',
    alt: 'La demande',
    title: 'La Grande Question',
    caption: 'Marrakech - Un coucher de soleil, une question, un OUI éternel'
  },
  {
    url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200&q=80',
    alt: 'Nos fiançailles',
    title: 'Les Fiançailles',
    caption: 'Entourés de nos proches, prêts pour la grande aventure'
  }
]
</script>

<style scoped>
.section-divider {
  @apply w-32 h-1 bg-gradient-to-r from-transparent via-dore to-transparent mx-auto my-8;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s forwards;
}

.animate-pulse {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.85; }
}
</style>
