# 🎉 Site de Mariage Afrochic

Site web moderne pour votre mariage avec thème afrochic (marron, ivoire, doré).

## ✨ Fonctionnalités

### Partie Publique
- ✅ Page d'accueil avec compte à rebours
- ✅ Formulaire RSVP complet
- ✅ Page d'informations pratiques
- ✅ Galerie photos (à implémenter)
- ✅ Design responsive mobile-first
- ✅ Thème afrochic moderne

### Partie Admin
- ✅ Authentification sécurisée
- ✅ Dashboard avec statistiques
- ✅ Gestion des invités
- ✅ Validation/refus des confirmations
- ✅ Filtres et recherche

## 🛠️ Technologies

- **Framework:** Vue.js 3 + TypeScript
- **Build:** Vite
- **Routing:** Vue Router
- **Styling:** Tailwind CSS
- **Backend:** Supabase
- **Database:** PostgreSQL (via Supabase)
- **Auth:** Supabase Auth

## 🚀 Installation

### 1. Prérequis

- Node.js 18+ et npm
- Un compte Supabase (gratuit sur supabase.com)

### 2. Installation des dépendances

\`\`\`bash
npm install
\`\`\`

### 3. Configuration Supabase

1. Créez un projet sur [supabase.com](https://supabase.com)
2. Copiez l'URL et la clé anon de votre projet
3. Créez un fichier `.env.local` :

\`\`\`env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_anon_key
VITE_WEDDING_DATE=2026-08-15T14:00:00
VITE_WEDDING_LOCATION=Paris, France
VITE_COUPLE_NAMES=Marie & Jean
\`\`\`

### 4. Création des tables Supabase

Allez dans le SQL Editor de Supabase et exécutez :

\`\`\`sql
-- Table des invités
CREATE TABLE guests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom_complet TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  telephone TEXT,
  nombre_accompagnants INTEGER DEFAULT 0,
  presence_confirmee BOOLEAN,
  restrictions_alimentaires TEXT,
  message TEXT,
  qr_code TEXT UNIQUE NOT NULL,
  invitation_envoyee BOOLEAN DEFAULT FALSE,
  date_envoi_invitation TIMESTAMPTZ,
  qr_scanne BOOLEAN DEFAULT FALSE,
  date_scan TIMESTAMPTZ,
  statut TEXT DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'validé', 'refusé')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes pour performance
CREATE INDEX idx_guests_email ON guests(email);
CREATE INDEX idx_guests_qr_code ON guests(qr_code);
CREATE INDEX idx_guests_statut ON guests(statut);

-- Row Level Security
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Guests peuvent créer leur RSVP"
  ON guests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Lecture publique des stats"
  ON guests FOR SELECT
  USING (statut = 'validé');

CREATE POLICY "Admins peuvent tout faire"
  ON guests FOR ALL
  USING (auth.role() = 'authenticated');
\`\`\`

### 5. Créer un utilisateur admin

Dans Supabase Dashboard > Authentication > Users, créez un utilisateur avec :
- Email: admin@votremariage.com
- Mot de passe: (votre mot de passe sécurisé)

### 6. Lancer le projet

\`\`\`bash
# Mode développement
npm run dev

# Build pour production
npm run build

# Preview du build
npm run preview
\`\`\`

## 📁 Structure du Projet

\`\`\`
wedding-site/
├── src/
│   ├── components/         # Composants Vue
│   │   ├── common/        # Header, Footer, Loader
│   │   ├── home/          # CountdownTimer, HeroSection
│   │   └── rsvp/          # RsvpForm
│   ├── composables/        # Logique réutilisable
│   │   ├── useAuth.ts     # Authentification
│   │   └── useGuests.ts   # Gestion invités
│   ├── router/            # Configuration routing
│   ├── types/             # Types TypeScript
│   ├── utils/             # Utilitaires
│   ├── views/             # Pages
│   │   ├── HomePage.vue
│   │   ├── RsvpPage.vue
│   │   ├── InfoPage.vue
│   │   ├── GalleryPage.vue
│   │   └── admin/
│   └── assets/            # CSS, images
├── public/                # Fichiers statiques
└── package.json
\`\`\`

## 🎨 Personnalisation

### Couleurs du thème

Modifiez dans `tailwind.config.js` :

\`\`\`javascript
colors: {
  'marron': {
    DEFAULT: '#8B4513',
    light: '#A0826D',
    dark: '#654321',
  },
  'ivoire': {
    DEFAULT: '#FFFFF0',
    dark: '#F5F5DC',
  },
  'dore': {
    DEFAULT: '#FFD700',
    light: '#FFEC8B',
    dark: '#B8860B',
  },
}
\`\`\`

### Informations du mariage

Modifiez dans `.env.local` :

\`\`\`env
VITE_WEDDING_DATE=2026-08-15T14:00:00
VITE_WEDDING_LOCATION=Paris, France
VITE_COUPLE_NAMES=Marie & Jean
\`\`\`

## 📝 TODO / Améliorations futures

- [ ] Implémenter la galerie photos avec lightbox
- [ ] Ajouter le système de génération QR code
- [ ] Créer les templates PDF d'invitation
- [ ] Système d'envoi d'emails
- [ ] Scanner QR code pour l'entrée
- [ ] Export des données (CSV/Excel)
- [ ] Statistiques avancées
- [ ] Multi-langue (FR/EN)

## 🚀 Déploiement

### Vercel (Recommandé)

1. Connectez votre repo GitHub
2. Importez le projet sur Vercel
3. Ajoutez les variables d'environnement
4. Déployez !

### Netlify

1. Connectez votre repo GitHub
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Ajoutez les variables d'environnement

## 📧 Support

Pour toute question, contactez-nous à : contact@votremariage.com

## 📄 Licence

Ce projet est privé et destiné à un usage personnel pour votre mariage.

---

**Fait avec ❤️ pour célébrer votre union ! 💍**
