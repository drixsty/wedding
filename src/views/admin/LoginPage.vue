<template>
  <div
      class="min-h-screen flex items-center justify-center px-6 py-24 bg-neutral-950 relative overflow-hidden"
  >
    <!-- Soft radial glow background -->
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_60%)]"></div>

    <!-- Card -->
    <div
        class="relative w-full max-w-md bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-10 transition-all duration-500 hover:border-white/20"
    >
      <!-- Header -->
      <div class="text-center mb-10">
        <h1 class="text-3xl font-serif text-white tracking-wide">
          {{ t('admin.login.title') }}
        </h1>
        <p class="text-neutral-400 text-sm mt-3">
          {{ t('admin.login.subtitle') }}
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-7">

        <!-- Email -->
        <div class="space-y-2">
          <label class="text-xs uppercase tracking-widest text-neutral-500">
            Email
          </label>

          <input
              v-model="email"
              type="email"
              required
              placeholder="admin@exemple.com"
              class="lux-input"
          />
        </div>

        <!-- Password -->
        <div class="space-y-2">
          <label class="text-xs uppercase tracking-widest text-neutral-500">
            {{ t('admin.login.password') }}
          </label>

          <input
              v-model="password"
              type="password"
              required
              placeholder="••••••••"
              class="lux-input"
          />
        </div>

        <!-- Error -->
        <transition name="fade">
          <div
              v-if="error"
              class="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl p-4"
          >
            <p class="font-medium mb-1">{{ t('admin.login.loginError') }}</p>
            <p class="opacity-80">{{ error }}</p>
          </div>
        </transition>

        <!-- Button -->
        <button
            type="submit"
            :disabled="loading"
            class="lux-button w-full"
        >
          <span v-if="loading" class="opacity-70">{{ t('admin.login.loading') }}</span>
          <span v-else>{{ t('admin.login.submit') }}</span>
        </button>

      </form>

      <!-- Back -->
      <div class="mt-10 text-center">
        <router-link
            to="/"
            class="lux-link text-sm"
        >
          {{ t('admin.login.back') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { t } from '@/i18n'

const router = useRouter()
const { signIn, loading, error } = useAuth()

const email = ref('')
const password = ref('')

async function handleLogin() {
  const { data } = await signIn(email.value, password.value)

  if (data) {
    router.push('/admin/dashboard')
  }
}
</script>

<style scoped>

/* Fade animation */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Inputs luxe */
.lux-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  padding: 14px 16px;
  font-size: 0.95rem;
  color: white;
  transition: all 0.3s ease;
}

.lux-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.lux-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.07);
}

/* Button luxe */
.lux-button {
  background: white;
  color: black;
  border-radius: 9999px;
  padding: 14px;
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  transition: all 0.35s ease;
}

.lux-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(255, 255, 255, 0.15);
}

.lux-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Back link micro interaction */
.lux-link {
  position: relative;
  color: #a3a3a3;
  transition: color 0.3s ease;
}

.lux-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 0%;
  height: 1px;
  background: white;
  transition: width 0.3s ease;
}

.lux-link:hover {
  color: white;
}

.lux-link:hover::after {
  width: 100%;
}

</style>
