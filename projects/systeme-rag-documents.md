# SEINENTAI RAG — Agent conversationnel pour base documentaire interne

## Système RAG agentique avec orchestration d'intentions, multi-stratégies de recherche et streaming SSE

---

## Contexte & Objectif

Sukyo Mahikari, organisation spirituelle internationale, dispose d'un corpus documentaire dense (textes doctrinaux, archives, supports de formation pour son service jeunesse) qui doit être interrogeable en langage naturel par ses membres. Les pipelines RAG standards souffrent de deux limites observées : ils mobilisent la recherche vectorielle pour toute interaction — y compris les salutations — et appliquent une stratégie de retrieval unique quel que soit le type de question. SEINENTAI RAG répond à ces deux points en plaçant une couche d'orchestration d'intentions en amont du pipeline et en dotant l'agent d'un choix dynamique entre trois stratégies de recherche, avec boucle d'auto-évaluation.

## Architecture Technique

| Composant | Rôle | Techno |
|---|---|---|
| Orchestration agent | StateGraph à 7 nœuds, routage conditionnel | LangGraph >= 0.4 |
| LLM | Génération, classification, évaluation | Mistral Large 3 (675B) via Ollama Cloud |
| API HTTP | Endpoints REST + streaming SSE | FastAPI |
| Recherche vectorielle | Dense + sparse BM25 + HyDE | Qdrant (collection `seinentai_documents`) |
| Reranking | Reclassement fin top-K | Cross-Encoder (sentence-transformers) |
| Stockage documents | Originaux PDF / DOCX | MinIO (S3-compatible) |
| Historique conversations | Sessions multi-tours | MongoDB (PyMongo) |
| Ingestion asynchrone | Indexation sur événements MinIO | Kafka (`minio-events`) |
| Frontend | Chat avec sources, streaming, partage | Next.js 16, React 19, Redux Toolkit |

## Fonctionnement

```
Requête utilisateur
    │
    ▼
[IntentRouter.classify]  ── small_talk / out_of_domain ──► Réponse directe (~500 ms, sans RAG)
    │
    │ knowledge_query
    ▼
[analyze_query] ──► [decompose_query] (si multi-hop)
    │                       │
    └─────────────┬─────────┘
                  ▼
          [execute_search]  ◄─────────┐
                  │                   │
                  ▼                   │ retry avec
          [rerank_results]            │ nouvelle stratégie
                  │                   │
                  ▼                   │
        [evaluate_quality] ──► [handle_fallback]
                  │ (score ≥ 0.6)
                  ▼
      [synthesize_response] ──► flux SSE token par token
```

1. `IntentRouter.classify()` filtre les messages sociaux par regex puis, si nécessaire, par appel LLM compact qui retourne classification + réponse directe en un seul aller-retour.
2. `analyze_query` détermine type (`simple`/`complex`), stratégie (`dense`/`hybrid`/`hyde`) et nécessité de décomposition.
3. `execute_search` invoque l'outil via `RetrievalTools.execute()`.
4. `rerank_results` applique le cross-encoder sur jusqu'à 10 candidats.
5. `evaluate_quality` retourne un score 0.0–1.0 ; sous 0.6, `handle_fallback` change de stratégie ou reformule.
6. `synthesize_response` produit la réponse finale en streaming SSE avec les sources.

## Points techniques notables

