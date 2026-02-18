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

interface UploadPhotoOptions {
  visible: boolean
  uploadedByGuest: boolean
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

  async function uploadSinglePhoto(file: File, payload: UploadPhotoPayload, options: UploadPhotoOptions) {
    const fileExt = file.name.split('.').pop() || 'jpg'
    const basePath = options.uploadedByGuest ? 'visitors' : 'admin'
    const filePath = `${basePath}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

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
        visible: options.visible,
        uploaded_by_guest: options.uploadedByGuest
      }])
      .select()
      .single()

    if (insertError) throw insertError

    return normalizePhoto(data)
  }

  async function uploadPhotos(files: File[], payload: UploadPhotoPayload, options: UploadPhotoOptions) {
    uploading.value = true
    error.value = null

    try {
      if (files.length === 0) {
        throw new Error('Aucun fichier sélectionné.')
      }

      const uploadedPhotos: Photo[] = []

      for (const file of files) {
        const photo = await uploadSinglePhoto(file, payload, options)
        uploadedPhotos.push(photo)
      }

      if (!options.uploadedByGuest) {
        photos.value = [...uploadedPhotos, ...photos.value]
      }

      return { data: uploadedPhotos, error: null }
    } catch (err: any) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      uploading.value = false
    }
  }

  async function uploadVisitorPhotos(files: File[], payload: UploadPhotoPayload) {
    return uploadPhotos(files, payload, { visible: false, uploadedByGuest: true })
  }

  async function uploadAdminPhotos(files: File[], payload: UploadPhotoPayload) {
    return uploadPhotos(files, payload, { visible: true, uploadedByGuest: false })
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

  async function setPhotosVisibility(photoIds: string[], visible: boolean) {
    loading.value = true
    error.value = null

    try {
      if (photoIds.length === 0) {
        return { data: [], error: null }
      }

      const { data, error: updateError } = await supabase
        .from('photos')
        .update({ visible })
        .in('id', photoIds)
        .select()

      if (updateError) throw updateError

      const updatedPhotos = (data || []).map(normalizePhoto)
      const updatedById = new Map(updatedPhotos.map(photo => [photo.id, photo]))

      photos.value = photos.value.map(photo => updatedById.get(photo.id) ?? photo)

      return { data: updatedPhotos, error: null }
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

  async function deletePhotos(photoIds: string[]) {
    loading.value = true
    error.value = null

    try {
      if (photoIds.length === 0) {
        return { error: null }
      }

      const { error: deleteError } = await supabase
        .from('photos')
        .delete()
        .in('id', photoIds)

      if (deleteError) throw deleteError

      photos.value = photos.value.filter(photo => !photoIds.includes(photo.id))

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
    uploadVisitorPhotos,
    uploadAdminPhotos,
    setPhotoVisibility,
    setPhotosVisibility,
    deletePhoto,
    deletePhotos
  }
}
