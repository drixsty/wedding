<template>
  <section class="space-y-5 animate-fade-in">
    <SiteConfigurationPanel />

    <div class="admin-panel">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 class="admin-section-title">{{ t('admin.dashboard.themeTitle') }}</h2>
          <p class="text-sm text-slate-600">{{ t('admin.dashboard.themeDescription') }}</p>
        </div>
        <div class="flex gap-2 flex-wrap">
          <button @click="syncThemeDraft" class="admin-btn admin-btn-muted">{{ t('admin.dashboard.resetTheme') }}</button>
          <button @click="applySmartPalette" class="admin-btn admin-btn-muted">{{ t('admin.dashboard.generatePalette') }}</button>
          <button @click="persistTheme" :disabled="themeSaving" class="admin-btn">
            {{ themeSaving ? t('admin.dashboard.themeSaving') : t('admin.dashboard.themeSave') }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <div class="admin-subpanel">
          <label for="theme-primary-seed" class="admin-field-label">{{ t('admin.dashboard.primarySeedColor') }}</label>
          <div class="flex items-center gap-3">
            <input id="theme-primary-seed" v-model="themePrimaryColor" type="color" class="h-10 w-14 rounded-lg border border-slate-300 bg-transparent p-1" />
            <input v-model="themePrimaryColor" type="text" class="admin-input flex-1 uppercase" placeholder="#B89F91" />
          </div>
          <p class="text-xs text-slate-500 mt-2">{{ t('admin.dashboard.primarySeedHint') }}</p>
        </div>

        <div class="admin-subpanel">
          <p class="admin-field-label">{{ t('admin.dashboard.contrastPreview') }}</p>
          <div class="grid grid-cols-2 gap-2">
            <div :style="{ backgroundColor: themeDraft.marron, color: readableOnPrimary }" class="rounded-lg px-3 py-2 text-xs font-semibold">Primary</div>
            <div :style="{ backgroundColor: themeDraft.dore, color: readableOnSecondary }" class="rounded-lg px-3 py-2 text-xs font-semibold">Secondary</div>
            <div :style="{ backgroundColor: themeDraft.ivoire, color: readableOnSurface }" class="rounded-lg px-3 py-2 text-xs font-semibold col-span-2">Surface / Texte lisible</div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <div v-for="colorKey in themeColorKeys" :key="colorKey" class="admin-subpanel">
          <label class="admin-field-label">{{ colorKey }}</label>
          <div class="flex items-center gap-3">
            <input v-model="themeDraft[colorKey]" type="color" class="h-10 w-14 rounded-lg border border-slate-300 bg-transparent p-1" />
            <input v-model="themeDraft[colorKey]" type="text" class="admin-input flex-1 uppercase" placeholder="#FFFFFF" />
          </div>
        </div>
      </div>

      <p v-if="themeFeedback" class="mt-3 text-sm text-slate-600">{{ themeFeedback }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import SiteConfigurationPanel from '@/components/admin/SiteConfigurationPanel.vue'
import { useTheme } from '@/composables/useTheme'
import { THEME_COLOR_KEYS } from '@/constants/theme'
import { t } from '@/i18n'

const { theme, saveTheme, sanitizeTheme, generateThemeFromPrimary, getReadableTextColor } = useTheme()
const themeColorKeys = THEME_COLOR_KEYS
const themeDraft = ref(sanitizeTheme(theme.value))
const themePrimaryColor = ref(themeDraft.value.marron)
const themeSaving = ref(false)
const themeFeedback = ref<string | null>(null)

const readableOnPrimary = computed(() => getReadableTextColor(themeDraft.value.marron))
const readableOnSecondary = computed(() => getReadableTextColor(themeDraft.value.dore))
const readableOnSurface = computed(() => getReadableTextColor(themeDraft.value.ivoire))

function syncThemeDraft() {
  themeDraft.value = sanitizeTheme(theme.value)
  themePrimaryColor.value = themeDraft.value.marron
}

function applySmartPalette() {
  themeDraft.value = generateThemeFromPrimary(themePrimaryColor.value)
  themePrimaryColor.value = themeDraft.value.marron
  themeFeedback.value = t('admin.dashboard.themeGenerated')
}

function normalizePrimaryColorInput(value: string): string {
  const trimmed = value.trim()
  const hex = trimmed.startsWith('#') ? trimmed : `#${trimmed}`
  return /^#([A-Fa-f0-9]{6})$/.test(hex) ? hex.toUpperCase() : themeDraft.value.marron
}

async function persistTheme() {
  themeSaving.value = true
  themeFeedback.value = null
  const { error } = await saveTheme(themeDraft.value)
  themeFeedback.value = error ? t('admin.dashboard.themeSaveError', { error }) : t('admin.dashboard.themeSaveSuccess')
  themeSaving.value = false
}

watch(theme, syncThemeDraft, { deep: true })
watch(themePrimaryColor, value => {
  const normalized = normalizePrimaryColorInput(value)
  if (normalized !== value) themePrimaryColor.value = normalized
})
</script>
