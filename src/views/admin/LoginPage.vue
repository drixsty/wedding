<template>
  <div
      class="admin-login min-h-screen flex items-center justify-center px-6 py-24 relative overflow-hidden animate-fade-in"
  >
    <!-- Soft radial glow background -->
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_60%)]"></div>

    <!-- Card -->
    <div class="admin-card relative w-full max-w-md !bg-white !border-slate-200 p-10 shadow-2xl shadow-slate-900/10 animate-scale-in">
      <!-- Header -->
      <div class="text-center mb-10">
        <h1 class="text-3xl font-serif text-slate-900 tracking-wide">
          {{ t('admin.login.title') }}
        </h1>
        <p class="text-slate-500 text-sm mt-3">
          {{ t('admin.login.subtitle') }}
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-7">

        <!-- Email -->
        <div class="space-y-2">
          <label class="text-xs uppercase tracking-widest text-slate-600">
            {{ t('admin.login.email') }}
          </label>

          <input
              v-model="email"
              type="email"
              required
              :placeholder="t('admin.login.emailPlaceholder')"
              class="admin-input"
          />
        </div>

        <!-- Password -->
        <div class="space-y-2">
          <label class="text-xs uppercase tracking-widest text-slate-600">
            {{ t('admin.login.password') }}
          </label>

          <input
              v-model="password"
              type="password"
              required
              placeholder="••••••••"
              class="admin-input"
          />
        </div>

        <!-- Error -->
        <transition name="fade">
          <div
              v-if="error"
            class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-4"
          >
            <p class="font-medium mb-1">{{ t('admin.login.loginError') }}</p>
            <p class="opacity-80">{{ error }}</p>
          </div>
        </transition>

        <!-- Button -->
        <button
            type="submit"
            :disabled="loading"
            class="admin-btn w-full"
        >
          <span v-if="loading" class="opacity-70">{{ t('admin.login.loading') }}</span>
          <span v-else>{{ t('admin.login.submit') }}</span>
        </button>

      </form>

      <!-- Back -->
      <div class="mt-10 text-center">
        <router-link
            to="/"
            class="admin-link text-sm text-slate-500 hover:text-slate-900"
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

.admin-login {
  background: radial-gradient(circle at top, rgba(15, 23, 42, 0.12), transparent 55%),
  linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
}
</style>
