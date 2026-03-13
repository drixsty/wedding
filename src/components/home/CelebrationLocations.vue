<template>
  <div class="space-y-20">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
      <LocationCard
        v-for="(location, index) in locations"
        :key="index"
        :location="location"
        v-reveal="{ delay: index * 150 }"
      />
    </div>
  </div>
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
    image: '/images/ceremony_traditional.png'
  },
  {
    name: 'Le Mariage Civil',
    description: 'Passage à la mairie de Yaoundé VI, suivi d’un vin d’honneur convivial avec nos proches.',
    address: 'Mairie de Yaoundé VI',
    time: 'Vendredi 24 juillet',
    icon: '📜',
    image: '/images/ceremony_civil.png'
  },
  {
    name: 'Cérémonie Religieuse',
    description: 'Bénédiction en la paroisse St Esprit de Mvolyé suivie d’une soirée de gala.',
    address: 'Paroisse de Mvolyé',
    time: 'Samedi 25 juillet',
    icon: '⛪',
    image: '/images/ceremony_religious.png'
  }
]
</script>
