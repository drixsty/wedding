import { ref } from 'vue'
import { supabase } from '@/utils/supabase'
import type { Photo } from '@/types/models'

const DEFAULT_PHOTOS: Photo[] = [
  {
    id: 'seed-1',
    url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200&q=80',
    titre: 'Notre rencontre',
    description: 'Le jour où tout a commencé.',
    categorie: 'couple',
    visible: true,
    uploaded_by_guest: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'seed-2',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
    titre: 'Famille réunie',
    description: 'Un souvenir avec toutes nos familles.',
    categorie: 'family',
    visible: true,
    uploaded_by_guest: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'seed-3',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80',
    titre: 'Soirée entre amis',
    description: 'Une fête entourée de ceux qu’on aime.',
    categorie: 'friends',
    visible: true,
    uploaded_by_guest: false,
    created_at: new Date().toISOString()
  }
]

interface UploadPhotoPayload {
  titre: string
  description: string
  categorie: string
}

function normalizePhoto(photo: Partial<Photo>): Photo {
  return {
    id: photo.id || crypto.randomUUID(),
    url: photo.url || '',
    titre: photo.titre || 'Souvenir',
    description: photo.description || '',
    categorie: photo.categorie || 'all',
    ordre_affichage: photo.ordre_affichage,
    visible: photo.visible ?? true,
    uploaded_by_guest: photo.uploaded_by_guest ?? false,
    created_at: photo.created_at || new Date().toISOString()
  }
}

export function useGallery() {
  const photos = ref<Photo[]>([])
  const loading = ref(false)
  const uploading = ref(false)
  const error = ref<string | null>(null)

  async function fetchPublicPhotos() {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('photos')
        .select('*')
        .eq('visible', true)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      photos.value = (data || []).map(normalizePhoto)
      if (photos.value.length === 0) {
        photos.value = DEFAULT_PHOTOS
      }

      return { data: photos.value, error: null }
    } catch (err: any) {
      photos.value = DEFAULT_PHOTOS
      error.value = err.message
      return { data: photos.value, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function fetchAdminPhotos() {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      photos.value = (data || []).map(normalizePhoto)
      return { data: photos.value, error: null }
    } catch (err: any) {
      error.value = err.message
      photos.value = []
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function uploadVisitorPhoto(file: File, payload: UploadPhotoPayload) {
    uploading.value = true
    error.value = null

    try {
      const fileExt = file.name.split('.').pop() || 'jpg'
      const filePath = `visitors/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

      const { error: storageError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file, { cacheControl: '3600', upsert: false })

      if (storageError) throw storageError

      const { data: publicData } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath)

      const { data, error: insertError } = await supabase
        .from('photos')
        .insert([{
          url: publicData.publicUrl,
          titre: payload.titre,
          description: payload.description,
          categorie: payload.categorie,
          visible: false,
          uploaded_by_guest: true
        }])
        .select()
        .single()

      if (insertError) throw insertError

      return { data: normalizePhoto(data), error: null }
    } catch (err: any) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      uploading.value = false
    }
  }

  async function setPhotoVisibility(photoId: string, visible: boolean) {
    loading.value = true
    error.value = null

    try {
      const { data, error: updateError } = await supabase
        .from('photos')
        .update({ visible })
        .eq('id', photoId)
        .select()
        .single()

      if (updateError) throw updateError

      photos.value = photos.value.map(photo => (photo.id === photoId ? normalizePhoto(data) : photo))

      return { data: normalizePhoto(data), error: null }
    } catch (err: any) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function deletePhoto(photoId: string) {
    loading.value = true
    error.value = null

    try {
      const { error: deleteError } = await supabase
        .from('photos')
        .delete()
        .eq('id', photoId)

      if (deleteError) throw deleteError

      photos.value = photos.value.filter(photo => photo.id !== photoId)

      return { error: null }
    } catch (err: any) {
      error.value = err.message
      return { error: err.message }
    } finally {
      loading.value = false
    }
  }

  return {
    photos,
    loading,
    uploading,
    error,
    fetchPublicPhotos,
    fetchAdminPhotos,
    uploadVisitorPhoto,
    setPhotoVisibility,
    deletePhoto
  }
}
