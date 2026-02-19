export interface CarouselItemConfig {
  title: string
  caption: string
  alt: string
  imageUrl: string
}

export interface SiteContentConfig {
  coupleName: string
  weddingLocation: string
  weddingDate: string
  contactEmail: string
  nav: {
    home: string
    gallery: string
    rsvp: string
    adminLogin: string
  }
  footer: {
    navigationTitle: string
    contactTitle: string
    questions: string
    rights: string
    madeWithCare: string
  }
  home: {
    subtitle: string
    cta: string
    momentsTitle: string
    momentsSubtitle: string
    heroImageUrl: string
    storyTitle: string
    storySubtitle: string
    storyCta: string
    storyModalTitle: string
    storyParagraphs: string[]
  }
  galleryPage: {
    title: string
    subtitle: string
  }
  rsvpPage: {
    title: string
    subtitle: string
  }
  carousel: CarouselItemConfig[]
}

export const DEFAULT_SITE_CONTENT: SiteContentConfig = {
  coupleName: 'Marie & Jean',
  weddingLocation: 'Paris, France',
  weddingDate: '2025-08-15T14:00:00',
  contactEmail: 'contact@votremariage.com',
  nav: {
    home: 'Accueil',
    gallery: 'Galerie',
    rsvp: 'RSVP',
    adminLogin: 'Connexion'
  },
  footer: {
    navigationTitle: 'Navigation',
    contactTitle: 'Contact',
    questions: 'Pour toute question :',
    rights: 'Tous droits réservés',
    madeWithCare: 'Fait avec soin pour célébrer notre union'
  },
  home: {
    subtitle: 'Un chapitre secret qui devient promesse éternelle',
    cta: 'Entrer dans notre histoire',
    momentsTitle: "Fragments d'une Histoire Extraordinaire",
    momentsSubtitle: 'Des instants volés, des confidences et des souvenirs qui dessinent notre aventure',
    heroImageUrl: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=2560&q=80',
    storyTitle: 'Notre Histoire',
    storySubtitle: 'Un récit entre hasard, héritage, passion et promesse',
    storyCta: 'Découvrir le chapitre caché',
    storyModalTitle: 'Notre Histoire • Version Intégrale',
    storyParagraphs: [
      'Tout a commencé par une énigme : un ticket oublié sur une table, un prénom griffonné au dos, et cette intuition inexplicable que nos chemins venaient de se reconnaître.',
      'De café en promenade nocturne, nos conversations sont devenues des refuges. Nous avons appris à rire de tout, à débattre de rien et à nous comprendre dans les silences.',
      'Très vite, nos familles, nos cultures et nos habitudes se sont entremêlées. Chaque rencontre a construit un pont entre nos univers, avec la certitude que nos différences seraient notre plus grande richesse.',
      'Nous avons traversé des saisons intenses : les grands projets, les doutes discrets, les victoires improvisées. À chaque étape, nous avons choisi la tendresse plutôt que la peur.'
    ]
  },
  galleryPage: {
    title: 'Galerie Photos',
    subtitle: 'Revivez nos plus beaux moments à travers ces images'
  },
  rsvpPage: {
    title: 'Confirmez votre présence',
    subtitle: 'Nous serions ravis de vous compter parmi nous'
  },
  carousel: [
    {
      title: 'Le Signe du Destin',
      caption: 'Paris, Festival Afrobeat — un regard, un sourire, et tout a basculé',
      alt: 'Notre rencontre',
      imageUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200&q=80'
    },
    {
      title: 'Retour aux Racines',
      caption: 'Un périple initiatique entre traditions, rires et promesses',
      alt: 'Notre voyage',
      imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=80'
    },
    {
      title: 'Le Oui sous les Étoiles',
      caption: 'Marrakech — un coucher de soleil, une bague, un serment murmuré',
      alt: 'La demande',
      imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1200&q=80'
    },
    {
      title: 'Le Cercle des Nôtres',
      caption: 'Entre émotions et éclats de joie, nos familles unies pour la suite',
      alt: 'Nos fiançailles',
      imageUrl: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200&q=80'
    }
  ]
}
