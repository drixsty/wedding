import { computed, ref } from 'vue'
import { supabase } from '@/utils/supabase'
import {
  DEFAULT_THEME,
  THEME_COLOR_KEYS,
  THEME_CSS_VARS,
  type ThemeColorKey,
  type ThemeConfig
} from '@/constants/theme'
import { useTenant } from '@/composables/useTenant'

const theme = ref<ThemeConfig>({ ...DEFAULT_THEME })
const loading = ref(false)
const error = ref<string | null>(null)

interface RgbColor {
  r: number
  g: number
  b: number
}

function clampChannel(value: number): number {
  return Math.min(255, Math.max(0, Math.round(value)))
}

function normalizeHexColor(color: string): string {
  const value = color.trim()
  const hex = value.startsWith('#') ? value : `#${value}`

  if (/^#([A-Fa-f0-9]{6})$/.test(hex)) {
    return hex.toUpperCase()
  }

  return '#000000'
}

function hexToRgb(hexColor: string): RgbColor {
  const hex = normalizeHexColor(hexColor).slice(1)

  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16)
  }
}

function rgbToHex({ r, g, b }: RgbColor): string {
  const toHex = (channel: number) => clampChannel(channel).toString(16).padStart(2, '0').toUpperCase()
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function mixHexColors(baseColor: string, mixColor: string, ratio: number): string {
  const weight = Math.max(0, Math.min(1, ratio))
  const base = hexToRgb(baseColor)
  const mix = hexToRgb(mixColor)

  return rgbToHex({
    r: base.r * (1 - weight) + mix.r * weight,
    g: base.g * (1 - weight) + mix.g * weight,
    b: base.b * (1 - weight) + mix.b * weight
  })
}

function relativeLuminance(hexColor: string): number {
  const { r, g, b } = hexToRgb(hexColor)
  const channels = [r, g, b].map(channel => {
    const normalized = channel / 255
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4
  })

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

function contrastRatio(colorA: string, colorB: string): number {
  const lumA = relativeLuminance(colorA)
  const lumB = relativeLuminance(colorB)
  const lighter = Math.max(lumA, lumB)
  const darker = Math.min(lumA, lumB)
  return (lighter + 0.05) / (darker + 0.05)
}

function getReadableTextColor(backgroundColor: string): '#111111' | '#FFFFFF' {
  const dark = '#111111'
  const light = '#FFFFFF'

  return contrastRatio(backgroundColor, dark) >= contrastRatio(backgroundColor, light) ? '#111111' : '#FFFFFF'
}

function hexToRgbChannels(hexColor: string): string {
  const { r, g, b } = hexToRgb(hexColor)
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

function generateThemeFromPrimary(primaryColor: string): ThemeConfig {
  const seed = normalizeHexColor(primaryColor)

  const marron = seed
  const marronLight = mixHexColors(seed, '#FFFFFF', 0.35)
  const marronDark = mixHexColors(seed, '#000000', 0.28)

  const dore = mixHexColors(seed, '#D8B46D', 0.6)
  const doreLight = mixHexColors(dore, '#FFFFFF', 0.42)
  const doreDark = mixHexColors(dore, '#000000', 0.26)

  const ivoire = mixHexColors(seed, '#FFFFFF', 0.92)
  const ivoireDark = mixHexColors(seed, '#FFFFFF', 0.84)

  const sage = mixHexColors(seed, '#9EBC9E', 0.45)
  const mauve = mixHexColors(seed, '#C2A2C2', 0.5)
  const clay = mixHexColors(seed, '#C99C8B', 0.45)
  const slate = mixHexColors(seed, '#8FA0B3', 0.52)
  const cream = mixHexColors(seed, '#F0E6D8', 0.78)
  const mist = mixHexColors(seed, '#D8E3E0', 0.78)

  return sanitizeTheme({
    marron,
    marronLight,
    marronDark,
    ivoire,
    ivoireDark,
    dore,
    doreLight,
    doreDark,
    sage,
    mauve,
    clay,
    slate,
    cream,
    mist
  })
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
    const { tenantSlug } = useTenant()

    const { data, error: loadError } = await supabase
      .from('site_theme')
      .select('colors')
      .eq('tenant_slug', tenantSlug.value)
      .maybeSingle()

    if (loadError) {
      throw loadError
    }

    if (data?.colors) {
      applyTheme(sanitizeTheme((data?.colors as Partial<ThemeConfig> | undefined) ?? null))
      return
    }

    const { data: legacyData, error: legacyError } = await supabase
      .from('site_theme')
      .select('colors')
      .eq('id', 1)
      .maybeSingle()

    if (legacyError) {
      throw legacyError
    }

    applyTheme(sanitizeTheme((legacyData?.colors as Partial<ThemeConfig> | undefined) ?? null))
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
    const { tenantSlug } = useTenant()

    let { error: saveError } = await supabase
      .from('site_theme')
      .upsert({
        tenant_slug: tenantSlug.value,
        colors: sanitizedTheme
      }, { onConflict: 'tenant_slug' })

    if (saveError?.message?.includes('tenant_slug')) {
      const legacyResult = await supabase
        .from('site_theme')
        .upsert({ id: 1, colors: sanitizedTheme })
      saveError = legacyResult.error
    }

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
    sanitizeTheme,
    generateThemeFromPrimary,
    getReadableTextColor,
    contrastRatio
  }
}

export type { ThemeConfig, ThemeColorKey }
