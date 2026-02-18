<template>
  <section class="py-20 bg-neutral-50">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-12 sm:mb-16">
        <h2 class="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900">
          Questions Fréquentes
        </h2>
        <p class="text-neutral-500 mt-3 text-sm sm:text-base">
          Tout ce que vous devez savoir
        </p>
      </div>

      <!-- FAQ Items -->
      <div class="max-w-4xl mx-auto space-y-4">
        <div
            v-for="(faq, index) in faqs"
            :key="index"
            class="rounded-3xl border border-neutral-200 bg-white overflow-hidden transition-all duration-300 relative group"
        >
          <!-- Question -->
          <button
              @click="toggleFaq(index)"
              class="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-neutral-100 transition-colors duration-200 relative z-10"
          >
            <div class="flex items-center gap-4 flex-1">
              <h3 class="text-lg sm:text-xl font-semibold text-neutral-900">
                {{ faq.question }}
              </h3>
            </div>
            <svg
                class="w-6 h-6 text-gold transition-transform duration-300 flex-shrink-0"
                :class="{ 'rotate-180': openIndex === index }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Answer -->
          <transition
              enter-active-class="transition-all duration-300 ease-out"
              leave-active-class="transition-all duration-200 ease-in"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-[40rem]"
              leave-from-class="opacity-100 max-h-[40rem]"
              leave-to-class="opacity-0 max-h-0"
          >
            <div v-show="openIndex === index" class="px-6 pb-6 bg-neutral-50 relative z-10">
              <div class="space-y-3">
                <p class="text-neutral-700 leading-relaxed text-sm sm:text-base">
                  {{ faq.answer }}
                </p>

                <!-- Image (optionnelle) -->
                <img
                    v-if="faq.image"
                    :src="faq.image"
                    :alt="faq.question"
                    class="rounded-2xl w-full object-cover mt-2"
                />
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface FAQ {
  question: string
  answer: string
  image?: string
}

// Etat de la FAQ ouverte
const openIndex = ref<number | null>(null)

// Liste des FAQs
const faqs: FAQ[] = [
  {
    question: "Puis-je amener mes enfants ?",
    answer: "Oui, les enfants sont les bienvenus ! Merci de nous indiquer leur nombre dans le formulaire RSVP afin que nous puissions prévoir des activités adaptées et des menus spéciaux pour eux.",
  },
  {
    question: "Y aura-t-il un menu végétarien ou vegan ?",
    answer: "Absolument ! Nous proposons des options végétariennes, véganes et sans gluten. Merci d'indiquer vos restrictions alimentaires dans le formulaire RSVP pour que nous puissions vous préparer un menu adapté.",
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800&q=80"
  },
  {
    question: "Quelle est la tenue recommandée ?",
    answer: "Nous recommandons une tenue élégante avec une touche afrochic. N'hésitez pas à porter des tenues traditionnelles africaines, des accessoires wax, ou simplement une belle tenue de soirée aux couleurs marron, doré ou ivoire."
  },
  {
    question: "Y a-t-il un parking sur place ?",
    answer: "Oui, un parking gratuit de 200 places est disponible sur le lieu de réception. Des navettes seront également organisées depuis les hôtels partenaires."
  },
  {
    question: "Puis-je prendre des photos pendant la cérémonie ?",
    answer: "Oui, mais nous vous demandons de rester discrets pendant les moments clés de la cérémonie. Un photographe professionnel sera présent et vous pourrez obtenir toutes les photos officielles par la suite."
  }
]

function toggleFaq(index: number) {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<style scoped>
.section-divider {
  @apply w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-300/40 mx-auto rounded-full mb-4;
}
</style>
