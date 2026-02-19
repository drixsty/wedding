<template>
  <section class="py-16 sm:py-24 bg-surface-subtle">
    <div class="max-w-6xl mx-auto px-5 sm:px-6">

      <div class="text-center mb-12 sm:mb-16">
        <h2 class="text-title-md sm:text-title-lg font-semibold text-content-primary">
          Nos lieux, pensés comme un voyage
        </h2>
        <p class="text-content-muted mt-2 sm:mt-3 text-body-sm sm:text-body">
          Chaque espace raconte une ambiance : émotion, célébration et souvenirs à partager
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <LocationCard
            v-for="(location, index) in locations"
            :key="index"
            :location="location"
        />
      </div>

      <div class="text-center mt-12">
        <router-link
            to="/rsvp"
            class="app-btn-secondary px-6 py-3 shadow"
        >
          📍 Recevoir le guide pratique avec votre confirmation
        </router-link>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import LocationCard from './LocationCard.vue'

interface Location {
  name: string
  description: string
  address: string
  time: string
  icon: string
  image: string
}

const locations: Location[] = [
  {
    name: 'La Cérémonie',
    description: 'Un écrin végétal et solennel pour nos vœux, accompagné de musique live et de rituels symboliques.',
    address: 'Pavillon des Cèdres, Paris 16e',
    time: '14h30 - 16h00',
    icon: '💍',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80'
  },
  {
    name: 'Le Cocktail Expérience',
    description: 'Un moment vivant entre dégustations, animations artistiques et espace photo éditorial.',
    address: 'Jardins suspendus des Cèdres',
    time: '16h15 - 18h30',
    icon: '🥂',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80'
  },
  {
    name: 'Le Dîner & La Nuit',
    description: 'Un dîner en plusieurs actes suivi d’une soirée dansante jusqu’au bout de la nuit.',
    address: 'Orangerie Royale',
    time: '19h30 - 00h30',
    icon: '🎉',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80'
  }
]
</script>
