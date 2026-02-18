<template>
  <div id="app" class="min-h-screen flex flex-col">
    <Header v-if="!isAdminRoute" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300" />
    
    <main class="flex-1">
      <router-view />
    </main>
    
    <Footer v-if="!isAdminRoute" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'

const route = useRoute()

const isAdminRoute = computed(() => {
  return route.path.startsWith('/admin')
})
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
