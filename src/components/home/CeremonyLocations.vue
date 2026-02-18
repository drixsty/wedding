<template>
  <section class="py-16 sm:py-24 bg-neutral-50">
    <div class="max-w-6xl mx-auto px-5 sm:px-6">

      <!-- Header -->
      <div class="text-center mb-12 sm:mb-16">
        <h2 class="text-3xl sm:text-4xl font-semibold text-neutral-900">
          Nos Lieux de Cérémonie
        </h2>
        <p class="text-neutral-500 mt-2 sm:mt-3 text-sm sm:text-base">
          Des cadres magnifiques pour célébrer notre union
        </p>
      </div>

      <!-- Locations Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <LocationCard
            v-for="(location, index) in locations"
            :key="index"
            :location="location"
        />
      </div>

      <!-- Call to action -->
      <div class="text-center mt-12">
        <router-link
            to="/infos"
            class="inline-block px-6 py-3 bg-neutral-900 text-white font-medium rounded-lg shadow hover:bg-neutral-800 transition-colors duration-200"
        >
          📍 Voir tous les détails pratiques
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
    description: 'Échange des vœux dans un cadre traditionnel africain',
    address: 'Grande Salle Afrochic, Paris',
    time: '14h00 - 15h30',
    icon: '💍',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80'
  },
  {
    name: 'Le Cocktail',
    description: 'Cocktail dinatoire dans les jardins tropicaux',
    address: 'Jardin des Palmiers',
    time: '16h00 - 19h00',
    icon: '🥂',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80'
  },
  {
    name: 'La Réception',
    description: 'Dîner de gala et soirée dansante',
    address: 'Salle des Fêtes Royale',
    time: '19h00 - 02h00',
    icon: '🎉',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80'
  }
]
</script>
