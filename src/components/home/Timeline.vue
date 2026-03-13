<template>
  <section class="py-spacing-section bg-white border-b border-stone/10">
    <div class="container mx-auto px-6 max-w-5xl">
       <div class="text-center space-y-12 mb-32">
          <span class="text-[0.65rem] uppercase tracking-[0.8em] text-gold-muted font-bold block" v-reveal>Itinéraire</span>
          <h2 class="text-5xl md:text-8xl font-serif text-ebony tracking-tighter" v-reveal="{ delay: 200 }">
             La Chronologie.
          </h2>
          <div class="h-[1px] w-24 bg-ebony mx-auto opacity-10"></div>
       </div>

       <div class="relative space-y-40">
          <!-- Central Line -->
          <div class="absolute left-1/2 top-0 bottom-0 w-px bg-stone/20 hidden md:block"></div>

          <div v-for="(item, index) in steps" :key="index" class="relative group" v-reveal="{ delay: index * 100 }">
             <!-- Asymmetric Steps -->
             <div class="flex flex-col md:flex-row items-center gap-20" :class="index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'">
                <!-- Text Content -->
                <div class="flex-1 space-y-6" :class="index % 2 === 0 ? 'md:text-right' : 'md:text-left'">
                   <span class="font-serif text-6xl text-stone/20 group-hover:text-gold-muted/20 transition-colors duration-[1s]">{{ item.time }}</span>
                   <h3 class="text-3xl font-serif text-ebony">{{ item.title }}</h3>
                   <p class="text-sm leading-loose text-content-secondary font-light max-w-sm" :class="index % 2 === 0 ? 'md:ml-auto' : 'md:mr-auto'">
                      {{ item.description }}
                   </p>
                </div>

                <!-- Central Orb -->
                <div class="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border border-stone bg-white z-10 items-center justify-center transition-all duration-700 group-hover:border-gold-muted group-hover:scale-150">
                   <div class="w-1 h-1 rounded-full bg-stone group-hover:bg-gold-muted"></div>
                </div>

                <!-- Placeholder for balance -->
                <div class="flex-1 opacity-0 pointer-events-none hidden md:block"></div>
             </div>
          </div>
       </div>

       <!-- Closure Decoration -->
       <div class="mt-40 text-center">
          <div class="font-serif text-2xl italic text-stone">Une journée à jamais gravée.</div>
       </div>
    </div>
  </section>
</template>

<script setup lang="ts">


const steps = [
  { time: '14:30', title: 'La Cérémonie', description: 'Une échange de promesses dans l\'intimité du jardin secret.' },
  { time: '16:00', title: 'Le Vin d\'Honneur', description: 'Cocktails signature et notes de jazz sous les saules pleureurs.' },
  { time: '19:30', title: 'Le Dîner Couture', description: 'Une expérience gastronomique orchestrée pour les sens.' },
  { time: '23:00', title: 'La Réception', description: 'Danse et célébration sous la voûte céleste.' }
]
</script>

<style scoped>
/* No extra styles needed, keeping it pure Tailwind */
</style>
