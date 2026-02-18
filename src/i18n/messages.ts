export const messages = {
  fr: {
    defaults: {
      coupleName: 'Marie & Jean',
      weddingLocation: 'Paris, France',
      weddingDate: '2025-08-15T14:00:00'
    },
    nav: {
      home: 'Accueil',
      gallery: 'Galerie',
      rsvp: 'RSVP'
    },
    footer: {
      navigation: 'Navigation',
      contact: 'Contact',
      questions: 'Pour toute question :',
      rights: 'Tous droits réservés',
      madeWithCare: 'Fait avec soin pour célébrer notre union'
    },
    home: {
      subtitle: 'Ensemble pour la vie',
      cta: 'Confirmer votre présence',
      momentsTitle: 'Nos Plus Beaux Moments',
      momentsSubtitle: "Une histoire d'amour en images"
    },
    rsvp: {
      title: 'Confirmez votre présence',
      deadlinePrefix: 'Merci de répondre avant le',
      fullName: 'Nom complet',
      fullNamePlaceholder: 'Votre nom complet',
      phone: 'Téléphone',
      emailPlaceholder: 'votre@email.com',
      presenceQuestion: 'Serez-vous présent(e) ?',
      yes: 'Oui, avec plaisir',
      no: 'Non, malheureusement',
      plusOnes: "Nombre d'accompagnants",
      plusOnesHint: 'Ne vous comptez pas',
      foodRestrictions: 'Restrictions alimentaires',
      foodRestrictionsPlaceholder: 'Allergies, préférences...',
      messageForCouple: 'Message pour les mariés',
      messagePlaceholder: 'Un mot doux...',
      success: 'Merci ❤️ Votre confirmation a été enregistrée.',
      submitLoading: 'Envoi en cours...',
      submit: 'Confirmer ma présence',
      required: '* Champs obligatoires'
    },
    admin: {
      login: {
        title: 'Administration',
        subtitle: 'Accès réservé à l’espace privé',
        password: 'Mot de passe',
        loginError: 'Erreur de connexion',
        loading: 'Connexion...',
        submit: 'Se connecter',
        back: '← Retour au site'
      },
      dashboard: {
        title: 'Tableau de bord',
        viewSite: 'Voir le site',
        logout: 'Déconnexion',
        yesConfirmations: 'Confirmations OUI',
        noConfirmations: 'Confirmations NON',
        pending: 'En attente',
        totalGuests: 'Total invités',
        plusOnes: 'accompagnants',
        status: 'Statut',
        attendance: 'Présence',
        search: 'Recherche',
        all: 'Tous',
        validated: 'Validé',
        refused: 'Refusé',
        searchPlaceholder: 'Nom ou email...',
        searchAction: '🔍 Rechercher',
        bulkValidate: '✅ Valider',
        bulkRefuse: '❌ Refuser',
        bulkDelete: '🗑️ Supprimer',
        selectedCount: '{count} sélectionné(s)',
        noneFound: 'Aucun invité trouvé',
        name: 'Nom',
        email: 'Email',
        attendants: 'Accompagnants',
        actions: 'Actions',
        confirmDeleteGuest: 'Supprimer cet invité ?',
        confirmDeleteGuests: 'Supprimer {count} invités ?'
      },
      scanner: {
        title: "📱 Scanner d'Entrée",
        ready: 'Prêt à scanner',
        instruction: 'Placez le QR code devant la caméra',
        verified: '✅ Invité vérifié !',
        guestName: 'Nom:',
        validateEntry: "✓ Valider l'entrée",
        cancel: 'Annuler',
        scanned: 'Scannés',
        validated: 'Validés',
        remaining: 'Restants',
        cameraError: "Impossible d'accéder à la caméra",
        invalidQr: 'QR code invalide',
        validationError: 'Erreur lors de la validation'
      }
    },
    faq: {
      title: 'Questions Fréquentes',
      subtitle: 'Tout ce que vous devez savoir'
    }
  }
} as const

export type Locale = keyof typeof messages
