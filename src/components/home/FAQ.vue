<template>
  <section class="py-20 bg-surface-subtle">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12 sm:mb-16">
        <h2 class="text-title-md sm:text-title-lg font-semibold tracking-tight text-content-primary">
          {{ t('faq.title') }}
        </h2>
        <p class="text-content-muted mt-3 text-body-sm sm:text-body">
          {{ t('faq.subtitle') }}
        </p>
      </div>

      <div class="max-w-4xl mx-auto space-y-4">
        <div
            v-for="(faq, index) in faqs"
            :key="index"
            class="rounded-3xl border border-border-soft bg-surface-elevated overflow-hidden transition-all duration-300 relative group"
        >
          <button
              @click="toggleFaq(index)"
              class="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-surface-subtle transition-colors duration-200 relative z-10"
          >
            <div class="flex items-center gap-4 flex-1">
              <h3 class="text-lg sm:text-xl font-semibold text-content-primary">
                {{ faq.question }}
              </h3>
            </div>
            <svg
                class="w-6 h-6 text-dore transition-transform duration-300 flex-shrink-0"
                :class="{ 'rotate-180': openIndex === index }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <transition
              enter-active-class="transition-all duration-300 ease-out"
              leave-active-class="transition-all duration-200 ease-in"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-[40rem]"
              leave-from-class="opacity-100 max-h-[40rem]"
              leave-to-class="opacity-0 max-h-0"
          >
            <div v-show="openIndex === index" class="px-6 pb-6 bg-surface-subtle/70 relative z-10">
              <div class="space-y-3">
                <p class="text-content-secondary leading-relaxed text-body-sm sm:text-body">
                  {{ faq.answer }}
                </p>

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
import { t } from '@/i18n'

interface FAQ {
  question: string
  answer: string
  image?: string
}

const openIndex = ref<number | null>(null)

const faqs: FAQ[] = [
  {
    question: 'Quel est le dress code exact ? ',
    answer: 'Le thème est “Élégance Afro-chic de soirée” : tons terre, doré, ivoire et touches profondes (vert sauge, bordeaux, bleu nuit). Les tenues traditionnelles et créations contemporaines sont les bienvenues.'
  },
  {
    question: 'Puis-je venir avec mes enfants ?',
    answer: 'Oui, un espace kids supervisé sera disponible pendant le cocktail et le dîner (jeux calmes, mini-atelier créatif et menu adapté). Merci d’indiquer les âges dans le RSVP pour une meilleure organisation.',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80'
  },
  {
    question: 'Comment se passent les transports et le retour de nuit ?',
    answer: 'Des navettes sont prévues entre le lieu de réception, deux hôtels partenaires et un point central à Paris. Les horaires détaillés vous seront envoyés après validation de votre RSVP.'
  },
  {
    question: 'Y aura-t-il des options alimentaires spécifiques ?',
    answer: 'Oui : végétarien, vegan, sans gluten, sans lactose et allergies spécifiques. Notre chef adaptera chaque menu sur demande si vous le signalez avant la date limite.'
  },
  {
    question: 'Peut-on prendre des photos pendant la cérémonie ?',
    answer: 'Nous vous inviterons à vivre la cérémonie pleinement pendant les vœux (sans téléphones levés). Une fois ce moment passé, place aux photos ! Un album partagé sera ouvert pour vos clichés préférés.'
  },
  {
    question: 'Et si je veux vous laisser un message surprise ?',
    answer: 'Excellente idée : un espace “mots secrets” sera disponible sur place et dans le formulaire RSVP. Vos messages feront partie d’un souvenir que nous découvrirons après le mariage.'
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
