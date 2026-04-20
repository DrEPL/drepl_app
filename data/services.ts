import { BrainCircuit, Database, Globe, Lightbulb, Users } from 'lucide-react';

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: any; // Lucide icon
  benefits: string[];
}

export const services: Service[] = [
  {
    id: 'ai',
    title: 'Développement IA',
    description: "De la conception à l'implémentation, je développe des systèmes d'IA sur mesure (NLP, vision par ordinateur, systèmes prédictifs) pour optimiser vos opérations et créer de la valeur.",
    icon: BrainCircuit,
    benefits: ['Automatisation des tâches complexes', 'Amélioration de la prise de décision', 'Expérience utilisateur personnalisée']
  },
  {
    id: 'bigdata',
    title: 'Ingénierie Big Data',
    description: "Je construis des architectures robustes pour la collecte, le traitement et l'analyse de grands volumes de données, garantissant l'exploitabilité de vos informations.",
    icon: Database,
    benefits: ['Pipelines ETL performants', 'Stockage distribué sécurisé', 'Traitement en temps réel']
  },
  {
    id: 'webmobile',
    title: 'Applications Web & Mobile',
    description: "Création d'applications modernes intégrant des fonctionnalités IA, des APIs RESTful performantes et des interfaces utilisateur intuitives.",
    icon: Globe,
    benefits: ['Interfaces réactives et modernes', 'Intégration transparente de l\'IA', 'Architecture évolutive']
  },
  {
    id: 'consulting',
    title: 'Conseil & Audit en IA',
    description: "Accompagnement stratégique, optimisation de systèmes existants et évaluation de faisabilité de vos projets d'Intelligence Artificielle.",
    icon: Lightbulb,
    benefits: ['Feuille de route claire', 'Réduction des risques techniques', 'Optimisation des coûts']
  },
  {
    id: 'training',
    title: 'Formation & Transfert',
    description: "Ateliers et formations personnalisées sur les technologies IA et Big Data pour faire monter en compétence vos équipes techniques.",
    icon: Users,
    benefits: ['Montée en compétence rapide', 'Maîtrise des outils modernes', 'Autonomie de vos équipes']
  }
];
