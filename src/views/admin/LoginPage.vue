<template>
  <div
      class="admin-login min-h-screen flex items-center justify-center px-6 py-24 relative overflow-hidden"
  >
    <!-- Soft radial glow background -->
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_60%)]"></div>

    <!-- Card -->
    <div
        class="relative w-full max-w-md bg-white/[0.04] backdrop-blur-xl border border-dore/25 rounded-xl p-10 transition-all duration-500 hover:border-dore/50 shadow-2xl shadow-black/25"
    >
      <!-- Header -->
      <div class="text-center mb-10">
        <h1 class="text-3xl font-serif text-white tracking-wide">
          {{ t('admin.login.title') }}
        </h1>
        <p class="text-ivoire/75 text-sm mt-3">
          {{ t('admin.login.subtitle') }}
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-7">

        <!-- Email -->
        <div class="space-y-2">
          <label class="text-xs uppercase tracking-widest text-ivoire/70">
            {{ t('admin.login.email') }}
          </label>

          <input
              v-model="email"
              type="email"
              required
              :placeholder="t('admin.login.emailPlaceholder')"
              class="lux-input"
          />
        </div>

        <!-- Password -->
        <div class="space-y-2">
          <label class="text-xs uppercase tracking-widest text-ivoire/70">
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
              class="bg-red-500/10 border border-red-400/40 text-red-200 text-sm rounded-xl p-4"
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
  background: rgba(255, 250, 240, 0.1);
  border: 1px solid rgba(var(--color-dore-rgb), 0.35);
  border-radius: 1rem;
  padding: 14px 16px;
  font-size: 0.95rem;
  color: #fff8ee;
  transition: all 0.3s ease;
}

.lux-input::placeholder {
  color: rgba(255, 241, 220, 0.45);
}

.lux-input:focus {
  outline: none;
  border-color: rgba(var(--color-dore-rgb), 0.8);
  background: rgba(255, 250, 240, 0.16);
}

/* Button luxe */
.lux-button {
  background: var(--color-dore);
  color: #2f1c0d;
  border-radius: 1rem;
  padding: 14px;
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  transition: all 0.35s ease;
}

.lux-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(var(--color-dore-rgb), 0.35);
}

.lux-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Back link micro interaction */
.lux-link {
  position: relative;
  color: rgba(255, 255, 255, 0.7);
  transition: color 0.3s ease;
}

.lux-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 0%;
  height: 1px;
  background: var(--color-dore);
  transition: width 0.3s ease;
}

.lux-link:hover {
  color: #fff8ee;
}

.lux-link:hover::after {
  width: 100%;
}


.admin-login {
  background: radial-gradient(circle at top, rgba(var(--color-dore-rgb), 0.2), transparent 55%),
  linear-gradient(180deg, var(--color-marron-dark) 0%, #1b1511 100%);
}
</style>
