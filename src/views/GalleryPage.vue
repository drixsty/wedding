<template>
  <div class="min-h-screen bg-gradient-to-b from-surface-base via-surface-elevated to-surface-subtle relative overflow-hidden">
    <div class="pointer-events-none absolute -top-20 -left-16 h-72 w-72 rounded-full bg-dore/20 blur-3xl animate-float-soft"></div>
    <div class="pointer-events-none absolute bottom-10 right-0 h-64 w-64 rounded-full bg-mauve/20 blur-3xl animate-float-soft delay-300"></div>

    <header class="relative bg-surface-strong text-content-inverse">
      <div class="container mx-auto px-4 py-16 sm:py-20 text-center">
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold tracking-wide animate-fade-in-down">
          {{ content.galleryPage.title }}
        </h1>

        <p class="mt-4 text-sm sm:text-base text-content-inverse/75 max-w-xl mx-auto animate-fade-in-up">
          {{ content.galleryPage.subtitle }}
        </p>
      </div>

      <div class="absolute bottom-0 left-0 w-full h-px bg-content-inverse/10"></div>
    </header>

    <main class="container mx-auto px-4 py-12">
      <Gallery />
    </main>
  </div>
</template>

<script setup lang="ts">
import Gallery from '@/components/gallery/Gallery.vue'
import { useSiteContent } from '@/composables/useSiteContent'

const { content } = useSiteContent()
</script>

<style scoped>
@keyframes fadeInDown {0% { opacity: 0; transform: translateY(-20px); }100% { opacity: 1; transform: translateY(0); }}
@keyframes fadeInUp {0% { opacity: 0; transform: translateY(20px); }100% { opacity: 1; transform: translateY(0); }}
.animate-fade-in-down { animation: fadeInDown 0.8s ease forwards; }
.animate-fade-in-up { animation: fadeInUp 0.8s ease forwards; }
.animate-fade-in-up.delay-100 { animation-delay: 0.1s; }
.bg-gradient-elegant { background: var(--gradient-warm); }
</style>
