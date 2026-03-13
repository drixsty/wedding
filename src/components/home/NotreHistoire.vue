<template>
  <section class="py-spacing-section bg-white overflow-hidden">
    <div class="container mx-auto px-6 max-w-7xl">
      <!-- Section 1: Intro -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center mb-40">
        <div class="lg:col-span-5 space-y-8" v-reveal>
          <span class="text-[0.6rem] uppercase tracking-[0.5em] text-gold-muted font-bold block">Origines</span>
          <h2 class="text-5xl md:text-7xl font-serif text-ebony leading-tight">Le murmure du premier jour.</h2>
          <div class="h-[1px] w-12 bg-ebony/10"></div>
          <p class="text-sm md:text-base leading-loose text-content-secondary font-light max-w-md">
            Il y a des rencontres qui ne sont pas des coïncidences, mais des retrouvailles. Sous le ciel étoilé d'un été sans fin, nous avons compris que l'essentiel n'était plus de chercher, mais de construire.
          </p>
        </div>
        <div class="lg:col-span-7 relative" v-reveal="{ delay: 200 }">
          <div class="aspect-[16/9] bg-stone/5 overflow-hidden shadow-floating group">
             <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80" class="w-full h-full object-cover grayscale transition-all duration-[3s] group-hover:scale-110 group-hover:grayscale-0" />
          </div>
          <div class="absolute -top-10 -right-10 w-40 h-40 bg-ivory/80 backdrop-blur-sm border border-stone/10 p-8 hidden md:flex items-center justify-center">
             <span class="font-serif text-4xl text-stone italic">01</span>
          </div>
        </div>
      </div>

      <!-- Section 2: Asymmetric Narrative -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-32 items-center flex-row-reverse">
        <div class="lg:col-span-6 lg:order-2 space-y-8" v-reveal>
          <span class="text-[0.6rem] uppercase tracking-[0.5em] text-gold-muted font-bold block">La Vision</span>
          <h2 class="text-5xl md:text-7xl font-serif text-ebony leading-tight">Une élégance silencieuse.</h2>
          <p class="text-sm md:text-base leading-loose text-content-secondary font-light">
            Nous avons choisi de célébrer notre union avec simplicité. Pas de fioritures, juste l'authenticité des mots échangés et la présence de ceux qui nous sont chers. 
          </p>
          <div class="pt-8 grid grid-cols-2 gap-8">
             <div class="space-y-4">
                <span class="block font-serif text-3xl text-ebony italic">Lieu</span>
                <span class="block text-[0.6rem] uppercase tracking-widest text-stone">Domaine du Ciel</span>
             </div>
             <div class="space-y-4">
                <span class="block font-serif text-3xl text-ebony italic">Atmosphère</span>
                <span class="block text-[0.6rem] uppercase tracking-widest text-stone">Minimaliste • Vrai</span>
             </div>
          </div>
        </div>
        <div class="lg:col-span-6 lg:order-1 relative" v-reveal="{ delay: 200 }">
           <div class="aspect-[3/4] max-w-sm ml-auto bg-stone/5 overflow-hidden shadow-editorial relative z-10 group">
              <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80" class="w-full h-full object-cover transition-all duration-[3s] group-hover:translate-y-[-20px]" />
           </div>
           <div class="absolute top-20 -left-10 w-full h-full border border-stone/10 -z-10"></div>
           <div class="absolute bottom-10 right-10 text-[0.5rem] uppercase tracking-[1.5em] text-stone vertical-text opacity-40">The Atelier Wedding</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Logic handled by static content for now as per design direction
</script>

<style scoped>
.vertical-text {
  writing-mode: vertical-rl;
  text-orientation: mixed;
}
</style>
