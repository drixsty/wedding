<template>
  <div class="min-h-screen">
    <!-- Hero Section Ultra-Moderne -->

    <section class="relative h-[72svh] min-h-[34rem] max-h-[52rem] md:h-[82vh] md:min-h-[40rem] flex flex-col justify-center items-center overflow-hidden bg-surface-strong">
      <!-- Background Image + Overlay -->
      <div class="absolute inset-0 z-0">
        <img
            src="https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=2560&q=80"
            srcset="https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1200&q=80 1200w,
                    https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1920&q=80 1920w,
                    https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=2560&q=80 2560w,
                    https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=3200&q=80 3200w"
            sizes="100vw"
            alt="Mariage"
            class="w-full h-full object-cover object-center"
            loading="eager"
            fetchpriority="high"
            decoding="async"
        />
        <div class="absolute inset-0 bg-surface-strong/35"></div>
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
            class="mt-8 app-btn-soft transform hover:scale-105 animate-fade-in-up delay-500"
        >
          {{ t('home.cta') }}
        </router-link>
      </div>
    </section>

    <!-- Story Section Enhanced -->
    <NotreHistoire/>

    <!-- Carousel Section with better design -->
    <section class="relative py-24 bg-surface-elevated overflow-hidden w-full">
      <!-- Top Gradient Accent -->
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-dore to-transparent"></div>

      <!-- Section Header -->
      <div class="text-center mb-12 sm:mb-16">
        <h2 class="text-title-md sm:text-title-lg font-semibold tracking-tight text-content-primary">
          {{ t('home.momentsTitle') }}
        </h2>
        <p class="text-content-muted mt-3 text-body-sm sm:text-body">
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
    alt: t('home.carousel.1.alt'),
    title: t('home.carousel.1.title'),
    caption: t('home.carousel.1.caption')
  },
  {
    url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=80',
    alt: t('home.carousel.2.alt'),
    title: t('home.carousel.2.title'),
    caption: t('home.carousel.2.caption')
  },
  {
    url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1200&q=80',
    alt: t('home.carousel.3.alt'),
    title: t('home.carousel.3.title'),
    caption: t('home.carousel.3.caption')
  },
  {
    url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200&q=80',
    alt: t('home.carousel.4.alt'),
    title: t('home.carousel.4.title'),
    caption: t('home.carousel.4.caption')
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
