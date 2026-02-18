import { ref } from 'vue'
import { supabase } from '@/utils/supabase'
import type { Guest, RsvpFormData, Stats } from '@/types/models'

export function useGuests() {
  const guests = ref<Guest[]>([])
  const stats = ref<Stats | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Générer un QR code unique
  function generateQRCode(): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 15)
    return `WED-${timestamp}-${random}`.toUpperCase()
  }

  // Soumettre un RSVP
  async function submitRsvp(formData: RsvpFormData) {
    loading.value = true
    error.value = null

    try {
      const qrCode = generateQRCode()

      const { data, error: submitError } = await supabase
        .from('guests')
        .insert([{
          ...formData,
          qr_code: qrCode,
          statut: 'en_attente'
        }])
        .select()
        .single()

      if (submitError) throw submitError

      return { data, error: null }
    } catch (err: any) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Récupérer tous les invités (admin)
  async function fetchGuests(filters?: { statut?: string; search?: string }) {
    loading.value = true
    error.value = null

    try {
      let query = supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false })

      if (filters?.statut) {
        query = query.eq('statut', filters.statut)
      }

      if (filters?.search) {
        query = query.or(`nom_complet.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      guests.value = data || []
      return { data, error: null }
    } catch (err: any) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Récupérer les statistiques
  async function fetchStats() {
    loading.value = true
    error.value = null

    try {
      const { data, error: statsError } = await supabase
        .from('guests')
        .select('*')

      if (statsError) throw statsError

      const statsData: Stats = {
        total_invites: data.length,
        confirmations_oui: data.filter(g => g.presence_confirmee === true && g.statut === 'validé').length,
        confirmations_non: data.filter(g => g.presence_confirmee === false).length,
        en_attente: data.filter(g => g.statut === 'en_attente').length,
        total_accompagnants: data
          .filter(g => g.presence_confirmee === true && g.statut === 'validé')
          .reduce((sum, g) => sum + (g.nombre_accompagnants || 0), 0),
        qr_scannes: data.filter(g => g.qr_scanne === true).length,
        invitations_envoyees: data.filter(g => g.invitation_envoyee === true).length
      }

      stats.value = statsData
      return { data: statsData, error: null }
    } catch (err: any) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Valider/refuser un invité (admin)
  async function updateGuestStatus(guestId: string, statut: 'validé' | 'refusé') {
    loading.value = true
    error.value = null

    try {
      const { data, error: updateError } = await supabase
        .from('guests')
        .update({ 
          statut, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', guestId)
        .select()
        .single()

      if (updateError) throw updateError

      // Mettre à jour la liste locale
      const index = guests.value.findIndex(g => g.id === guestId)
      if (index !== -1) {
        guests.value[index] = data
      }

      return { data, error: null }
    } catch (err: any) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Supprimer un invité (admin)
  async function deleteGuest(guestId: string) {
    loading.value = true
    error.value = null

    try {
      const { error: deleteError } = await supabase
        .from('guests')
        .delete()
        .eq('id', guestId)

      if (deleteError) throw deleteError

      // Retirer de la liste locale
      guests.value = guests.value.filter(g => g.id !== guestId)

      return { error: null }
    } catch (err: any) {
      error.value = err.message
      return { error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Vérifier un QR code
  async function verifyQRCode(qrCode: string) {
    loading.value = true
    error.value = null

    try {
      const { data, error: verifyError } = await supabase
        .from('guests')
        .select('*')
        .eq('qr_code', qrCode)
        .eq('statut', 'validé')
        .single()

      if (verifyError) throw verifyError

      // Marquer comme scanné
      await supabase
        .from('guests')
        .update({
          qr_scanne: true,
          date_scan: new Date().toISOString()
        })
        .eq('id', data.id)

      return { data, error: null }
    } catch (err: any) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Marquer invitation comme envoyée
  async function markInvitationSent(guestIds: string[]) {
    loading.value = true
    error.value = null

    try {
      const { error: updateError } = await supabase
        .from('guests')
        .update({
          invitation_envoyee: true,
          date_envoi_invitation: new Date().toISOString()
        })
        .in('id', guestIds)

      if (updateError) throw updateError

      return { error: null }
    } catch (err: any) {
      error.value = err.message
      return { error: err.message }
    } finally {
      loading.value = false
    }
  }

  return {
    guests,
    stats,
    loading,
    error,
    submitRsvp,
    fetchGuests,
    fetchStats,
    updateGuestStatus,
    deleteGuest,
    verifyQRCode,
    markInvitationSent
  }
}
