<template>
  <Modal v-model="isOpen">
    <transition name="fade">
      <div
          v-if="isOpen"
          class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md p-4 z-50"
      >
        <div
            class="bg-white rounded-3xl shadow-2xl max-w-3xl w-full relative overflow-hidden animate-zoomIn flex flex-col"
        >
          <!-- Bouton de fermeture -->
          <button
              @click="isOpen = false"
              class="absolute top-4 right-4 bg-gray-200 rounded-full p-2 text-gray-700 hover:text-white hover:bg-neutral-900 transition-colors duration-300 z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Content -->
          <div class="p-6 sm:p-8 overflow-y-auto max-h-[80vh]">
            <h3 class="text-2xl sm:text-3xl font-semibold mb-4 text-center text-neutral-900">
              {{ title }}
            </h3>
            <div class="space-y-4 text-justify text-neutral-700 text-sm sm:text-base leading-relaxed">
              <p v-for="(paragraph, idx) in paragraphs" :key="idx">
                <span v-html="paragraph"></span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Modal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Modal from '@/components/common/Modal.vue'

interface Props {
  modelValue: boolean
  title: string
  paragraphs: string[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val)
})
</script>

<style scoped>
/* Smooth fade for modal */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
}

/* Animation zoom */
@keyframes zoomIn {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
.animate-zoomIn {
  animation: zoomIn 0.25s ease-out forwards;
}
</style>
