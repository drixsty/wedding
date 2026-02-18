import { computed, ref } from 'vue'
import { supabase } from '@/utils/supabase'
import {
  DEFAULT_THEME,
  THEME_COLOR_KEYS,
  THEME_CSS_VARS,
  type ThemeColorKey,
  type ThemeConfig
} from '@/constants/theme'

const theme = ref<ThemeConfig>({ ...DEFAULT_THEME })
const loading = ref(false)
const error = ref<string | null>(null)

function normalizeHexColor(color: string): string {
  const value = color.trim()
  const hex = value.startsWith('#') ? value : `#${value}`

  if (/^#([A-Fa-f0-9]{6})$/.test(hex)) {
    return hex.toUpperCase()
  }

  return '#000000'
}

function hexToRgbChannels(hexColor: string): string {
  const hex = normalizeHexColor(hexColor).slice(1)
  const r = Number.parseInt(hex.slice(0, 2), 16)
  const g = Number.parseInt(hex.slice(2, 4), 16)
  const b = Number.parseInt(hex.slice(4, 6), 16)

  return `${r} ${g} ${b}`
}

function sanitizeTheme(input?: Partial<ThemeConfig> | null): ThemeConfig {
  const safeTheme = { ...DEFAULT_THEME }

  if (!input) {
    return safeTheme
  }

  for (const key of THEME_COLOR_KEYS) {
    const value = input[key]
    if (typeof value === 'string') {
      safeTheme[key] = normalizeHexColor(value)
    }
  }

  return safeTheme
}

function applyTheme(newTheme: ThemeConfig) {
  if (typeof document === 'undefined') {
    return
  }

  const root = document.documentElement

  for (const key of THEME_COLOR_KEYS) {
    const cssVar = THEME_CSS_VARS[key]
    const value = normalizeHexColor(newTheme[key])

    root.style.setProperty(cssVar, value)
    root.style.setProperty(`${cssVar}-rgb`, hexToRgbChannels(value))
  }

  theme.value = { ...newTheme }
}

async function loadTheme() {
  loading.value = true
  error.value = null

  try {
    const { data, error: loadError } = await supabase
      .from('site_theme')
      .select('colors')
      .eq('id', 1)
      .maybeSingle()

    if (loadError) {
      throw loadError
    }

    applyTheme(sanitizeTheme((data?.colors as Partial<ThemeConfig> | undefined) ?? null))
  } catch (err: any) {
    error.value = err.message
    applyTheme({ ...DEFAULT_THEME })
  } finally {
    loading.value = false
  }
}

async function saveTheme(newTheme: ThemeConfig) {
  loading.value = true
  error.value = null

  const sanitizedTheme = sanitizeTheme(newTheme)

  try {
    const { error: saveError } = await supabase
      .from('site_theme')
      .upsert({
        id: 1,
        colors: sanitizedTheme
      })

    if (saveError) {
      throw saveError
    }

    applyTheme(sanitizedTheme)

    return { error: null }
  } catch (err: any) {
    error.value = err.message
    return { error: err.message }
  } finally {
    loading.value = false
  }
}

export function useTheme() {
  return {
    theme,
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    applyTheme,
    loadTheme,
    saveTheme,
    sanitizeTheme
  }
}

export type { ThemeConfig, ThemeColorKey }
