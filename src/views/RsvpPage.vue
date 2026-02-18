<template>
  <div class="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-100">

    <!-- Header -->
    <header class="relative bg-neutral-900 text-white">
      <div class="container mx-auto px-4 py-16 sm:py-20 text-center">
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold tracking-wide animate-fade-in-down">
          Confirmez votre présence
        </h1>

        <p class="mt-4 text-sm sm:text-base text-white/70 max-w-xl mx-auto animate-fade-in-up">
          Nous serions ravis de vous compter parmi nous
        </p>
      </div>

      <!-- Séparateur subtil -->
      <div class="absolute bottom-0 left-0 w-full h-px bg-white/10"></div>
    </header>

    <!-- Contenu principal -->
    <main class="relative z-10 -mt-10 sm:-mt-12 pb-20">
      <div class="container mx-auto px-4">
        <RsvpForm />
      </div>
    </main>

  </div>
</template>

<script setup lang="ts">
import RsvpForm from '@/components/rsvp/RsvpForm.vue'
</script>

<style scoped>
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-down {
  animation: fadeInDown 0.6s ease forwards;
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease forwards;
  animation-delay: 0.1s;
}
</style>
