# K-Pop Discussion Hub — Édition Studio

Projet Fil Rouge **UX / Accessibilité (B3-IN — EFREI Paris)** : plateforme communautaire et magazine éditorial K-Pop conçu en conformité stricte **RGAA 4.1.2** et **WCAG 2.2 AAA**.

## Maquettes Figma

Toutes les maquettes haute fidélité (11 pages complètes, 1280px, calques éditables) et le prototype interactif (103 liens cliquables) sont consultables ici :

- **Prototype interactif Figma (Mode Play)** : https://www.figma.com/proto/jC3ZuayneQDMkdTxxKic2S?node-id=1-2&starting-point-node-id=1-2
- **Maquettes Figma (Mode Design & calques)** : https://www.figma.com/design/jC3ZuayneQDMkdTxxKic2S

## Lancement en local

Prérequis : Node.js (aucune dépendance externe requise).

```bash
node server.js
```

Puis ouvrir http://localhost:8080/index.html.

## Pages incluses

- **Accueil** (`index.html`) : Hero éditorial, Tendances & Facts (dossiers Keria T1 avec vidéo sous-titrée WebVTT, sondage live K/DA *FIRESTARTER*), Lookbook groupes et chronologie 2G → 5G.
- **Article détaillé** (`article.html`) : Lecture complète, vidéo HTML5 sous-titrée, sondage interactif et fil de commentaires réservé aux membres.
- **Forum communautaire** (`forum.html`) : Tri, votes, réponses connectées et profils illustrés.
- **Connexion & Inscription** (`login.html`) : Authentification membre, accès rapide de démonstration et mascotte interactive **Bobi**.
- **Profil Membre** (`profil.html`) : Upload et recadrage d'avatar local (`256×256`), favoris, préférences d'accessibilité et export RGPD.
- **Fiches Groupes & Culture** : `bts.html`, `blackpink.html`, `straykids.html`, `twice.html`, `newjeans.html` et `lightsticks.html`.

## Documentation du projet

- [DOSSIER_PROJET_EFREI.md](DOSSIER_PROJET_EFREI.md) — Cadrage UX et démarche projet
- [DOCUMENT_TECHNIQUE_FRONTEND.md](DOCUMENT_TECHNIQUE_FRONTEND.md) — Architecture frontend et serveur Node.js
- [ACCESSIBILITY_AUDIT.md](ACCESSIBILITY_AUDIT.md) — Audit d'accessibilité RGAA 4.1.2 / WCAG 2.2 AAA
- [LIVRABLES_DOSSIER_ET_SOUTENANCE.md](LIVRABLES_DOSSIER_ET_SOUTENANCE.md) — Livrables et support de soutenance

## Équipe

- **Nitrovinzleo** — Architecture, mascotte Bobi, finalisation UI & accessibilité
- **Matt12sw** — Serveur Node.js/API REST, design système Studio & dossiers Tendances
- **NikolaTDRV** — Fiches groupes 3G/4G/5G, dossier Lightsticks & espace Membre
- **TiboBientotInShape** — Documentation, support de soutenance & Forum communautaire
