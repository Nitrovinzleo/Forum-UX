# Dossier Projet Fil Rouge - UX & Prototypage (EFREI B3)
**Sujet : Forum Accessible & Inclusif (Culture K-Pop & Vague Hallyu)**
**Évaluation : Dossier (15 pages max) & Soutenance (15 minutes)**

---

## 1. Page de garde & Synthèse du projet

* **Titre du projet :** K-Pop Discussion Hub - Forum Accessible & Éco-conçu
* **Cadre :** Bachelor Ingénierie & Numérique - B3 EFREI (Module UX et Prototypage - M. Esat Bylykbashi)
* **Lien Prototype fonctionnel :** `http://localhost:8080`
* **Lien Maquette Figma :** [Lien du projet Figma](https://www.figma.com/make/q6aEO2r3nwkQWn48oqRFuN/Accessible-Forum-Discussion-Page?t=wwdsAJNGpfxayFqU-0)
* **Ambition :** Créer un espace communautaire de débats passionnés sur la K-Pop, 100% conforme au **RGAA 4.1.2** et aux normes **WCAG 2.2 niveau AAA**, sans compromis sur l'expérience visuelle et l'interactivité.

---

## 2. Synthèse de la Recherche Utilisateur & Benchmark

### A. Entretiens utilisateurs menés (Insights clés)
* **Interview 1 (Fan de K-Pop sur mobile, 21 ans) :** « Les applications comme Weverse ou Twitter sont saturées de popups et de vidéos automatiques. On ne trouve pas de débats de fond sans être interrompu ou agressé visuellement. »
* **Interview 2 (Utilisateur malvoyant naviguant au zoom 200%, 25 ans) :** « Souvent, quand j'augmente la taille du texte sur un forum, les boutons se chevauchent ou les messages sont tronqués par des boîtes fixes. »
* **Interview 3 (Utilisatrice naviguant au clavier seul, 29 ans) :** « Rares sont les formulaires où le focus ne disparaît pas dans la nature après avoir validé une réponse. »

### B. Benchmark concurrentiel (3 solutions analysées)
| Plateforme | Forces observées | Faiblesses & Freins UX | Pratiques retenues |
| :--- | :--- | :--- | :--- |
| **Reddit** | Forte structuration des fils de discussion et votes. | Contrastes insuffisants, hiérarchie visuelle dense et anxiogène. | Système de vote/utilité explicite avec retour direct. |
| **Weverse** | Forte proximité idoles/fans, multilingue. | Application lourde, navigation complexe, accessibilité clavier quasi-nulle. | Fil d'Ariane clair et catégorisation thématique épurée. |
| **Forum OpenClassrooms** | Clarté des réponses, code couleur identifiable. | Formulaire rigide, retours d'erreurs reposant trop sur la couleur. | Labels au-dessus des champs et liens directs vers les erreurs. |

---

## 3. Personas & Cartes d'Empathie

### Persona 1 : Lucas, 21 ans (Étudiant passionné & Modérateur)
* **Identité :** Étudiant en B3, consulte le forum sur mobile entre deux cours et sur PC le soir.
* **Objectif :** Lancer des débats constructifs sur l'évolution musicale et les concepts des groupes de 4e et 5e génération.
* **Frustrations :** Les forums pollués par les conflits de fandoms (*fanwars*), le manque de clarté dans la modération.
* **Citation :** *« Je veux un espace propre où l'on peut débattre d'accords et de production sans scroll infini toxique. »*

#### Carte d'empathie de Lucas :
* **Dit :** « Pourquoi les morceaux de K-Pop ne font plus que 2 minutes ? »
* **Pense :** « J'espère que mon message va susciter des réponses argumentées et non du simple spam. »
* **Fait :** Rédige des questions détaillées avec des sous-points précis, vote sur les réponses utiles.
* **Ressent :** Passionné par l'industrie musicale, agacé par les interfaces encombrées.

---

### Persona 2 : Sophie, 38 ans (Sociologue, navigation au lecteur d'écran NVDA)
* **Identité :** Chercheuse en sciences sociales, malvoyante, utilise le lecteur d'écran et la navigation au clavier.
* **Objectif :** Lire les avis de la communauté et apporter un regard sociologique sur les fandoms mondiaux.
* **Frustrations :** Les formulaires avec des erreurs invisibles vocalement, l'absence de liens d'évitement.
* **Citation :** *« Si je ne peux pas savoir quel champ pose problème au clavier, je quitte la page immédiatement. »*

#### Carte d'empathie de Sophie :
* **Dit :** « Le lecteur d'écran doit me lire les instructions sans que j'aie à chercher partout. »
* **Pense :** « Enfin un site où le contour de focus est visible et où chaque bouton a un label clair ! »
* **Fait :** Utilise la touche `Tab`, consulte les articles via la touche `H` (titres).
* **Ressent :** Soulagement et efficacité face à une interface prédictive et sans piège de focus.

---

## 4. Parcours Utilisateur & Énoncé du Problème

### A. Journey Map (Parcours actuel de publication)
1. **Déclencheur :** Découverte d'un nouveau clip de K-Pop et envie de débattre de la production.
2. **Recherche :** Arrivée sur le fil via le fil d'Ariane ou lien direct.
3. **Action :** Lecture de la question initiale, consultation des 3 avis experts, vote d'utilité.
4. **Attente :** Rédaction de sa propre analyse dans le formulaire dédié.
5. **Résultat :** Confirmation vocale et visuelle immédiate, focus automatique sur la réponse publiée.

### B. Énoncé du problème (« Comment pourrions-nous... ? »)
> **« Comment pourrions-nous concevoir une interface de forum communautaire qui rende la lecture et la contribution aussi intuitives et fluides pour un étudiant sur mobile que pour une personne malvoyante naviguant au lecteur d'écran ? »**
* *Comment pourrions-nous signaler les erreurs de saisie sans jamais dépendre uniquement de la couleur rouge ?*
* *Comment pourrions-nous déplacer le focus intelligemment pour ne jamais perdre l'utilisateur au clavier ?*

---

## 5. Mini Design System

### A. Palette de Couleurs (Ratios WCAG AAA $\ge$ 7:1)
* **Couleur Principale :** `#0C3B2E` (Vert sapin profond, évoque la maturité et la sérénité).
* **Couleur d'Accent :** `#FDE047` (Jaune solaire haute visibilité, contraste **11.6:1** avec texte `#052E16`).
* **Neutres :** `#FFFFFF` (Fonds cartes), `#F8FAFC` (Fond de page), `#0F172A` (Texte principal, contraste **16.9:1**).
* **Couleurs d'état :**
  * Succès : `#064E3B` sur fond `#ECFDF5` (contraste **9.6:1**).
  * Erreur : `#991B1B` sur fond `#FEF2F2` (contraste **11.5:1**).

### B. Typographie & Composants
* **Typographie :** Système natif moderne sans empattement (`system-ui`, `-apple-system`, `Roboto`, `Segoe UI`).
* **Échelle :** H1 (36px), H2 (28px), H3 (18px), Corps de texte (17px / 1.0625rem), Métadonnées (14px).
* **Boutons :** Cibles minimales systématiques de **48 &times; 48 px**.
* **Indicateur de focus universel :** Contour plein de **3 px** (`#0047AB` / `#FDE047`).

---

## 6. Tests Utilisateurs & Itérations (Avant / Après)

| Problème identifié lors des tests | Retour utilisateur / Verbatim | Décision & Itération appliquée (Après) |
| :--- | :--- | :--- |
| **Feuille de style externe bloquante** | L'audit Lighthouse indiquait un gain de 400 ms dû aux ressources bloquantes. | Styles CSS critiques inlinés directement dans `<head>` et script en `defer`. Gain : **FCP quasi-instantané (0 ms de blocage)**. |
| **Poids du document HTML** | Transfert non compressé de 32 KiB sur réseau mobile. | Serveur Node.js configuré avec compression **Gzip niveau 9** (`Content-Encoding: gzip`). Poids réduit à **~8 KiB** (**économie de plus de 21 KiB**). |
| **Visibilité des champs en erreur** | « Si je ne vois pas les couleurs, comment savoir quel champ est en faute ? » | Ajout systématique d'une icône `⚠️`, du préfixe textuel « Erreur : », d'un encart récapitulatif cliquable et d'une bordure de 3 px. |
| **Perte de focus après envoi** | L'utilisateur au clavier devait retaper 15 fois sur Tab pour retrouver son message. | Déplacement dynamique programmé : `newArticle.focus()` avec `tabindex="-1"` et scroll doux centré. |

---

## 7. Structure de la Soutenance (15 minutes chrono)

| Timing | Partie | Contenu présenté par le groupe |
| :--- | :--- | :--- |
| **1 min** | **Contexte & Équipe** | Présentation des membres, du sujet K-Pop et de l'objectif d'inclusivité universelle. |
| **3 min** | **Recherche Utilisateur** | Présentation des 2 personas (Lucas et Sophie), des irritants identifiés et du benchmark. |
| **1 min** | **Définition du Problème** | Énoncé du « Comment pourrions-nous... ? » et contraintes fortes (WCAG AAA / RGAA). |
| **6 min** | **Démonstration en direct** | • Démonstration de la navigation au clavier seul (`Tab`, liens d'évitement).<br>• Vote d'utilité avec vocalisation.<br>• Simulation d'erreur de saisie (récapitulatif accessible cliquable).<br>• Envoi réussi et transfert dynamique du focus vers la nouvelle réponse. |
| **2 min** | **Tests & Itérations** | Présentation du tableau Avant/Après et des optimisations de performance (Lighthouse/Gzip). |
| **2 min** | **Justification des choix** | Présentation du Mini Design System et de la grille d'audit de conformité à 100%. |
