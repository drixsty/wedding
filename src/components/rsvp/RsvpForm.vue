<template>
  <div class="max-w-4xl mx-auto px-6 py-20 pb-40">
    <div class="relative min-h-[500px] flex flex-col justify-center">
      <!-- Success View -->
      <div v-if="success" class="text-center space-y-12 animate-fade-in">
        <div class="inline-flex w-24 h-24 rounded-full border border-ebony items-center justify-center mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-gold-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l4 4L19 7" /></svg>
        </div>
        <div class="space-y-6">
          <h2 class="text-5xl md:text-7xl font-serif text-ebony leading-tight">{{ t('rsvp.success') }}</h2>
          <p class="text-[0.65rem] uppercase tracking-[0.6em] text-gold-muted font-bold">Nous avons hâte de vous retrouver.</p>
        </div>
        <router-link to="/" class="inline-block mt-8 text-[0.65rem] uppercase tracking-widest font-bold text-ebony border-b border-ebony/20 pb-2 hover:border-ebony transition-all">Retour à l'accueil</router-link>
      </div>

      <!-- Stepped Form -->
      <form v-else @submit.prevent="handleSubmit" class="space-y-24 relative">
        <!-- Progress Indicator (Minimalist) -->
        <div class="absolute -top-32 left-0 w-full flex justify-between items-center px-2">
          <span class="text-[0.6rem] font-bold uppercase tracking-[0.4em] text-stone">Étape 0{{ currentStep }} — 04</span>
          <div class="flex gap-4">
             <div v-for="i in 4" :key="i" class="w-12 h-[1px] transition-all duration-1000" :class="i <= currentStep ? 'bg-gold-muted' : 'bg-stone/20'"></div>
          </div>
        </div>

        <!-- Step 1: Identification -->
        <div v-if="currentStep === 1" class="space-y-16 animate-fade-in-up">
          <div class="space-y-6">
            <span class="text-[0.65rem] uppercase tracking-widest font-bold text-gold-muted">Introduction</span>
            <h2 class="text-5xl md:text-7xl font-serif text-ebony leading-tight">À qui avons-nous l'honneur ?</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div class="group border-b border-stone/30 focus-within:border-ebony transition-all duration-700 pb-4">
              <label class="text-[0.6rem] uppercase tracking-widest text-stone mb-4 block">Nom & Prénom</label>
              <input v-model="form.nom_complet" type="text" class="w-full bg-transparent border-none p-0 text-2xl md:text-3xl font-serif text-ebony focus:ring-0 placeholder-stone/20" placeholder="Votre nom complet" required />
            </div>
            <div class="group border-b border-stone/30 focus-within:border-ebony transition-all duration-700 pb-4">
              <label class="text-[0.6rem] uppercase tracking-widest text-stone mb-4 block">Email</label>
              <input v-model="form.email" type="email" class="w-full bg-transparent border-none p-0 text-2xl md:text-3xl font-serif text-ebony focus:ring-0 placeholder-stone/20" placeholder="votre@email.com" required />
            </div>
          </div>
        </div>

        <!-- Step 2: Presence -->
        <div v-if="currentStep === 2" class="space-y-16 animate-fade-in-up">
          <div class="space-y-6">
            <span class="text-[0.65rem] uppercase tracking-widest font-bold text-gold-muted">Célébration</span>
            <h2 class="text-5xl md:text-7xl font-serif text-ebony leading-tight">Serez-vous parmi nous ?</h2>
          </div>
          <div class="flex flex-col md:flex-row gap-8">
            <button type="button" @click="form.presence_confirmee = true; nextStep()" class="flex-1 p-12 text-left border border-stone/20 hover:border-gold-muted hover:bg-stone/5 transition-all duration-700 group">
              <div class="mb-8 w-12 h-12 rounded-full border border-stone/20 flex items-center justify-center group-hover:border-gold-muted">
                <div class="w-2 h-2 rounded-full bg-gold-muted opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <span class="block text-3xl font-serif text-ebony mb-2">{{ t('rsvp.yes') }}</span>
              <span class="text-[0.65rem] uppercase tracking-widest text-stone">Ce sera un honneur</span>
            </button>
            <button type="button" @click="form.presence_confirmee = false; nextStep()" class="flex-1 p-12 text-left border border-stone/20 hover:border-ebony hover:bg-ebony/5 transition-all duration-700 group">
              <div class="mb-8 w-12 h-12 rounded-full border border-stone/20 flex items-center justify-center group-hover:border-ebony">
                 <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-stone group-hover:text-ebony transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </div>
              <span class="block text-3xl font-serif text-ebony mb-2">{{ t('rsvp.no') }}</span>
              <span class="text-[0.65rem] uppercase tracking-widest text-stone">À regret</span>
            </button>
          </div>
        </div>

        <!-- Step 3: Details (Only if Yes) -->
        <div v-if="currentStep === 3" class="space-y-16 animate-fade-in-up">
          <div class="space-y-6">
            <span class="text-[0.65rem] uppercase tracking-widest font-bold text-gold-muted">Accompagnement</span>
            <h2 class="text-5xl md:text-7xl font-serif text-ebony leading-tight">Quelques précisions.</h2>
          </div>
          <div class="space-y-20">
            <div class="group border-b border-stone/30 focus-within:border-ebony transition-all duration-700 pb-4">
              <label class="text-[0.6rem] uppercase tracking-widest text-stone mb-4 block">{{ t('rsvp.plusOnes') }}</label>
              <input v-model.number="form.nombre_accompagnants" type="number" min="0" max="10" class="w-full bg-transparent border-none p-0 text-3xl md:text-5xl font-serif text-ebony focus:ring-0" />
            </div>
            <div class="group border-b border-stone/30 focus-within:border-ebony transition-all duration-700 pb-4">
              <label class="text-[0.6rem] uppercase tracking-widest text-stone mb-4 block">{{ t('rsvp.foodRestrictions') }}</label>
              <textarea v-model="form.restrictions_alimentaires" class="w-full bg-transparent border-none p-0 text-xl font-serif text-ebony focus:ring-0 placeholder-stone/20" rows="2" :placeholder="t('rsvp.foodRestrictionsPlaceholder')"></textarea>
            </div>
          </div>
        </div>

        <!-- Step 4: Final Message -->
        <div v-if="currentStep === 4" class="space-y-16 animate-fade-in-up">
          <div class="space-y-6">
            <span class="text-[0.65rem] uppercase tracking-widest font-bold text-gold-muted">Mot de la fin</span>
            <h2 class="text-5xl md:text-7xl font-serif text-ebony leading-tight">Un message pour nous ?</h2>
          </div>
          <div class="group border-b border-stone/30 focus-within:border-ebony transition-all duration-700 pb-4">
            <textarea v-model="form.message" class="w-full bg-transparent border-none p-0 text-2xl md:text-4xl font-serif text-ebony focus:ring-0 placeholder-stone/20 leading-relaxed" rows="4" :placeholder="t('rsvp.messagePlaceholder')"></textarea>
          </div>
        </div>

        <!-- Global Actions -->
        <div v-if="!success" class="flex items-center justify-between pt-12 border-t border-stone/20">
          <button v-if="currentStep > 1" type="button" @click="prevStep" class="text-[0.65rem] uppercase tracking-widest font-bold text-ebony border-b border-ebony/30 hover:border-ebony transition-colors">Précédent</button>
          <div v-else></div>
          
          <button v-if="currentStep < 4" type="button" @click="nextStep" :disabled="!isStepValid" class="px-10 py-5 bg-ebony text-ivory text-[0.65rem] uppercase tracking-[0.4em] font-bold shadow-floating hover:bg-gold-muted transition-all duration-700 disabled:opacity-20">
             Continuer
          </button>
          <button v-else type="submit" :disabled="loading || !isStepValid" class="px-12 py-6 bg-ebony text-ivory text-[0.7rem] uppercase tracking-[0.5em] font-bold hover:bg-gold-muted transition-all duration-700 shadow-floating active:scale-95">
             {{ loading ? t('rsvp.submitLoading') : 'Confirmer le RSVP' }}
          </button>
        </div>

        <!-- Feedback Messages -->
        <Transition name="fade">
          <p v-if="error" class="text-xs text-danger uppercase tracking-widest text-center">{{ error }}</p>
        </Transition>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useGuests } from '@/composables/useGuests'
