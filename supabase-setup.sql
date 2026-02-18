-- ===============================================
-- SCRIPT SQL POUR SUPABASE
-- Site de Mariage Afrochic
-- ===============================================

-- Table des invités
CREATE TABLE IF NOT EXISTS guests (
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

-- Table des photos (pour galerie future)
CREATE TABLE IF NOT EXISTS photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  titre TEXT,
  description TEXT,
  categorie TEXT,
  ordre_affichage INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===============================================
-- INDEXES POUR PERFORMANCE
-- ===============================================

CREATE INDEX IF NOT EXISTS idx_guests_email ON guests(email);
CREATE INDEX IF NOT EXISTS idx_guests_qr_code ON guests(qr_code);
CREATE INDEX IF NOT EXISTS idx_guests_statut ON guests(statut);
CREATE INDEX IF NOT EXISTS idx_guests_created_at ON guests(created_at);
CREATE INDEX IF NOT EXISTS idx_photos_categorie ON photos(categorie);

-- ===============================================
-- ROW LEVEL SECURITY (RLS)
-- ===============================================

-- Activer RLS
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Policy: Les invités peuvent créer leur RSVP
CREATE POLICY "Guests peuvent créer leur RSVP"
  ON guests FOR INSERT
  WITH CHECK (true);

-- Policy: Lecture publique des invités validés (pour stats)
CREATE POLICY "Lecture publique des guests validés"
  ON guests FOR SELECT
  USING (statut = 'validé');

-- Policy: Les admins authentifiés peuvent tout faire sur guests
CREATE POLICY "Admins peuvent tout faire sur guests"
  ON guests FOR ALL
  USING (auth.role() = 'authenticated');

-- Policy: Lecture publique des photos
CREATE POLICY "Photos publiquement accessibles"
  ON photos FOR SELECT
  USING (true);

-- Policy: Les admins peuvent gérer les photos
CREATE POLICY "Admins peuvent gérer photos"
  ON photos FOR ALL
  USING (auth.role() = 'authenticated');

-- ===============================================
-- FONCTION POUR METTRE À JOUR updated_at
-- ===============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour guests
CREATE TRIGGER update_guests_updated_at
    BEFORE UPDATE ON guests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ===============================================
-- VUE POUR STATISTIQUES
-- ===============================================

CREATE OR REPLACE VIEW guest_stats AS
SELECT
  COUNT(*) as total_invites,
  COUNT(*) FILTER (WHERE presence_confirmee = true AND statut = 'validé') as confirmations_oui,
  COUNT(*) FILTER (WHERE presence_confirmee = false) as confirmations_non,
  COUNT(*) FILTER (WHERE statut = 'en_attente') as en_attente,
  COUNT(*) FILTER (WHERE statut = 'validé') as valides,
  COUNT(*) FILTER (WHERE statut = 'refusé') as refuses,
  COALESCE(SUM(nombre_accompagnants) FILTER (WHERE presence_confirmee = true AND statut = 'validé'), 0) as total_accompagnants,
  COUNT(*) FILTER (WHERE qr_scanne = true) as qr_scannes,
  COUNT(*) FILTER (WHERE invitation_envoyee = true) as invitations_envoyees
FROM guests;

-- ===============================================
-- DONNÉES D'EXEMPLE (OPTIONNEL)
-- ===============================================

-- Décommentez pour insérer des données de test
/*
INSERT INTO guests (nom_complet, email, telephone, nombre_accompagnants, presence_confirmee, qr_code, statut)
VALUES
  ('Jean Dupont', 'jean.dupont@example.com', '+33 6 12 34 56 78', 2, true, 'WED-TEST-001', 'validé'),
  ('Marie Martin', 'marie.martin@example.com', '+33 6 98 76 54 32', 0, true, 'WED-TEST-002', 'en_attente'),
  ('Pierre Durand', 'pierre.durand@example.com', '+33 6 11 22 33 44', 1, false, 'WED-TEST-003', 'validé');
*/

-- ===============================================
-- CONFIGURATION STORAGE (Pour les photos)
-- ===============================================

-- Créer un bucket pour les photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('wedding-photos', 'wedding-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Policy pour le bucket photos
CREATE POLICY "Photos publiquement accessibles storage"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'wedding-photos');

CREATE POLICY "Admins peuvent uploader des photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'wedding-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Admins peuvent supprimer des photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'wedding-photos' AND auth.role() = 'authenticated');

-- ===============================================
-- NOTES D'UTILISATION
-- ===============================================

/*
APRÈS AVOIR EXÉCUTÉ CE SCRIPT:

1. Créer un utilisateur admin dans Authentication > Users
   - Email: admin@votremariage.com
   - Password: (votre mot de passe sécurisé)

2. Tester l'insertion d'un RSVP (depuis l'app)

3. Vérifier les permissions dans le dashboard admin

4. Configurer l'envoi d'emails (via Supabase ou service externe)

5. Pour voir les stats:
   SELECT * FROM guest_stats;
*/
