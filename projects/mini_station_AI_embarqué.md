# Fiche descriptive de projet

## Mini-station météo IoT avec IA embarquée

---

## Présentation du projet

Ce projet consiste à concevoir et développer une mini-station de mesure environnementale autonome, capable de collecter des données météorologiques (température et humidité) en temps réel grâce à un capteur DHT11 piloté par un microcontrôleur ESP32. Les données sont transmises sans fil vers un tableau de bord interactif et exploitées par un modèle de Machine Learning pour générer des prédictions météorologiques à court terme.

Ce projet combine l'électronique embarquée, le développement logiciel et l'intelligence artificielle dans un système intégré de bout en bout.

---

## Objectifs du projet

1. Concevoir un système de mesure environnementale fiable et autonome à base d'ESP32 et DHT11 pour la collecte de données température/humidité.
2. Mettre en place une transmission des données en temps réel via protocole MQTT vers une infrastructure de stockage et de traitement.
3. Développer un dashboard de visualisation interactif permettant le suivi en direct des mesures, l'affichage de l'historique et la gestion des alertes.
4. Concevoir et entraîner un modèle de Machine Learning capable de prédire l'évolution des conditions météorologiques à partir des séries temporelles collectées.
5. Intégrer l'ensemble des composants (matériel, firmware, dashboard, IA) dans un système cohérent, documenté et déployable.

---

## Matériel

| Composant      | Détail              |
|----------------|---------------------|
| Microcontrôleur | ESP32 DevKit        |
| Capteur         | DHT11, BMP280       |
| Résistance      | 10 kΩ (pull-up)     |
| Alimentation    | USB / LiPo 3.7V     |
| Câblage         | Breadboard + jumpers |

---

## Architecture logicielle

### Firmware ESP32
- Lecture du capteur DHT11 (MicroPython)
- Publication MQTT vers un broker (Mosquitto)
- Mode deep sleep pour économie d'énergie
- Mise à jour OTA via Wi-Fi

### Dashboard temps réel
- Stack : Node-RED et Grafana
- Graphes température & humidité en direct
- Alertes configurables par seuil
- Historique avec granularité variable

### Module Machine Learning
- Modèle Random Forest sur séries temporelles
- Prédiction à 24h / 48h
- Entraînement sur données historiques collectées
- Déploiement via API FastAPI

---

## Livrables

- **Prototype fonctionnel** — station câblée ESP32 + DHT11 avec firmware opérationnel et transmission Wi-Fi
- **Dashboard de visualisation** — interface temps réel avec graphes, alertes et historique (Grafana ou équivalent)
- **Modèle ML de prédiction** — modèle entraîné et évalué (RMSE, MAE) avec API de déploiement
- **Documentation technique** — schéma de câblage, architecture système, rapport d'analyse et guide de déploiement

---

## Stack technologique

- Programmation embarquée (C++ / MicroPython)
- Protocole MQTT
- Bases de données temporelles (InfluxDB)
- Visualisation de données (Grafana)
- Python (pandas, numpy)
- Machine Learning (scikit-learn)
- Séries temporelles (LSTM / ARIMA)
- API REST (FastAPI)
- Électronique de base
- Réseau Wi-Fi
- Docker

---

## Extensions possibles

- Ajout du capteur BMP280 (pression atmosphérique, altitude)
- Intégration d'un écran OLED pour affichage local
- Notifications push / SMS en cas d'alerte
- Réseau multi-capteurs via LoRa

---

## Problématique

> Comment concevoir un système IoT autonome et intégré, capable de collecter des données environnementales en temps réel, de les visualiser de manière intelligible et d'en extraire des prédictions météorologiques fiables grâce au Machine Learning — le tout à partir de composants bas coût ?

---

## Domaines d'application et cas d'usage

Le cœur technique de ce projet — capteur + transmission + stockage + ML — est un pattern réutilisable dans de nombreux secteurs. Il suffit d'adapter le capteur et le contexte de déploiement.

### Agriculture & horticulture
- Contrôle de la température et humidité dans une serre pour optimiser la croissance des plantes
- Détection précoce du gel pour déclencher une alarme ou un système de chauffage automatique
- Suivi des conditions microclimatiques par zone de culture pour adapter l'irrigation
- Prédiction ML des risques de maladies fongiques liées à un excès d'humidité

### Bâtiment intelligent (Smart Building)
- Surveillance de la température et humidité dans chaque pièce d'un appartement ou bureau
- Optimisation automatique de la climatisation ou du chauffage selon les prédictions ML
- Détection d'anomalies (humidité trop élevée = risque de moisissures)
- Suivi de la consommation énergétique corrélée aux conditions climatiques

### Santé & environnement médical
- Surveillance de la chaîne du froid pour médicaments ou vaccins (température critique)
- Contrôle des conditions dans une chambre de patient ou salle d'opération
- Alertes automatiques en cas de dérive hors des plages réglementaires
- Journalisation automatique pour conformité et audit qualité (ISO, HACCP)

### Logistique & stockage
- Surveillance d'entrepôts de denrées alimentaires ou produits chimiques
- Suivi en temps réel pendant le transport (camions frigorifiques, conteneurs)
- Détection de conditions dégradées pour déclencher une intervention
- Rapport automatique des conditions sur toute la durée d'un envoi

### Éducation & recherche
- Projet de TP pour apprendre les bases de l'IoT, du protocole MQTT et de la data viz
- Collecte de données réelles pour des travaux pratiques de Machine Learning
- Comparaison de modèles ML (LSTM vs Random Forest) sur des données issues du terrain
- Étude de la qualité de l'air dans des salles de classe (ajout capteur CO₂)

### Urbanisme & ville connectée
- Déploiement de plusieurs stations dans une ville pour cartographier les îlots de chaleur
- Alimentation d'un système d'alerte météo hyperlocal pour les habitants
- Collecte de données citoyennes (citizen science) pour enrichir des bases de données publiques
- Corrélation entre conditions climatiques et fréquentation des espaces publics