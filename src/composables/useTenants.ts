import { ref } from 'vue'
import { supabase } from '@/utils/supabase'
import { useTenant } from '@/composables/useTenant'

export interface TenantRecord {
  id: string
  name: string
  slug: string
  created_at: string
}

const tenants = ref<TenantRecord[]>([])
const loading = ref(false)

async function fetchTenants() {
  loading.value = true

  try {
    const { data, error } = await supabase
      .from('tenants')
      .select('id,name,slug,created_at')
      .order('created_at', { ascending: true })

    if (error) {
      throw error
    }

    tenants.value = data || []
  } catch {
    tenants.value = []
  } finally {
    loading.value = false
  }
}

async function createTenant(name: string) {
  const { normalizeTenantSlug } = useTenant()
  const slug = normalizeTenantSlug(name)

  const { data, error } = await supabase
    .from('tenants')
    .insert({ name: name.trim(), slug })
    .select('id,name,slug,created_at')
    .single()

  if (error) {
    return { error: error.message, data: null }
  }

  tenants.value = [...tenants.value, data]
  return { error: null, data }
}

export function useTenants() {
  return {
    tenants,
    loading,
    fetchTenants,
    createTenant
  }
}
