<template>
  <div class="min-h-screen bg-ivory selection:bg-ebony selection:text-ivory overflow-x-hidden">
    <!-- Couture Hero Section: Optimized for Above-the-Fold -->
    <section class="relative min-h-[75vh] flex flex-col items-center justify-center px-6 overflow-hidden pt-20">
      
      <!-- Central Editorial Block -->
      <div class="relative z-10 text-center max-w-6xl mx-auto space-y-10">
        <div class="space-y-2 opacity-0 animate-fade-in-up" style="animation-duration: 1.5s;">
          <span class="block text-[0.6rem] uppercase tracking-[0.4em] font-sans font-bold text-gold-muted">
            {{ content.home.subtitle }}
          </span>
        </div>

        <h1 class="text-[clamp(2.5rem,10vw,7rem)] font-serif font-normal leading-[0.9] tracking-tighter text-ebony opacity-0 animate-fade-in-up" 
            style="animation-delay: 0.3s; animation-duration: 2s;">
          {{ content.coupleName.split('&')[0] }}<br/>
          <span class="italic text-gold-muted">&</span> {{ content.coupleName.split('&')[1] }}
        </h1>

        <div class="space-y-8 opacity-0 animate-fade-in-up" style="animation-delay: 0.6s; animation-duration: 2.2s;">
          <p class="text-[0.65rem] font-sans font-bold tracking-[0.4em] uppercase text-ebony/60">
            {{ weddingDateFormatted }} — {{ content.weddingLocation }}
          </p>
        </div>
      </div>

      <!-- Minimal Decorative Elements -->
      <div class="absolute top-[20%] right-[10%] w-px h-16 bg-stone/30 hidden lg:block"></div>
    </section>

    <!-- Countdown Section: High Visibility -->
    <CountdownTimer />

    <!-- Editorial Story Section -->
    <section id="histoire" class="py-spacing-section bg-white border-y border-stone/20">
      <div class="container mx-auto px-6 max-w-7xl">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
          <div class="lg:col-span-5 space-y-10" v-reveal>
             <span class="text-[0.65rem] uppercase tracking-widest font-bold text-gold-muted">Notre Histoire</span>
             <h2 class="text-5xl md:text-7xl font-serif leading-tight text-ebony">L'Essentiel est Invisible.</h2>
             <p class="text-sm md:text-base leading-loose text-content-secondary font-light max-w-md">
                Chaque chapitre de notre vie a été écrit with patience. Ce mariage n'est pas seulement une célébration, c'est l'affirmation d'une promesse faite un soir d'automne.
             </p>
             <div class="pt-6">
                <button @click="isStoryModalOpen = true" class="px-10 py-4 bg-ebony text-ivory text-[0.7rem] uppercase tracking-[0.4em] font-bold shadow-floating hover:bg-gold-muted transition-all duration-700 inline-block">Explorer les détails</button>
             </div>

             <StoryModal 
                :is-open="isStoryModalOpen" 
                :title="'Notre Histoire'" 
                :paragraphs="storyParagraphs" 
                @close="isStoryModalOpen = false" 
              />
          </div>
          <div class="lg:col-span-7 relative" v-reveal="{ delay: 200 }">
             <div class="aspect-[4/5] bg-stone/10 overflow-hidden shadow-editorial">
                <img :src="carouselImages[0]?.url" class="w-full h-full object-cover grayscale-[0.5] hover:grayscale-0 transition-all duration-[2s]" />
             </div>
             <!-- Asymmetric Overlay Text -->
             <div class="absolute -bottom-10 -left-10 bg-ivory p-12 hidden md:block border border-stone/10">
                <span class="font-serif text-3xl italic text-gold-muted leading-none">"Deux cœurs, un seul chemin."</span>
             </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Refined Gallery Preview -->
    <section class="py-32 bg-ivory border-t border-stone/10">
      <div class="container mx-auto px-6">
        <div class="mb-24 text-center">
           <div v-reveal>
              <h2 class="text-4xl md:text-5xl lg:text-6xl font-serif text-ebony leading-none">{{ content.home.momentsTitle }}</h2>
              <div class="mt-8 h-px w-24 bg-gold-muted/30 mx-auto"></div>
           </div>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-12" v-reveal>
           <div v-for="(image, index) in carouselImages.slice(0, 3)" :key="index" class="aspect-[4/5] overflow-hidden shadow-floating group rounded-2xl">
              <img :src="image.url" class="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" />
           </div>
        </div>
      </div>
    </section>

    <!-- Locations & Invitation Ritual -->
    <section class="py-spacing-section bg-ebony text-ivory overflow-hidden relative">
      <div class="container mx-auto px-6 relative z-10">
         <div class="max-w-4xl mx-auto text-center space-y-20">
            <div class="space-y-8" v-reveal>
               <span class="text-[0.6rem] uppercase tracking-[0.5em] text-gold-muted font-bold">Lieux de Célébration</span>
               <h3 class="text-4xl md:text-6xl font-serif italic text-ivory">Une escale hors du temps.</h3>
            </div>
            
            <CelebrationLocations />

            <div class="pt-20" v-reveal>
               <router-link to="/rsvp" class="group inline-flex flex-col items-center gap-8">
                  <div class="w-20 h-20 rounded-full border border-ivory/20 flex items-center justify-center group-hover:border-gold-muted group-hover:scale-110 transition-all duration-700 bg-ivory/5">
                     <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gold-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </div>
                  <span class="text-[0.7rem] uppercase tracking-[0.6em] font-bold text-ivory/80 group-hover:text-gold-muted group-hover:tracking-[1em] transition-all duration-700">
                     Suivre l'invitation
                  </span>
               </router-link>
            </div>
         </div>
      </div>
    </section>

    <!-- Minimal Timeline -->
    <Timeline class="bg-white border-t border-stone/10" />

    <FAQ class="bg-ivory" />

    <!-- Couture Footer -->
    <footer class="py-24 border-t border-stone/20 bg-ivory">
       <div class="container mx-auto px-6 text-center space-y-10">
          <div class="font-serif text-3xl md:text-4xl text-ebony tracking-tighter font-bold">M. & S.</div>
          <p class="text-[0.6rem] uppercase tracking-[0.4em] text-stone font-bold whitespace-nowrap overflow-hidden text-ellipsis">Tous droits réservés © 2026</p>
          <div class="flex flex-wrap justify-center gap-6 md:gap-12">
             <a href="#" class="text-[0.6rem] uppercase tracking-widest text-ebony/40 hover:text-ebony transition-colors font-bold">Instagram</a>
             <a href="#" class="text-[0.6rem] uppercase tracking-widest text-ebony/40 hover:text-ebony transition-colors font-bold">Hébergement</a>
          </div>
       </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import CelebrationLocations from '@/components/home/CelebrationLocations.vue'
