<template>
  <section class="relative py-16 bg-surface-subtle overflow-hidden">
    <div class="max-w-4xl mx-auto px-5 sm:px-6 text-center">
      <!-- Header -->
      <div class="text-center mb-12 sm:mb-16">
        <h2 class="text-title-md sm:text-title-lg font-semibold tracking-tight text-content-primary">
          Notre Histoire
        </h2>
        <p class="text-content-muted mt-3 text-body-sm sm:text-body">
          Un récit entre hasard, héritage, passion et promesse
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
              class="app-btn-secondary px-6 sm:px-8 py-3 sm:py-4"
          >
            Découvrir le chapitre caché
          </button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <StoryModal
        v-model="showModal"
        title="Notre Histoire • Version Intégrale"
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
  "Tout a commencé par une énigme : un ticket oublié sur une table, un prénom griffonné au dos, et cette intuition inexplicable que nos chemins venaient de se reconnaître.",
  "De café en promenade nocturne, nos conversations sont devenues des refuges. Nous avons appris à rire de tout, à débattre de rien et à nous comprendre dans les silences.",
  "Très vite, nos familles, nos cultures et nos habitudes se sont entremêlées. Chaque rencontre a construit un pont entre nos univers, avec la certitude que nos différences seraient notre plus grande richesse.",
  "Nous avons traversé des saisons intenses : les grands projets, les doutes discrets, les victoires improvisées. À chaque étape, nous avons choisi la tendresse plutôt que la peur.",
  "Puis est venu ce voyage au Maroc, une terrasse au coucher du soleil, et cette question posée avec les mains qui tremblent : “Et si on écrivait la suite ensemble ?”.",
  "Le “oui” n’était pas une fin heureuse, mais un commencement. Depuis, nous préparons ce mariage comme on compose une œuvre collective : avec nos proches, nos racines et nos rêves.",
  "Le jour J sera une célébration de l’amour, oui, mais aussi de la transmission, de la fête, de la musique, et de tout ce qui nous relie.",
  "Merci de faire partie de cette aventure. Votre présence donne encore plus de sens à cette promesse que nous nous apprêtons à prononcer."
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
