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

## Structure du projet

```text
├── index.html          # Page d'accueil Édition Studio
├── server.js           # Serveur HTTP Node.js natif + API REST + streaming vidéo
├── pages/              # Pages HTML (forum, login, profil, article, lightsticks, fiches groupes)
├── styles/             # Feuilles de style CSS (studio.css, styles.css)
├── scripts/            # Logique JavaScript (studio.js, app.js, article.js, articles-data.js)
├── assets/             # Médias (images/, images/avatars/, images/lightsticks/, images/mascot/, videos/)
└── docs/               # Dossier projet EFREI, documentation technique & audit RGAA
```

## Pages incluses

- **Accueil** (`index.html`) : Encart pub Lightsticks déroulant (code promo cadeau), Hero éditorial Keria (T1) & K/DA *FIRESTARTER*, catégorie épinglée **Débat HOT 🔥** (Manon — KATSEYE), fil Articles & Facts, Lookbook groupes et chronologie 2G → 5G.
- **Article détaillé** (`pages/article.html`) : Lecture complète, vidéo HTML5 sous-titrée, sondage interactif et fil de commentaires réservé aux membres.
- **Forum communautaire** (`pages/forum.html`) : Tri, votes, réponses connectées et profils illustrés.
- **Connexion & Inscription** (`pages/login.html`) : Authentification membre, accès rapide de démonstration et mascotte interactive **Zeri**.
- **Profil Membre** (`pages/profil.html`) : Upload et recadrage d'avatar local (`256×256`), favoris, préférences d'accessibilité et export RGPD.
- **Fiches Groupes & Culture** (`pages/`) : `bts.html`, `blackpink.html`, `straykids.html`, `twice.html`, `newjeans.html` et `lightsticks.html`.

## Documentation du projet

- [docs/DOSSIER_PROJET_EFREI.md](docs/DOSSIER_PROJET_EFREI.md) — Cadrage UX et démarche projet
- [docs/DOCUMENT_TECHNIQUE_FRONTEND.md](docs/DOCUMENT_TECHNIQUE_FRONTEND.md) — Architecture frontend et serveur Node.js
- [docs/ACCESSIBILITY_AUDIT.md](docs/ACCESSIBILITY_AUDIT.md) — Audit d'accessibilité RGAA 4.1.2 / WCAG 2.2 AAA
- [docs/LIVRABLES_DOSSIER_ET_SOUTENANCE.md](docs/LIVRABLES_DOSSIER_ET_SOUTENANCE.md) — Livrables et support de soutenance

## Équipe

- **Nitrovinzleo** — Architecture, mascotte Zeri, finalisation UI & accessibilité
- **Matt12sw** — Serveur Node.js/API REST, design système Studio & dossiers Tendances
- **NikolaTDRV** — Fiches groupes 3G/4G/5G, dossier Lightsticks & espace Membre
- **TiboBientotInShape** — Documentation, support de soutenance & Forum communautaire
