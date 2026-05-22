import { BrainCircuit, Database, Globe, Lightbulb, Users } from 'lucide-react';

export interface Service {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  icon: any; // Lucide icon
  benefits: string[];
  benefitsEn: string[];
}

export const services: Service[] = [
  {
    id: 'ai',
    title: 'Développement IA',
    titleEn: 'AI Development',
    description: "De la conception à l'implémentation, je développe des systèmes d'IA sur mesure (NLP, vision par ordinateur, systèmes prédictifs) pour optimiser vos opérations et créer de la valeur.",
    descriptionEn: "From design to implementation, I develop custom AI systems (NLP, computer vision, predictive systems) to optimize your operations and create value.",
    icon: BrainCircuit,
    benefits: ['Automatisation des tâches complexes', 'Amélioration de la prise de décision', 'Expérience utilisateur personnalisée'],
    benefitsEn: ['Automation of complex tasks', 'Improved decision-making', 'Personalized user experience'],
  },
  {
    id: 'bigdata',
    title: 'Ingénierie Big Data',
    titleEn: 'Big Data Engineering',
    description: "Je construis des architectures robustes pour la collecte, le traitement et l'analyse de grands volumes de données, garantissant l'exploitabilité de vos informations.",
    descriptionEn: "I build robust architectures for collecting, processing and analyzing large volumes of data, ensuring your information is fully exploitable.",
    icon: Database,
    benefits: ['Pipelines ETL performants', 'Stockage distribué sécurisé', 'Traitement en temps réel'],
    benefitsEn: ['High-performance ETL pipelines', 'Secure distributed storage', 'Real-time processing'],
  },
  {
    id: 'webmobile',
    title: 'Applications Web & Mobile',
    titleEn: 'Web & Mobile Applications',
    description: "Création d'applications modernes intégrant des fonctionnalités IA, des APIs RESTful performantes et des interfaces utilisateur intuitives.",
    descriptionEn: "Building modern applications integrating AI features, high-performance RESTful APIs and intuitive user interfaces.",
    icon: Globe,
    benefits: ['Interfaces réactives et modernes', "Intégration transparente de l'IA", 'Architecture évolutive'],
    benefitsEn: ['Responsive and modern interfaces', 'Seamless AI integration', 'Scalable architecture'],
  },
  {
    id: 'consulting',
    title: 'Conseil & Audit en IA',
    titleEn: 'AI Consulting & Audit',
    description: "Accompagnement stratégique, optimisation de systèmes existants et évaluation de faisabilité de vos projets d'Intelligence Artificielle.",
    descriptionEn: "Strategic support, optimization of existing systems and feasibility assessment of your Artificial Intelligence projects.",
    icon: Lightbulb,
    benefits: ['Feuille de route claire', 'Réduction des risques techniques', 'Optimisation des coûts'],
    benefitsEn: ['Clear roadmap', 'Reduced technical risks', 'Cost optimization'],
  },
  {
    id: 'training',
    title: 'Formation & Transfert',
    titleEn: 'Training & Knowledge Transfer',
    description: "Ateliers et formations personnalisées sur les technologies IA et Big Data pour faire monter en compétence vos équipes techniques.",
    descriptionEn: "Personalized workshops and training on AI and Big Data technologies to upskill your technical teams.",
    icon: Users,
    benefits: ['Montée en compétence rapide', 'Maîtrise des outils modernes', 'Autonomie de vos équipes'],
    benefitsEn: ['Rapid skill development', 'Mastery of modern tools', 'Team autonomy'],
  },
];
