<template>
  <div class="min-h-screen bg-gradient-to-b from-ivoire via-white to-ivoire-dark">
    <!-- Header Section -->
    <header class="relative bg-neutral-900 text-white">
      <div class="container mx-auto px-4 py-16 sm:py-20 text-center">
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold tracking-wide animate-fade-in-down">
          Galerie Photos
        </h1>

        <p class="mt-4 text-sm sm:text-base text-white/70 max-w-xl mx-auto animate-fade-in-up">
          Revivez nos plus beaux moments à travers ces images
        </p>
      </div>

      <!-- Séparateur subtil -->
      <div class="absolute bottom-0 left-0 w-full h-px bg-white/10"></div>
    </header>

    <!-- Gallery Component -->
    <main class="container mx-auto px-4 py-12">
      <Gallery />
    </main>
  </div>
</template>

<script setup lang="ts">
import Gallery from '@/components/gallery/Gallery.vue'
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
  background: linear-gradient(135deg, #fef9f4 0%, #fff 50%, #f5f0e5 100%);
}
</style>
