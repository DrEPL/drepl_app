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
  githubUrl?: string;
  demoUrl?: string;
}

export const projects: Project[] = [
  {
    id: '1',
    slug: 'detection-violences-domestiques',
    title: 'Détection des Violences Domestiques',
    shortDescription: 'Analyse de données sociales pour identifier les signaux de violences domestiques via NLP.',
    problem: 'Identifier de manière proactive et analyser les signaux de violences domestiques à partir de vastes ensembles de données textuelles issues des réseaux sociaux.',
    solution: 'Développement d\'un pipeline ETL conteneurisé, couplé à un système NLP basé sur Apache Spark pour l\'extraction et l\'analyse de textes. Création d\'une API FastAPI pour exposer les prédictions et d\'un tableau de bord interactif pour la visualisation.',
    results: 'Identification proactive des tendances de violence, amélioration de la réactivité des interventions de 40%, et fourniture d\'insights précieux et exploitables aux organisations d\'aide.',
    category: 'IA',
    technologies: ['Python', 'Spark', 'FastAPI', 'NLP', 'Docker'],
    imageUrl: '/file.svg', // Placeholder
    githubUrl: 'https://github.com/DrEPL',
  },
  {
    id: '2',
    slug: 'systeme-rag-documents',
    title: 'Système RAG Exploitation Documents',
    shortDescription: 'Moteur de recherche intelligent et traitement de documents hétérogènes.',
    problem: 'Difficulté à trouver des informations pertinentes rapidement dans une base de documents d\'entreprise volumineuse et non structurée.',
    solution: 'Mise en place d\'une architecture Retrieval-Augmented Generation (RAG) utilisant LangChain et Qdrant pour l\'indexation vectorielle, permettant d\'interroger les documents en langage naturel via un LLM.',
    results: 'Réduction de 75% du temps de recherche documentaire, génération d\'insights automatiques et amélioration globale de la productivité des équipes métier.',
    category: 'IA',
    technologies: ['LangChain', 'Qdrant', 'LLMs', 'Python', 'Vector DB'],
    imageUrl: '/file.svg',
    githubUrl: 'https://github.com/DrEPL',
  },
  {
    id: '3',
    slug: 'modele-traduction-fr-wo',
    title: 'Modèle de Traduction FR-Wolof',
    shortDescription: 'Entraînement et déploiement de modèle de traduction avec pipeline MLOps.',
    problem: 'Manque d\'outils de traduction performants et contextualisés entre le français et le wolof.',
    solution: 'Entraînement d\'un modèle Seq2Seq personnalisé, avec gestion complète du cycle de vie du modèle via MLflow et déploiement automatisé.',
    results: 'Mise à disposition d\'une API de traduction fluide avec un score BLEU compétitif, facilitant la communication et l\'accessibilité numérique.',
    category: 'IA',
    technologies: ['MLOps', 'MLflow', 'PyTorch', 'NLP', 'FastAPI'],
    imageUrl: '/file.svg',
    githubUrl: 'https://github.com/DrEPL',
  },
  {
    id: '4',
    slug: 'datanexus-hub',
    title: 'DATANEXUS HUB',
    shortDescription: 'Développement de pipeline ETL et gestion d\'architecture distribuée.',
    problem: 'Silos de données et incapacité à traiter des flux de données massifs en temps réel pour l\'analyse.',
    solution: 'Création d\'un hub centralisé utilisant Apache Kafka pour le streaming, Airflow pour l\'orchestration et Hadoop HDFS pour le stockage distribué.',
    results: 'Unification des sources de données, traitement en temps quasi-réel (latence < 2s) et scalabilité horizontale assurée.',
    category: 'Big Data',
    technologies: ['Kafka', 'Airflow', 'Hadoop', 'ETL', 'Scala'],
    imageUrl: '/file.svg',
    githubUrl: 'https://github.com/DrEPL',
  },
  {
    id: '5',
    slug: 'detection-intrusion-reseaux',
    title: 'Détection d\'Intrusion Réseaux',
    shortDescription: 'Projet Machine Learning pour sécuriser les infrastructures réseaux.',
    problem: 'Vulnérabilité croissante des réseaux face aux attaques sophistiquées nécessitant une détection comportementale.',
    solution: 'Entraînement de modèles de Machine Learning (Forêts Aléatoires, SVM) sur des datasets de trafic réseau pour identifier les anomalies et les signatures d\'attaques.',
    results: 'Taux de détection (Recall) de 96% avec un faible taux de faux positifs, renforçant la sécurité proactive.',
    category: 'IA',
    technologies: ['Scikit-learn', 'Pandas', 'Python', 'Jupyter'],
    imageUrl: '/file.svg',
    githubUrl: 'https://github.com/DrEPL',
  },
  {
    id: '6',
    slug: 'systeme-iot-ia-embarquee',
    title: 'Système IoT avec IA Embarquée',
    shortDescription: 'Déploiement de modèles légers sur des dispositifs de périphérie (Edge Computing).',
    problem: 'Besoin d\'inférence IA locale (sans connexion cloud) pour des capteurs IoT à faible consommation.',
    solution: 'Optimisation et quantification de modèles TensorFlow Lite déployés sur des microcontrôleurs pour analyser les données de capteurs environnementaux.',
    results: 'Inférence en temps réel (<50ms) directement sur l\'appareil, économie de bande passante et fonctionnement hors-ligne garanti.',
    category: 'IoT',
    technologies: ['TensorFlow Lite', 'C++', 'Edge Computing', 'IoT'],
    imageUrl: '/file.svg',
    githubUrl: 'https://github.com/DrEPL',
  },
  {
    id: '7',
    slug: 'wapitaxi-yangoyo',
    title: 'WapiTaxi & Yango\'yo',
    shortDescription: 'Application mobile de réservation de taxi en ligne.',
    problem: 'Difficulté à mettre en relation efficacement les usagers du transport public et les chauffeurs de taxi au Congo.',
    solution: 'Conception de l\'interface utilisateur et développement complet (Backend et Frontend mobile) d\'une application de réservation en temps réel avec deux interfaces distinctes : usagers et chauffeurs.',
    results: 'Mise en place d\'une plateforme fonctionnelle facilitant la réservation et améliorant la mobilité urbaine.',
    category: 'Web/Mobile',
    technologies: ['Développement Mobile', 'UI/UX', 'Backend', 'Frontend'],
    imageUrl: '/file.svg',
    githubUrl: 'https://github.com/DrEPL',
  },
  {
    id: '8',
    slug: 'syspace-dsi',
    title: 'SYSPACE & DSI Task',
    shortDescription: 'Migration logicielle et développement d\'outils internes pour le Ministère des Finances.',
    problem: 'Système existant obsolète basé sur du PHP natif et manque d\'outils de gestion de tâches et de partage d\'information à la DSI.',
    solution: 'Migration de l\'application vers le framework Laravel, conception d\'un système de délégation de tâches (DSI Task) et refonte du site ITE Congo.',
    results: 'Modernisation du système d\'information de l\'État, amélioration de la collaboration interne et automatisation des délégations de tâches.',
    category: 'Web/Mobile',
    technologies: ['PHP', 'Laravel', 'Développement Web', 'Refonte de site'],
    imageUrl: '/file.svg',
  }
];
