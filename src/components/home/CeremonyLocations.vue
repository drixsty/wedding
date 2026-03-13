<template>
  <section class="py-16 sm:py-24 bg-surface-subtle">
    <div class="max-w-6xl mx-auto px-5 sm:px-6">

      <div class="text-center mb-12 sm:mb-16">
        <h2 class="text-title-md sm:text-title-lg font-semibold text-content-primary">
          Les lieux de célébration
        </h2>
        <p class="text-content-muted mt-2 sm:mt-3 text-body-sm sm:text-body">
          Trois étapes, trois lieux à Yaoundé pour célébrer notre union
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
          📍 Recevoir les informations pratiques
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
    name: 'La Dot',
    description: 'Une célébration traditionnelle familiale pour marquer la première étape de notre union.',
    address: 'Yaoundé',
    time: 'Jeudi 23 juillet',
    icon: '👑',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80'
  },
  {
    name: 'Le Mariage Civil',
    description: 'Passage à la mairie de Yaoundé VI, suivi d’un vin d’honneur convivial avec nos proches.',
    address: 'Mairie de Yaoundé VI',
    time: 'Vendredi 24 juillet',
    icon: '📜',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80'
  },
  {
    name: 'La Célébration Religieuse & Soirée',
    description: 'Messe à la paroisse St Esprit de Mvolyé puis soirée de fête pour clôturer ce week-end inoubliable.',
    address: 'Paroisse St Esprit de Mvolyé',
    time: 'Samedi 25 juillet',
    icon: '⛪',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80'
  }
]
</script>
