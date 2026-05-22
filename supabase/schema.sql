-- ============================================================
-- SCHÉMA PORTFOLIO DREPL
-- À exécuter dans le SQL Editor de Supabase
-- ============================================================

-- Table admin (1 seule ligne autorisée)
CREATE TABLE IF NOT EXISTS admin_settings (
  id           INT         DEFAULT 1 PRIMARY KEY CHECK (id = 1),
  password_hash TEXT       NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
-- Pas de policy publique = seul le service role peut lire/écrire

CREATE TABLE IF NOT EXISTS projects (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  slug         TEXT        UNIQUE NOT NULL,
  title        TEXT        NOT NULL,
  short_description TEXT,
  problem      TEXT,
  solution     TEXT,
  results      TEXT,
  category     TEXT        NOT NULL CHECK (category IN ('IA', 'Big Data', 'Web/Mobile', 'IoT')),
  technologies TEXT[]      DEFAULT '{}',
  categorized_technologies JSONB DEFAULT '[]',
  image_url    TEXT        DEFAULT '/file.svg',
  logo_url     TEXT,
  github_url   TEXT,
  demo_url     TEXT,
  developed_at TEXT,
  screenshots  JSONB       DEFAULT '[]',
  is_private_repo BOOLEAN  DEFAULT false,
  display_order INTEGER    DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- RLS : lecture publique, écriture via service role uniquement
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON projects FOR SELECT USING (true);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- SEED : 8 projets existants
-- ============================================================
INSERT INTO projects (slug, title, short_description, problem, solution, results, category, technologies, categorized_technologies, image_url, github_url, is_private_repo, display_order) VALUES
(
  'detection-violences-domestiques',
  'Détection des Violences Domestiques',
  'Analyse de données sociales pour identifier les signaux de violences domestiques via NLP.',
  'Les réseaux sociaux regorgent de signaux faibles indiquant des situations de violences domestiques, mais l''absence d''outils analytiques automatisés empêche les organisations d''aide d''identifier ces détresses de manière proactive et d''intervenir à temps.',
  'Conception d''une architecture Big Data intégrant un pipeline ETL conteneurisé et un moteur de Traitement du Langage Naturel (NLP) propulsé par Apache Spark. Une API FastAPI fluide alimente un tableau de bord interactif, permettant une visualisation en temps réel des signaux d''alerte.',
  'Amélioration spectaculaire de 40% de la réactivité des interventions d''urgence. Le système fournit désormais des insights prédictifs et actionnables, transformant des données brutes en un outil décisionnel vital pour les associations et les services de secours.',
  'IA',
  ARRAY['Python', 'Spark', 'FastAPI', 'NLP', 'Docker'],
  '[{"category":"Data & Processing","skills":["Spark","NLP"]},{"category":"Backend","skills":["Python","FastAPI"]},{"category":"Infrastructure","skills":["Docker"]}]',
  '/file.svg',
  'https://github.com/DrEPL',
  false,
  1
),
(
  'systeme-rag-documents',
  'Système RAG Exploitation Documents',
  'Moteur de recherche intelligent et traitement de documents hétérogènes.',
  'Le capital intellectuel de l''entreprise est souvent noyé dans une masse de documents hétérogènes et non structurés. Les collaborateurs perdent un temps précieux à rechercher des informations critiques, ce qui freine la prise de décision et l''efficacité opérationnelle.',
  'Développement d''un moteur de recherche intelligent s''appuyant sur l''architecture Retrieval-Augmented Generation (RAG). En combinant la puissance de LangChain, l''indexation vectorielle via Qdrant et des LLMs avancés, le système permet d''interroger la base documentaire directement en langage naturel.',
  'Réduction drastique de 75% du temps consacré à la recherche documentaire. L''outil génère instantanément des synthèses précises et sourcées, décuplant la productivité des équipes métier et valorisant le patrimoine de données de l''entreprise.',
  'IA',
  ARRAY['LangChain', 'Qdrant', 'LLMs', 'Python', 'Vector DB'],
  '[{"category":"IA & Modeling","skills":["LangChain","LLMs"]},{"category":"Backend","skills":["Python"]},{"category":"Database","skills":["Qdrant","Vector DB"]}]',
  '/file.svg',
  'https://github.com/DrEPL',
  false,
  2
),
(
  'modele-traduction-fr-wo',
  'Modèle de Traduction FR-Wolof',
  'Entraînement et déploiement de modèle de traduction avec pipeline MLOps.',
  'La fracture linguistique numérique isole de nombreuses communautés au Sénégal. L''absence d''outils de traduction automatique fiables et contextualisés entre le français et le wolof limite considérablement l''accès à l''information et aux services numériques.',
  'Création de bout en bout d''un modèle d''intelligence artificielle de type Seq2Seq dédié à la traduction franco-wolof. L''infrastructure intègre une chaîne MLOps robuste utilisant MLflow pour le suivi des expérimentations, garantissant un entraînement itératif et un déploiement automatisé.',
  'Déploiement réussi d''une API de traduction à haute performance, affichant un score BLEU compétitif. Cette innovation technologique lève une barrière linguistique majeure, favorisant l''inclusion numérique et facilitant la communication interculturelle.',
  'IA',
  ARRAY['MLOps', 'MLflow', 'PyTorch', 'NLP', 'FastAPI'],
  '[{"category":"IA & Modeling","skills":["PyTorch","NLP"]},{"category":"MLOps & Infra","skills":["MLOps","MLflow"]},{"category":"Backend","skills":["FastAPI"]}]',
  '/file.svg',
  'https://github.com/DrEPL',
  false,
  3
),
(
  'datanexus-hub',
  'DATANEXUS HUB',
  'Plateforme centralisée et sécurisée pour l''analyse et la valorisation des données adaptées aux réalités locales.',
  'L''explosion des volumes de données dans des secteurs stratégiques représente une opportunité majeure, mais leur exploitation en Afrique reste entravée par l''absence d''infrastructures locales intégrées.',
  'Conçu au sein du DiCentre4AI, DataNexus Hub est une plateforme souveraine de centralisation et de traitement de données. La solution repose sur une architecture Big Data complète : Apache Kafka gère l''ingestion de flux en temps réel, tandis qu''Apache Spark assure le traitement analytique distribué.',
  'Unification sécurisée des sources de données locales, traitement des flux massifs en temps quasi-réel (latence < 2s), et mise à disposition d''un environnement d''analyse souverain et hautement scalable.',
  'Big Data',
  ARRAY['Kafka', 'Hadoop', 'Apache Spark', 'Python', 'Flask', 'WebSocket', 'Next.js', 'MongoDB', 'PostgreSQL', 'Docker', 'Nginx'],
  '[{"category":"Data & Processing","skills":["Kafka","Hadoop","Apache Spark"]},{"category":"Backend","skills":["Python","Flask","WebSocket"]},{"category":"Frontend","skills":["Next.js"]},{"category":"Database","skills":["MongoDB","PostgreSQL"]},{"category":"Infrastructure","skills":["Docker","Nginx"]}]',
  '/projects/datanexus_hub/landing_page.png',
  null,
  true,
  4
),
(
  'detection-intrusion-reseaux',
  'Détection d''Intrusion Réseaux',
  'Projet Machine Learning pour sécuriser les infrastructures réseaux.',
  'Face à la sophistication croissante des cyberattaques, les systèmes de sécurité traditionnels basés sur des signatures fixes sont devenus obsolètes.',
  'Implémentation d''un système de détection d''intrusion propulsé par l''Intelligence Artificielle. Le pipeline exploite des algorithmes de Machine Learning avancés (Random Forest, SVM) entraînés sur des flux de trafic réseau massifs.',
  'Atteinte d''un taux de détection (Recall) exceptionnel de 96%, couplé à une réduction drastique des faux positifs.',
  'IA',
  ARRAY['Scikit-learn', 'Pandas', 'Python', 'Jupyter'],
  '[{"category":"IA & Modeling","skills":["Scikit-learn"]},{"category":"Data & Processing","skills":["Pandas","Python","Jupyter"]}]',
  '/file.svg',
  'https://github.com/DrEPL',
  false,
  5
),
(
  'systeme-iot-ia-embarquee',
  'Système IoT avec IA Embarquée',
  'Déploiement de modèles légers sur des dispositifs de périphérie (Edge Computing).',
  'Les dispositifs IoT déployés dans des zones isolées ou critiques souffrent de limitations de bande passante et d''une dépendance stricte au Cloud.',
  'Conception d''une architecture Edge Computing intégrant des réseaux de neurones ultralégers. Grâce à des techniques avancées de quantification, des modèles TensorFlow Lite ont été optimisés et déployés directement sur des microcontrôleurs.',
  'Exécution d''inférences d''une fluidité remarquable (latence inférieure à 50ms) sans aucun recours au Cloud.',
  'IoT',
  ARRAY['TensorFlow Lite', 'C++', 'Edge Computing', 'IoT'],
  '[{"category":"IA & Modeling","skills":["TensorFlow Lite"]},{"category":"Edge & Devices","skills":["Edge Computing","IoT","C++"]}]',
  '/file.svg',
  'https://github.com/DrEPL',
  false,
  6
),
(
  'wapitaxi-yangoyo',
  'WapiTaxi & Yango''yo',
  'Application mobile de réservation de taxi en ligne.',
  'Dans les métropoles urbaines congolaises, le transport public souffre d''une désorganisation systémique.',
  'Développement full-stack d''un écosystème mobile de VTC. Le projet a englobé la conception UX/UI, le développement d''un Backend robuste de géolocalisation et la création de deux applications Frontend mobiles distinctes.',
  'Lancement d''une plateforme fluide et performante qui a révolutionné la prise en charge des passagers.',
  'Web/Mobile',
  ARRAY['Développement Mobile', 'UI/UX', 'Backend', 'Frontend'],
  '[{"category":"Frontend","skills":["Développement Mobile","Frontend","UI/UX"]},{"category":"Backend","skills":["Backend"]}]',
  '/file.svg',
  'https://github.com/DrEPL',
  false,
  7
),
(
  'syspace-dsi',
  'SYSPACE & DSI Task',
  'Migration logicielle et développement d''outils internes pour le Ministère des Finances.',
  'La Direction des Systèmes d''Information (DSI) du Ministère des Finances s''appuyait sur une infrastructure logicielle vieillissante en PHP natif.',
  'Refonte architecturale complète vers le framework moderne Laravel. Le projet a inclus la création d''un portail intranet collaboratif (SYSPACE), l''intégration d''un module de gestion agile (DSI Task).',
  'Modernisation réussie de l''écosystème numérique étatique. Le nouveau système a drastiquement réduit les frictions opérationnelles.',
  'Web/Mobile',
  ARRAY['PHP', 'Laravel', 'Développement Web', 'Refonte de site'],
  '[{"category":"Backend","skills":["PHP","Laravel"]},{"category":"Web","skills":["Développement Web","Refonte de site"]}]',
  '/file.svg',
  null,
  false,
  8
);
