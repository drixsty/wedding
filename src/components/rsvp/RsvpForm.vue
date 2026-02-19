<template>
  <div class="max-w-2xl mx-auto px-4">
    <div
        class="bg-gradient-to-b from-white via-amber-50/40 to-white border border-dore/30 rounded-lg p-6 sm:p-10 shadow-xl shadow-dore/10 transition-all duration-500 animate-fade-in-up"
    >
      <!-- Header -->
      <div class="mb-8">
        <h2 class="text-2xl sm:text-3xl font-serif font-semibold text-marron-dark">
          {{ t('rsvp.title') }}
        </h2>
        <p class="text-marron/70 text-sm sm:text-base mt-2">
          {{ t('rsvp.deadlinePrefix') }}
          <span class="font-medium text-marron-dark">{{ deadline }}</span>
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Nom complet -->
        <div>
          <label class="block text-sm font-medium text-marron-dark mb-2">
            {{ t('rsvp.fullName') }} <span class="text-red-500">*</span>
          </label>
          <input
              v-model="form.nom_complet"
              type="text"
              required
              :placeholder="t('rsvp.fullNamePlaceholder')"
              class="input"
          />
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-marron-dark mb-2">
            Email <span class="text-red-500">*</span>
          </label>
          <input
              v-model="form.email"
              type="email"
              required
              :placeholder="t('rsvp.emailPlaceholder')"
              class="input"
          />
        </div>

        <!-- {{ t('rsvp.phone') }} -->
        <div>
          <label class="block text-sm font-medium text-marron-dark mb-2">
            {{ t('rsvp.phone') }}
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
          <label class="block text-sm font-medium text-marron-dark mb-3">
            {{ t('rsvp.presenceQuestion') }} <span class="text-red-500">*</span>
          </label>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
                type="button"
                @click="form.presence_confirmee = true"
                :class="presenceClass(true)"
            >
              {{ t('rsvp.yes') }}
            </button>

            <button
                type="button"
                @click="form.presence_confirmee = false"
                :class="presenceClass(false)"
            >
              {{ t('rsvp.no') }}
            </button>
          </div>
        </div>

        <!-- Champs conditionnels -->
        <Transition name="fade-slide">
          <div v-if="form.presence_confirmee" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-marron-dark mb-2">
                {{ t('rsvp.plusOnes') }}
              </label>
              <input
                  v-model.number="form.nombre_accompagnants"
                  type="number"
                  min="0"
                  max="5"
                  class="input"
              />
              <p class="text-xs text-marron/60 mt-1">
                {{ t('rsvp.plusOnesHint') }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-marron-dark mb-2">
                {{ t('rsvp.foodRestrictions') }}
              </label>
              <textarea
                  v-model="form.restrictions_alimentaires"
                  rows="3"
                  :placeholder="t('rsvp.foodRestrictionsPlaceholder')"
                  class="input resize-none"
              ></textarea>
            </div>
          </div>
        </Transition>

        <!-- Message -->
        <div>
          <label class="block text-sm font-medium text-marron-dark mb-2">
            {{ t('rsvp.messageForCouple') }}
          </label>
          <textarea
              v-model="form.message"
              rows="4"
              :placeholder="t('rsvp.messagePlaceholder')"
              class="input resize-none"
          ></textarea>
        </div>

        <!-- Erreur -->
        <Transition name="fade">
          <div
              v-if="error"
              class="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-lg"
          >
            {{ error }}
          </div>
        </Transition>

        <!-- Succès -->
        <Transition name="fade">
          <div
              v-if="success"
              class="bg-green-50 border border-green-200 text-green-700 text-sm p-4 rounded-lg"
          >
            {{ t('rsvp.success') }}
          </div>
        </Transition>

        <!-- Submit -->
        <button
            type="submit"
            :disabled="loading || !formValid"
            class="w-full h-12 rounded-lg bg-gradient-to-r from-dore to-dore-dark text-marron-dark font-semibold transition-all duration-300 hover:brightness-105 hover:shadow-lg hover:shadow-dore/25 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span v-if="loading">{{ t('rsvp.submitLoading') }}</span>
          <span v-else>{{ t('rsvp.submit') }}</span>
        </button>

        <p class="text-xs text-marron/60 text-center">
          {{ t('rsvp.required') }}
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
import { t } from '@/i18n'

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
    'h-12 rounded-lg border text-sm font-medium transition-all duration-300',
    form.presence_confirmee === value
        ? 'bg-gradient-to-r from-dore to-dore-dark text-marron-dark border-dore shadow-md shadow-dore/20'
        : 'bg-white text-marron border-dore/35 hover:border-dore/70 hover:bg-dore/10'
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
  @apply w-full h-12 px-4 rounded-lg border border-dore/35 bg-ivoire text-marron-dark placeholder-marron/45 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-dore/30 focus:border-dore hover:border-dore/60;
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
