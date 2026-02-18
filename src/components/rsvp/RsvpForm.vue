<template>
  <div class="max-w-2xl mx-auto px-4">
    <div
        class="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-10 transition-all duration-500 animate-fade-in-up"
    >
      <!-- Header -->
      <div class="mb-8">
        <h2 class="text-2xl sm:text-3xl font-serif font-semibold text-neutral-900">
          Confirmez votre présence
        </h2>
        <p class="text-neutral-500 text-sm sm:text-base mt-2">
          Merci de répondre avant le
          <span class="font-medium text-neutral-700">{{ deadline }}</span>
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Nom complet -->
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-2">
            Nom complet <span class="text-red-500">*</span>
          </label>
          <input
              v-model="form.nom_complet"
              type="text"
              required
              placeholder="Votre nom complet"
              class="input"
          />
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-2">
            Email <span class="text-red-500">*</span>
          </label>
          <input
              v-model="form.email"
              type="email"
              required
              placeholder="votre@email.com"
              class="input"
          />
        </div>

        <!-- Téléphone -->
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-2">
            Téléphone
          </label>
          <input
              v-model="form.telephone"
              type="tel"
              placeholder="+33 6 12 34 56 78"
              class="input"
          />
        </div>

        <!-- Présence -->
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-3">
            Serez-vous présent(e) ? <span class="text-red-500">*</span>
          </label>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
                type="button"
                @click="form.presence_confirmee = true"
                :class="presenceClass(true)"
            >
              Oui, avec plaisir
            </button>

            <button
                type="button"
                @click="form.presence_confirmee = false"
                :class="presenceClass(false)"
            >
              Non, malheureusement
            </button>
          </div>
        </div>

        <!-- Champs conditionnels -->
        <Transition name="fade-slide">
          <div v-if="form.presence_confirmee" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                Nombre d'accompagnants
              </label>
              <input
                  v-model.number="form.nombre_accompagnants"
                  type="number"
                  min="0"
                  max="5"
                  class="input"
              />
              <p class="text-xs text-neutral-400 mt-1">
                Ne vous comptez pas
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                Restrictions alimentaires
              </label>
              <textarea
                  v-model="form.restrictions_alimentaires"
                  rows="3"
                  placeholder="Allergies, préférences..."
                  class="input resize-none"
              ></textarea>
            </div>
          </div>
        </Transition>

        <!-- Message -->
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-2">
            Message pour les mariés
          </label>
          <textarea
              v-model="form.message"
              rows="4"
              placeholder="Un mot doux..."
              class="input resize-none"
          ></textarea>
        </div>

        <!-- Erreur -->
        <Transition name="fade">
          <div
              v-if="error"
              class="bg-red-50 border border-red-200 text-red-600 text-sm p-4 rounded-xl"
          >
            {{ error }}
          </div>
        </Transition>

        <!-- Succès -->
        <Transition name="fade">
          <div
              v-if="success"
              class="bg-green-50 border border-green-200 text-green-600 text-sm p-4 rounded-xl"
          >
            Merci ❤️ Votre confirmation a été enregistrée.
          </div>
        </Transition>

        <!-- Submit -->
        <button
            type="submit"
            :disabled="loading || !formValid"
            class="w-full h-12 rounded-xl bg-neutral-900 text-white font-medium transition-all duration-300 hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span v-if="loading">Envoi en cours...</span>
          <span v-else>Confirmer ma présence</span>
        </button>

        <p class="text-xs text-neutral-400 text-center">
          * Champs obligatoires
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useGuests } from '@/composables/useGuests'
import { validateEmail } from '@/utils/validators'
import { formatDate } from '@/utils/formatters'
import type { RsvpFormData } from '@/types/models'

const { submitRsvp, loading } = useGuests()

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

const deadline = computed(() => {
  const weddingDate =
      import.meta.env.VITE_WEDDING_DATE || '2025-08-15T14:00:00'
  const deadlineDate = new Date(weddingDate)
  deadlineDate.setDate(deadlineDate.getDate() - 30)
  return formatDate(deadlineDate, 'DD MMMM YYYY')
})

const formValid = computed(() => {
  return (
      form.nom_complet.trim().length > 0 &&
      validateEmail(form.email) &&
      form.presence_confirmee !== null
  )
})

const presenceClass = (value: boolean) => {
  return [
    'h-12 rounded-xl border text-sm font-medium transition-all duration-300',
    form.presence_confirmee === value
        ? 'bg-neutral-900 text-white border-neutral-900'
        : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-900'
  ]
}

async function handleSubmit() {
  error.value = null
  success.value = false

  if (!formValid.value) {
    error.value =
        'Veuillez remplir correctement les champs obligatoires.'
    return
  }

  const { error: submitError } = await submitRsvp(form)

  if (submitError) {
    error.value = submitError
  } else {
    success.value = true

    Object.assign(form, {
      nom_complet: '',
      email: '',
      telephone: '',
      nombre_accompagnants: 0,
      presence_confirmee: true,
      restrictions_alimentaires: '',
      message: ''
    })

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<style scoped>
/* Inputs modernes */
.input {
  @apply w-full h-12 px-4 rounded-xl border border-neutral-300 bg-white text-neutral-800 placeholder-neutral-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900;
}

textarea.input {
  @apply h-auto py-3;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease forwards;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
