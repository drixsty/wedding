import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

export interface InvitationData {
  guestName: string
  guestEmail: string
  numberOfGuests: number
  eventDate: string
  eventLocation: string
  qrCodeDataURL: string
}

/**
 * Génère une invitation PDF élégante
 */
export async function generateInvitationPDF(data: InvitationData): Promise<Blob> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  // Couleurs
  const greige = [184, 159, 145]
  const champagne = [201, 168, 124]
  const ivoire = [252, 250, 247]

  // Fond ivoire
  pdf.setFillColor(ivoire[0], ivoire[1], ivoire[2])
  pdf.rect(0, 0, pageWidth, pageHeight, 'F')

  // Border décorative
  pdf.setDrawColor(champagne[0], champagne[1], champagne[2])
  pdf.setLineWidth(0.5)
  pdf.rect(10, 10, pageWidth - 20, pageHeight - 20)
  pdf.rect(12, 12, pageWidth - 24, pageHeight - 24)

  // Titre principal
  pdf.setFontSize(32)
  pdf.setTextColor(greige[0], greige[1], greige[2])
  pdf.setFont('helvetica', 'bold')
  pdf.text('Vous êtes invité(e)', pageWidth / 2, 40, { align: 'center' })

  // Motif décoratif
  pdf.setFontSize(24)
  pdf.text('❤', pageWidth / 2, 50, { align: 'center' })

  // Noms des mariés
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bolditalic')
  pdf.text('Marie & Jean', pageWidth / 2, 65, { align: 'center' })

  // Message d'invitation
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(greige[0], greige[1], greige[2])
  
  const invitationText = [
    '',
    'ont le plaisir de vous inviter',
    'à célébrer leur union',
    '',
    `${data.eventDate}`,
    '',
    `${data.eventLocation}`
  ]

  let yPosition = 85
  invitationText.forEach(line => {
    pdf.text(line, pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 8
  })

  // Informations invité
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text(`Cher(e) ${data.guestName}`, pageWidth / 2, yPosition + 15, { align: 'center' })
  
  if (data.numberOfGuests > 1) {
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Vous êtes invité(e) avec ${data.numberOfGuests - 1} personne(s)`, pageWidth / 2, yPosition + 22, { align: 'center' })
  }

  // QR Code
  if (data.qrCodeDataURL) {
    const qrSize = 50
    const qrX = (pageWidth - qrSize) / 2
    const qrY = yPosition + 35
    
    pdf.addImage(data.qrCodeDataURL, 'PNG', qrX, qrY, qrSize, qrSize)
    
    pdf.setFontSize(10)
    pdf.setTextColor(greige[0], greige[1], greige[2])
    pdf.text('Présentez ce QR code à l\'entrée', pageWidth / 2, qrY + qrSize + 8, { align: 'center' })
  }

  // Footer
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'italic')
  pdf.setTextColor(greige[0], greige[1], greige[2])
  pdf.text('Nous avons hâte de célébrer avec vous !', pageWidth / 2, pageHeight - 25, { align: 'center' })
  
  pdf.setFontSize(8)
  pdf.text(`Référence: ${data.guestEmail}`, pageWidth / 2, pageHeight - 15, { align: 'center' })

  return pdf.output('blob')
}

/**
 * Télécharge le PDF d'invitation
 */
export function downloadInvitationPDF(blob: Blob, guestName: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `invitation-${guestName.replace(/\s+/g, '-')}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Génère un PDF depuis un élément HTML
 */
export async function generatePDFFromElement(
  element: HTMLElement,
  filename: string
): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: '#FCFAF7',
    logging: false
  })

  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [canvas.width, canvas.height]
  })

  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
  pdf.save(filename)
}
