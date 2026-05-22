export type SkillCategoryKey = 'ai_ml' | 'big_data_cloud' | 'web_mobile' | 'tools_other';

export interface SkillCategory {
  key: SkillCategoryKey;
  title: string;
  skills: { name: string; level: number }[];
}

export const skillCategories: SkillCategory[] = [
  {
    key: 'ai_ml',
    title: 'Intelligence Artificielle & ML',
    skills: [
      { name: 'Python', level: 95 },
      { name: 'TensorFlow / Keras', level: 85 },
      { name: 'PyTorch', level: 80 },
      { name: 'NLP & LLMs (LangChain)', level: 90 },
      { name: 'Scikit-learn', level: 90 },
      { name: 'Pandas / Matplotlib / Seaborn', level: 85 },
      { name: 'MLOps (MLflow)', level: 85 },
      { name: 'OpenAI API', level: 85 },
      { name: 'Jupyter / Kaggle', level: 90 },
    ]
  },
  {
    key: 'big_data_cloud',
    title: 'Big Data & Cloud',
    skills: [
      { name: 'Apache Spark', level: 85 },
      { name: 'Apache Airflow', level: 80 },
      { name: 'Apache Kafka', level: 75 },
      { name: 'Hadoop HDFS', level: 75 },
      { name: 'Docker', level: 90 },
      { name: 'AWS', level: 80 },
      { name: 'PostgreSQL / MongoDB / Redis', level: 85 },
      { name: 'Minio / DVC', level: 85 },
    ]
  },
  {
    key: 'web_mobile',
    title: 'Développement Web & Mobile',
    skills: [
      { name: 'FastAPI / Flask / Django', level: 90 },
      { name: 'Node.js / NestJS', level: 80 },
      { name: 'React Native / Flutter / Ionic', level: 80 },
      { name: 'TypeScript / JS / Dart', level: 85 },
      { name: 'HTML / CSS / Tailwind', level: 90 },
      { name: 'Angular', level: 75 },
      { name: 'PHP / Laravel', level: 80 },
      { name: 'C++ / Scala', level: 75 },
    ]
  },
  {
    key: 'tools_other',
    title: 'Outils & Autres',
    skills: [
      { name: 'Git / GitHub', level: 95 },
      { name: 'Jenkins (CI/CD)', level: 80 },
      { name: 'Figma', level: 75 },
      { name: 'Linux / Bash', level: 85 },
      { name: 'Cisco CCNA (Réseaux) / GNS3', level: 75 },
      { name: 'npm / VS Code', level: 90 },
    ]
  }
];

export const allSkillsList = skillCategories.flatMap(c => c.skills.map(s => s.name));
