export type ThemeColorKey =
  | 'marron'
  | 'marronLight'
  | 'marronDark'
  | 'ivoire'
  | 'ivoireDark'
  | 'dore'
  | 'doreLight'
  | 'doreDark'
  | 'sage'
  | 'mauve'
  | 'clay'
  | 'slate'
  | 'cream'
  | 'mist'

export type ThemeConfig = Record<ThemeColorKey, string>

export const DEFAULT_THEME: ThemeConfig = {
  marron: '#B89F91',
  marronLight: '#D4C4B7',
  marronDark: '#8B7A6A',
  ivoire: '#FCFAF7',
  ivoireDark: '#F5F2ED',
  dore: '#C9A87C',
  doreLight: '#E5D4B8',
  doreDark: '#A68B5B',
  sage: '#A4B8A4',
  mauve: '#BEA5B8',
  clay: '#C4A29E',
  slate: '#9BA5AF',
  cream: '#F0E6D8',
  mist: '#D8E3E0'
}

export const THEME_COLOR_LABELS: Record<ThemeColorKey, string> = {
  marron: 'Marron principal',
  marronLight: 'Marron clair',
  marronDark: 'Marron foncé',
  ivoire: 'Ivoire',
  ivoireDark: 'Ivoire foncé',
  dore: 'Doré principal',
  doreLight: 'Doré clair',
  doreDark: 'Doré foncé',
  sage: 'Accent Sage',
  mauve: 'Accent Mauve',
  clay: 'Accent Clay',
  slate: 'Accent Slate',
  cream: 'Accent Cream',
  mist: 'Accent Mist'
}

export const THEME_CSS_VARS: Record<ThemeColorKey, string> = {
  marron: '--color-marron',
  marronLight: '--color-marron-light',
  marronDark: '--color-marron-dark',
  ivoire: '--color-ivoire',
  ivoireDark: '--color-ivoire-dark',
  dore: '--color-dore',
  doreLight: '--color-dore-light',
  doreDark: '--color-dore-dark',
  sage: '--color-sage',
  mauve: '--color-mauve',
  clay: '--color-clay',
  slate: '--color-slate',
  cream: '--color-cream',
  mist: '--color-mist'
}

export const THEME_COLOR_KEYS = Object.keys(DEFAULT_THEME) as ThemeColorKey[]
