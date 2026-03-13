<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-ebony/95 backdrop-blur-md">
      <div class="relative w-full max-w-4xl max-h-[90vh] bg-white border border-stone/10 shadow-floating overflow-hidden flex flex-col animate-scale-in">
        
        <!-- Header -->
        <div class="flex items-center justify-between p-8 border-b border-stone/5">
          <span class="text-[0.6rem] uppercase tracking-[0.4em] font-bold text-gold-muted">Récit Intime</span>
          <button @click="$emit('close')" class="group flex items-center gap-4 text-[0.65rem] uppercase tracking-widest font-bold text-stone hover:text-ebony transition-all">
            Fermer
            <div class="w-8 h-px bg-stone/30 group-hover:w-12 group-hover:bg-ebony transition-all"></div>
          </button>
        </div>

        <!-- content -->
        <div class="flex-1 overflow-y-auto p-12 md:p-20 space-y-16 selection:bg-gold-muted/10">
          <div class="max-w-2xl mx-auto space-y-10">
            <h2 class="text-4xl md:text-6xl font-serif text-ebony leading-tight">
              {{ title }}
            </h2>
            
            <div class="w-20 h-px bg-gold-muted/30"></div>

            <div class="prose prose-stone prose-sm md:prose-base !max-w-none">
              <p v-for="(paragraph, idx) in paragraphs" :key="idx" class="text-stone leading-loose mb-8 font-light italic">
                {{ paragraph }}
              </p>
            </div>
          </div>

          <!-- Decorative Footer in Modal -->
          <div class="flex justify-center pt-10">
            <div class="font-serif text-3xl italic text-gold-muted/40">M. & S.</div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean
  title: string
  paragraphs: string[]
}

defineProps<Props>()
defineEmits(['close'])
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-scale-in {
  animation: scaleIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #947B5A; }
</style>
