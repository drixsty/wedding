export interface Guest {
  id: string
  nom_complet: string
  email: string
  telephone?: string
  nombre_accompagnants: number
  presence_confirmee: boolean
  restrictions_alimentaires?: string
  message?: string
  qr_code: string
  invitation_envoyee: boolean
  date_envoi_invitation?: string
  qr_scanne: boolean
  date_scan?: string
  statut: 'en_attente' | 'validé' | 'refusé'
  created_at: string
  updated_at: string
}

export interface RsvpFormData {
  nom_complet: string
  email: string
  telephone: string
  nombre_accompagnants: number
  presence_confirmee: boolean
  restrictions_alimentaires?: string
  message?: string
}

export interface Photo {
  id: string
  url: string
  titre?: string
  description?: string
  categorie?: string
  ordre_affichage?: number
  created_at: string
}

export interface Administrator {
  id: string
  email: string
  nom?: string
  role: 'super_admin' | 'admin'
  created_at: string
}

export interface Stats {
  total_invites: number
  confirmations_oui: number
  confirmations_non: number
  en_attente: number
  total_accompagnants: number
  qr_scannes: number
  invitations_envoyees: number
}

export interface InvitationData {
  guest_ids: string[]
  template?: string
  message_personnalise?: string
}

export interface SiteTheme {
  id: number
  colors: Record<string, string>
  created_at: string
  updated_at: string
}
