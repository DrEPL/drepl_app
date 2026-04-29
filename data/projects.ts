export interface Project {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  problem: string;
  solution: string;
  results: string;
  category: 'IA' | 'Big Data' | 'Web/Mobile' | 'IoT';
  technologies: string[];
  imageUrl: string;
  logoUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  developedAt?: string;
  screenshots?: { url: string; title: string; description: string }[];
  categorizedTechnologies?: { category: string; skills: string[] }[];
  isPrivateRepo?: boolean;
}

export const projects: Project[] = [
  {
    id: '1',
    slug: 'detection-violences-domestiques',
    title: 'Détection des Violences Domestiques',
    shortDescription: 'Analyse de données sociales pour identifier les signaux de violences domestiques via NLP.',
    problem: "Les réseaux sociaux regorgent de signaux faibles indiquant des situations de violences domestiques, mais l'absence d'outils analytiques automatisés empêche les organisations d'aide d'identifier ces détresses de manière proactive et d'intervenir à temps.",
    solution: "Conception d'une architecture Big Data intégrant un pipeline ETL conteneurisé et un moteur de Traitement du Langage Naturel (NLP) propulsé par Apache Spark. Une API FastAPI fluide alimente un tableau de bord interactif, permettant une visualisation en temps réel des signaux d'alerte.",
    results: "Amélioration spectaculaire de 40% de la réactivité des interventions d'urgence. Le système fournit désormais des insights prédictifs et actionnables, transformant des données brutes en un outil décisionnel vital pour les associations et les services de secours.",
    category: 'IA',
    technologies: ['Python', 'Spark', 'FastAPI', 'NLP', 'Docker'],
    categorizedTechnologies: [
      { category: 'Data & Processing', skills: ['Spark', 'NLP'] },
      { category: 'Backend', skills: ['Python', 'FastAPI'] },
      { category: 'Infrastructure', skills: ['Docker'] }
    ],
    imageUrl: '/file.svg', // Placeholder
    githubUrl: 'https://github.com/DrEPL',
  },
  {
    id: '2',
    slug: 'systeme-rag-documents',
    title: 'Système RAG Exploitation Documents',
    shortDescription: 'Moteur de recherche intelligent et traitement de documents hétérogènes.',
    problem: "Le capital intellectuel de l'entreprise est souvent noyé dans une masse de documents hétérogènes et non structurés. Les collaborateurs perdent un temps précieux à rechercher des informations critiques, ce qui freine la prise de décision et l'efficacité opérationnelle.",
    solution: "Développement d'un moteur de recherche intelligent s'appuyant sur l'architecture Retrieval-Augmented Generation (RAG). En combinant la puissance de LangChain, l'indexation vectorielle via Qdrant et des LLMs avancés, le système permet d'interroger la base documentaire directement en langage naturel.",
    results: "Réduction drastique de 75% du temps consacré à la recherche documentaire. L'outil génère instantanément des synthèses précises et sourcées, décuplant la productivité des équipes métier et valorisant le patrimoine de données de l'entreprise.",
    category: 'IA',
    technologies: ['LangChain', 'Qdrant', 'LLMs', 'Python', 'Vector DB'],
    categorizedTechnologies: [
      { category: 'IA & Modeling', skills: ['LangChain', 'LLMs'] },
      { category: 'Backend', skills: ['Python'] },
      { category: 'Database', skills: ['Qdrant', 'Vector DB'] }
    ],
    imageUrl: '/file.svg',
    githubUrl: 'https://github.com/DrEPL',
  },
  {
    id: '3',
    slug: 'modele-traduction-fr-wo',
    title: 'Modèle de Traduction FR-Wolof',
    shortDescription: 'Entraînement et déploiement de modèle de traduction avec pipeline MLOps.',
    problem: "La fracture linguistique numérique isole de nombreuses communautés au Sénégal. L'absence d'outils de traduction automatique fiables et contextualisés entre le français et le wolof limite considérablement l'accès à l'information et aux services numériques.",
    solution: "Création de bout en bout d'un modèle d'intelligence artificielle de type Seq2Seq dédié à la traduction franco-wolof. L'infrastructure intègre une chaîne MLOps robuste utilisant MLflow pour le suivi des expérimentations, garantissant un entraînement itératif et un déploiement automatisé.",
    results: "Déploiement réussi d'une API de traduction à haute performance, affichant un score BLEU compétitif. Cette innovation technologique lève une barrière linguistique majeure, favorisant l'inclusion numérique et facilitant la communication interculturelle.",
    category: 'IA',
    technologies: ['MLOps', 'MLflow', 'PyTorch', 'NLP', 'FastAPI'],
    categorizedTechnologies: [
      { category: 'IA & Modeling', skills: ['PyTorch', 'NLP'] },
      { category: 'MLOps & Infra', skills: ['MLOps', 'MLflow'] },
      { category: 'Backend', skills: ['FastAPI'] }
    ],
    imageUrl: '/file.svg',
    githubUrl: 'https://github.com/DrEPL',
  },
  {
    id: '4',
    slug: 'datanexus-hub',
    title: 'DATANEXUS HUB',
    shortDescription: 'Plateforme centralisée et sécurisée pour l\'analyse et la valorisation des données adaptées aux réalités locales.',
    problem: 'L\'explosion des volumes de données dans des secteurs stratégiques représente une opportunité majeure, mais leur exploitation en Afrique reste entravée par l\'absence d\'infrastructures locales intégrées. Les chercheurs font face à un dilemme : conserver leurs données localement au risque d\'une perte définitive, ou dépendre de plateformes externes peu transparentes, posant ainsi des enjeux critiques de souveraineté et de sécurité.',
    solution: "Conçu au sein du DiCentre4AI (dicentre4ai.sn), DataNexus Hub est une plateforme souveraine de centralisation et de traitement de données. La solution repose sur une architecture Big Data complète : Apache Kafka gère l'ingestion de flux en temps réel, tandis qu'Apache Spark assure le traitement analytique distribué. Le stockage est sécurisé et pérennisé via l'écosystème Hadoop. Côté applicatif, un backend performant en Python (Flask) communique en temps réel via WebSocket avec une interface utilisateur fluide développée en Next.js. La gestion des données structurées et non structurées s'appuie sur une combinaison de PostgreSQL et MongoDB. L'ensemble de l'infrastructure est conteneurisé sous Docker et sécurisé par Nginx, offrant ainsi un environnement de recherche scalable, isolé et garantissant le contrôle total des données.",
    results: 'Unification sécurisée des sources de données locales, traitement des flux massifs en temps quasi-réel (latence < 2s), et mise à disposition d\'un environnement d\'analyse souverain et hautement scalable.',
    developedAt: 'DiCentre4AI',
    category: 'Big Data',
    technologies: ['Kafka', 'Hadoop', 'Apache Spark', 'Python', 'Flask', 'WebSocket', 'Next.js', 'MongoDB', 'PostgreSQL', 'Docker', 'Nginx'],
    categorizedTechnologies: [
      { category: 'Data & Processing', skills: ['Kafka', 'Hadoop', 'Apache Spark'] },
      { category: 'Backend', skills: ['Python', 'Flask', 'WebSocket'] },
      { category: 'Frontend', skills: ['Next.js'] },
      { category: 'Database', skills: ['MongoDB', 'PostgreSQL'] },
      { category: 'Infrastructure', skills: ['Docker', 'Nginx'] }
    ],
    imageUrl: '/projects/datanexus_hub/landing_page.png',
    logoUrl: '/projects/datanexus_hub/DataNexus_logo.svg',
    isPrivateRepo: true,
    screenshots: [
      { url: '/projects/datanexus_hub/landing_page.png', title: 'Page d\'accueil', description: 'Interface d\'atterrissage moderne pour présenter la plateforme.' },
      { url: '/projects/datanexus_hub/home_page.png', title: 'Tableau de Bord', description: 'Vue d\'ensemble analytique et gestion globale.' },
      { url: '/projects/datanexus_hub/exploration_datasets.png', title: 'Exploration des Datasets', description: 'Interface de découverte et d\'analyse des données.' },
      { url: '/projects/datanexus_hub/transformation.png', title: 'Transformation & Pipelines', description: 'Gestion visuelle des flux de transformation de données.' }
    ]
  },
  {
    id: '5',
    slug: 'detection-intrusion-reseaux',
    title: 'Détection d\'Intrusion Réseaux',
    shortDescription: 'Projet Machine Learning pour sécuriser les infrastructures réseaux.',
    problem: "Face à la sophistication croissante des cyberattaques, les systèmes de sécurité traditionnels basés sur des signatures fixes sont devenus obsolètes. Les infrastructures réseaux critiques nécessitent désormais une analyse comportementale proactive pour identifier les menaces zero-day.",
    solution: "Implémentation d'un système de détection d'intrusion propulsé par l'Intelligence Artificielle. Le pipeline exploite des algorithmes de Machine Learning avancés (Random Forest, SVM) entraînés sur des flux de trafic réseau massifs pour repérer les anomalies et les comportements malveillants en temps réel.",
    results: "Atteinte d'un taux de détection (Recall) exceptionnel de 96 %, couplé à une réduction drastique des faux positifs. L'infrastructure réseau bénéficie désormais d'un bouclier proactif capable d'anticiper et de neutraliser les intrusions avant qu'elles ne causent des dommages.",
    category: 'IA',
    technologies: ['Scikit-learn', 'Pandas', 'Python', 'Jupyter'],
    categorizedTechnologies: [
      { category: 'IA & Modeling', skills: ['Scikit-learn'] },
      { category: 'Data & Processing', skills: ['Pandas', 'Python', 'Jupyter'] }
    ],
    imageUrl: '/file.svg',
    githubUrl: 'https://github.com/DrEPL',
  },
  {
    id: '6',
    slug: 'systeme-iot-ia-embarquee',
    title: 'Système IoT avec IA Embarquée',
    shortDescription: 'Déploiement de modèles légers sur des dispositifs de périphérie (Edge Computing).',
    problem: "Les dispositifs IoT déployés dans des zones isolées ou critiques souffrent de limitations de bande passante et d'une dépendance stricte au Cloud. Le défi consiste à doter ces capteurs à très faible consommation d'une capacité d'analyse autonome et instantanée.",
    solution: "Conception d'une architecture Edge Computing intégrant des réseaux de neurones ultralégers. Grâce à des techniques avancées de quantification, des modèles TensorFlow Lite ont été optimisés et déployés directement sur des microcontrôleurs pour traiter les données environnementales localement.",
    results: "Exécution d'inférences d'une fluidité remarquable (latence inférieure à 50ms) sans aucun recours au Cloud. Cette approche garantit un fonctionnement 100% hors-ligne, préserve la confidentialité des données et prolonge significativement l'autonomie énergétique des capteurs.",
    category: 'IoT',
    technologies: ['TensorFlow Lite', 'C++', 'Edge Computing', 'IoT'],
    categorizedTechnologies: [
      { category: 'IA & Modeling', skills: ['TensorFlow Lite'] },
      { category: 'Edge & Devices', skills: ['Edge Computing', 'IoT', 'C++'] }
    ],
    imageUrl: '/file.svg',
    githubUrl: 'https://github.com/DrEPL',
  },
  {
    id: '7',
    slug: 'wapitaxi-yangoyo',
    title: 'WapiTaxi & Yango\'yo',
    shortDescription: 'Application mobile de réservation de taxi en ligne.',
    problem: "Dans les métropoles urbaines congolaises, le transport public souffre d'une désorganisation systémique. L'absence d'outils numériques pour mettre en relation instantanément les usagers et les chauffeurs de taxi engendre des temps d'attente prolongés et une perte d'efficacité économique.",
    solution: "Développement full-stack d'un écosystème mobile de VTC (WapiTaxi & Yango'yo). Le projet a englobé la conception UX/UI, le développement d'un Backend robuste de géolocalisation et la création de deux applications Frontend mobiles distinctes et synchronisées en temps réel (côté client et côté chauffeur).",
    results: "Lancement d'une plateforme fluide et performante qui a révolutionné la prise en charge des passagers. L'application a fluidifié la mobilité urbaine, sécurisé les trajets et optimisé les revenus quotidiens des chauffeurs grâce à un matching intelligent.",
    category: 'Web/Mobile',
    technologies: ['Développement Mobile', 'UI/UX', 'Backend', 'Frontend'],
    categorizedTechnologies: [
      { category: 'Frontend', skills: ['Développement Mobile', 'Frontend', 'UI/UX'] },
      { category: 'Backend', skills: ['Backend'] }
    ],
    imageUrl: '/file.svg',
    githubUrl: 'https://github.com/DrEPL',
  },
  {
    id: '8',
    slug: 'syspace-dsi',
    title: 'SYSPACE & DSI Task',
    shortDescription: 'Migration logicielle et développement d\'outils internes pour le Ministère des Finances.',
    problem: "La Direction des Systèmes d'Information (DSI) du Ministère des Finances s'appuyait sur une infrastructure logicielle vieillissante en PHP natif. Ce système rigide freinait la collaboration inter-équipes et rendait le suivi des tâches et des délégations complexe et inefficace.",
    solution: "Refonte architecturale complète vers le framework moderne Laravel. Le projet a inclus la création d'un portail intranet collaboratif (SYSPACE), l'intégration d'un module de gestion agile (DSI Task) pour l'attribution des tickets, et la refonte vitrine du site institutionnel ITE Congo.",
    results: "Modernisation réussie de l'écosystème numérique étatique. Le nouveau système a drastiquement réduit les frictions opérationnelles, automatisé le suivi des délégations et insufflé une nouvelle dynamique de collaboration et de transparence au sein de la DSI.",
    category: 'Web/Mobile',
    technologies: ['PHP', 'Laravel', 'Développement Web', 'Refonte de site'],
    categorizedTechnologies: [
      { category: 'Backend', skills: ['PHP', 'Laravel'] },
      { category: 'Web', skills: ['Développement Web', 'Refonte de site'] }
    ],
    imageUrl: '/file.svg',
  }
];
