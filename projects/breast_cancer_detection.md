# API de détection du cancer du sein
*Classification binaire de mammographies par ensemble de modèles PyTorch, avec explicabilité Grad-CAM et contrôle de qualité d'image en amont.*

## Contexte & Objectif

L'interprétation d'une mammographie reste un acte expert, soumis à variabilité inter-observateur. L'enjeu n'est pas de remplacer le radiologue mais de lui fournir un **second avis assisté** : une probabilité bénin/malin, accompagnée d'une carte de saillance qui indique *où* le réseau a regardé. Le projet adresse ce besoin sous forme d'API HTTP + interface web, en gardant un design défensif (aucune sortie non vérifiée, alerte explicite quand la confiance est faible).

## Architecture technique

| Composant | Rôle | Technologie |
|---|---|---|
| Backend API | Routage HTTP, orchestration prédiction + Grad-CAM | Flask 3, Flask-CORS |
| Inférence | Chargement modèles, prédiction, ensembling | PyTorch, torchvision |
| Explicabilité | Génération de heatmaps Grad-CAM | pytorch-grad-cam, OpenCV |
| Prétraitement & QC | Resize, normalisation ImageNet, contrôle qualité | Pillow, OpenCV, NumPy |
| Frontend | Upload, paramètres, affichage des résultats | Next.js 15, React 18, Axios |
| Modèles | Classification binaire (Benign / Malignant) | ResNet18 (state dict), DenseNet121 (TorchScript) |

## Fonctionnement

```
       Image PNG/JPG/DICOM
              │
              ▼
   ┌──────────────────────┐
   │ Validation client    │  taille / dimensions / type
   └──────────┬───────────┘
              ▼  POST /api/analyze (multipart)
   ┌──────────────────────┐
   │ check_quality()      │  grayscale + Laplacien + contraste
   └──────────┬───────────┘
              ▼
   ┌──────────────────────┐
   │ preprocess()         │  Grayscale→3ch, 224×224, norm ImageNet
   └──────────┬───────────┘
              ▼
   ┌──────────────────────┐    ┌──────────────────┐
   │ ResNet18.predict()   │    │ DenseNet.predict()│
   └──────────┬───────────┘    └────────┬─────────┘
              └────────┬───────────────┘
                       ▼  moyenne pondérée + accord/désaccord
   ┌──────────────────────┐
   │ Grad-CAM par modèle  │  layer4[-1] / features[-1]
   └──────────┬───────────┘
              ▼
       JSON + PNG base64
```