- **Routage à deux étages (regex puis LLM).** `IntentRouter._quick_classify()` court-circuite l'appel LLM sur ~30 patterns figés (salutations, remerciements, adieux, formules de courtoisie), ramenant la latence du chemin social à ~50 ms au lieu de ~500 ms. Sécurité : si la confiance LLM tombe sous 0.6 pour `small_talk`, l'intention bascule en `knowledge_query`.
- **Boucle de qualité bornée.** Le graphe itère jusqu'à `DEFAULT_MAX_ITERATIONS=4` avec changement de stratégie à chaque tour ([Agent/graph.py:38](Agent/graph.py#L38)). Au-delà, la synthèse est forcée avec le contexte disponible plutôt que de renvoyer une erreur — `handle_fallback` met `quality_sufficient=True` ([Agent/graph.py:404](Agent/graph.py#L404)).
- **Parsing JSON résilient.** `_parse_json_response()` enchaîne quatre tentatives (parse direct, bloc ` ```json `, premier `{...}`, réparation par suffixes `}` / `"]}`), puis retry avec backoff exponentiel 1s/2s/4s. Indispensable face aux LLM qui produisent parfois du JSON tronqué par `num_predict`.
- **Injection d'outils via wrapper de nœud.** `_inject_tools()` ([Agent/graph.py:521](Agent/graph.py#L521)) ajoute `RetrievalTools` au state à l'exécution puis le retire avant sérialisation, contournant l'incompatibilité de LangGraph avec les objets non-sérialisables dans l'état partagé.
- **Déduplication post-search.** `execute_search` dédoublonne les documents sur les 200 premiers caractères avant rerank, évitant que la décomposition en sous-requêtes ne gonfle artificiellement le contexte de l'évaluateur.
- **Triple chemin exposé par un seul endpoint.** `/chat/new` route entre mode agent (raisonnement dynamique), mode statique (`use_hybrid`/`use_hyde` explicites pour rétrocompatibilité et benchmarks) et mode direct (réponse sans RAG), selon les flags et la classification d'intention.

## Interfaces exposées

- `POST /chat/new` et `POST /chat/{session_id}` — conversation, JSON ou SSE (`stream=true`)
- `GET /chat/history`, `GET /chat/sessions/{session_id}` — historique multi-session
- `POST /documents/upload`, endpoints `/search/...` — indexation et recherche directe
- `GET /docs` — Swagger interactif FastAPI
- `services/kafka_consumer.py` — ré-indexation automatique déclenchée par événements MinIO sur le topic `minio-events`

Événements SSE émis : `start`, `thought`, `tool_call`, `observation`, `synthesis_start`, `token`, `done`, `error` — permettant au frontend d'afficher le raisonnement en temps réel.

## Stack & compétences

- **IA / NLP** : RAG agentique, LangGraph (StateGraph, routage conditionnel), prompt engineering structuré (5 prompts spécialisés), HyDE, cross-encoder reranking, fusion dense/BM25
- **Backend** : FastAPI, streaming SSE, Pydantic, lifespan asynchrone, dépendances injectables, singletons lazy
- **Données** : Qdrant (vector + sparse `Qdrant/bm25`), MongoDB, MinIO/S3, Kafka
- **Frontend** : Next.js 16, React 19, Redux Toolkit, Tailwind, consommation SSE côté client
- **Infra** : Docker Compose multi-services (Qdrant, MinIO, MongoDB, Kafka, Ollama), scripts de démarrage Python

## Résultat

Le système répond en local aux trois cas d'usage cibles : interactions sociales en moins de 500 ms sans solliciter Qdrant, questions factuelles (dense + rerank, ~3 s), questions complexes multi-hop avec décomposition automatique et fallback. Un `agent_trace` complet — pensées, appels d'outils, scores de qualité, stratégies essayées, itérations — est renvoyé pour chaque réponse, exploitable pour debug ou affichage côté UI. Le pipeline RAG statique reste accessible via `use_agent=false` pour la rétrocompatibilité et les benchmarks comparatifs entre orchestration agentique et pipeline linéaire.

*Le même schéma — classification d'intention en amont, StateGraph itératif avec auto-évaluation, multi-stratégie de retrieval — s'applique à toute base documentaire métier où les utilisateurs alternent questions factuelles, requêtes conceptuelles et échanges conversationnels : support client, documentation technique interne, plateformes pédagogiques, assistance juridique ou médicale.*
