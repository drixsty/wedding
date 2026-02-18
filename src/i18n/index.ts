import { messages } from './messages'

const defaultLocale = 'fr' as const

function interpolate(template: string, params?: Record<string, string | number>) {
  if (!params) return template

  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(params[key] ?? `{${key}}`))
}

export function t(key: string, params?: Record<string, string | number>, locale = defaultLocale): string {
  const value = key.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[part]
    }
    return undefined
  }, messages[locale])

  if (typeof value === 'string') {
    return interpolate(value, params)
  }

  return key
}
