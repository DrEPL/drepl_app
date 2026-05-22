#!/usr/bin/env node
/**
 * Script de migration Supabase
 *
 * Prérequis :
 *   1. Créer un Access Token sur https://supabase.com/dashboard/account/tokens
 *   2. L'ajouter dans .env.local : SUPABASE_ACCESS_TOKEN=sbp_xxxxx
 *   3. Lancer : node scripts/migrate.js
 */

const fs = require('fs');
const path = require('path');

// ── Lire .env.local ─────────────────────────────────────────
const envPath = path.join(__dirname, '..', '.env.local');
const vars = {};
fs.readFileSync(envPath, 'utf8').split('\n').forEach(l => {
  const m = l.match(/^([^#=\s]+)=(.*)$/);
  if (!m) return;
  let v = m[2].trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
  vars[m[1]] = v;
});

const SUPABASE_URL  = vars['NEXT_PUBLIC_SUPABASE_URL'];
const ACCESS_TOKEN  = vars['SUPABASE_ACCESS_TOKEN'];

if (!SUPABASE_URL) { console.error('❌  NEXT_PUBLIC_SUPABASE_URL manquant dans .env.local'); process.exit(1); }
if (!ACCESS_TOKEN) {
  console.error('❌  SUPABASE_ACCESS_TOKEN manquant dans .env.local');
  console.error('');
  console.error('   Obtenir le token :');
  console.error('   1. https://supabase.com/dashboard/account/tokens');
  console.error('   2. "Generate new token"');
  console.error('   3. Ajouter dans .env.local :');
  console.error('      SUPABASE_ACCESS_TOKEN=sbp_xxxxx');
  process.exit(1);
}

const PROJECT_REF = SUPABASE_URL.match(/https:\/\/([^.]+)\./)?.[1];
if (!PROJECT_REF) { console.error('❌  Impossible d\'extraire le project ref depuis', SUPABASE_URL); process.exit(1); }

console.log(`\n🚀  Migration → projet ${PROJECT_REF}\n`);

// ── Exécuter une requête SQL ─────────────────────────────────
async function sql(label, query) {
  process.stdout.write(`   ${label}... `);
  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });
  const data = await res.json();
  if (!res.ok) {
    console.log('❌');
    console.error('   Erreur:', JSON.stringify(data));
    throw new Error(label + ' failed');
  }
  console.log('✅');
  return data;
}

// ── Migrations ───────────────────────────────────────────────
async function main() {
  // 1. Table projects
  await sql('Table projects', `
    CREATE TABLE IF NOT EXISTS projects (
      id                       UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
      slug                     TEXT        UNIQUE NOT NULL,
      title                    TEXT        NOT NULL,
      short_description        TEXT,
      problem                  TEXT,
      solution                 TEXT,
      results                  TEXT,
      category                 TEXT        NOT NULL CHECK (category IN ('IA', 'Big Data', 'Web/Mobile', 'IoT')),
      technologies             TEXT[]      DEFAULT '{}',
      categorized_technologies JSONB       DEFAULT '[]',
      image_url                TEXT        DEFAULT '/file.svg',
      logo_url                 TEXT,
      github_url               TEXT,
      demo_url                 TEXT,
      developed_at             TEXT,
      screenshots              JSONB       DEFAULT '[]',
      is_private_repo          BOOLEAN     DEFAULT false,
      display_order            INTEGER     DEFAULT 0,
      created_at               TIMESTAMPTZ DEFAULT NOW(),
      updated_at               TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  // 2. RLS projects
  await sql('RLS projects', `
    ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='projects' AND policyname='Public read') THEN
        CREATE POLICY "Public read" ON projects FOR SELECT USING (true);
      END IF;
    END $$
  `);

  // 3. Trigger updated_at
  await sql('Trigger updated_at', `
    CREATE OR REPLACE FUNCTION update_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
    $$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS set_updated_at ON projects;
    CREATE TRIGGER set_updated_at
      BEFORE UPDATE ON projects
      FOR EACH ROW EXECUTE FUNCTION update_updated_at()
  `);

  // 4. Table admin_settings
  await sql('Table admin_settings', `
    CREATE TABLE IF NOT EXISTS admin_settings (
      id            INT         DEFAULT 1 PRIMARY KEY CHECK (id = 1),
      password_hash TEXT        NOT NULL,
      created_at    TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY
  `);

  // 5. Vérifier si des projets existent déjà
  const existing = await sql('Vérification projets existants', `SELECT count(*)::int AS n FROM projects`);
  const count = existing[0]?.n ?? 0;

  if (count > 0) {
    console.log(`\n   ℹ️  ${count} projets déjà en base. Seed ignoré.\n`);
  } else {
    // 6. Seed — 8 projets
    await sql('Seed projets (8)', `
      INSERT INTO projects (slug, title, short_description, problem, solution, results, category, technologies, categorized_technologies, image_url, github_url, is_private_repo, display_order) VALUES
      (
        'detection-violences-domestiques',
        'Détection des Violences Domestiques',
        'Analyse de données sociales pour identifier les signaux de violences domestiques via NLP.',
        'Les réseaux sociaux regorgent de signaux faibles indiquant des situations de violences domestiques, mais l''absence d''outils analytiques automatisés empêche les organisations d''aide d''identifier ces détresses de manière proactive et d''intervenir à temps.',
        'Conception d''une architecture Big Data intégrant un pipeline ETL conteneurisé et un moteur de Traitement du Langage Naturel (NLP) propulsé par Apache Spark.',
        'Amélioration spectaculaire de 40% de la réactivité des interventions d''urgence.',
        'IA', ARRAY['Python','Spark','FastAPI','NLP','Docker'],
        '[{"category":"Data & Processing","skills":["Spark","NLP"]},{"category":"Backend","skills":["Python","FastAPI"]},{"category":"Infrastructure","skills":["Docker"]}]',
        '/file.svg', 'https://github.com/DrEPL', false, 1
      ),
      (
        'systeme-rag-documents',
        'Système RAG Exploitation Documents',
        'Moteur de recherche intelligent et traitement de documents hétérogènes.',
        'Le capital intellectuel de l''entreprise est souvent noyé dans une masse de documents hétérogènes et non structurés.',
        'Développement d''un moteur de recherche intelligent s''appuyant sur l''architecture Retrieval-Augmented Generation (RAG).',
        'Réduction drastique de 75% du temps consacré à la recherche documentaire.',
        'IA', ARRAY['LangChain','Qdrant','LLMs','Python','Vector DB'],
        '[{"category":"IA & Modeling","skills":["LangChain","LLMs"]},{"category":"Backend","skills":["Python"]},{"category":"Database","skills":["Qdrant","Vector DB"]}]',
        '/file.svg', 'https://github.com/DrEPL', false, 2
      ),
      (
        'modele-traduction-fr-wo',
        'Modèle de Traduction FR-Wolof',
        'Entraînement et déploiement de modèle de traduction avec pipeline MLOps.',
        'La fracture linguistique numérique isole de nombreuses communautés au Sénégal.',
        'Création de bout en bout d''un modèle d''intelligence artificielle de type Seq2Seq dédié à la traduction franco-wolof.',
        'Déploiement réussi d''une API de traduction à haute performance, affichant un score BLEU compétitif.',
        'IA', ARRAY['MLOps','MLflow','PyTorch','NLP','FastAPI'],
        '[{"category":"IA & Modeling","skills":["PyTorch","NLP"]},{"category":"MLOps & Infra","skills":["MLOps","MLflow"]},{"category":"Backend","skills":["FastAPI"]}]',
        '/file.svg', 'https://github.com/DrEPL', false, 3
      ),
      (
        'datanexus-hub',
        'DATANEXUS HUB',
        'Plateforme centralisée et sécurisée pour l''analyse et la valorisation des données adaptées aux réalités locales.',
        'L''explosion des volumes de données dans des secteurs stratégiques représente une opportunité majeure, mais leur exploitation en Afrique reste entravée par l''absence d''infrastructures locales intégrées.',
        'Conçu au sein du DiCentre4AI, DataNexus Hub est une plateforme souveraine de centralisation et de traitement de données.',
        'Unification sécurisée des sources de données locales, traitement des flux massifs en temps quasi-réel (latence < 2s).',
        'Big Data', ARRAY['Kafka','Hadoop','Apache Spark','Python','Flask','WebSocket','Next.js','MongoDB','PostgreSQL','Docker','Nginx'],
        '[{"category":"Data & Processing","skills":["Kafka","Hadoop","Apache Spark"]},{"category":"Backend","skills":["Python","Flask","WebSocket"]},{"category":"Frontend","skills":["Next.js"]},{"category":"Database","skills":["MongoDB","PostgreSQL"]},{"category":"Infrastructure","skills":["Docker","Nginx"]}]',
        '/projects/datanexus_hub/landing_page.png', null, true, 4
      ),
      (
        'detection-intrusion-reseaux',
        'Détection d''Intrusion Réseaux',
        'Projet Machine Learning pour sécuriser les infrastructures réseaux.',
        'Face à la sophistication croissante des cyberattaques, les systèmes de sécurité traditionnels basés sur des signatures fixes sont devenus obsolètes.',
        'Implémentation d''un système de détection d''intrusion propulsé par l''Intelligence Artificielle.',
        'Atteinte d''un taux de détection (Recall) exceptionnel de 96%, couplé à une réduction drastique des faux positifs.',
        'IA', ARRAY['Scikit-learn','Pandas','Python','Jupyter'],
        '[{"category":"IA & Modeling","skills":["Scikit-learn"]},{"category":"Data & Processing","skills":["Pandas","Python","Jupyter"]}]',
        '/file.svg', 'https://github.com/DrEPL', false, 5
      ),
      (
        'systeme-iot-ia-embarquee',
        'Système IoT avec IA Embarquée',
        'Déploiement de modèles légers sur des dispositifs de périphérie (Edge Computing).',
        'Les dispositifs IoT déployés dans des zones isolées ou critiques souffrent de limitations de bande passante et d''une dépendance stricte au Cloud.',
        'Conception d''une architecture Edge Computing intégrant des réseaux de neurones ultralégers.',
        'Exécution d''inférences d''une fluidité remarquable (latence inférieure à 50ms) sans aucun recours au Cloud.',
        'IoT', ARRAY['TensorFlow Lite','C++','Edge Computing','IoT'],
        '[{"category":"IA & Modeling","skills":["TensorFlow Lite"]},{"category":"Edge & Devices","skills":["Edge Computing","IoT","C++"]}]',
        '/file.svg', 'https://github.com/DrEPL', false, 6
      ),
      (
        'wapitaxi-yangoyo',
        'WapiTaxi & Yango''yo',
        'Application mobile de réservation de taxi en ligne.',
        'Dans les métropoles urbaines congolaises, le transport public souffre d''une désorganisation systémique.',
        'Développement full-stack d''un écosystème mobile de VTC.',
        'Lancement d''une plateforme fluide et performante qui a révolutionné la prise en charge des passagers.',
        'Web/Mobile', ARRAY['Développement Mobile','UI/UX','Backend','Frontend'],
        '[{"category":"Frontend","skills":["Développement Mobile","Frontend","UI/UX"]},{"category":"Backend","skills":["Backend"]}]',
        '/file.svg', 'https://github.com/DrEPL', false, 7
      ),
      (
        'syspace-dsi',
        'SYSPACE & DSI Task',
        'Migration logicielle et développement d''outils internes pour le Ministère des Finances.',
        'La Direction des Systèmes d''Information (DSI) du Ministère des Finances s''appuyait sur une infrastructure logicielle vieillissante en PHP natif.',
        'Refonte architecturale complète vers le framework moderne Laravel.',
        'Modernisation réussie de l''écosystème numérique étatique.',
        'Web/Mobile', ARRAY['PHP','Laravel','Développement Web','Refonte de site'],
        '[{"category":"Backend","skills":["PHP","Laravel"]},{"category":"Web","skills":["Développement Web","Refonte de site"]}]',
        '/file.svg', null, false, 8
      )
    `);
  }

  console.log('\n✅  Migrations terminées avec succès !\n');
}

main().catch(err => {
  console.error('\n❌  Migration échouée :', err.message);
  process.exit(1);
});