import Timeline from '@/components/home/Timeline.vue'
import FAQ from '@/components/home/FAQ.vue'
import CountdownTimer from '@/components/home/CountdownTimer.vue'
import StoryModal from '@/components/home/StoryModal.vue'
import { formatDate } from '@/utils/formatters'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { useSiteContent } from '@/composables/useSiteContent'

dayjs.extend(duration)
const { content } = useSiteContent()

const weddingDateFormatted = computed(() =>
  formatDate(content.value.weddingDate, 'DD MMMM YYYY')
)

const carouselImages = computed(() => content.value.carousel.slice(0, 5).map(item => ({
  url: item.imageUrl,
  alt: item.alt,
  title: item.title,
  caption: item.caption
})))

const isStoryModalOpen = ref(false)
const storyParagraphs = [
  "Tout a commencé lors d'un festival Afrobeat à Paris. Un simple regard échangé au milieu de la foule, et le temps a semblé se figer. Ce qui devait être une simple soirée entre amis est devenu le prologue de notre plus belle aventure.",
  "Au fil des mois, nous avons découvert que nos âmes se complétaient parfaitement. Des discussions passionnées sur nos racines communes aux rires partagés devant des couchers de soleil, chaque instant renforçait ce lien invisible mais indéfectible.",
  "Le point culminant de notre récit s'est déroulé à Marrakech, sous une voûte étoilée. C'est là, dans l'intimité du désert, que la promesse d'une vie à deux a été scellée. Aujourd'hui, nous vous invitons à célébrer non seulement un mariage, mais l'union de deux destins qui n'en forment désormais plus qu'un."
]
</script>

<style scoped>
@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(60px); }
  100% { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up {
  animation: fadeInUp 2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

:deep(.timeline-container) {
  @apply bg-transparent;
}

/* Custom Editorial Overrides */
:deep(.carousel-container) {
  @apply rounded-none shadow-none;
  background-color: rgb(var(--color-stone-rgb) / 0.05);
}
</style>
