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
  coupleName: 'Clément & Charlène',
  weddingLocation: 'Yaoundé, Cameroun',
  weddingDate: '2026-07-23T10:00:00',
  contactEmail: 'contact@cintoinfinity.com',
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
    madeWithCare: 'Fait avec amour pour célébrer notre union'
  },
  home: {
    subtitle: '#CIntoInfinity',
    cta: 'Confirmer ma présence',
    momentsTitle: 'Nos plus beaux instants',
    momentsSubtitle: 'Quelques images de notre histoire, en attendant de la célébrer avec vous',
    heroImageUrl: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=2560&q=80',
    storyTitle: 'Notre Histoire',
    storySubtitle: 'Une histoire de timing, de patience et de choix',
    storyCta: "Lire l'histoire complète",
    storyModalTitle: 'Notre histoire • #CIntoInfinity',
    storyParagraphs: [
      'Si on devait résumer notre histoire en une phrase, on dirait qu’elle a pris son temps. Beaucoup de temps.',
      'Tout commence en 2005. Cette année-là, nous emménageons dans le même quartier. Nous empruntons les mêmes rues, nous fréquentons les mêmes endroits, nous croisons probablement les mêmes voisins… et pourtant, nous ne nous croisons pas.',
      'Ce qui est encore plus ironique, c’est que Clément a été le camarade de classe de Babelle, la grande sœur de Charlène, de la 6e à la Terminale. Il n’était donc pas si loin. Mais visiblement, à l’époque, le destin avait décidé de faire durer le suspense.',
      'Clément était déjà une petite célébrité locale : il avait remporté le fameux “Master”, le concours de beauté du lycée. Oui, c’est une information vérifiée. Oui, il en est toujours très fier.',
      'Les années passent, chacun poursuit sa vie, et il faut attendre 2015 pour que nos chemins se croisent enfin. Pas dans la rue, ni à l’école, mais sur un groupe WhatsApp avec des amis en commun.',
      'À ce moment-là, Clément vit en Tunisie pour ses études supérieures. Charlène est au Cameroun. Nous sommes séparés par des kilomètres, des fuseaux horaires et des connexions internet parfois capricieuses.',
      'Nous commençons à discuter, d’abord dans le groupe, puis en privé. Nous devenons amis, nous nous taquinons beaucoup aussi, et notre complicité grandit naturellement.',
      'Puis arrive l’été 2016. Clément rentre au Cameroun pour les vacances. Lors d’une cérémonie chez les parents de Charlène, nous nous retrouvons enfin en face à face : la rencontre est simple, presque évidente.',
      'Après cela, la vie reprend son cours. Clément retourne en Tunisie. Charlène part en France pour ses études. Nous continuons à avancer chacun de notre côté, mais nous restons en contact. Toujours.',
      'En 2019, Clément s’installe en France, à Lille, tandis que Charlène vit à Nantes. En 2020, nous nous retrouvons à Paris pour une sortie entre amis, en pleine période Covid. C’est la première fois que nous nous revoyons depuis 2016.',
      'Il n’y a pas de grande déclaration : juste une évidence qui s’installe doucement. Plus tard, les sentiments deviennent impossibles à ignorer. Cette fois, nous ne voulons plus laisser le doute décider à notre place.',
      'Depuis ce moment-là, nous ne nous quittons plus. Notre histoire n’a jamais été une question de hasard, mais de timing. Et aujourd’hui, nous nous choisissons pour la vie.'
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
      title: 'Les débuts d’une évidence',
      caption: 'Des années de messages, de rires et de complicité avant de nous choisir.',
      alt: 'Moments de complicité',
      imageUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200&q=80'
    },
    {
      title: 'Nos retrouvailles',
      caption: 'Après les kilomètres et les années, Paris a été le point de bascule.',
      alt: 'Retrouvailles à Paris',
      imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=80'
    },
    {
      title: 'Main dans la main',
      caption: 'Un choix conscient, porté par l’amour et la confiance.',
      alt: 'Couple main dans la main',
      imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1200&q=80'
    },
    {
      title: 'Cap vers l’infini',
      caption: 'Aujourd’hui, nous célébrons notre histoire entourés des nôtres.',
      alt: 'Célébration du mariage',
      imageUrl: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200&q=80'
    }
  ]
}
