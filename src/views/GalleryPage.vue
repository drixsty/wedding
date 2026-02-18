<template>
  <div class="min-h-screen bg-gradient-to-b from-surface-base via-surface-elevated to-surface-subtle">
    <!-- Header Section -->
    <header class="relative bg-surface-strong text-content-inverse">
      <div class="container mx-auto px-4 py-16 sm:py-20 text-center">
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold tracking-wide animate-fade-in-down">
          {{ t('galleryPage.title') }}
        </h1>

        <p class="mt-4 text-sm sm:text-base text-content-inverse/75 max-w-xl mx-auto animate-fade-in-up">
          {{ t('galleryPage.subtitle') }}
        </p>
      </div>

      <!-- Séparateur subtil -->
      <div class="absolute bottom-0 left-0 w-full h-px bg-content-inverse/10"></div>
    </header>

    <!-- Gallery Component -->
    <main class="container mx-auto px-4 py-12">
      <Gallery />
    </main>
  </div>
</template>

<script setup lang="ts">
import Gallery from '@/components/gallery/Gallery.vue'
import { t } from '@/i18n'
</script>

<style scoped>
/* Animations */
@keyframes fadeInDown {
  0% { opacity: 0; transform: translateY(-20px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-down {
  animation: fadeInDown 0.8s ease forwards;
}
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease forwards;
}
.animate-fade-in-up.delay-100 {
  animation-delay: 0.1s;
}

/* Gradient Header Background (optional elegant gradient) */
.bg-gradient-elegant {
  background: var(--gradient-warm);
}
</style>
