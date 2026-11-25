/**
 * K-POP DISCUSSION HUB - JAVASCRIPT GLOBAL
 * Conformité : RGAA 4.1.2 & WCAG 2.2 AAA
 * 
 * Modules :
 * 1. Barre d'accessibilité persistante (Grand texte, Contraste élevé, Paillettes on/off)
 * 2. Gestion de session utilisateur (Connexion, Déconnexion, Démo 1-clic)
 * 3. Logique de la page Login (Toggle mot de passe, validation, API)
 * 4. Logique du Forum (Validation en direct, votes, tri, API REST, annonces vocales)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Zone d'annonces vocales pour technologies d'assistance
  const srAnnouncements = document.getElementById('sr-announcements');

  /**
   * Vocalise un message pour les lecteurs d'écran (NVDA, JAWS, VoiceOver).
   * @param {string} message 
   */
  function announceToScreenReader(message) {
    if (!srAnnouncements) return;
    srAnnouncements.textContent = '';
    setTimeout(() => {
      srAnnouncements.textContent = message;
    }, 50);
  }

  // ==========================================================================
  // 1. BARRE D'ACCESSIBILITÉ PERSISTANTE (AVEC LOCALSTORAGE)
  // ==========================================================================
  const btnTextSize = document.getElementById('btn-text-size');
  const btnHighContrast = document.getElementById('btn-high-contrast');
  const btnSparklesToggle = document.getElementById('btn-sparkles-toggle');
  const sparklesBtnText = document.getElementById('sparkles-btn-text');

  // Restauration des préférences sauvegardées
  if (localStorage.getItem('kpop_a11y_large_text') === 'true') {
    document.body.classList.add('large-text-mode');
    if (btnTextSize) {
      btnTextSize.setAttribute('aria-pressed', 'true');
      btnTextSize.setAttribute('aria-label', 'Rétablir la taille normale du texte');
    }
  }

  if (localStorage.getItem('kpop_a11y_high_contrast') === 'true') {
    document.body.classList.add('high-contrast-mode');
    if (btnHighContrast) {
      btnHighContrast.setAttribute('aria-pressed', 'true');
      btnHighContrast.setAttribute('aria-label', 'Désactiver le mode contraste élevé');
    }
  }

  if (localStorage.getItem('kpop_a11y_sparkles') === 'false') {
    document.body.classList.add('no-sparkles');
    if (btnSparklesToggle) {
      btnSparklesToggle.setAttribute('aria-pressed', 'false');
      btnSparklesToggle.setAttribute('aria-label', 'Activer les animations et paillettes');
      if (sparklesBtnText) sparklesBtnText.textContent = 'Paillettes : Coupées';
    }
  }

  // Toggle Grand Texte (125%)
  if (btnTextSize) {
    btnTextSize.addEventListener('click', () => {
      const isLarge = document.body.classList.toggle('large-text-mode');
      btnTextSize.setAttribute('aria-pressed', isLarge ? 'true' : 'false');
      btnTextSize.setAttribute('aria-label', isLarge ? 'Rétablir la taille normale du texte' : 'Agrandir la taille du texte à 125%');
      localStorage.setItem('kpop_a11y_large_text', isLarge);
      announceToScreenReader(`Affichage grand texte ${isLarge ? 'activé' : 'désactivé'}.`);
    });
  }

  // Toggle Contraste Élevé Renforcé
  if (btnHighContrast) {
    btnHighContrast.addEventListener('click', () => {
      const isHigh = document.body.classList.toggle('high-contrast-mode');
      btnHighContrast.setAttribute('aria-pressed', isHigh ? 'true' : 'false');
      btnHighContrast.setAttribute('aria-label', isHigh ? 'Désactiver le mode contraste élevé' : 'Activer le mode contraste élevé');
      localStorage.setItem('kpop_a11y_high_contrast', isHigh);
      announceToScreenReader(`Mode contraste élevé ${isHigh ? 'activé' : 'désactivé'}.`);
    });
  }

  // Toggle Paillettes & Animations
  if (btnSparklesToggle) {
    btnSparklesToggle.addEventListener('click', () => {
      const noSparkles = document.body.classList.toggle('no-sparkles');
      const sparklesActive = !noSparkles;
      btnSparklesToggle.setAttribute('aria-pressed', sparklesActive ? 'true' : 'false');
      btnSparklesToggle.setAttribute('aria-label', sparklesActive ? 'Désactiver les animations et paillettes' : 'Activer les animations et paillettes');
      if (sparklesBtnText) {
        sparklesBtnText.textContent = sparklesActive ? 'Paillettes : Activées' : 'Paillettes : Coupées';
      }
      localStorage.setItem('kpop_a11y_sparkles', sparklesActive);
      announceToScreenReader(`Animations et paillettes ${sparklesActive ? 'activées' : 'désactivées'}.`);
    });
  }

  // ==========================================================================
  // 2. GESTION DE SESSION UTILISATEUR & NAVBAR
  // ==========================================================================
  const navUserItem = document.getElementById('nav-user-item');

  function updateNavbarSession() {
    if (!navUserItem) return;
    const sessionRaw = localStorage.getItem('kpop_user_session');
    if (sessionRaw) {
      try {
        const user = JSON.parse(sessionRaw);
        navUserItem.innerHTML = `
          <div style="display: inline-flex; align-items: center; gap: 0.45rem;">
            <a href="/pages/profil.html" class="st-nav-link st-nav-cta" aria-label="Accéder au profil de ${escapeHtml(user.name)}">
              <span>${escapeHtml(user.name)}</span>
            </a>
            <button type="button" id="btn-nav-logout" class="st-btn st-btn-ghost" style="min-height: 40px; padding: 0.3rem 0.7rem; font-size: 0.825rem;" aria-label="Se déconnecter">
              Quitter
            </button>
          </div>
        `;
        const btnLogout = document.getElementById('btn-nav-logout');
        if (btnLogout) {
          btnLogout.addEventListener('click', () => {
            localStorage.removeItem('kpop_user_session');
            announceToScreenReader('Vous avez été déconnecté.');
            updateNavbarSession();
            window.location.reload();
          });
        }
      } catch (e) {
        localStorage.removeItem('kpop_user_session');
      }
    }
  }
  updateNavbarSession();

  // ==========================================================================
  // 3. LOGIQUE DE LA PAGE DE CONNEXION (/pages/login.html)
  // ==========================================================================
  const loginForm = document.getElementById('login-form');
  const inputLoginId = document.getElementById('input-login-id');
  const inputLoginPwd = document.getElementById('input-login-pwd');
  const btnTogglePwd = document.getElementById('btn-toggle-pwd');
  const pwdToggleIcon = document.getElementById('pwd-toggle-icon');
  const btnQuickDemoLogin = document.getElementById('btn-quick-demo-login');
  const loginFeedbackAlert = document.getElementById('login-feedback-alert');
  const btnSubmitLogin = document.getElementById('btn-submit-login');

  // Toggle Afficher/Masquer Mot de Passe
  if (btnTogglePwd && inputLoginPwd) {
    btnTogglePwd.addEventListener('click', () => {
      const isPassword = inputLoginPwd.getAttribute('type') === 'password';
      inputLoginPwd.setAttribute('type', isPassword ? 'text' : 'password');
      btnTogglePwd.setAttribute('aria-pressed', isPassword ? 'true' : 'false');
      btnTogglePwd.setAttribute('aria-label', isPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe en clair');
      if (pwdToggleIcon) {
        pwdToggleIcon.textContent = isPassword ? 'Masquer' : 'Afficher';
      } else {
        btnTogglePwd.textContent = isPassword ? 'Masquer' : 'Afficher';
      }
      announceToScreenReader(isPassword ? 'Mot de passe affiché en clair' : 'Mot de passe masqué');
    });
  }

  // Connexion Rapide Démo 1-Clic
  if (btnQuickDemoLogin) {
    btnQuickDemoLogin.addEventListener('click', async () => {
      if (inputLoginId) inputLoginId.value = 'minji.park@kpop-hub.fr';
      if (inputLoginPwd) inputLoginPwd.value = 'KpopDream2026!';
      announceToScreenReader('Identifiants de démonstration insérés. Connexion en cours...');
      await executeLogin('Min-ji Park', 'Fan VIP & Chercheuse 2nd Gen');
    });
  }

  // Soumission classique du formulaire de connexion
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const loginId = inputLoginId ? inputLoginId.value.trim() : '';
      const loginPwd = inputLoginPwd ? inputLoginPwd.value : '';

      const idError = document.getElementById('login-id-error');
      const pwdError = document.getElementById('login-pwd-error');

      let hasError = false;

      // Validation de l'identifiant
      if (!loginId || loginId.length < 3) {
        hasError = true;
        if (inputLoginId) inputLoginId.setAttribute('aria-invalid', 'true');
        if (idError) {
          idError.textContent = 'Veuillez saisir un identifiant valide (au moins 3 caractères).';
          idError.hidden = false;
        }
      } else {
        if (inputLoginId) inputLoginId.setAttribute('aria-invalid', 'false');
        if (idError) idError.hidden = true;
      }

      // Validation du mot de passe
      if (!loginPwd || loginPwd.length < 4) {
        hasError = true;
        if (inputLoginPwd) inputLoginPwd.setAttribute('aria-invalid', 'true');
        if (pwdError) {
          pwdError.textContent = 'Le mot de passe doit comporter au moins 4 caractères.';
          pwdError.hidden = false;
        }
      } else {
        if (inputLoginPwd) inputLoginPwd.setAttribute('aria-invalid', 'false');
        if (pwdError) pwdError.hidden = true;
      }

      if (hasError) {
        if (loginFeedbackAlert) {
          loginFeedbackAlert.className = 'feedback-alert alert-error';
          loginFeedbackAlert.hidden = false;
          loginFeedbackAlert.innerHTML = `<strong>Erreur de saisie :</strong> Veuillez vérifier les champs requis ci-dessus.`;
          loginFeedbackAlert.focus();
        }
        announceToScreenReader('Le formulaire de connexion contient des erreurs.');
        return;
      }

      const displayName = loginId.includes('@') ? loginId.split('@')[0] : loginId;
      await executeLogin(displayName, 'Membre passionné');
    });
  }

  async function executeLogin(userName, userRole) {
    if (btnSubmitLogin) {
      btnSubmitLogin.disabled = true;
      btnSubmitLogin.setAttribute('aria-busy', 'true');
      btnSubmitLogin.innerHTML = `<span>⏳</span> Connexion en cours...`;
    }

    try {
      await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userName, role: userRole })
      }).catch(() => null);
    } catch (err) {}

    // Enregistrement de la session
    const sessionData = {
      name: userName,
      role: userRole,
      loggedAt: new Date().toISOString()
    };
    localStorage.setItem('kpop_user_session', JSON.stringify(sessionData));

    if (loginFeedbackAlert) {
      loginFeedbackAlert.className = 'feedback-alert alert-success';
      loginFeedbackAlert.hidden = false;
      loginFeedbackAlert.innerHTML = `<strong>✨ Bienvenue ${escapeHtml(userName)} !</strong> Connexion réussie. Redirection vers l'accueil...`;
    }

    announceToScreenReader(`Connexion réussie. Bienvenue ${userName}. Redirection en cours.`);

    setTimeout(() => {
      window.location.href = '/index.html';
    }, 700);
  }

  // ==========================================================================
  // 4. LOGIQUE DU FORUM (/pages/forum.html)
  // ==========================================================================
  const replyForm = document.getElementById('reply-form');
  const inputAuthorName = document.getElementById('input-author-name');
  const inputAuthorRole = document.getElementById('input-author-role');
  const inputAuthorEmail = document.getElementById('input-author-email');
  const textareaReplyMessage = document.getElementById('textarea-reply-message');
  const checkboxCharterConsent = document.getElementById('checkbox-charter-consent');
  const charCounter = document.getElementById('current-char-count');
  const formFeedbackAlert = document.getElementById('form-feedback-alert');
  const responsesList = document.getElementById('responses-list');
  const responsesBadgeCount = document.getElementById('responses-badge-count');
  const countNumber = document.getElementById('count-number');
  const sortSelect = document.getElementById('sort-replies-select');
  const btnSubmitReply = document.getElementById('btn-submit-reply');

  let currentRepliesCount = 3;

  // Pré-remplir le formulaire si un utilisateur est connecté
  const currentSession = localStorage.getItem('kpop_user_session');
  if (currentSession && inputAuthorName) {
    try {
      const user = JSON.parse(currentSession);
      inputAuthorName.value = user.name;
      if (inputAuthorRole) inputAuthorRole.value = user.role;
    } catch (e) {}
  }

  // Compteur de caractères du message
  if (textareaReplyMessage && charCounter) {
    textareaReplyMessage.addEventListener('input', () => {
      const len = textareaReplyMessage.value.length;
      charCounter.textContent = len;
    });
  }

  // Gestion des boutons de vote d'utilité (bistables aria-pressed)
  function setupUtilityVoteButtons(container = document) {
    const voteButtons = container.querySelectorAll('.btn-utility');
    voteButtons.forEach((btn) => {
      if (btn.dataset.initialized) return;
      btn.dataset.initialized = 'true';

      btn.addEventListener('click', () => {
        const isCurrentlyPressed = btn.getAttribute('aria-pressed') === 'true';
        let votes = parseInt(btn.dataset.votes, 10) || 0;
        const badge = btn.querySelector('.utility-badge');
        const card = btn.closest('.post-card');
        const authorHeading = card ? card.querySelector('.author-name') : null;
        const authorName = authorHeading ? authorHeading.textContent.trim() : 'ce message';

        if (!isCurrentlyPressed) {
          votes += 1;
          btn.dataset.votes = votes;
          btn.setAttribute('aria-pressed', 'true');
          if (badge) badge.textContent = votes;
          btn.setAttribute('aria-label', `Réponse de ${authorName} marquée comme utile. Actuellement ${votes} votes. Cliquez pour annuler.`);
          announceToScreenReader(`Vous avez voté pour le message de ${authorName}. Total des votes : ${votes}.`);

          // Synchronisation API REST
          if (card && card.id) {
            const numericId = card.id.replace(/\D/g, '');
            if (numericId) {
              fetch(`/api/replies/${numericId}/vote`, { method: 'POST' }).catch(() => null);
            }
          }
        } else {
          votes = Math.max(0, votes - 1);
          btn.dataset.votes = votes;
          btn.setAttribute('aria-pressed', 'false');
          if (badge) badge.textContent = votes;
          btn.setAttribute('aria-label', `Voter : marquer la réponse de ${authorName} comme utile. Actuellement ${votes} votes.`);
          announceToScreenReader(`Votre vote pour le message de ${authorName} a été retiré. Total des votes : ${votes}.`);
        }
      });
    });
  }
  setupUtilityVoteButtons();

  // Soumission du formulaire de réponse (réservé aux membres connectés)
  if (replyForm) {
    let activeSess = null;
    try { activeSess = JSON.parse(localStorage.getItem('kpop_user_session') || 'null'); } catch {}
    if (!activeSess || !activeSess.name) {
      replyForm.innerHTML = `
        <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.5rem 0;">
          <div>
            <p style="margin: 0 0 0.25rem 0; font-weight: 700;">Connectez-vous pour publier une réponse</p>
            <p style="margin: 0; font-size: 0.9rem; color: var(--st-ink-muted, #52434C);">La participation au forum est réservée aux membres connectés.</p>
          </div>
          <a href="/pages/login.html" class="st-btn st-btn-primary">Se connecter pour parler</a>
        </div>
      `;
    } else {
      replyForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const authorName = inputAuthorName ? inputAuthorName.value.trim() : '';
      const authorRole = inputAuthorRole ? inputAuthorRole.value.trim() : 'Membre K-Pop';
      const replyMessage = textareaReplyMessage ? textareaReplyMessage.value.trim() : '';
      const consentGiven = checkboxCharterConsent ? checkboxCharterConsent.checked : false;

      let isFormValid = true;

      const nameError = document.getElementById('error-author-name');
      const msgError = document.getElementById('error-reply-message');
      const consentError = document.getElementById('error-charter-consent');

      if (!authorName || authorName.length < 2) {
        isFormValid = false;
        if (inputAuthorName) inputAuthorName.setAttribute('aria-invalid', 'true');
        if (nameError) nameError.hidden = false;
      } else {
        if (inputAuthorName) inputAuthorName.setAttribute('aria-invalid', 'false');
        if (nameError) nameError.hidden = true;
      }

      if (!replyMessage || replyMessage.length < 15) {
        isFormValid = false;
        if (textareaReplyMessage) textareaReplyMessage.setAttribute('aria-invalid', 'true');
        if (msgError) msgError.hidden = false;
      } else {
        if (textareaReplyMessage) textareaReplyMessage.setAttribute('aria-invalid', 'false');
        if (msgError) msgError.hidden = true;
      }

      if (!consentGiven) {
        isFormValid = false;
        if (checkboxCharterConsent) checkboxCharterConsent.setAttribute('aria-invalid', 'true');
        if (consentError) consentError.hidden = false;
      } else {
        if (checkboxCharterConsent) checkboxCharterConsent.setAttribute('aria-invalid', 'false');
        if (consentError) consentError.hidden = true;
      }

      if (!isFormValid) {
        if (formFeedbackAlert) {
          formFeedbackAlert.className = 'feedback-alert alert-error';
          formFeedbackAlert.hidden = false;
          formFeedbackAlert.innerHTML = `<strong>Erreur :</strong> Veuillez compléter correctement les champs obligatoires signalés.`;
          formFeedbackAlert.focus();
        }
        announceToScreenReader('Le formulaire comporte des erreurs à corriger.');
        return;
      }

      // Envoi avec état de chargement accessible
      const originalBtnText = btnSubmitReply ? btnSubmitReply.innerHTML : '';
      if (btnSubmitReply) {
        btnSubmitReply.disabled = true;
        btnSubmitReply.setAttribute('aria-busy', 'true');
        btnSubmitReply.innerHTML = `<span>⏳</span> Publication en cours...`;
      }
      announceToScreenReader('Publication de votre réponse en cours...');

      try {
        await fetch('/api/replies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ authorName, authorRole, replyMessage })
        });
      } catch (err) {}

      if (btnSubmitReply) {
        btnSubmitReply.disabled = false;
        btnSubmitReply.removeAttribute('aria-busy');
        btnSubmitReply.innerHTML = originalBtnText;
      }

      // Insertion du nouvel article dans la liste
      currentRepliesCount += 1;
      const newReplyId = `reply-${currentRepliesCount}`;
      const now = new Date();
      const timeFormatted = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      const newArticle = document.createElement('article');
      newArticle.className = 'post-card reply-card-new';
      newArticle.id = newReplyId;
      newArticle.dataset.votes = '0';
      newArticle.dataset.timestamp = currentRepliesCount;
      newArticle.setAttribute('aria-labelledby', `author-${newReplyId}`);
      newArticle.setAttribute('tabindex', '-1');

      const initials = authorName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'KP';

      newArticle.innerHTML = `
        <header class="post-header">
          <div class="post-author-info">
            <span class="avatar" style="background: linear-gradient(135deg, #10B981, #064E3B); color: #FFFFFF;" aria-hidden="true">${initials}</span>
            <div class="author-details">
              <h3 id="author-${newReplyId}" class="author-name">${escapeHtml(authorName)}</h3>
              <p class="author-role">${escapeHtml(authorRole)}</p>
              <p class="post-timestamp">
                <span class="sr-only">Réponse publiée </span>
                <time datetime="${now.toISOString()}">À l'instant (${timeFormatted})</time>
              </p>
            </div>
          </div>
          <span class="sparkle-badge">Nouveau message</span>
        </header>
        <div class="post-content">
          <p>${escapeHtml(replyMessage).replace(/\n/g, '<br>')}</p>
        </div>
        <footer class="post-footer">
          <button 
            type="button" 
            class="btn-utility" 
            id="btn-vote-${newReplyId}" 
            aria-pressed="false" 
            data-votes="0"
            aria-label="Voter : marquer la réponse de ${escapeHtml(authorName)} comme utile. Actuellement 0 vote.">
            <span class="utility-icon" aria-hidden="true">👍</span>
            <span class="utility-text">Utile</span>
            <span class="utility-badge" aria-hidden="true">0</span>
          </button>
        </footer>
      `;

      if (responsesList) {
        responsesList.appendChild(newArticle);
        setupUtilityVoteButtons(newArticle);
      }

      if (responsesBadgeCount) responsesBadgeCount.textContent = `(${currentRepliesCount})`;
      if (countNumber) countNumber.textContent = currentRepliesCount;

      if (formFeedbackAlert) {
        formFeedbackAlert.className = 'feedback-alert alert-success';
        formFeedbackAlert.hidden = false;
        formFeedbackAlert.innerHTML = `<strong>✨ Merci ${escapeHtml(authorName)} !</strong> Votre analyse a été ajoutée avec succès au fil de discussion.`;
      }

      replyForm.reset();
      if (charCounter) charCounter.textContent = '0';
      announceToScreenReader(`Votre réponse numéro ${currentRepliesCount} a été publiée avec succès.`);

      setTimeout(() => {
        newArticle.focus();
        newArticle.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    });
    }
  }

  // Tri des réponses
  if (sortSelect && responsesList) {
    sortSelect.addEventListener('change', () => {
      const mode = sortSelect.value;
      const articles = Array.from(responsesList.querySelectorAll('article.post-card'));

      if (mode === 'oldest') {
        articles.sort((a, b) => parseInt(a.dataset.timestamp, 10) - parseInt(b.dataset.timestamp, 10));
      } else if (mode === 'newest') {
        articles.sort((a, b) => parseInt(b.dataset.timestamp, 10) - parseInt(a.dataset.timestamp, 10));
      } else if (mode === 'votes') {
        articles.sort((a, b) => parseInt(b.dataset.votes, 10) - parseInt(a.dataset.votes, 10));
      }

      articles.forEach(art => responsesList.appendChild(art));
      announceToScreenReader(`Liste des réponses triée : ${sortSelect.options[sortSelect.selectedIndex].text}.`);
    });
  }

  // ==========================================================================
  // 5. LOGIQUE DE LA PAGE PROFIL (/pages/profil.html)
  // ==========================================================================
  const profileDisplayName = document.getElementById('profile-display-name');
  const profileDisplayEmail = document.getElementById('profile-display-email');
  const profileAvatarLetter = document.getElementById('profile-avatar-letter');
  const btnProfileLogout = document.getElementById('btn-profile-logout');
  const prefStatusText = document.getElementById('pref-status-text');
  const prefStatusContrast = document.getElementById('pref-status-contrast');
  const prefStatusSparkles = document.getElementById('pref-status-sparkles');

  if (profileDisplayName) {
    const sessionRaw = localStorage.getItem('kpop_user_session');
    if (sessionRaw) {
      try {
        const user = JSON.parse(sessionRaw);
        if (user.name) {
          profileDisplayName.textContent = user.name;
          if (profileAvatarLetter) {
            profileAvatarLetter.textContent = user.name.charAt(0).toUpperCase();
          }
        }
        if (profileDisplayEmail) {
          const pseudoClean = user.name.toLowerCase().replace(/[^a-z0-9]/g, '');
          profileDisplayEmail.textContent = `@${pseudoClean || 'fan'} • ${(pseudoClean || 'fan')}@kpop-hub.fr`;
        }
      } catch (e) {}
    }

    // Mise à jour visuelle des badges de préférences
    function updateProfilePrefBadges() {
      if (prefStatusText) {
        const isLarge = document.body.classList.contains('large-text-mode');
        prefStatusText.textContent = isLarge ? 'Agrandie (125%) 🔍' : 'Standard (100%)';
      }
      if (prefStatusContrast) {
        const isHigh = document.body.classList.contains('high-contrast-mode');
        prefStatusContrast.textContent = isHigh ? 'Contraste Renforcé (N&B) ◐' : 'Thème Pop Cyber-Fuchsia ✨';
      }
      if (prefStatusSparkles) {
        const noSparkles = document.body.classList.contains('no-sparkles');
        prefStatusSparkles.textContent = noSparkles ? 'Paillettes Coupées ⛔' : 'Paillettes Activées ✨';
      }
    }
    updateProfilePrefBadges();

    // Re-check quand les boutons de la barre a11y sont cliqués
    [btnTextSize, btnHighContrast, btnSparklesToggle].forEach(btn => {
      if (btn) btn.addEventListener('click', () => setTimeout(updateProfilePrefBadges, 80));
    });

    if (btnProfileLogout) {
      btnProfileLogout.addEventListener('click', () => {
        if (confirm('Voulez-vous vraiment vous déconnecter de votre compte membre ?')) {
          localStorage.removeItem('kpop_user_session');
          announceToScreenReader('Vous avez été déconnecté. Redirection vers la page de connexion.');
          window.location.href = '/pages/login.html';
        }
      });
    }
  }

  // ==========================================================================
  // 6. SYSTÈME DE MASCOTTE INTERACTIVE K-POP & BULLES COMIQUES
  // ==========================================================================
  const MASCOT_QUOTES = [
    { emote: 'mascot-joy.png', title: 'Hype Pop !', text: "Youpi ! Enfin un nouveau song de BLACKPINK, mon compte en banque tremble déjà ! 💖" },
    { emote: 'mascot-hype.png', title: 'Mode Victoire', text: "Borahae ! 💜 7 membres, 0 flop, le record du monde de streams est explosé !" },
    { emote: 'mascot-pout.png', title: 'Noise Trap King', text: "Attention les basses ! Bang Chan et 3RACHA ont samplé une perceuse et de la drill, j'adore !" },
    { emote: 'mascot-surprise.png', title: 'Choc Chorégraphique', text: "Omo ! 😱 La chorégraphie de TWICE va tellement vite que je suis tombé dans mon salon !" },
    { emote: 'mascot-thinking.png', title: 'Grand Débat', text: "Attendez... Est-ce que la 2e génération était meilleure ou c'est juste la nostalgie des clips en 480p ?" },
    { emote: 'mascot-wink.png', title: 'Vibe Y2K', text: "Ditto dans les écouteurs, tempo Jersey Club à fond, je marche dans la rue comme dans un clip NewJeans ✨" },
    { emote: 'mascot-shy.png', title: 'Moment Fandom', text: "Mon lightstick synchronisé en Bluetooth s'est allumé en plein cours... Tout le monde a vu que j'étais STAY !" },
    { emote: 'mascot-awkward.png', title: 'Esprit Fair-Play', text: "Règle d'or du Discussion Hub : zéro fanwar ici ! On aime la musique et on respecte tous les fandoms ✌️" },
    { emote: 'mascot-sad.png', title: 'Portefeuille en larmes', text: "Quand ton bias sort un teaser solo mais que les billets de concert en fosse VIP coûtent 250 euros... 😭" }
  ];

  let currentBubble = null;

  function closeMascotBubble() {
    if (currentBubble && currentBubble.parentElement) {
      currentBubble.parentElement.removeChild(currentBubble);
      currentBubble = null;
    }
  }

  function showMascotBubble(targetElement, quoteText, quoteTitle, placement = 'bottom') {
    closeMascotBubble();

    const bubble = document.createElement('div');
    bubble.className = 'speech-bubble';
    bubble.setAttribute('role', 'dialog');
    bubble.setAttribute('aria-label', quoteTitle || 'Message de Zeri la mascotte');
    bubble.dataset.placement = placement;

    bubble.innerHTML = `
      <div class="speech-bubble-header">
        <span>✨ ${escapeHtml(quoteTitle || 'Zeri la Mascotte')}</span>
        <button type="button" class="speech-bubble-close" aria-label="Fermer la bulle">×</button>
      </div>
      <p class="speech-bubble-text">${escapeHtml(quoteText)}</p>
    `;

    const container = targetElement.closest('.peeking-mascot-wrapper, .corner-mascot-wrapper') || targetElement.parentElement;
    container.appendChild(bubble);
    currentBubble = bubble;

    const closeBtn = bubble.querySelector('.speech-bubble-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMascotBubble();
      });
    }

    announceToScreenReader(`Zeri la mascotte dit : ${quoteText}`);
  }

  // Click handler pour tous les déclencheurs de mascotte en coin / peeking
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.btn-peeking-mascot, .btn-corner-mascot, .kpop-mascot-trigger');
    if (trigger) {
      e.stopPropagation();
      const customQuote = trigger.dataset.mascotQuote;
      const customTitle = trigger.dataset.mascotTitle;
      const placement = trigger.dataset.mascotPlacement || 'bottom';

      const container = trigger.closest('.peeking-mascot-wrapper, .corner-mascot-wrapper') || trigger.parentElement;
      if (currentBubble && currentBubble.parentElement === container) {
        closeMascotBubble();
        return;
      }

      if (customQuote) {
        showMascotBubble(trigger, customQuote, customTitle, placement);
      } else {
        const randomItem = MASCOT_QUOTES[Math.floor(Math.random() * MASCOT_QUOTES.length)];
        showMascotBubble(trigger, randomItem.text, randomItem.title, placement);
      }
      return;
    }

    if (currentBubble && !e.target.closest('.speech-bubble')) {
      closeMascotBubble();
    }
  });

  // ==========================================================================
  // 8. ARTICLES TENDANCES : COMMENTAIRES EN DIRECT & SAUVEGARDE FAVORIS
  // ==========================================================================
  const savedArticlesKey = 'kpop_saved_articles';
  const trendCommentsKey = 'kpop_trend_comments';
  const favGroupsKey = 'kpop_fav_groups';

  function getSavedArticles() {
    try { return JSON.parse(localStorage.getItem(savedArticlesKey) || '[]'); } catch { return []; }
  }

  function setSavedArticles(list) {
    localStorage.setItem(savedArticlesKey, JSON.stringify(list));
  }

  // Initialisation des boutons Sauvegarder (.btn-bookmark)
  document.querySelectorAll('.btn-bookmark').forEach((btn) => {
    const id = btn.dataset.bookmarkId;
    const title = btn.dataset.bookmarkTitle;
    const label = btn.querySelector('.bookmark-label');

    function syncBookmarkUi() {
      const saved = getSavedArticles().some((item) => item.id === id);
      btn.setAttribute('aria-pressed', saved ? 'true' : 'false');
      if (label) label.textContent = saved ? 'Sauvegardé' : 'Sauvegarder';
    }
    syncBookmarkUi();

    btn.addEventListener('click', () => {
      let list = getSavedArticles();
      const exists = list.some((item) => item.id === id);
      if (exists) {
        list = list.filter((item) => item.id !== id);
        announceToScreenReader(`Article retiré de vos favoris.`);
      } else {
        list.push({ id, title, savedAt: new Date().toLocaleDateString('fr-FR') });
        announceToScreenReader(`Article ajouté à vos favoris dans votre profil.`);
      }
      setSavedArticles(list);
      syncBookmarkUi();
    });
  });

  // Rendu & ajout en direct des commentaires Tendances
  function renderTrendCommentHtml(c) {
    const initials = (c.author || 'M').slice(0, 2).toUpperCase();
    const isLarp = c.stance === 'Team LARP';
    return `
      <li class="trend-comment-item">
        <div class="trend-comment-head">
          <div class="trend-comment-author-wrap">
            <span class="trend-avatar avatar-marie" aria-hidden="true">${escapeHtml(initials)}</span>
            <span class="trend-comment-author">${escapeHtml(c.author)}</span>
            <span class="trend-stance-badge ${isLarp ? 'trend-stance-larp' : ''}">${escapeHtml(c.stance)}</span>
          </div>
          <span class="trend-comment-time">${escapeHtml(c.time || "À l'instant")}</span>
        </div>
        <p class="trend-comment-text">${escapeHtml(c.message)}</p>
        <button type="button" class="btn-utility" aria-pressed="false" data-votes="0" aria-label="Voter : marquer le commentaire de ${escapeHtml(c.author)} comme utile. Actuellement 0 vote.">
          <svg class="utility-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg>
          <span class="utility-text">Utile</span>
          <span class="utility-badge" aria-hidden="true">0</span>
        </button>
      </li>
    `;
  }

  function getStoredTrendComments() {
    try { return JSON.parse(localStorage.getItem(trendCommentsKey) || '[]'); } catch { return []; }
  }

  document.querySelectorAll('.trend-reply-form').forEach((form) => {
    const articleId = form.dataset.articleId;
    const container = form.closest('.trend-comments');
    const listEl = container ? container.querySelector('.trend-comment-list') : null;
    const countEl = container ? container.querySelector('.trend-comments-count') : null;

    // Pré-remplir le pseudo si connecté
    try {
      const sess = JSON.parse(localStorage.getItem('kpop_user_session') || 'null');
      const authorInput = form.querySelector('input[name="author"]');
      if (sess && sess.name && authorInput && !authorInput.value) {
        authorInput.value = sess.name;
      }
    } catch {}

    // Restaurer les commentaires locaux
    const existing = getStoredTrendComments().filter((c) => c.articleId === articleId);
    if (listEl && existing.length > 0) {
      existing.forEach((c) => listEl.insertAdjacentHTML('beforeend', renderTrendCommentHtml(c)));
      setupUtilityVoteButtons(listEl);
      if (countEl) countEl.textContent = `${listEl.querySelectorAll('.trend-comment-item').length} commentaires`;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const author = (form.querySelector('input[name="author"]').value || '').trim();
      const stance = form.querySelector('select[name="stance"]').value;
      const message = (form.querySelector('textarea[name="message"]').value || '').trim();
      if (!author || !message) return;

      const commentObj = {
        articleId,
        articleLabel: articleId === 'keria' ? 'Keria (T1) — Esport & K-Pop' : 'K/DA Firestarter — Vraie K-Pop ou LARP',
        author,
        stance,
        message,
        time: "À l'instant"
      };
      const all = getStoredTrendComments();
      all.push(commentObj);
      localStorage.setItem(trendCommentsKey, JSON.stringify(all));

      if (listEl) {
        listEl.insertAdjacentHTML('beforeend', renderTrendCommentHtml(commentObj));
        setupUtilityVoteButtons(listEl);
        if (countEl) countEl.textContent = `${listEl.querySelectorAll('.trend-comment-item').length} commentaires`;
      }
      form.querySelector('textarea[name="message"]').value = '';
      announceToScreenReader(`Votre commentaire a été publié.`);
    });
  });

  // ==========================================================================
  // 9. PAGE CONNEXION / INSCRIPTION : ONGLETS, FORCE MDP & CRÉATION COMPTE
  // ==========================================================================
  const authTabBtns = document.querySelectorAll('.auth-tab-btn');
  authTabBtns.forEach((tab) => {
    tab.addEventListener('click', () => {
      authTabBtns.forEach((t) => {
        const isSelected = t === tab;
        t.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !isSelected;
      });
    });
  });

  const regPwdInput = document.getElementById('input-reg-pwd');
  const pwdFill = document.getElementById('pwd-strength-fill');
  const pwdLabel = document.getElementById('pwd-strength-label');
  if (regPwdInput && pwdFill && pwdLabel) {
    regPwdInput.addEventListener('input', () => {
      const val = regPwdInput.value;
      let score = 0;
      if (val.length >= 8) score++;
      if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
      if (/\d/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;

      if (!val.length) {
        pwdFill.style.width = '0%';
        pwdLabel.textContent = 'Vide';
      } else if (score <= 1) {
        pwdFill.style.width = '30%';
        pwdFill.style.backgroundColor = '#DC2626';
        pwdLabel.textContent = 'Faible';
      } else if (score <= 2) {
        pwdFill.style.width = '65%';
        pwdFill.style.backgroundColor = '#D97706';
        pwdLabel.textContent = 'Moyen';
      } else {
        pwdFill.style.width = '100%';
        pwdFill.style.backgroundColor = '#059669';
        pwdLabel.textContent = 'Fort';
      }
    });
  }

  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (document.getElementById('input-reg-name').value || '').trim();
      const email = (document.getElementById('input-reg-email').value || '').trim();
      const bias = document.getElementById('input-reg-bias').value;
      const pwd = document.getElementById('input-reg-pwd').value;
      const alertBox = document.getElementById('login-feedback-alert');

      if (!name || !email || pwd.length < 6) {
        if (alertBox) {
          alertBox.className = 'feedback-alert alert-error';
          alertBox.textContent = 'Renseignez un pseudo, un e-mail valide et un mot de passe d\'au moins 6 caractères.';
          alertBox.hidden = false;
        }
        return;
      }

      const newSession = {
        name,
        email,
        bias,
        location: 'France',
        bio: `Fan de ${bias}, actif sur les débats K-Pop & Esport.`,
        loggedInAt: new Date().toISOString()
      };
      localStorage.setItem('kpop_user_session', JSON.stringify(newSession));
      localStorage.setItem(favGroupsKey, JSON.stringify([bias]));
      window.location.href = '/pages/profil.html';
    });
  }

  // ==========================================================================
  // 10. PAGE PROFIL : ONGLETS, ÉDITEUR EN DIRECT, FAVORIS & EXPORT RGPD
  // ==========================================================================
  const profileTabBtns = document.querySelectorAll('.profile-tab-btn');
  profileTabBtns.forEach((tab) => {
    tab.addEventListener('click', () => {
      profileTabBtns.forEach((t) => {
        const isSelected = t === tab;
        t.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !isSelected;
      });
    });
  });

  const btnEditProfile = document.getElementById('btn-toggle-edit-profile');
  const profileEditorForm = document.getElementById('profile-editor-form');
  const profileToast = document.getElementById('profile-toast');

  function showProfileToast(msg) {
    if (!profileToast) return;
    profileToast.textContent = msg;
    profileToast.hidden = false;
    setTimeout(() => { profileToast.hidden = true; }, 3500);
  }

  if (btnEditProfile && profileEditorForm) {
    let pendingAvatarDataUrl = undefined;
    const avatarFileInput = document.getElementById('edit-avatar-file');
    const avatarPreviewImg = document.getElementById('edit-avatar-preview');
    const btnRemoveAvatar = document.getElementById('btn-remove-avatar');

    // Hydrater le profil depuis localStorage
    function hydrateProfileDetails() {
      try {
        const sess = JSON.parse(localStorage.getItem('kpop_user_session') || 'null');
        const avatarImg = document.getElementById('profile-avatar-img');
        const avatarEl = document.getElementById('profile-avatar-letter');
        if (sess) {
          const nameEl = document.getElementById('profile-display-name');
          const emailEl = document.getElementById('profile-display-email');
          const bioEl = document.getElementById('profile-bio-text');
          const biasEl = document.getElementById('profile-bias-val');
          const locEl = document.getElementById('profile-location-val');
          if (nameEl && sess.name) nameEl.textContent = sess.name;
          if (emailEl && sess.email) emailEl.textContent = sess.email;
          if (avatarEl && sess.name) avatarEl.textContent = sess.name.charAt(0).toUpperCase();
          if (bioEl && sess.bio) bioEl.textContent = sess.bio;
          if (biasEl && sess.bias) biasEl.textContent = sess.bias;
          if (locEl && sess.location) locEl.textContent = sess.location;
          if (avatarImg && avatarEl) {
            if (sess.avatar) {
              avatarImg.src = sess.avatar;
              avatarImg.hidden = false;
              avatarEl.hidden = true;
              if (avatarPreviewImg) avatarPreviewImg.src = sess.avatar;
            } else {
              avatarImg.hidden = true;
              avatarEl.hidden = false;
              if (avatarPreviewImg) avatarPreviewImg.src = '/assets/images/avatars/minji.jpg';
            }
          }
        }
      } catch {}
    }
    hydrateProfileDetails();

    // Redimensionnement propre en 256x256 pour stocker sans saturer localStorage
    if (avatarFileInput) {
      avatarFileInput.addEventListener('change', () => {
        const file = avatarFileInput.files && avatarFileInput.files[0];
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          const img = new Image();
          img.onload = () => {
            const size = 256;
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            const minSide = Math.min(img.width, img.height);
            const sx = (img.width - minSide) / 2;
            const sy = (img.height - minSide) / 2;
            ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
            pendingAvatarDataUrl = canvas.toDataURL('image/jpeg', 0.85);
            if (avatarPreviewImg) avatarPreviewImg.src = pendingAvatarDataUrl;
          };
          img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
      });
    }

    if (btnRemoveAvatar) {
      btnRemoveAvatar.addEventListener('click', () => {
        pendingAvatarDataUrl = null;
        if (avatarFileInput) avatarFileInput.value = '';
        if (avatarPreviewImg) avatarPreviewImg.src = '/assets/images/avatars/minji.jpg';
      });
    }

    btnEditProfile.addEventListener('click', () => {
      const opening = profileEditorForm.hidden;
      profileEditorForm.hidden = !opening;
      btnEditProfile.setAttribute('aria-expanded', opening ? 'true' : 'false');
      if (opening) {
        pendingAvatarDataUrl = undefined;
        document.getElementById('edit-name').value = document.getElementById('profile-display-name').textContent.trim();
        document.getElementById('edit-location').value = document.getElementById('profile-location-val').textContent.trim();
        document.getElementById('edit-bias').value = document.getElementById('profile-bias-val').textContent.trim();
        document.getElementById('edit-bio').value = document.getElementById('profile-bio-text').textContent.trim();
      }
    });

    profileEditorForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let sess = {};
      try { sess = JSON.parse(localStorage.getItem('kpop_user_session') || '{}'); } catch {}
      sess.name = document.getElementById('edit-name').value.trim() || 'Min-ji Park';
      sess.email = sess.email || 'minji.park@kpop-hub.fr';
      sess.location = document.getElementById('edit-location').value.trim() || 'Paris / Séoul';
      sess.bias = document.getElementById('edit-bias').value;
      sess.bio = document.getElementById('edit-bio').value.trim();
      if (pendingAvatarDataUrl !== undefined) {
        if (pendingAvatarDataUrl === null) {
          delete sess.avatar;
        } else {
          sess.avatar = pendingAvatarDataUrl;
        }
      }
      localStorage.setItem('kpop_user_session', JSON.stringify(sess));
      hydrateProfileDetails();
      profileEditorForm.hidden = true;
      btnEditProfile.setAttribute('aria-expanded', 'false');
      showProfileToast('Profil et photo mis à jour.');
    });
  }

  // Groupes favoris & articles sauvegardés sur /pages/profil.html
  const favGroupsContainer = document.getElementById('fav-groups-container');
  const savedArticlesContainer = document.getElementById('profile-saved-articles');
  const activityListContainer = document.getElementById('profile-activity-list');

  if (favGroupsContainer) {
    let favGroups = ['BLACKPINK', 'NewJeans'];
    try {
      const stored = JSON.parse(localStorage.getItem(favGroupsKey) || 'null');
      if (Array.isArray(stored)) favGroups = stored;
    } catch {}

    function updateProfileKpis() {
      const kpiGroups = document.getElementById('kpi-groups-count');
      const kpiSaved = document.getElementById('kpi-saved-count');
      const kpiComments = document.getElementById('kpi-comments-count');
      if (kpiGroups) kpiGroups.textContent = favGroups.length;
      if (kpiSaved) kpiSaved.textContent = getSavedArticles().length;
      if (kpiComments) kpiComments.textContent = 1 + getStoredTrendComments().length;
    }

    favGroupsContainer.querySelectorAll('.fav-chip-btn').forEach((chip) => {
      const grp = chip.dataset.favGroup;
      chip.setAttribute('aria-pressed', favGroups.includes(grp) ? 'true' : 'false');
      chip.addEventListener('click', () => {
        if (favGroups.includes(grp)) {
          favGroups = favGroups.filter((g) => g !== grp);
        } else {
          favGroups.push(grp);
        }
        localStorage.setItem(favGroupsKey, JSON.stringify(favGroups));
        chip.setAttribute('aria-pressed', favGroups.includes(grp) ? 'true' : 'false');
        updateProfileKpis();
      });
    });

    function renderSavedArticles() {
      if (!savedArticlesContainer) return;
      const list = getSavedArticles();
      if (!list.length) {
        savedArticlesContainer.innerHTML = '<p style="margin: 0; font-size: 0.925rem; color: var(--color-text-muted);">Aucun article sauvegardé. Cliquez sur « Sauvegarder » sur un article de la page d\'accueil (Keria ou K/DA Firestarter).</p>';
      } else {
        savedArticlesContainer.innerHTML = list.map((item) => `
          <div class="activity-card" style="display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
            <div>
              <a href="/index.html#tendances-section" style="font-weight: 700; color: var(--color-link); text-decoration: none;">${escapeHtml(item.title)}</a>
              <div style="font-size: 0.8rem; color: var(--color-text-muted);">Sauvegardé le ${escapeHtml(item.savedAt || '')}</div>
            </div>
            <button type="button" class="btn-bookmark" data-remove-saved="${escapeHtml(item.id)}" aria-label="Retirer ${escapeHtml(item.title)} des favoris">Retirer</button>
          </div>
        `).join('');
        savedArticlesContainer.querySelectorAll('[data-remove-saved]').forEach((rm) => {
          rm.addEventListener('click', () => {
            setSavedArticles(getSavedArticles().filter((i) => i.id !== rm.dataset.removeSaved));
            renderSavedArticles();
            updateProfileKpis();
          });
        });
      }
      updateProfileKpis();
    }
    renderSavedArticles();

    // Injecter aussi les commentaires Tendances postés dans l'historique d'activité
    if (activityListContainer) {
      const userComments = getStoredTrendComments();
      userComments.forEach((c) => {
        activityListContainer.insertAdjacentHTML('afterbegin', `
          <article class="activity-card">
            <div style="display: flex; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.4rem;">
              <strong style="font-size: 0.95rem;">${escapeHtml(c.articleLabel || 'Article Tendances')}</strong>
              <span class="trend-stance-badge">${escapeHtml(c.stance)}</span>
            </div>
            <p style="margin: 0; font-size: 0.925rem; color: var(--color-text-muted); line-height: 1.55;">
              « ${escapeHtml(c.message)} »
            </p>
          </article>
        `);
      });
    }
  }

  // Export JSON RGPD
  const btnExportGdpr = document.getElementById('btn-export-gdpr');
  if (btnExportGdpr) {
    btnExportGdpr.addEventListener('click', () => {
      const payload = {
        exportedAt: new Date().toISOString(),
        profile: JSON.parse(localStorage.getItem('kpop_user_session') || '{}'),
        followedGroups: JSON.parse(localStorage.getItem(favGroupsKey) || '[]'),
        savedArticles: getSavedArticles(),
        trendComments: getStoredTrendComments()
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'kpop-hub-mes-donnees.json';
      a.click();
      URL.revokeObjectURL(url);
      showProfileToast('Export JSON téléchargé.');
    });
  }

  function escapeHtml(text) {
    return (text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
