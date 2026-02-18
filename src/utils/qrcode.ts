import QRCode from 'qrcode'

export interface QRCodeData {
  guestId: string
  name: string
  email: string
  eventDate: string
}

/**
 * Génère un QR code pour un invité
 */
export async function generateQRCode(data: QRCodeData): Promise<string> {
  try {
    // Créer la payload du QR code
    const payload = JSON.stringify({
      id: data.guestId,
      name: data.name,
      email: data.email,
      date: data.eventDate,
      type: 'wedding-invitation',
      timestamp: Date.now()
    })

    // Générer le QR code en data URL
    const qrCodeDataURL = await QRCode.toDataURL(payload, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 1,
      margin: 2,
      color: {
        dark: '#B89F91', // Couleur greige
        light: '#FCFAF7'  // Couleur ivoire
      },
      width: 400
    })

    return qrCodeDataURL
  } catch (error) {
    console.error('Erreur génération QR code:', error)
    throw new Error('Impossible de générer le QR code')
  }
}

/**
 * Génère un QR code sous forme de canvas
 */
export async function generateQRCodeCanvas(
  data: QRCodeData,
  canvas: HTMLCanvasElement
): Promise<void> {
  const payload = JSON.stringify({
    id: data.guestId,
    name: data.name,
    email: data.email,
    date: data.eventDate,
    type: 'wedding-invitation'
  })

  await QRCode.toCanvas(canvas, payload, {
    errorCorrectionLevel: 'H',
    margin: 2,
    color: {
      dark: '#B89F91',
      light: '#FCFAF7'
    },
    width: 300
  })
}

/**
 * Vérifie et décode un QR code
 */
export function decodeQRCodeData(qrData: string): QRCodeData | null {
  try {
    const data = JSON.parse(qrData)
    
    if (data.type !== 'wedding-invitation') {
      throw new Error('QR code invalide')
    }

    return {
      guestId: data.id,
      name: data.name,
      email: data.email,
      eventDate: data.date
    }
  } catch (error) {
    console.error('Erreur décodage QR code:', error)
    return null
  }
}

/**
 * Télécharge le QR code en tant qu'image
 */
export function downloadQRCode(dataURL: string, filename: string): void {
  const link = document.createElement('a')
  link.href = dataURL
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
