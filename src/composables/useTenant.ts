import { computed, ref } from 'vue'

const TENANT_STORAGE_KEY = 'wedding:tenant-slug'
const tenantSlug = ref('default')

function normalizeTenantSlug(input?: string | null): string {
  const value = (input ?? '').trim().toLowerCase()
  if (!value) {
    return 'default'
  }

  const normalized = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return normalized || 'default'
}

function resolveTenantFromUrl() {
  if (typeof window === 'undefined') {
    return tenantSlug.value
  }

  const url = new URL(window.location.href)
  const tenantFromQuery = url.searchParams.get('tenant')

  if (tenantFromQuery) {
    return normalizeTenantSlug(tenantFromQuery)
  }

  const storedTenant = window.localStorage.getItem(TENANT_STORAGE_KEY)

  return normalizeTenantSlug(storedTenant)
}

function initializeTenant() {
  const resolvedTenant = resolveTenantFromUrl()
  tenantSlug.value = resolvedTenant

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(TENANT_STORAGE_KEY, resolvedTenant)
  }
}

function setTenant(nextTenant: string) {
  const normalized = normalizeTenantSlug(nextTenant)
  tenantSlug.value = normalized

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(TENANT_STORAGE_KEY, normalized)
  }
}

export function useTenant() {
  return {
    tenantSlug: computed(() => tenantSlug.value),
    normalizeTenantSlug,
    initializeTenant,
    setTenant
  }
}
