<template>
  <section class="relative py-16 bg-surface-subtle overflow-hidden">
    <div class="max-w-4xl mx-auto px-5 sm:px-6 text-center">
      <!-- Header -->
      <div class="text-center mb-12 sm:mb-16">
        <h2 class="text-title-md sm:text-title-lg font-semibold tracking-tight text-content-primary">
          Notre Histoire
        </h2>
        <p class="text-content-muted mt-3 text-body-sm sm:text-body">
          Un voyage d'amour, de complicité et de découvertes
        </p>
      </div>
      <!-- Story Card -->
      <div class="bg-surface-elevated rounded-4xl border-2 border-gradient-to-r from-dore/40 via-dore/20 to-dore/40 p-6 sm:p-10 relative overflow-hidden">
        <!-- Subtle decorative overlay -->
        <div class="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-r from-dore/10 to-dore/5 rounded-full pointer-events-none"></div>

        <!-- Story content preview -->
        <div class="text-left text-content-primary space-y-4">
          <p
              v-for="(paragraph, idx) in previewParagraphs"
              :key="idx"
              class="leading-relaxed text-sm sm:text-base md:text-lg"
          >
            <span v-html="paragraph"></span>
          </p>
        </div>

        <!-- CTA Button -->
        <div class="flex justify-center mt-6">
          <button
              @click="showModal = true"
              class="flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-surface-strong text-content-inverse font-semibold rounded-xl hover:bg-marron-dark transition-all duration-300"
          >
            Lire notre histoire complète
          </button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <StoryModal
        v-model="showModal"
        title="Notre Histoire Complète"
        :paragraphs="storyParagraphs"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import StoryModal from './StoryModal.vue'

// Modal state
const showModal = ref(false)

// Limite de paragraphes pour la preview
const previewLimit = 3

// Texte custom pour l’histoire
const storyParagraphs = [
  "Tout a commencé un après-midi ensoleillé, lors d’un marché local où nos regards se sont croisés pour la première fois. C’était un moment suspendu, comme si le monde autour de nous avait ralenti.",
  "Au fil des mois, nos chemins se sont mêlés dans des rires, des aventures et des conversations interminables. Chaque rencontre renforçait cette connexion unique que nous ressentions l’un pour l’autre.",
  "Nous avons voyagé ensemble, découvert des paysages à couper le souffle et partagé des souvenirs qui resteront gravés à jamais dans nos cœurs.",
  "Malgré les défis et les moments de doute, notre complicité et notre confiance mutuelle nous ont permis de surmonter chaque obstacle.",
  "Aujourd’hui, nous sommes prêts à franchir cette nouvelle étape de notre vie et à célébrer notre amour entourés de nos proches et de ceux qui comptent le plus pour nous.",
  "Chaque instant passé ensemble nous a rapprochés et nous a appris que le vrai bonheur réside dans les petites choses partagées avec l’être aimé.",
  "Notre histoire continue, riche de souvenirs et d’émotions, et nous avons hâte de créer encore plus de moments inoubliables ensemble.",
  "C’est avec joie et gratitude que nous invitons chacun de vous à partager cette aventure et à être témoins de notre engagement et de notre amour."
]

// Paragraphes affichés dans la preview
const previewParagraphs = computed(() => storyParagraphs.slice(0, previewLimit))
</script>

<style scoped>
/* Dégradé pour border */
.border-gradient-to-r {
  border-image-slice: 1;
  border-image-source: linear-gradient(to right, rgba(245, 158, 11, 0.4), rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.4));
}
</style>
