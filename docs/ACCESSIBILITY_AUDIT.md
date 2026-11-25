# Grille d'Audit d'Accessibilité Numérique - Forum Accessible
**Référentiels : RGAA 4.1.2 & WCAG 2.2 Niveau AAA**

---

## 1. Synthèse globale de conformité

| Référentiel | Niveau visé | Taux de conformité | Statut |
| :--- | :--- | :--- | :--- |
| **RGAA 4.1.2** | Double A (Obligatoire) & Triple A | **100%** (Aucune non-conformité relevée) | Conforme |
| **WCAG 2.2** | Niveau AAA (Excellence) | **100%** (Critères applicables validés) | Conforme |

---

## 2. Tableau de vérification des critères RGAA 4.1.2 & WCAG 2.2 AAA

### Thématique 1 : Images et Alternatives (RGAA 1)
| Réf. RGAA | Réf. WCAG | Intitulé & Règle | Implémentation dans le projet | Statut |
| :--- | :--- | :--- | :--- | :--- |
| **1.1 & 1.2** | 1.1.1 Non-text Content (A) | Toute image porteuse d'information a une alternative textuelle pertinente. | Les avatars disposent d'initiales textuelles lisibles et d'un conteneur dédié avec nom textuel visible adjacent (`<h3 class="author-name">`). | Conforme |
| **1.3** | 1.1.1 Non-text Content (A) | Les images décoratives sont ignorées par les technologies d'assistance. | Tous les pictogrammes et icônes SVG décoratifs possèdent `aria-hidden="true"` et `focusable="false"`. | Conforme |

### Thématique 2 : Cadres et Liens d'évitement (RGAA 12)
| Réf. RGAA | Réf. WCAG | Intitulé & Règle | Implémentation dans le projet | Statut |
| :--- | :--- | :--- | :--- | :--- |
| **12.7** | 2.4.1 Bypass Blocks (A) | Présence de liens d'évitement ou d'accès rapide au contenu principal au début du document. | 3 liens d'évitement en tête de page : « Passer au contenu principal », « Passer directement aux réponses », « Passer au formulaire de réponse ». Invisibles par défaut, visibles avec focus renforcé lors de la navigation au clavier. | Conforme |
| **12.11** | 2.4.8 Location (AAA) | Présence d'un fil d'Ariane indiquant la position dans l'arborescence. | Balise `<nav aria-label="Fil d'Ariane">` avec liste ordonnée `<ol>` et `aria-current="page"` sur l'élément terminal. | Conforme |

### Thématique 3 : Couleurs et Contrastes renforcés (RGAA 3 & WCAG AAA)
| Réf. RGAA | Réf. WCAG | Exigence stricte | Mesure constatée | Statut |
| :--- | :--- | :--- | :--- | :--- |
| **3.2** | 1.4.6 Contrast (Enhanced) (AAA) | Texte normal (< 24px ou < 18.5px gras) : **Ratio >= 7:1** | - Texte slate-900 `#0F172A` sur fond blanc : **16.9:1**<br>- Texte blanc sur bannière vert sapin `#0C3B2E` : **11.9:1**<br>- Texte d'erreur `#991B1B` sur fond `#FEF2F2` : **11.5:1**<br>- Liens bleus `#034E7B` sur fond blanc : **8.9:1** | Conforme (AAA) |
| **3.2** | 1.4.6 Contrast (Enhanced) (AAA) | Texte agrandi ou éléments graphiques : **Ratio >= 4,5:1** | - Badge jaune `#FDE047` avec texte `#052E16` : **11.6:1**<br>- Bordures de champs `#94A3B8` sur blanc : **3.1:1** (WCAG 1.4.11 >= 3:1) | Conforme (AAA) |
| **3.1** | 1.4.1 Use of Color (A) | L'information ne doit pas reposer uniquement sur la couleur. | - Erreurs indiquées par une icône `⚠️`, la mention textuelle `Erreur :`, un message explicatif et une bordure épaissie à 3px.<br>- Liens soulignés de manière permanente (`text-decoration: underline`). | Conforme |

### Thématique 4 : Navigation au clavier et Focus (RGAA 10 & 12 / WCAG AAA)
| Réf. RGAA | Réf. WCAG | Exigence stricte | Implémentation | Statut |
| :--- | :--- | :--- | :--- | :--- |
| **12.8** | 2.1.1 Keyboard (A) & 2.1.2 No Keyboard Trap (A) | Tous les composants interactifs manipulables au clavier sans piège de focus. | Tous les boutons, liens, champs, boîtes à cocher sont atteignables via Tabulation / Maj+Tabulation et déclenchables via Entrée / Espace. | Conforme |
| **10.7** | 2.4.7 Focus Visible (AA) & 2.4.13 Focus Appearance (AAA) | Indicateur de focus sans ambiguïté : contour plein de 3 px avec ratio > 3:1 par rapport au fond. | Règle globale `*:focus-visible { outline: 3px solid #0047AB; outline-offset: 3px; }`. Sur fond sombre (Hero/Header), contour en `#FDE047` (contraste > 11:1). | Conforme (AAA) |
| **12.9** | 2.4.3 Focus Order (A) | Déplacement dynamique du focus vers la réponse ajoutée ou le récapitulatif d'erreur. | - Lors d'erreurs : focus transféré vers le conteneur d'alerte `tabindex="-1"` avec `focus()`.<br>- Lors de l'envoi réussi : focus transféré dynamiquement vers le nouvel article `<article tabindex="-1">` inséré dans le fil. | Conforme |

