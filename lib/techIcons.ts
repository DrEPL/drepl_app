import {
  // Languages & runtimes
  siPython, siCplusplus, siPhp, siJavascript, siTypescript,
  // AI / ML / NLP
  siPytorch, siTensorflow, siHuggingface, siLangchain, siLanggraph,
  siMistralai, siOllama, siSpacy, siScikitlearn, siMlflow,
  // Web frameworks
  siReact, siNextdotjs, siFastapi, siFlask, siLaravel,
  siExpress, siNodedotjs,
  // Frontend / styling
  siTailwindcss, siRedux,
  // Data stores
  siMongodb, siPostgresql, siRedis, siQdrant, siMinio,
  // Big Data
  siApachespark, siApacheairflow, siApachekafka, siApachehadoop,
  // Data tooling
  siPandas, siJupyter, siPlotly, siStreamlit, siPydantic,
  // DevOps / infra
  siDocker, siKubernetes, siNginx, siVercel, siGithub, siGit,
  // Testing
  siPytest, siJest,
} from 'simple-icons';

export interface SimpleIcon {
  title: string;
  slug: string;
  hex: string;
  path: string;
}

// Direct registry, keyed by normalized tech name (lowercase, no spaces/dots/dashes).
const ICONS: Record<string, SimpleIcon> = {
  // Languages
  python: siPython,
  cplusplus: siCplusplus,
  'c++': siCplusplus,
  php: siPhp,
  javascript: siJavascript,
  js: siJavascript,
  typescript: siTypescript,
  ts: siTypescript,

  // AI / ML / NLP
  pytorch: siPytorch,
  tensorflow: siTensorflow,
  tensorflowlite: siTensorflow,
  huggingface: siHuggingface,
  langchain: siLangchain,
  langgraph: siLanggraph,
  mistral: siMistralai,
  mistrallarge: siMistralai,
  mistralai: siMistralai,
  ollama: siOllama,
  spacy: siSpacy,
  scikitlearn: siScikitlearn,
  sklearn: siScikitlearn,
  mlflow: siMlflow,

  // Web frameworks
  react: siReact,
  nextjs: siNextdotjs,
  nextdotjs: siNextdotjs,
  fastapi: siFastapi,
  flask: siFlask,
  laravel: siLaravel,
  express: siExpress,
  nodejs: siNodedotjs,

  // Frontend / styling
  tailwind: siTailwindcss,
  tailwindcss: siTailwindcss,
  redux: siRedux,
  reduxtoolkit: siRedux,

  // Data stores
  mongodb: siMongodb,
  postgresql: siPostgresql,
  postgres: siPostgresql,
  redis: siRedis,
  qdrant: siQdrant,
  minio: siMinio,

  // Big Data
  spark: siApachespark,
  apachespark: siApachespark,
  pyspark: siApachespark,
  airflow: siApacheairflow,
  apacheairflow: siApacheairflow,
  kafka: siApachekafka,
  apachekafka: siApachekafka,
  hadoop: siApachehadoop,
  apachehadoop: siApachehadoop,

  // Data tooling
  pandas: siPandas,
  jupyter: siJupyter,
  plotly: siPlotly,
  streamlit: siStreamlit,
  pydantic: siPydantic,

  // DevOps / infra
  docker: siDocker,
  dockercompose: siDocker,
  kubernetes: siKubernetes,
  k8s: siKubernetes,
  nginx: siNginx,
  vercel: siVercel,
  github: siGithub,
  git: siGit,

  // Testing
  pytest: siPytest,
  jest: siJest,
};

// Normalize a tech display name into a registry key.
function normalize(name: string): string {
  return name
    .toLowerCase()
    .trim()
    // strip trailing version (e.g. "Next.js 16", "Python 3.11", "Spark 3.5", "React 19")
    .replace(/\s+v?\d+(\.\d+)*(\s*\([^)]+\))?$/i, '')
    // collapse all non-alphanum
    .replace(/[^a-z0-9+]/g, '');
}

export function getTechIcon(name: string): SimpleIcon | null {
  if (!name) return null;
  const key = normalize(name);
  return ICONS[key] ?? null;
}
