document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  function esc(str) {
    return (str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // 1. Accessibilité synchronisée avec le reste du site
  const btnText = document.getElementById('st-btn-text');
  const btnContrast = document.getElementById('st-btn-contrast');

  if (localStorage.getItem('kpop_a11y_large_text') === 'true') {
    document.body.classList.add('large-text-mode');
    if (btnText) btnText.setAttribute('aria-pressed', 'true');
  }
  if (localStorage.getItem('kpop_a11y_high_contrast') === 'true') {
    document.body.classList.add('high-contrast-mode');
    if (btnContrast) btnContrast.setAttribute('aria-pressed', 'true');
  }

  if (btnText) {
    btnText.addEventListener('click', () => {
      const on = document.body.classList.toggle('large-text-mode');
      btnText.setAttribute('aria-pressed', on ? 'true' : 'false');
      localStorage.setItem('kpop_a11y_large_text', on);
    });
  }
  if (btnContrast) {
    btnContrast.addEventListener('click', () => {
      const on = document.body.classList.toggle('high-contrast-mode');
      btnContrast.setAttribute('aria-pressed', on ? 'true' : 'false');
      localStorage.setItem('kpop_a11y_high_contrast', on);
    });
  }

  // 2. Sondage Live K/DA Firestarter (Vraie K-Pop vs LARP)
  const pollKey = 'kpop_studio_kda_poll';
  const btnKpop = document.getElementById('poll-btn-kpop');
  const btnLarp = document.getElementById('poll-btn-larp');
  const barKpop = document.getElementById('poll-bar-kpop');
  const barLarp = document.getElementById('poll-bar-larp');
  const statKpop = document.getElementById('poll-stat-kpop');
  const statLarp = document.getElementById('poll-stat-larp');

  let pollState = { kpop: 83, larp: 94, choice: null };
  try {
    const saved = JSON.parse(localStorage.getItem(pollKey) || 'null');
    if (saved && typeof saved.kpop === 'number') pollState = saved;
  } catch {}

  function renderPoll() {
    const total = pollState.kpop + pollState.larp || 1;
    const pctKpop = Math.round((pollState.kpop / total) * 100);
    const pctLarp = 100 - pctKpop;
    if (barKpop) barKpop.style.width = `${pctKpop}%`;
    if (barLarp) barLarp.style.width = `${pctLarp}%`;
    if (statKpop) statKpop.textContent = `Vraie K-Pop : ${pctKpop}% (${pollState.kpop})`;
    if (statLarp) statLarp.textContent = `LARP : ${pctLarp}% (${pollState.larp})`;
    if (btnKpop) btnKpop.setAttribute('aria-pressed', pollState.choice === 'kpop' ? 'true' : 'false');
    if (btnLarp) btnLarp.setAttribute('aria-pressed', pollState.choice === 'larp' ? 'true' : 'false');
  }
  renderPoll();

  function votePoll(side) {
    if (pollState.choice === side) return;
    if (pollState.choice === 'kpop') pollState.kpop--;
    if (pollState.choice === 'larp') pollState.larp--;
    pollState[side]++;
    pollState.choice = side;
    localStorage.setItem(pollKey, JSON.stringify(pollState));
    renderPoll();
  }

  if (btnKpop) btnKpop.addEventListener('click', () => votePoll('kpop'));
  if (btnLarp) btnLarp.addEventListener('click', () => votePoll('larp'));

  // 3. Sauvegarde Favoris synchronisée avec /pages/profil.html
  const savedKey = 'kpop_saved_articles';
  function getSaved() {
    try { return JSON.parse(localStorage.getItem(savedKey) || '[]'); } catch { return []; }
  }

  document.querySelectorAll('.st-save-btn').forEach((btn) => {
    const id = btn.dataset.bookmarkId;
    const title = btn.dataset.bookmarkTitle;
    const lbl = btn.querySelector('.st-save-label');

    function sync() {
      const isSaved = getSaved().some((i) => i.id === id);
      btn.setAttribute('aria-pressed', isSaved ? 'true' : 'false');
      if (lbl) lbl.textContent = isSaved ? 'Sauvegardé' : 'Sauvegarder';
    }
    sync();

    btn.addEventListener('click', () => {
      let list = getSaved();
      if (list.some((i) => i.id === id)) {
        list = list.filter((i) => i.id !== id);
      } else {
        list.push({ id, title, savedAt: new Date().toLocaleDateString('fr-FR') });
      }
      localStorage.setItem(savedKey, JSON.stringify(list));
      sync();
    });
  });

  // 4. Filtre Lookbook Groupes Phares
  const groupFilters = document.querySelectorAll('.st-group-filter');
  const lookCards = document.querySelectorAll('.st-look-card');
  groupFilters.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      groupFilters.forEach((b) => b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'));
      lookCards.forEach((card) => {
        card.hidden = filter !== 'all' && card.dataset.category !== filter;
      });
    });
  });

  // 5. Chronologie interactive (2G -> 5G)
  const eraTabs = document.querySelectorAll('.st-era-btn');
  eraTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      eraTabs.forEach((t) => {
        const active = t === tab;
        t.setAttribute('aria-selected', active ? 'true' : 'false');
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !active;
      });
    });
  });

  // 6. Rendu dynamique du fil Articles & Facts (MAX 2 commentaires par sujet + accès membre)
  const feedEl = document.getElementById('st-articles-feed');
  const commentsKey = 'kpop_trend_comments';
  function getComments() {
    try { return JSON.parse(localStorage.getItem(commentsKey) || '[]'); } catch { return []; }
  }
  function getSession() {
    try { return JSON.parse(localStorage.getItem('kpop_user_session') || 'null'); } catch { return null; }
  }

  const session = getSession();
  const navUserItem = document.getElementById('nav-user-item');
  if (session && session.name && navUserItem) {
    navUserItem.innerHTML = `
      <div style="display: inline-flex; align-items: center; gap: 0.45rem;">
        <a href="/pages/profil.html" class="st-nav-link st-nav-cta" aria-label="Accéder au profil de ${esc(session.name)}">${esc(session.name)}</a>
        <button type="button" id="st-nav-logout" class="st-btn st-btn-ghost" style="min-height: 40px; padding: 0.3rem 0.7rem; font-size: 0.825rem;">Quitter</button>
      </div>
    `;
    const btnOut = document.getElementById('st-nav-logout');
    if (btnOut) {
      btnOut.addEventListener('click', () => {
        localStorage.removeItem('kpop_user_session');
        window.location.reload();
      });
    }
  }

  function bindVoteButtons(root = document) {
    root.querySelectorAll('.st-vote-btn').forEach((btn) => {
      if (btn.dataset.bound) return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', () => {
        const pressed = btn.getAttribute('aria-pressed') === 'true';
        let count = parseInt(btn.dataset.votes, 10) || 0;
        count = pressed ? count - 1 : count + 1;
        btn.dataset.votes = count;
        btn.setAttribute('aria-pressed', pressed ? 'false' : 'true');
        const num = btn.querySelector('.st-vote-num');
        if (num) num.textContent = count;
      });
    });
  }

  if (feedEl && window.KPOP_ARTICLES) {
    const stored = getComments();
    const articles = Object.values(window.KPOP_ARTICLES).filter((a) => a.id !== 'manon');
    feedEl.innerHTML = articles.map((a) => {
      const userForArticle = stored.filter((c) => c.articleId === a.id);
      const allComments = [...a.comments, ...userForArticle];
      const preview = allComments.slice(0, 2); // MAX 2 COMMENTAIRES AFFICHÉS
      const remaining = Math.max(0, allComments.length - 2);
      const replyHref = session && session.name ? `/pages/article.html?id=${esc(a.id)}#article-reply-zone` : '/pages/login.html';
      const replyLabel = session && session.name ? 'Répondre' : 'Se connecter pour parler';

      return `
        <article class="st-thread-box" style="display: flex; flex-direction: column;">
          <div class="st-thread-head" style="align-items: flex-start;">
            <div>
              <div class="st-meta-strip" style="margin-bottom: 0.45rem;">
                <span class="st-tag ${a.tagGold ? 'st-tag-gold' : ''}">${esc(a.tag)}</span>
                <span>${esc(a.published)}</span>
                <span>${allComments.length} réponses</span>
              </div>
              <h3 style="margin: 0; font-family: var(--font-display); font-size: 1.2rem; font-weight: 800; line-height: 1.25;">
                <a href="/pages/article.html?id=${esc(a.id)}" style="color: inherit; text-decoration: none;">${esc(a.title)}</a>
              </h3>
              <p style="margin: 0.45rem 0 0 0; font-size: 0.875rem; color: var(--st-ink-muted); line-height: 1.5;">${esc(a.summary)}</p>
            </div>
          </div>

          <ul class="st-thread-list" role="list" style="flex: 1;">
            ${preview.map((c) => {
              const isLarp = c.stance === 'Team LARP';
              return `
                <li class="st-comment">
                  <div class="st-comment-top">
                    <span class="st-comment-who">
                      <img src="${esc(c.avatar || '/assets/images/avatars/default.jpg')}" alt="" class="st-comment-avatar" aria-hidden="true">
                      <span>${esc(c.author)}</span>
                      <span class="st-stance ${isLarp ? 'st-stance-larp' : ''}">${esc(c.stance)}</span>
                    </span>
                    <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--st-ink-muted);">${esc(c.time || '')}</span>
                  </div>
                  <p>${esc(c.message)}</p>
                  <button type="button" class="st-vote-btn" aria-pressed="false" data-votes="${c.votes || 0}">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg>
                    <span>Utile</span>
                    <span class="st-vote-num">${c.votes || 0}</span>
                  </button>
                </li>
              `;
            }).join('')}
          </ul>

          <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--st-line); display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.6rem;">
            <a href="/pages/article.html?id=${esc(a.id)}" class="st-btn st-btn-primary">
              <span>${remaining > 0 ? `Voir l'article & les +${remaining} autres réponses` : "Lire l'article & le fil complet"}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
            <a href="${replyHref}" class="st-btn st-btn-ghost">${replyLabel}</a>
          </div>
        </article>
      `;
    }).join('');
    bindVoteButtons(feedEl);
  }

  // 8. Boutons Play overlay sur les vidéos HTML5
  document.querySelectorAll('.st-video-play-overlay').forEach((overlay) => {
    const vid = document.getElementById(overlay.dataset.videoTarget);
    if (!vid) return;
    overlay.addEventListener('click', () => {
      overlay.hidden = true;
      vid.play().catch(() => {});
    });
    vid.addEventListener('play', () => { overlay.hidden = true; });
    vid.addEventListener('ended', () => { overlay.hidden = false; });
  });

  // 9. Bulle de dialogue BD ancrée directement sur Zeri au clic
  let activeBubble = null;
  function closeZeriBubble() {
    if (activeBubble) {
      activeBubble.remove();
      activeBubble = null;
    }
  }

  document.querySelectorAll('.st-zeri-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const wasSame = activeBubble && activeBubble.dataset.owner === btn.dataset.zeriMsg;
      closeZeriBubble();
      if (wasSame) return;

      const bubble = document.createElement('div');
      bubble.className = 'speech-bubble';
      bubble.setAttribute('role', 'status');
      bubble.dataset.owner = btn.dataset.zeriMsg || '';
      bubble.innerHTML = `
        <div class="speech-bubble-header">
          <span class="speech-bubble-title">Zeri</span>
          <button type="button" class="btn-close-bubble" aria-label="Fermer la bulle">×</button>
        </div>
        <p class="speech-bubble-text">${esc(btn.dataset.zeriMsg)}</p>
      `;
      document.body.appendChild(bubble);

      const rect = btn.getBoundingClientRect();
      const bWidth = 280;
      let left = rect.right - bWidth + 14;
      if (left < 12) left = 12;
      if (left + bWidth > window.innerWidth - 12) left = window.innerWidth - bWidth - 12;
      const top = rect.bottom + 10;
      bubble.style.left = `${left}px`;
      bubble.style.top = `${top}px`;

      bubble.querySelector('.btn-close-bubble').addEventListener('click', closeZeriBubble);
      activeBubble = bubble;
    });
  });

  document.addEventListener('click', (e) => {
    if (activeBubble && !e.target.closest('.speech-bubble') && !e.target.closest('.st-zeri-btn')) {
      closeZeriBubble();
    }
  });

  // 10. Panneau publicitaire déroulant automatique toutes les 3 s (BLACKPINK, BTS, Stray Kids, TWICE, NewJeans)
  const adCarousel = document.getElementById('st-ad-carousel');
  if (adCarousel) {
    const track = document.getElementById('st-ad-track');
    const slides = Array.from(adCarousel.querySelectorAll('.st-ad-slide'));
    const dots = Array.from(adCarousel.querySelectorAll('.st-ad-dot'));
    const progressFill = document.getElementById('st-ad-progress-fill');
    const pauseBtn = document.getElementById('st-ad-pause-btn');
    const DURATION = 3000;
    let current = 0;
    let paused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let hovered = false;
    let timer = null;

    function restartProgress() {
      if (!progressFill) return;
      progressFill.style.transition = 'none';
      progressFill.style.width = '0%';
      void progressFill.offsetWidth;
      if (!paused && !hovered) {
        progressFill.style.transition = `width ${DURATION}ms linear`;
        progressFill.style.width = '100%';
      }
    }

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      if (track) {
        track.style.transform = `translateX(-${current * 100}%)`;
      }
      slides.forEach((s, i) => s.classList.toggle('is-active', i === current));
      dots.forEach((d, i) => {
        d.classList.toggle('is-active', i === current);
        d.setAttribute('aria-pressed', String(i === current));
      });
      restartProgress();
    }

    function startTimer() {
      clearInterval(timer);
      if (paused || hovered) return;
      restartProgress();
      timer = setInterval(() => showSlide(current + 1), DURATION);
    }

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        showSlide(Number(dot.dataset.adIndex || 0));
        startTimer();
      });
    });

    if (pauseBtn) {
      if (paused) {
        pauseBtn.textContent = '▶';
        pauseBtn.setAttribute('aria-pressed', 'true');
      }
      pauseBtn.addEventListener('click', () => {
        paused = !paused;
        pauseBtn.textContent = paused ? '▶' : '❚❚';
        pauseBtn.setAttribute('aria-pressed', String(paused));
        if (paused) {
          clearInterval(timer);
          if (progressFill) {
            progressFill.style.transition = 'none';
            progressFill.style.width = '0%';
          }
        } else {
          startTimer();
        }
      });
    }

    adCarousel.addEventListener('mouseenter', () => {
      hovered = true;
      clearInterval(timer);
      if (progressFill) {
        progressFill.style.transition = 'none';
        progressFill.style.width = '0%';
      }
    });
    adCarousel.addEventListener('mouseleave', () => {
      hovered = false;
      startTimer();
    });

    showSlide(0);
    startTimer();
  }

  // 11. Code promo masqué sous papier cadeau qui tombe au clic
  const codeBtn = document.getElementById('st-ad-code-btn');
  const copiedBadge = document.getElementById('st-ad-code-copied');
  if (codeBtn) {
    codeBtn.addEventListener('click', () => {
      const alreadyOpen = codeBtn.classList.contains('is-revealed');
      if (!alreadyOpen) {
        codeBtn.classList.add('is-revealed');
        codeBtn.setAttribute('aria-expanded', 'true');
        codeBtn.setAttribute('aria-label', 'Code promo KPOPHUB10 révélé, cliquer pour copier');
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText('KPOPHUB10').then(() => {
          if (copiedBadge) {
            copiedBadge.hidden = false;
            setTimeout(() => { copiedBadge.hidden = true; }, 2200);
          }
        }).catch(() => {});
      }
    });
  }
});