import { validateEmail } from '@/utils/validators'
import type { RsvpFormData } from '@/types/models'
import { t } from '@/i18n'

const { submitRsvp, loading } = useGuests()
const currentStep = ref(1)

const form = reactive<RsvpFormData>({
  nom_complet: '',
  email: '',
  telephone: '',
  nombre_accompagnants: 0,
  presence_confirmee: true,
  restrictions_alimentaires: '',
  message: ''
})

const error = ref<string | null>(null)
const success = ref(false)

const isStepValid = computed(() => {
  if (currentStep.value === 1) return form.nom_complet.trim().length > 3 && validateEmail(form.email)
  if (currentStep.value === 2) return true // Presence buttons force next
  if (currentStep.value === 3) return true
  if (currentStep.value === 4) return true
  return false
})

function nextStep() {
  if (isStepValid.value) {
    if (currentStep.value === 2 && !form.presence_confirmee) {
      currentStep.value = 4 // Skip details if not coming
    } else {
      currentStep.value++
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function prevStep() {
  if (currentStep.value === 4 && !form.presence_confirmee) {
    currentStep.value = 2
  } else {
    currentStep.value--
  }
}

async function handleSubmit() {
  error.value = null
  const { error: submitError } = await submitRsvp(form)
  if (submitError) {
    error.value = submitError
  } else {
    success.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<style scoped>
@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.animate-fade-in-up {
  animation: fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-fade-in {
  animation: fadeIn 1.5s ease-out forwards;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
