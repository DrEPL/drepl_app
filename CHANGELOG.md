# Changelog

Tous les changements notables de ce projet sont documentés dans ce fichier.

Le format est basé sur [Keep a Changelog 1.1.0](https://keepachangelog.com/fr/1.1.0/),
et le projet suit le versioning [CalVer](https://calver.org/) au format `YYYY.M.PATCH`.

## [2026.5.0] - 2026-05-23

Première version documentée. Consolide l'ensemble du travail réalisé en mai 2026 :
mise en place de l'i18n FR/EN, panel admin Supabase, refonte des pages projet, polish
visuel du home et enrichissement DB du projet IoT.

### Added
- i18n FR/EN complet (footer, layout, contact, meta tags) avec auto-traduction HuggingFace (`Helsinki-NLP/opus-mt-fr-en`)
- Panel admin Supabase pour la gestion des projets (CRUD, upload d'images, déclenchement de la traduction)
- Pages projet enrichies : hero + sidebar Stack Technique sticky, KPI banner, sections Contexte / Problématique / Solution / Résultats, pipeline timeline verticale, équipe, adaptations possibles
- Listing projets en bento grid avec thèmes par catégorie + pagination "Load more" (5 projets par page)
- Rendu markdown sur les pages projet, logos tech aux couleurs de marque, animations au scroll
- Effet Liquid Glass sur tous les badges de projet (catégorie, FR/WO, etc.)
- Cover placeholder WO-FR (SVG) avec badges liquid-glass
- Avatar organique liquide sur le hero du home (SVG `feTurbulence` + `feDisplacementMap`)
- Icône WhatsApp à côté des numéros, drapeaux SVG sur le toggle de locale
- Enrichissement DB du projet **Système IoT avec IA Embarquée** (mini-station météo ESP32 + DHT11 + Random Forest) avec contenu FR/EN complet, KPI, pipeline en 6 étapes, équipe binôme ; markdown source ajouté
- Polish design du home : orbes ambiants animés au hero, indicateur de scroll, tech marquee en double rangée sens opposés, anneaux pulsants concentriques au CTA, lift et glow au hover sur les cards Services et Projets, border-glow doux sur la card About

### Changed
- Pages projet bilingues avec dropdown locale custom
- Refactor `portfolio` → `projets` dans toute l'app

### Fixed
- Affichage de `project.imageUrl` sur les cards du home (avec fallback icône par catégorie)
- Suppression complète de `next-auth` pour résoudre le build Vercel
- Compatibilité `null` dans l'interface `Project` pour les champs optionnels
- Sérialisation des `undefined` dans `rowToProject`
- Import direct de `services` dans `index` au lieu du passage via `getStaticProps`
