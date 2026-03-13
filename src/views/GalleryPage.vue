<template>
  <div class="min-h-screen bg-ivory selection:bg-ebony selection:text-ivory pt-32 pb-24">
    <main class="container mx-auto px-10">
      <!-- High-Impact Editorial Heading -->
      <header class="mb-24 space-y-8" v-reveal>
        <div class="flex items-center gap-4">
          <span class="text-[0.6rem] uppercase tracking-[0.5em] text-gold-muted font-bold">La Collection</span>
          <div class="h-[1px] w-12 bg-gold-muted/30"></div>
        </div>
        <h1 class="text-6xl md:text-8xl font-serif text-ebony leading-[0.9] tracking-tighter">
          Fragments <br/>
          <span class="italic text-gold-muted">d'éternité.</span>
        </h1>
        <p class="text-sm md:text-base text-content-secondary font-light max-w-xl leading-loose">
          Une curation méticuleuse de nos moments les plus précieux. Chaque cliché est une fenêtre ouverte sur l'émotion pure de cette journée.
        </p>
      </header>

      <Gallery />
    </main>

    <!-- Decorative Bottom Line -->
    <div class="mt-20 border-t border-stone/10 mx-10"></div>
  </div>
</template>

<script setup lang="ts">
import Gallery from '@/components/gallery/Gallery.vue'
</script>

<style scoped>
/* Transitive animations handled by v-reveal and Gallery component */
</style>
