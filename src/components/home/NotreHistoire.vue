<template>
  <section class="relative py-16 bg-surface-subtle overflow-hidden">
    <div class="max-w-4xl mx-auto px-5 sm:px-6 text-center">
      <div class="text-center mb-12 sm:mb-16">
        <h2 class="text-title-md sm:text-title-lg font-semibold tracking-tight text-content-primary">
          {{ content.home.storyTitle }}
        </h2>
        <p class="text-content-muted mt-3 text-body-sm sm:text-body">
          {{ content.home.storySubtitle }}
        </p>
      </div>
      <div class="bg-surface-elevated rounded-4xl border-2 border-gradient-to-r from-dore/40 via-dore/20 to-dore/40 p-6 sm:p-10 relative overflow-hidden">
        <div class="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-r from-dore/10 to-dore/5 rounded-full pointer-events-none"></div>

        <div class="text-left text-content-primary space-y-4">
          <p
            v-for="(paragraph, idx) in previewParagraphs"
            :key="idx"
            class="leading-relaxed text-sm sm:text-base md:text-lg"
          >
            <span v-html="paragraph"></span>
          </p>
        </div>

        <div class="flex justify-center mt-6">
          <button
            @click="showModal = true"
            class="app-btn-secondary px-6 sm:px-8 py-3 sm:py-4"
          >
            {{ content.home.storyCta }}
          </button>
        </div>
      </div>
    </div>

    <StoryModal
      v-model="showModal"
      :title="content.home.storyModalTitle"
      :paragraphs="storyParagraphs"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import StoryModal from './StoryModal.vue'
import { useSiteContent } from '@/composables/useSiteContent'

const showModal = ref(false)
const previewLimit = 3
const { content } = useSiteContent()

const storyParagraphs = computed(() => content.value.home.storyParagraphs)
const previewParagraphs = computed(() => storyParagraphs.value.slice(0, previewLimit))
</script>

<style scoped>
.border-gradient-to-r {
  border-image-slice: 1;
  border-image-source: linear-gradient(to right, rgba(245, 158, 11, 0.4), rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.4));
}
</style>