1. Le frontend valide le fichier puis appelle [routes/api.py:427](routes/api.py#L427) `/api/analyze`.
2. `ImagePreprocessor.check_quality` rejette toute image hors critères (couleur, flou, contraste, dimensions).
3. Le pipeline `transforms.Compose` produit un tenseur (1, 3, 224, 224) normalisé ImageNet.
4. En mode `ensemble`, `_ensemble_predict` agrège les probabilités via `ENSEMBLE_WEIGHTS`.
5. `GradCAM.generate_gradcam_visualization` produit une heatmap par modèle, superposée à l'image originale.
6. La réponse expose prédiction, probabilités, accord inter-modèles, indicateur `low_confidence` et `processing_time_ms`.

## Points techniques notables

- **Chargement adaptatif des checkpoints** ([utils/model_loader.py:55](utils/model_loader.py#L55)) : `_try_load_checkpoint` essaie successivement `torch.jit.load` (TorchScript), puis `torch.load`, puis — si le modèle a été livré sous forme de **dossier zip PyTorch extrait** contenant `data.pkl` — reconstruit un zip temporaire à la volée pour le passer à `torch.load`. Cela permet de servir deux formats hétérogènes sans intervention manuelle.
- **Grad-CAM générique** ([utils/gradcam.py:18](utils/gradcam.py#L18)) : `_resolve_target_layers` sélectionne la couche cible par introspection — `layer4[-1]` pour ResNet, `features[-1]` pour DenseNet, sinon dernière `Conv2d` rencontrée via `model.modules()`. Le même objet `GradCAM` fonctionne pour les deux architectures sans branche conditionnelle externe.
- **Ensemble pondéré avec détection de désaccord** ([routes/api.py:121](routes/api.py#L121)) : la classe finale est calculée sur la moyenne pondérée des probabilités, mais le champ `agreement` reporte aussi si les modèles individuels prédisent la même classe — un signal opérationnel quand la moyenne masque un conflit.
- **Garde-fous numériques sur la sortie modèle** ([utils/model_loader.py:212](utils/model_loader.py#L212)) : rejet explicite des logits NaN/Inf et vérification que la somme des probabilités softmax appartient à `[0.99, 1.01]`. Une sortie corrompue lève une `RuntimeError` au lieu de produire un diagnostic invalide.
- **Zone grise de confiance** : `LOW_CONFIDENCE_BAND = (0.45, 0.65)` ([config.py:49](config.py#L49)) marque toute prédiction proche du seuil avec `low_confidence=True`, déclenchant un avertissement frontend "cas incertain → révision recommandée" plutôt qu'un verdict tranché.
- **Contrôle qualité quantitatif** ([utils/image_preprocessing.py:88](utils/image_preprocessing.py#L88)) : variance du Laplacien ≥ 50 (netteté), écart-type ≥ 15 (contraste), différence inter-canaux < 15 (grayscale), dimensions ≥ 100 px. Une image hors critères est refusée avec la liste des raisons, avant toute inférence.

## Interfaces exposées

| Méthode | Endpoint | Usage |
|---|---|---|
| GET | `/api/health` | État + nombre de modèles chargés |
| GET | `/api/models` | Modèles disponibles + entrée `ensemble` si ≥ 2 |
| POST | `/api/predict` | Prédiction seule |
| POST | `/api/gradcam` | Prédiction + heatmap principale |
| POST | `/api/analyze` | Pipeline complet (prédiction + Grad-CAM par modèle + qualité) |

Frontend Next.js sur `localhost:3000` : dropzone, sélection de modèle, slider de seuil `[0.30, 0.70]`, affichage probabilités, badges d'accord/désaccord et disclaimer médical permanent.

## Stack & compétences

- **ML / Vision** : PyTorch, torchvision, transfer learning (ResNet18, DenseNet121), TorchScript, Grad-CAM, OpenCV
- **Backend** : Flask factory pattern (`create_app`), Blueprints, CORS, logging fichier + console
- **Frontend** : Next.js 15 (App Router), React 18, Axios, validation client
- **Robustesse** : contrôle qualité d'image, validation NaN/Inf, gestion multi-format de checkpoints

## Résultat

L'API sert aujourd'hui deux modèles indépendants et un mode ensemble pondéré, retourne une carte Grad-CAM par modèle, expose un seuil ajustable et un signal de faible confiance. Le temps de traitement observé tourne autour de **1,8 s par image** en CPU (cf. `processing_time_ms` dans la réponse d'exemple du README). Les limites assumées sont documentées : pas d'authentification ni de rate limiting, validation MIME uniquement côté client, pas de rotation de logs — autant de prérequis explicitement listés avant tout déploiement réel.

---

*En remplaçant uniquement les poids entraînés et les seuils de contrôle qualité, ce même programme peut être réutilisé pour : la détection de pneumonie ou de tuberculose sur radiographies pulmonaires, le dépistage de la rétinopathie diabétique sur fonds d'œil, la classification de lésions cutanées (mélanome / bénin) sur dermatoscopies, la détection de fissures sur clichés de soudures industrielles, le tri pièce conforme / non conforme en contrôle qualité usine, l'identification de maladies foliaires sur photos de cultures, ou encore la détection d'objets prohibés sur images de scanners de sécurité — tout cas binaire où une image experte doit recevoir un verdict accompagné d'une zone d'attention visuelle.*
