import sys
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    # 16:9 widescreen
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # Palette de couleurs du Design System
    C_DARK_GREEN = RGBColor(12, 59, 46)     # #0C3B2E
    C_ACCENT_GREEN = RGBColor(7, 38, 29)    # #07261D
    C_YELLOW = RGBColor(253, 224, 71)       # #FDE047
    C_DARK_TEXT = RGBColor(15, 23, 42)      # #0F172A
    C_MUTED_TEXT = RGBColor(51, 65, 85)     # #334155
    C_WHITE = RGBColor(255, 255, 255)
    C_BG_PAGE = RGBColor(248, 250, 252)     # #F8FAFC
    C_CARD_BG = RGBColor(255, 255, 255)
    C_BORDER = RGBColor(203, 213, 225)      # #CBD5E1
    C_ERROR_RED = RGBColor(153, 27, 27)     # #991B1B
    C_SUCCESS_GREEN = RGBColor(6, 78, 59)   # #064E3B

    blank_layout = prs.slide_layouts[6]

    def set_slide_background(slide, color):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.fill.background()
        return bg

    def add_header(slide, tag_text, title_text, dark=False):
        # Badge
        badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.5), Inches(3.2), Inches(0.42))
        badge.fill.solid()
        badge.fill.fore_color.rgb = C_YELLOW if not dark else C_YELLOW
        badge.line.fill.background()
        tf_b = badge.text_frame
        tf_b.word_wrap = True
        p_b = tf_b.paragraphs[0]
        p_b.text = tag_text.upper()
        p_b.font.size = Pt(11)
        p_b.font.bold = True
        p_b.font.color.rgb = C_DARK_GREEN
        p_b.alignment = PP_ALIGN.CENTER

        # Titre
        tx_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.95), Inches(11.7), Inches(0.9))
        tf = tx_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title_text
        p.font.size = Pt(28)
        p.font.bold = True
        p.font.color.rgb = C_WHITE if dark else C_DARK_GREEN

    # -------------------------------------------------------------
    # SLIDE 1 : PAGE DE GARDE
    # -------------------------------------------------------------
    slide1 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide1, C_DARK_GREEN)

    # Accent decoratif
    dec = slide1.shapes.add_shape(MSO_SHAPE.OVAL, Inches(9.5), Inches(-1.5), Inches(5.5), Inches(5.5))
    dec.fill.solid()
    dec.fill.fore_color.rgb = RGBColor(16, 75, 59)
    dec.line.fill.background()

    # Badge EFREI
    b_efrei = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(1.2), Inches(4.5), Inches(0.45))
    b_efrei.fill.solid()
    b_efrei.fill.fore_color.rgb = C_YELLOW
    b_efrei.line.fill.background()
    p = b_efrei.text_frame.paragraphs[0]
    p.text = "EFREI PARIS · B3 INGÉNIERIE & NUMÉRIQUE"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = C_DARK_GREEN
    p.alignment = PP_ALIGN.CENTER

    # Titre principal
    t_box = slide1.shapes.add_textbox(Inches(1.0), Inches(1.9), Inches(11.0), Inches(2.2))
    tf = t_box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "K-Pop Discussion Hub"
    p.font.size = Pt(44)
    p.font.bold = True
    p.font.color.rgb = C_WHITE

    p2 = tf.add_paragraph()
    p2.text = "Conception d'un forum accessible & éco-conçu (RGAA 4.1.2 / WCAG 2.2 AAA)"
    p2.font.size = Pt(22)
    p2.font.color.rgb = C_YELLOW

    # Cartouche de détails
    c_box = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(4.5), Inches(11.33), Inches(1.9))
    c_box.fill.solid()
    c_box.fill.fore_color.rgb = RGBColor(7, 38, 29)
    c_box.line.color.rgb = RGBColor(253, 224, 71)
    c_box.line.width = Pt(1.5)
    tf_c = c_box.text_frame
    tf_c.word_wrap = True
    
    p = tf_c.paragraphs[0]
    p.text = "PROJET FIL ROUGE UX & PROTOTYPAGE · SOUTENANCE FINALE (15 MIN)"
    p.font.bold = True
    p.font.size = Pt(14)
    p.font.color.rgb = C_YELLOW

    p = tf_c.add_paragraph()
    p.text = "• Enseignant référent : Esat BYLYKBASHI  |  Durée : 3 jours (21h)"
    p.font.size = Pt(13)
    p.font.color.rgb = C_WHITE

    p = tf_c.add_paragraph()
    p.text = "• Prototype interactif : http://localhost:8080  |  Maquette Figma Make : Accessible Forum Discussion"
    p.font.size = Pt(13)
    p.font.color.rgb = RGBColor(226, 232, 240)

    # -------------------------------------------------------------
    # SLIDE 2 : CONTEXTE & DÉFI DU PROJET
    # -------------------------------------------------------------
    slide2 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide2, C_BG_PAGE)
    add_header(slide2, "Introduction & Cadrage", "Le Contexte : Élever le débat K-Pop avec inclusion")

    # 3 colonnes de cartes
    cols = [
        ("Le Constat Réel", "La K-Pop génère des milliards d'interactions mondiales, mais les espaces actuels (X, TikTok) sont saturés de bruit, de querelles (fanwars) et de superficialité.", "1"),
        ("Le Problème UX", "Les plateformes actuelles excluent les personnes en situation de handicap (contrastes insuffisants, formulaires inaccessibles, perte de focus au clavier).", "2"),
        ("Notre Ambition", "Offrir un forum mono-page épuré, centré sur le fond musical (2e à 5e gen), 100% conforme RGAA 4.1.2 et WCAG 2.2 Niveau AAA.", "3")
    ]
    for i, (title, desc, num) in enumerate(cols):
        left = Inches(0.8 + i * 4.0)
        card = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(2.2), Inches(3.7), Inches(4.4))
        card.fill.solid()
        card.fill.fore_color.rgb = C_WHITE
        card.line.color.rgb = C_BORDER
        card.line.width = Pt(1.5)
        tf = card.text_frame
        tf.word_wrap = True
        
        # Numéro rond
        p = tf.paragraphs[0]
        p.text = f"Étape {num}"
        p.font.bold = True
        p.font.size = Pt(12)
        p.font.color.rgb = C_DARK_GREEN

        p2 = tf.add_paragraph()
        p2.text = title
        p2.font.bold = True
        p2.font.size = Pt(18)
        p2.font.color.rgb = C_DARK_TEXT
        
        p3 = tf.add_paragraph()
        p3.text = desc
        p3.font.size = Pt(14)
        p3.font.color.rgb = C_MUTED_TEXT

    # -------------------------------------------------------------
    # SLIDE 3 : 01. PERSONAS (FONDÉS SUR LA RECHERCHE)
    # -------------------------------------------------------------
    slide3 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide3, C_BG_PAGE)
    add_header(slide3, "01. Personas", "Deux Personas clés fondés sur la recherche terrain")

    personas = [
        ("Inès, 21 ans", "Étudiante B3, alternante (Mobile-first)", 
         "« Je ne veux pas scroller 10 minutes pour trouver une vraie analyse musicale. »",
         "Objectif : Participer à des débats de fond entre deux cours sans être parasitée par du spam.\nFrustrations : Boutons minuscules sur mobile, conflits toxiques entre fandoms.\nContexte : Smartphone en 4G dans le métro, temps d'attention court (5-10 min).",
         C_DARK_GREEN),
        ("Sophie, 38 ans", "Sociologue des médias (Lecteur d'écran & Clavier)", 
         "« Si l'interface ne me dit pas où est l'erreur au clavier, je quitte la page. »",
         "Objectif : Étudier la mobilisation des fans et publier des retours argumentés accessibles.\nFrustrations : Formulaires avec focus perdu, contrastes trop faibles, erreurs basées sur la couleur seule.\nContexte : Ordinateur, lecteur d'écran NVDA, navigation 100% clavier (Tab).",
         RGBColor(3, 78, 123))
    ]

    for i, (name, role, quote, body, color) in enumerate(personas):
        left = Inches(0.8 + i * 5.9)
        card = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(2.1), Inches(5.6), Inches(4.6))
        card.fill.solid()
        card.fill.fore_color.rgb = C_WHITE
        card.line.color.rgb = color
        card.line.width = Pt(2.5)
        tf = card.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = name
        p.font.bold = True
        p.font.size = Pt(20)
        p.font.color.rgb = color

        p_r = tf.add_paragraph()
        p_r.text = role
        p_r.font.bold = True
        p_r.font.size = Pt(12)
        p_r.font.color.rgb = C_MUTED_TEXT

        p_q = tf.add_paragraph()
        p_q.text = quote
        p_q.font.italic = True
        p_q.font.size = Pt(13)
        p_q.font.color.rgb = C_DARK_TEXT

        p_b = tf.add_paragraph()
        p_b.text = body
        p_b.font.size = Pt(12)
        p_b.font.color.rgb = C_MUTED_TEXT

    # -------------------------------------------------------------
    # SLIDE 4 : 02. PARCOURS UTILISATEUR (JOURNEY MAP)
    # -------------------------------------------------------------
    slide4 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide4, C_BG_PAGE)
    add_header(slide4, "02. Parcours Utilisateur", "Journey Map : La situation actuelle vs Notre solution")

    steps = [
        ("1. Déclencheur", "Envie de débattre après un clip", "😫 Irritant : Forums toxiques ou pollués", "😊 Solution : Charte d'échange saine"),
        ("2. Arrivée", "Repérage sur la page", "😫 Irritant : Défilement infini, pubs", "😊 Solution : H1 clair + Fil d'Ariane"),
        ("3. Lecture & Vote", "Avis d'experts & vote utile", "😫 Irritant : Cibles < 24px, état flou", "😊 Solution : Cibles 48px + aria-pressed"),
        ("4. Rédaction", "Saisie du message", "😫 Irritant : Erreur rouge invisible", "😊 Solution : Erreur textuelle + icône ⚠️"),
        ("5. Publication", "Confirmation & suite", "😫 Irritant : Rechargement & focus perdu", "😊 Solution : Focus automatique programmé")
    ]

    for i, (st, action, irr, sol) in enumerate(steps):
        left = Inches(0.8 + i * 2.4)
        box = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(2.2), Inches(2.25), Inches(4.5))
        box.fill.solid()
        box.fill.fore_color.rgb = C_WHITE
        box.line.color.rgb = C_BORDER
        box.line.width = Pt(1.5)
        tf = box.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = st
        p.font.bold = True
        p.font.size = Pt(13)
        p.font.color.rgb = C_DARK_GREEN

        p = tf.add_paragraph()
        p.text = action
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = C_DARK_TEXT

        p = tf.add_paragraph()
        p.text = irr
        p.font.size = Pt(10)
        p.font.color.rgb = C_ERROR_RED

        p = tf.add_paragraph()
        p.text = sol
        p.font.size = Pt(10)
        p.font.color.rgb = C_SUCCESS_GREEN

    # -------------------------------------------------------------
    # SLIDE 5 : ÉNONCÉ DU PROBLÈME (HOW MIGHT WE)
    # -------------------------------------------------------------
    slide5 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide5, C_DARK_GREEN)
    add_header(slide5, "Cadrage du problème", "La question centrale : Comment pourrions-nous... ?", dark=True)

    hmw_card = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(2.3), Inches(10.9), Inches(4.2))
    hmw_card.fill.solid()
    hmw_card.fill.fore_color.rgb = RGBColor(7, 38, 29)
    hmw_card.line.color.rgb = C_YELLOW
    hmw_card.line.width = Pt(2.0)
    tf = hmw_card.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "« Comment pourrions-nous concevoir une interface de forum communautaire qui rende la lecture et la contribution aussi intuitives et fluides pour un étudiant pressé sur mobile que pour une personne malvoyante naviguant au lecteur d'écran ? »"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = C_WHITE

    p2 = tf.add_paragraph()
    p2.text = "\nSous-défis résolus par notre prototype :"
    p2.font.size = Pt(14)
    p2.font.bold = True
    p2.font.color.rgb = C_YELLOW

    bullets = [
        "1. Garantir une navigation 100% au clavier avec des cibles tactiles confortables (≥ 48 px).",
        "2. Signaler les erreurs de saisie sans s'appuyer uniquement sur la couleur rouge.",
        "3. Déplacer dynamiquement le focus pour ne jamais perdre l'utilisateur après publication."
    ]
    for b in bullets:
        p = tf.add_paragraph()
        p.text = "• " + b
        p.font.size = Pt(13)
        p.font.color.rgb = RGBColor(226, 232, 240)

    # -------------------------------------------------------------
    # SLIDE 6 : 03. MAQUETTES & PARCOURS CLÉ
    # -------------------------------------------------------------
    slide6 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide6, C_BG_PAGE)
    add_header(slide6, "03. Maquettes & Prototype", "Le parcours clé structuré en 4 zones majeures")

    zones = [
        ("1. En-tête & A11y", "• 3 liens d'évitement au clavier\n• Outils : Grand texte & Contraste\n• Fil d'Ariane sémantique"),
        ("2. Hero & Sujet H1", "• H1 unique à fort contraste\n• Badge thématique jaune\n• Bouton Utile avec aria-pressed"),
        ("3. Fil des réponses", "• Sous-titres H3 sans rupture\n• Tri sans rechargement de page\n• Structure d'articles sémantiques"),
        ("4. Formulaire interactif", "• Labels visibles au-dessus des champs\n• Validation immédiate (blur/submit)\n• Transfert automatique de focus")
    ]
    for i, (ztitle, zdesc) in enumerate(zones):
        left = Inches(0.8 + i * 2.95)
        card = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(2.2), Inches(2.8), Inches(4.5))
        card.fill.solid()
        card.fill.fore_color.rgb = C_WHITE
        card.line.color.rgb = C_BORDER
        card.line.width = Pt(1.5)
        tf = card.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = ztitle
        p.font.bold = True
        p.font.size = Pt(15)
        p.font.color.rgb = C_DARK_GREEN

        p = tf.add_paragraph()
        p.text = zdesc
        p.font.size = Pt(12)
        p.font.color.rgb = C_MUTED_TEXT

    # -------------------------------------------------------------
    # SLIDE 7 : 03. DÉMONSTRATION EN DIRECT
    # -------------------------------------------------------------
    slide7 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide7, C_DARK_GREEN)
    add_header(slide7, "Démonstration Prototype", "Démonstration interactive en direct (6 minutes)", dark=True)

    demo_box = slide7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.5), Inches(2.3), Inches(10.3), Inches(4.2))
    demo_box.fill.solid()
    demo_box.fill.fore_color.rgb = C_WHITE
    demo_box.line.color.rgb = C_YELLOW
    demo_box.line.width = Pt(2.5)
    tf = demo_box.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "DÉROULÉ DE LA DÉMO DU PROTOTYPE (Sur http://localhost:8080) :"
    p.font.bold = True
    p.font.size = Pt(16)
    p.font.color.rgb = C_DARK_GREEN

    points = [
        ("1. Navigation Clavier & Évitement :", "Appuyer sur Tab pour dévoiler les skip links et parcourir l'ensemble de la page sans souris."),
        ("2. Outils de confort :", "Démontrer l'agrandissement de texte (+125%) et le mode contraste élevé accessible."),
        ("3. Système de vote :", "Cliquer sur 'Utile' : observer le compteur passer de 38 à 39, le toggle aria-pressed et l'annonce vocale."),
        ("4. Gestion d'erreur immédiate :", "Tenter de soumettre sans la charte : l'encart rouge d'alerte apparaît avec focus automatique et liens d'ancrage."),
        ("5. Succès & Focus dynamique :", "Cocher et soumettre : la nouvelle réponse s'insère dans le fil, et le focus se déplace dessus automatiquement.")
    ]
    for titre, expl in points:
        p = tf.add_paragraph()
        p.text = titre + " " + expl
        p.font.size = Pt(12)
        p.font.color.rgb = C_DARK_TEXT

    # -------------------------------------------------------------
    # SLIDE 8 : 04. JUSTIFICATION DES CHOIX ERGONOMIQUES
    # -------------------------------------------------------------
    slide8 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide8, C_BG_PAGE)
    add_header(slide8, "04. Justification des choix", "Heuristiques de Nielsen & Architecture de l'information")

    nielsen = [
        ("Visibilité de l'état (#1)", "Compteur de caractères en direct, pastille 'Débat ouvert', boîte de statut aria-live."),
        ("Contrôle et liberté (#3)", "Bouton d'annulation du formulaire en 1 clic, possibilité de retirer son vote."),
        ("Prévention des erreurs (#5)", "Instructions explicites d'aide sous chaque champ via aria-describedby."),
        ("Aide à la correction (#9)", "Récapitulatif cliquable qui repositionne le curseur sur le champ erroné.")
    ]
    for i, (htitle, hdesc) in enumerate(nielsen):
        row = i // 2
        col = i % 2
        left = Inches(0.8 + col * 5.9)
        top = Inches(2.2 + row * 2.3)
        card = slide8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(5.6), Inches(2.0))
        card.fill.solid()
        card.fill.fore_color.rgb = C_WHITE
        card.line.color.rgb = C_BORDER
        card.line.width = Pt(1.5)
        tf = card.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = htitle
        p.font.bold = True
        p.font.size = Pt(16)
        p.font.color.rgb = C_DARK_GREEN

        p = tf.add_paragraph()
        p.text = hdesc
        p.font.size = Pt(13)
        p.font.color.rgb = C_MUTED_TEXT

    # -------------------------------------------------------------
    # SLIDE 9 : 04. ACCESSIBILITÉ RENFORCÉE (RGAA / WCAG AAA)
    # -------------------------------------------------------------
    slide9 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide9, C_BG_PAGE)
    add_header(slide9, "04. Accessibilité", "Conformité totale RGAA 4.1.2 & WCAG 2.2 Niveau AAA")

    a11y_cards = [
        ("Contrastes AAA ≥ 7:1", "Texte ardoise sur blanc : 16.9:1\nTexte blanc sur vert sapin : 11.9:1\nBadge jaune : 11.6:1\n(Dépasse largement les 4,5:1 du AA)."),
        ("Cibles tactiles ≥ 48 px", "Tous les boutons, liens et champs ont une surface minimale de 48x48 px (dépasse les 44 px du cours)."),
        ("Focus 3 px sans ambiguïté", "Contour plein de 3 px avec contraste > 7:1 sur fond clair et > 11:1 sur fond sombre. Jamais masqué."),
        ("Non-dépendance à la couleur", "Erreurs signalées par icône ⚠️, texte 'Erreur :' et bordure 3 px. Liens systématiquement soulignés.")
    ]
    for i, (atitle, adesc) in enumerate(a11y_cards):
        left = Inches(0.8 + i * 2.95)
        card = slide9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(2.2), Inches(2.8), Inches(4.5))
        card.fill.solid()
        card.fill.fore_color.rgb = C_WHITE
        card.line.color.rgb = C_DARK_GREEN
        card.line.width = Pt(2.0)
        tf = card.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = atitle
        p.font.bold = True
        p.font.size = Pt(15)
        p.font.color.rgb = C_DARK_GREEN

        p = tf.add_paragraph()
        p.text = adesc
        p.font.size = Pt(12)
        p.font.color.rgb = C_MUTED_TEXT

    # -------------------------------------------------------------
    # SLIDE 10 : 04. TESTS UTILISATEURS & ITÉRATIONS (AVANT / APRÈS)
    # -------------------------------------------------------------
    slide10 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide10, C_BG_PAGE)
    add_header(slide10, "04. Tests & Itérations", "Tableau Avant / Après fondé sur les tests réels")

    # Table
    rows = 5
    cols_n = 3
    table_shape = slide10.shapes.add_table(rows, cols_n, Inches(0.8), Inches(2.1), Inches(11.7), Inches(4.7))
    tbl = table_shape.table
    tbl.columns[0].width = Inches(3.2)
    tbl.columns[1].width = Inches(3.8)
    tbl.columns[2].width = Inches(4.7)

    headers_t = ["Point testé / Audit", "Situation Avant (Problème)", "Itération appliquée (Solution Après)"]
    for j, h in enumerate(headers_t):
        cell = tbl.cell(0, j)
        cell.fill.solid()
        cell.fill.fore_color.rgb = C_DARK_GREEN
        p = cell.text_frame.paragraphs[0]
        p.text = h
        p.font.bold = True
        p.font.size = Pt(12)
        p.font.color.rgb = C_WHITE

    data = [
        ("1. Rendu bloquant (Lighthouse)", "Appel CSS externe bloquant l'affichage pendant 400 ms.", "Styles critiques inlinés dans <head> + script defer : 0 ms de blocage au FCP."),
        ("2. Poids document (Lighthouse)", "Fichier HTML non compressé de 32 KiB sur le réseau.", "Serveur Node.js avec Gzip niveau 9 : poids réduit à ~8 KiB (économie de 21+ KiB)."),
        ("3. Mise en cache HTTP", "Serveur Python basique sans en-têtes Cache-Control.", "En-têtes Cache-Control public, max-age long et support des ETag (HTTP 304)."),
        ("4. Focus post-publication", "Au clavier seul, le focus restait bloqué sur le bouton d'envoi.", "Transfert dynamique du focus (tabindex='-1') sur le nouvel article inséré.")
    ]
    for i, row in enumerate(data):
        for j, val in enumerate(row):
            cell = tbl.cell(i + 1, j)
            cell.fill.solid()
            cell.fill.fore_color.rgb = C_WHITE if i % 2 == 0 else C_BG_PAGE
            p = cell.text_frame.paragraphs[0]
            p.text = val
            p.font.size = Pt(11)
            p.font.color.rgb = C_DARK_TEXT

    # -------------------------------------------------------------
    # SLIDE 11 : CONCLUSION & BILAN DU PROJET
    # -------------------------------------------------------------
    slide11 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide11, C_DARK_GREEN)
    add_header(slide11, "Bilan & Perspectives", "Conclusion : Un projet UX rigoureux et universel", dark=True)

    b_card = slide11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(2.3), Inches(10.9), Inches(4.3))
    b_card.fill.solid()
    b_card.fill.fore_color.rgb = RGBColor(7, 38, 29)
    b_card.line.color.rgb = C_YELLOW
    b_card.line.width = Pt(2.0)
    tf = b_card.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "CE QUE LE PROJET DÉMONTRE POUR LE MODULE B3 EFREI :"
    p.font.bold = True
    p.font.size = Pt(16)
    p.font.color.rgb = C_YELLOW

    bilans = [
        ("L'accessibilité n'est pas une contrainte, mais un moteur de clarté :", "Le respect du RGAA 4.1.2 et des WCAG 2.2 AAA a rendu l'interface plus rapide, plus lisible et plus intuitive pour absolument tous les utilisateurs."),
        ("Une démarche de conception complète et itérative :", "De la recherche utilisateur (Personas, Journey Map) au prototype interactif fonctionnel jusqu'aux audits de performance Lighthouse."),
        ("Zéro compromis technique :", "Code Vanilla HTML5/CSS/JS natif, sans dépendance lourde, éco-conçu et hébergé sur un serveur Node.js performant.")
    ]
    for t_b, d_b in bilans:
        p = tf.add_paragraph()
        p.text = "• " + t_b + " " + d_b
        p.font.size = Pt(13)
        p.font.color.rgb = C_WHITE

    # -------------------------------------------------------------
    # SLIDE 12 : QUESTIONS & REMERCIEMENTS
    # -------------------------------------------------------------
    slide12 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide12, C_DARK_GREEN)

    t_box = slide12.shapes.add_textbox(Inches(1.5), Inches(2.2), Inches(10.3), Inches(2.5))
    tf = t_box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Merci pour votre attention !"
    p.font.size = Pt(48)
    p.font.bold = True
    p.font.color.rgb = C_WHITE
    p.alignment = PP_ALIGN.CENTER

    p2 = tf.add_paragraph()
    p2.text = "Avez-vous des questions ?"
    p2.font.size = Pt(26)
    p2.font.color.rgb = C_YELLOW
    p2.alignment = PP_ALIGN.CENTER

    p3 = tf.add_paragraph()
    p3.text = "\nDémo disponible en direct sur http://localhost:8080"
    p3.font.size = Pt(16)
    p3.font.color.rgb = RGBColor(226, 232, 240)
    p3.alignment = PP_ALIGN.CENTER

    output_path = r"c:\Users\vhoeb\Desktop\Ecole\B3\UX\Presentation_Soutenance_Kpop_UX.pptx"
    prs.save(output_path)
    print(f"Présentation créée avec succès : {output_path}")

if __name__ == '__main__':
    create_deck()
