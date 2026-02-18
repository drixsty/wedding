import * as XLSX from 'xlsx'

export interface Guest {
  id: string
  name: string
  email: string
  phone?: string
  attending: boolean | null
  plus_ones?: number
  dietary_restrictions?: string
  message?: string
  invitation_sent?: boolean
  checked_in?: boolean
  created_at: string
}

/**
 * Exporte les invités en CSV
 */
export function exportGuestsToCSV(guests: Guest[]): void {
  const headers = [
    'Nom',
    'Email',
    'Téléphone',
    'Présence',
    'Accompagnants',
    'Restrictions alimentaires',
    'Message',
    'Invitation envoyée',
    'Check-in',
    'Date d\'inscription'
  ]

  const rows = guests.map(guest => [
    guest.name,
    guest.email,
    guest.phone || '',
    guest.attending === null ? 'En attente' : guest.attending ? 'Oui' : 'Non',
    guest.plus_ones || 0,
    guest.dietary_restrictions || '',
    guest.message || '',
    guest.invitation_sent ? 'Oui' : 'Non',
    guest.checked_in ? 'Oui' : 'Non',
    new Date(guest.created_at).toLocaleDateString('fr-FR')
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  downloadFile(blob, `invites-${new Date().toISOString().split('T')[0]}.csv`)
}

/**
 * Exporte les invités en Excel
 */
export function exportGuestsToExcel(guests: Guest[]): void {
  const worksheet = XLSX.utils.json_to_sheet(
    guests.map(guest => ({
      'Nom': guest.name,
      'Email': guest.email,
      'Téléphone': guest.phone || '',
      'Présence': guest.attending === null ? 'En attente' : guest.attending ? 'Oui' : 'Non',
      'Accompagnants': guest.plus_ones || 0,
      'Restrictions alimentaires': guest.dietary_restrictions || '',
      'Message': guest.message || '',
      'Invitation envoyée': guest.invitation_sent ? 'Oui' : 'Non',
      'Check-in': guest.checked_in ? 'Oui' : 'Non',
      'Date d\'inscription': new Date(guest.created_at).toLocaleDateString('fr-FR')
    }))
  )

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Invités')

  // Ajuster les largeurs des colonnes
  const maxWidth = 30
  const wscols = [
    { wch: 20 }, // Nom
    { wch: maxWidth }, // Email
    { wch: 15 }, // Téléphone
    { wch: 12 }, // Présence
    { wch: 15 }, // Accompagnants
    { wch: maxWidth }, // Restrictions
    { wch: maxWidth }, // Message
    { wch: 18 }, // Invitation envoyée
    { wch: 10 }, // Check-in
    { wch: 15 }  // Date
  ]
  worksheet['!cols'] = wscols

  XLSX.writeFile(workbook, `invites-${new Date().toISOString().split('T')[0]}.xlsx`)
}

/**
 * Exporte les statistiques en Excel
 */
export function exportStatsToExcel(stats: any): void {
  // Statistiques générales
  const statsData = [
    { 'Métrique': 'Total invités', 'Valeur': stats.total },
    { 'Métrique': 'Confirmés', 'Valeur': stats.confirmed },
    { 'Métrique': 'Refusés', 'Valeur': stats.declined },
    { 'Métrique': 'En attente', 'Valeur': stats.pending },
    { 'Métrique': 'Taux de confirmation', 'Valeur': `${stats.confirmationRate}%` },
    { 'Métrique': 'Total personnes', 'Valeur': stats.totalPeople },
    { 'Métrique': 'Invitations envoyées', 'Valeur': stats.invitationsSent },
    { 'Métrique': 'Check-ins', 'Valeur': stats.checkedIn }
  ]

  const wsStats = XLSX.utils.json_to_sheet(statsData)
  
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, wsStats, 'Statistiques')

  XLSX.writeFile(workbook, `statistiques-${new Date().toISOString().split('T')[0]}.xlsx`)
}

/**
 * Génère un fichier de liste d'invités imprimable
 */
export function generatePrintableGuestList(guests: Guest[]): void {
  const confirmedGuests = guests.filter(g => g.attending === true)
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Liste des invités</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          background: #FCFAF7;
        }
        h1 {
          color: #B89F91;
          text-align: center;
          margin-bottom: 30px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
        }
        th {
          background: #C9A87C;
          color: white;
          padding: 12px;
          text-align: left;
        }
        td {
          padding: 10px;
          border-bottom: 1px solid #F5F2ED;
        }
        tr:hover {
          background: #F5F2ED;
        }
        .checkbox {
          width: 20px;
          height: 20px;
          border: 2px solid #B89F91;
          display: inline-block;
        }
        @media print {
          body { background: white; }
        }
      </style>
    </head>
    <body>
      <h1>📋 Liste des Invités Confirmés</h1>
      <p><strong>Total:</strong> ${confirmedGuests.length} invité(s) confirmé(s)</p>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
      <table>
        <thead>
          <tr>
            <th>Check-in</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>Accompagnants</th>
          </tr>
        </thead>
        <tbody>
          ${confirmedGuests.map(guest => `
            <tr>
              <td><span class="checkbox"></span></td>
              <td>${guest.name}</td>
              <td>${guest.email}</td>
              <td>${guest.phone || '-'}</td>
              <td>${guest.plus_ones || 0}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `

  const blob = new Blob([htmlContent], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const newWindow = window.open(url, '_blank')
  
  if (newWindow) {
    newWindow.onload = () => {
      setTimeout(() => {
        newWindow.print()
        URL.revokeObjectURL(url)
      }, 250)
    }
  }
}

/**
 * Télécharge un fichier
 */
function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