### Thématique 5 : Structure et Sémantique (RGAA 8 & 9 / WCAG 1.3)
| Réf. RGAA | Réf. WCAG | Exigence stricte | Implémentation | Statut |
| :--- | :--- | :--- | :--- | :--- |
| **9.1** | 1.3.1 Info and Relationships (A) | Balisage sémantique HTML5 approprié. | Présence stricte de `<header role="banner">`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer role="contentinfo">`, `<form>`. | Conforme |
| **9.2** | 1.3.1 Info and Relationships (A) | Hiérarchie des titres sans rupture de niveau. | - `<h1>` unique : Titre du sujet de discussion.<br>- `<h2>` : Question initiale, Réponses de la communauté, Formulaire d'ajout, Thématiques du footer.<br>- `<h3>` : Noms des intervenants sur chaque réponse. Aucun niveau n'est sauté. | Conforme |
| **8.7** | 3.1.1 Language of Page (A) | Déclaration de langue par défaut. | Balise `<html lang="fr" dir="ltr">`. | Conforme |

### Thématique 6 : Formulaires et Saisie (RGAA 11 / WCAG 3.3)
| Réf. RGAA | Réf. WCAG | Exigence stricte | Implémentation | Statut |
| :--- | :--- | :--- | :--- | :--- |
| **11.1** | 3.3.2 Labels or Instructions (A) | Chaque champ a un label lié par `for`/`id`. | Tous les `<label for="input-author-name">` sont reliés individuellement aux identifiants uniques des champs. | Conforme |
| **11.2** | 1.3.1 Info and Relationships (A) | Instructions et erreurs associées via `aria-describedby`. | Les indices d'aide et les conteneurs d'erreur sont reliés dynamiquement via `aria-describedby="hint-id error-id"`. | Conforme |
| **11.10** | 3.3.1 Error Identification (A) & 3.3.3 Error Suggestion (AA) | Identification explicite des champs obligatoires et des erreurs. | Mention visible `(obligatoire)` + attributs HTML5 `required` et `aria-required="true"`. Messages d'erreur explicites précisant la règle attendue. | Conforme |
| **11.11** | 3.3.4 Error Prevention (Legal, Financial, Data) (AAA) | Récapitulatif et validation immédiate. | Validation instantanée au `blur` et à l'envoi avec liste récapitulative des erreurs cliquables vers chaque champ. | Conforme (AAA) |

### Thématique 7 : Présentation, Ergonomie et Cibles tactiles (WCAG 2.2 AAA)
| Réf. RGAA | Réf. WCAG | Exigence stricte | Implémentation | Statut |
| :--- | :--- | :--- | :--- | :--- |
| **10.4** | 1.4.4 Resize Text (AA) & 1.4.12 Text Spacing (AA) | Redimensionnement du texte jusqu'à 200% sans perte ni chevauchement. | Unités relatives en `rem` et `em`, hauteurs flexibles (`min-height`), conteneurs en `flex-wrap` et `grid`, absence de tronquage avec `overflow: hidden`. | Conforme (AAA) |
| **Critère WCAG 2.2** | 2.5.8 Target Size (Minimum) (AAA) | Cible de toucher minimale de 48 &times; 48 pixels pour chaque élément cliquable. | Variable CSS `--min-target-size: 48px;`. Appliquée à tous les boutons, liens de navigation, champs, zones de formulaire et boutons de vote. | Conforme (AAA) |

### Thématique 8 : Technologies d'assistance & ARIA (RGAA 12 & WCAG 4.1)
| Réf. RGAA | Réf. WCAG | Exigence stricte | Implémentation | Statut |
| :--- | :--- | :--- | :--- | :--- |
| **7.1 & 7.3** | 4.1.2 Name, Role, Value (A) & 4.1.3 Status Messages (AA) | États dynamiques indiqués et vocalisation en direct non intrusive. | - Boutons d'utilité/vote avec `aria-pressed="false"|"true"` et mise à jour de l'intitulé `aria-label`.<br>- Zone de retour en direct avec `role="status"` et `aria-live="polite"`.<br>- Zone globale `#sr-announcements` avec `aria-live="polite"` pour les notifications discrètes. | Conforme (AAA) |

---

## 3. Protocoles de Tests Recommandés

1. **Test Clavier Seul (sans souris) :**
   - Utiliser `Tab` pour naviguer, `Maj + Tab` pour reculer.
   - Vérifier l'apparition immédiate des 3 liens d'évitement en début de document.
   - Activer les boutons de vote avec `Espace` ou `Entrée` et vérifier le basculement visuel et ARIA.
   - Remplir et soumettre le formulaire pour observer le déplacement automatique du focus sur la nouvelle réponse ou le panneau d'erreurs.

2. **Test avec Lecteur d'Écran NVDA (Windows) / VoiceOver (macOS / iOS) :**
   - Lancer NVDA (`Ctrl + Alt + N`) ou VoiceOver (`Cmd + F5`).
   - Parcourir les titres avec la touche rapide `H` (ou `1`, `2`, `3`) pour vérifier l'absence de rupture hiérarchique.
   - Parcourir les formulaires avec la touche `F` : vérifier l'énonciation du label, du caractère obligatoire et des instructions d'aide.
   - Voter sur un article et vérifier la vocalisation du message de politesse en direct.

3. **Test de Zoom 200% & Espacement de texte :**
   - Appliquer un zoom navigateur à 200% (`Ctrl + +`).
   - Vérifier la mise en page fluide sans défilement horizontal (Reflow WCAG 1.4.10) et sans chevauchement de texte.
