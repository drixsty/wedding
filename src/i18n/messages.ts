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
      rsvp: 'RSVP',
      adminLogin: 'Connexion'
    },
    footer: {
      navigation: 'Navigation',
      contact: 'Contact',
      questions: 'Pour toute question :',
      rights: 'Tous droits réservés',
      madeWithCare: 'Fait avec soin pour célébrer notre union'
    },
    home: {
      subtitle: 'Un chapitre secret qui devient promesse éternelle',
      cta: 'Entrer dans notre histoire',
      momentsTitle: 'Fragments d\'une Histoire Extraordinaire',
      momentsSubtitle: 'Des instants volés, des confidences et des souvenirs qui dessinent notre aventure',
      carousel: {
        1: {
          alt: 'Notre rencontre',
          title: 'Le Signe du Destin',
          caption: 'Paris, Festival Afrobeat — un regard, un sourire, et tout a basculé'
        },
        2: {
          alt: 'Notre voyage',
          title: 'Retour aux Racines',
          caption: 'Un périple initiatique entre traditions, rires et promesses'
        },
        3: {
          alt: 'La demande',
          title: 'Le Oui sous les Étoiles',
          caption: 'Marrakech — un coucher de soleil, une bague, un serment murmuré'
        },
        4: {
          alt: 'Nos fiançailles',
          title: 'Le Cercle des Nôtres',
          caption: 'Entre émotions et éclats de joie, nos familles unies pour la suite'
        }
      }
    },
    galleryPage: {
      title: 'Galerie Photos',
      subtitle: 'Revivez nos plus beaux moments à travers ces images'
    },
    gallery: {
      categories: {
        all: 'Tous',
        couple: 'Couple',
        family: 'Famille',
        friends: 'Amis',
        ceremony: 'Cérémonie',
        reception: 'Réception'
      },
      empty: 'Aucune photo disponible pour cette catégorie.',
      uploadTitle: 'Partagez vos photos',
      uploadSubtitle: 'Envoyez vos souvenirs du mariage. Ils seront publiés après validation.',
      form: {
        title: 'Titre',
        titlePlaceholder: 'Ex: Danse des mariés',
        description: 'Description',
        descriptionPlaceholder: 'Ajoutez un petit mot sur ce moment...',
        category: 'Catégorie',
        file: 'Image',
        fileRequired: 'Merci de sélectionner au moins une image avant l’envoi.',
        selectedFiles: '{count} image(s) sélectionnée(s)',
        submit: 'Envoyer mes photos',
        uploading: 'Envoi en cours...',
        pendingHint: 'Chaque photo est vérifiée par les mariés avant publication.',
        success: 'Merci ❤️ {count} photo(s) envoyée(s), en attente de validation.',
        error: 'Impossible d’envoyer la photo : {error}'
      },
      photos: {
        1: { title: 'Notre Rencontre', description: 'Le jour où tout a commencé' },
        2: { title: 'Voyage en Afrique', description: 'Safari inoubliable au Kenya' },
        3: { title: 'Famille Réunie', description: 'Nos deux familles ensemble' },
        4: { title: 'Soirée entre Amis', description: 'Célébration avec nos proches' },
        5: { title: 'La Demande', description: 'Moment magique à Marrakech' },
        6: { title: 'Fiançailles', description: 'Entourés de nos familles' }
      }
    },
    rsvpPage: {
      title: 'Confirmez votre présence',
      subtitle: 'Nous serions ravis de vous compter parmi nous'
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
        email: 'Email',
        emailPlaceholder: 'admin@exemple.com',
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
        yes: '✅ Oui',
        no: '❌ Non',
        search: 'Recherche',
        all: 'Tous',
        validated: 'Validé',
        refused: 'Refusé',
        statuses: {
          en_attente: 'En attente',
          validé: 'Validé',
          refusé: 'Refusé'
        },
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
        themeTitle: 'Personnalisation des couleurs',
        themeDescription: 'La palette est centralisée et persistée en base (table site_theme).',
        resetTheme: 'Réinitialiser',
        themeSave: 'Sauvegarder la palette',
        themeSaving: 'Enregistrement...',
        themeSaveSuccess: 'Palette enregistrée avec succès.',
        themeSaveError: 'Impossible d’enregistrer le thème : {error}',
        generatePalette: 'Générer depuis la couleur principale',
        primarySeedColor: 'Couleur principale',
        primarySeedHint: 'Choisissez une couleur maître, puis générez automatiquement les tons secondaires et accents.',
        contrastPreview: 'Aperçu contraste',
        contrastHint: 'Le texte est choisi automatiquement (noir/blanc) pour conserver une bonne lisibilité.',
        themeGenerated: 'Palette générée automatiquement. Vérifiez et ajustez si nécessaire.',
        themeColorLabels: {
          marron: 'Marron principal',
          marronLight: 'Marron clair',
          marronDark: 'Marron foncé',
          ivoire: 'Ivoire',
          ivoireDark: 'Ivoire foncé',
          dore: 'Doré principal',
          doreLight: 'Doré clair',
          doreDark: 'Doré foncé',
          sage: 'Accent Sage',
          mauve: 'Accent Mauve',
          clay: 'Accent Clay',
          slate: 'Accent Slate',
          cream: 'Accent Cream',
          mist: 'Accent Mist'
        },
        galleryTitle: 'Gestion de la galerie',
        galleryDescription: 'Modérez les photos ajoutées par les visiteurs et affichez/masquez-les.',
        refreshGallery: 'Actualiser les photos',
        galleryEmpty: 'Aucune photo dans la galerie pour le moment.',
        adminUploadTitle: 'Titre',
        adminUploadTitlePlaceholder: 'Ex: Entrée des mariés',
        adminUploadCategory: 'Catégorie',
        adminUploadDescription: 'Description',
        adminUploadDescriptionPlaceholder: 'Ajoutez un contexte pour ces photos...',
        adminUploadImages: 'Images',
        adminUploadSelected: '{count} image(s) prête(s) à être envoyée(s)',
        adminUploadSubmit: 'Ajouter les photos',
        adminUploadInProgress: 'Ajout en cours...',
        adminUploadFileRequired: 'Sélectionnez au moins une image.',
        adminUploadSuccess: '{count} photo(s) ajoutée(s) à la galerie.',
        adminUploadError: 'Impossible d’ajouter les photos : {error}',
        selectPhoto: 'Sélectionner',
        bulkPublishPhotos: 'Publier la sélection',
        bulkHidePhotos: 'Masquer la sélection',
        bulkDeletePhotos: 'Supprimer la sélection',
        selectedPhotosCount: '{count} photo(s) sélectionnée(s)',
        bulkPhotosUpdated: '{count} photo(s) mise(s) à jour.',
        bulkPhotosDeleted: '{count} photo(s) supprimée(s).',
        noTitle: 'Photo sans titre',
        guestUpload: 'Visiteur',
        coupleUpload: 'Couple',
        hidePhoto: 'Masquer',
        showPhoto: 'Publier',
        deletePhoto: 'Supprimer',
        confirmDeletePhoto: 'Supprimer cette photo de la galerie ?',
        confirmDeletePhotos: 'Supprimer {count} photo(s) de la galerie ?',
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
      subtitle: 'Les réponses à toutes vos questions pour vivre cette célébration pleinement'
    }
  }
} as const

export type Locale = keyof typeof messages
