# 🔍 Détection des Violences Domestiques sur les Réseaux Sociaux
### Pipeline ETL Big Data & NLP — Étude de cas

## Contexte & Objectif

Les violences domestiques restent un phénomène massif mais largement sous-déclaré. Les réseaux sociaux constituent paradoxalement un canal d'expression où victimes, témoins et associations partagent quotidiennement témoignages, alertes et signaux faibles. **L'enjeu de ce projet est de transformer ce flot non structuré en un signal exploitable**, permettant de quantifier le volume, la sévérité, la distribution géographique et l'évolution temporelle du phénomène.

Concrètement, le système collecte en continu des commentaires depuis **Twitter** et **YouTube**, les nettoie, leur applique un traitement NLP, calcule un **score de sévérité** par publication, et expose le tout à travers une **API REST** et un **dashboard interactif**.

---

## Architecture Technique

Le projet repose sur une architecture **distribuée, conteneurisée et orchestrée**, pensée pour s'exécuter aussi bien en local qu'en production.

| Composant | Rôle | Technologie |
|-----------|------|-------------|
| Orchestration | Planification & dépendances des tâches | **Apache Airflow 3.x** |
| Extraction | Collecte API multi-sources | TwitterAPI.io + YouTube Data API v3 |
| Traitement distribué | Nettoyage & NLP à l'échelle | **Apache Spark 3.5 (PySpark)** |
| NLP | Tokenisation, lemmatisation, scoring | **spaCy** (FR + EN) |
| Stockage | Persistance documentaire | **MongoDB 7.0** |
| API REST | Exposition des données | **FastAPI** (async, Beanie ODM) |
| Visualisation | Dashboard analytique | **Streamlit + Plotly** |
| Déploiement | Infrastructure as Code | Docker Compose |

---

## Pipeline ETL en 6 étapes

```
extract_twitter  ──┐
                    ├─→ store_raw_posts → clean_spark → nlp_spacy → store_clean_posts → log_metrics
extract_youtube  ──┘
```

1. **Extraction parallèle** — Deux extracteurs interrogent simultanément Twitter et YouTube sur une liste de mots-clés (`violence conjugale`, `femme battue`, `harcèlement`, etc.).
2. **Stockage brut** — Upsert MongoDB déduplique par `(platform, external_id)` ; aucune perte, aucun doublon.
3. **Nettoyage Spark** — Suppression des URLs, mentions, emojis, normalisation Unicode, détection de la langue.
4. **NLP distribué** — UDF PySpark + spaCy : tokenisation, lemmatisation, retrait des stopwords, détection des mots-clés de violence.
5. **Scoring de sévérité** — Chaque post reçoit un score entre 0 et 1, calculé à partir d'un dictionnaire pondéré (`tuer: 1.0`, `viol: 0.95`, `battre: 0.8`, …).
6. **Métriques** — Volume traité, taux de transformation et durées sont consignés dans `pipeline_metrics`.

Le DAG Airflow gère la **résilience** (3 retries avec *exponential backoff*), la **non-concurrence** (`max_active_runs=1`) et la **tolérance partielle** (`trigger_rule=ALL_DONE` — si Twitter échoue, YouTube continue).

---

## Points techniques notables

- **Pattern Lifespan FastAPI** — MongoDB initialisé une seule fois au démarrage via `@asynccontextmanager`. Connexion Motor réutilisée, zéro reconnexion par requête.
- **MongoDB Spark Connector** — Spark lit/écrit directement dans MongoDB sans étape intermédiaire (`spark.read.format("mongodb")`).
- **Logs centralisés** — Chaque tâche Airflow écrit son statut, sa durée et le nombre d'enregistrements traités dans la collection `pipeline_logs`, exploitable depuis l'API et le dashboard.
- **Modèles spaCy chargés côté worker** — Pour éviter les erreurs de sérialisation, les modèles linguistiques sont initialisés à l'intérieur de l'UDF, sur chaque exécuteur Spark.
- **Index MongoDB optimisés** — Index composites (`platform`, `created_at`), index textuels pour la recherche full-text, index sur `severity_score` pour les requêtes analytiques.

---

## API REST (FastAPI)

Une douzaine d'endpoints exposent les données et le contrôle du pipeline :

- `GET /posts/` — listing paginé des commentaires
- `GET /posts/search?q=` — recherche full-text MongoDB
- `POST /pipeline/extract` — déclenche une extraction à la volée
- `GET /stats/overview` — KPIs globaux (volume, sévérité moyenne, plateformes)
- `GET /stats/temporal` — évolution dans le temps
- `GET /stats/geographic` — distribution par pays
- `GET /logs/summary` — performances du pipeline

Documentation interactive auto-générée via Swagger UI à `/docs`.

---

## Dashboard Streamlit

Interface analytique avec design *glassmorphism*, compatible dark/light mode :
- KPIs en temps réel (posts collectés, posts traités, taux de transformation)
- Distribution temporelle des publications
- Carte des mentions par pays
- Top mots-clés et nuage de termes
- Histogramme des scores de sévérité
- Monitoring de santé du pipeline

---

## Stack & compétences mises en œuvre

**Big Data** · Apache Spark, PySpark UDFs, Spark Streaming patterns
**Orchestration** · Apache Airflow (DAGs, XCom, TriggerRules, retry policies)
**NLP** · spaCy, tokenisation multi-langue, scoring pondéré
**Backend** · FastAPI async, Beanie ODM, Pydantic Settings
**Bases de données** · MongoDB (index composites, texte intégral, agrégations)
**DataViz** · Streamlit, Plotly
**DevOps** · Docker Compose, multi-services, networking inter-conteneurs
**Tests** · Pytest avec couverture

---

## Résultat

Un système **end-to-end fonctionnel**, capable d'ingérer plusieurs centaines de publications par run, de les enrichir sémantiquement et de fournir des indicateurs exploitables pour la recherche, les associations ou les politiques publiques.

> *Projet personnel à vocation démonstrative — l'architecture est réplicable pour tout cas d'usage de **text mining sur réseaux sociaux** (e-réputation, veille épidémiologique, analyse d'opinion, etc.).*
