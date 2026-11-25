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

  // 1. Accessibilité
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

  // 2. Session utilisateur
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

  // 3. Charger l'article depuis ?id=
  const articles = window.KPOP_ARTICLES || {};
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') && articles[params.get('id')] ? params.get('id') : 'keria';
  const article = articles[id];
  if (!article) return;

  document.title = `${article.title} | K-Pop Discussion Hub`;
  const crumb = document.getElementById('article-crumb');
  if (crumb) crumb.textContent = article.title;

  // Média principal
  const mediaSlot = document.getElementById('article-media-slot');
  if (article.mediaType === 'video') {
    mediaSlot.innerHTML = `
      <video id="article-main-video" controls playsinline preload="metadata" poster="${esc(article.posterSrc)}" aria-label="${esc(article.mediaAlt)}">
        <source src="${esc(article.videoSrc)}" type="video/mp4">
        <track kind="captions" srclang="fr" label="Français" src="/assets/videos/keria-dance.vtt" default>
        Votre navigateur ne prend pas en charge la lecture vidéo HTML5.
      </video>
      <button type="button" class="st-video-play-overlay" id="article-video-overlay" aria-label="Lancer la vidéo">
        <span class="st-play-circle" aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg>
        </span>
        <span class="st-play-caption">Lancer la vidéo</span>
      </button>
    `;
    const vid = document.getElementById('article-main-video');
    const ov = document.getElementById('article-video-overlay');
    if (vid && ov) {
      ov.addEventListener('click', () => { ov.hidden = true; vid.play().catch(() => {}); });
      vid.addEventListener('play', () => { ov.hidden = true; });
      vid.addEventListener('ended', () => { ov.hidden = false; });
    }
  } else {
    mediaSlot.innerHTML = `<img src="${esc(article.imageSrc)}" alt="${esc(article.mediaAlt)}" style="object-position: center center;">`;
  }

  // Meta, Titre, Corps, Verdict
  document.getElementById('article-meta-slot').innerHTML = `
    <span class="st-tag ${article.tagGold ? 'st-tag-gold' : ''}">${esc(article.tag)}</span>
    <span>${esc(article.published)}</span>
    <span>${esc(article.readTime)} de lecture</span>
  `;
  document.getElementById('article-h1').textContent = article.title;
  document.getElementById('article-body-slot').innerHTML = article.paragraphs
    .map((p) => `<p style="margin: 0 0 1rem 0;">${esc(p)}</p>`)
    .join('');

  if (article.verdict) {
    const vBox = document.getElementById('article-verdict-slot');
    const vText = document.getElementById('article-verdict-text');
    vText.textContent = article.verdict;
    vBox.hidden = false;
  }

  // Liens externes + Sauvegarder
  const linksSlot = document.getElementById('article-links-slot');
  const savedKey = 'kpop_saved_articles';
  function getSaved() {
    try { return JSON.parse(localStorage.getItem(savedKey) || '[]'); } catch { return []; }
  }
  const linksHtml = (article.links || []).map((l) => `
    <a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer" class="st-btn st-btn-primary">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      <span>${esc(l.label)}</span>
    </a>
  `).join('');
  linksSlot.innerHTML = linksHtml + `
    <button type="button" id="article-bookmark-btn" class="st-btn st-btn-ghost" aria-pressed="false">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
      <span id="article-bookmark-label">Sauvegarder</span>
    </button>
  `;

  const bmBtn = document.getElementById('article-bookmark-btn');
  const bmLbl = document.getElementById('article-bookmark-label');
  const bmId = `article-${article.id}`;
  function syncBm() {
    const saved = getSaved().some((i) => i.id === bmId);
    bmBtn.setAttribute('aria-pressed', saved ? 'true' : 'false');
    bmLbl.textContent = saved ? 'Sauvegardé' : 'Sauvegarder';
  }
  syncBm();
  bmBtn.addEventListener('click', () => {
    let list = getSaved();
    if (list.some((i) => i.id === bmId)) {
      list = list.filter((i) => i.id !== bmId);
    } else {
      list.push({ id: bmId, title: article.title, savedAt: new Date().toLocaleDateString('fr-FR') });
    }
    localStorage.setItem(savedKey, JSON.stringify(list));
    syncBm();
  });

  // 4. Forum complet : toutes les réponses + tri + filtre par camp
  const commentsKey = 'kpop_trend_comments';
  function getStoredComments() {
    try { return JSON.parse(localStorage.getItem(commentsKey) || '[]'); } catch { return []; }
  }

  let activeCamp = 'all';
  let activeSort = 'oldest';
  const listEl = document.getElementById('article-comments-list');
  const countEl = document.getElementById('article-comments-count');
  const sortSelect = document.getElementById('article-sort-select');
  const campWrap = document.getElementById('article-camp-filters');

  if (article.hasCampFilter && campWrap) {
    campWrap.hidden = false;
    const camps = ['all', ...article.stances];
    campWrap.innerHTML = camps.map((c) => `
      <button type="button" class="st-filter-btn" data-camp="${esc(c)}" aria-pressed="${c === 'all' ? 'true' : 'false'}" style="min-height: 40px; padding: 0.3rem 0.75rem; font-size: 0.825rem;">
        ${c === 'all' ? 'Tous' : esc(c.replace('Team ', ''))}
      </button>
    `).join('');
    campWrap.querySelectorAll('.st-filter-btn').forEach((b) => {
      b.addEventListener('click', () => {
        activeCamp = b.dataset.camp;
        campWrap.querySelectorAll('.st-filter-btn').forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
        renderComments();
      });
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      activeSort = sortSelect.value;
      renderComments();
    });
  }

  function renderComments() {
    const userComments = getStoredComments().filter((c) => c.articleId === article.id);
    let combined = [
      ...article.comments.map((c, idx) => ({ ...c, _order: idx })),
      ...userComments.map((c, idx) => ({ ...c, votes: c.votes || 0, time: c.time || "À l'instant", _order: 100 + idx }))
    ];
    if (activeCamp !== 'all') {
      combined = combined.filter((c) => c.stance === activeCamp);
    }
    if (activeSort === 'votes') {
      combined.sort((a, b) => (b.votes || 0) - (a.votes || 0));
    } else {
      combined.sort((a, b) => a._order - b._order);
    }

    countEl.textContent = `(${combined.length})`;
    listEl.innerHTML = combined.map((c) => {
      const isLarp = c.stance === 'Team LARP';
      return `
        <li class="st-comment">
          <div class="st-comment-top">
            <span class="st-comment-who">
              <img src="${esc(c.avatar || '/assets/images/avatars/default.jpg')}" alt="" class="st-comment-avatar" aria-hidden="true">
              <span>${esc(c.author)}</span>
              <span class="st-stance ${isLarp ? 'st-stance-larp' : ''}">${esc(c.stance)}</span>
            </span>
            <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--st-ink-muted);">${esc(c.time)}</span>
          </div>
          <p>${esc(c.message)}</p>
          <button type="button" class="st-vote-btn" aria-pressed="false" data-votes="${c.votes || 0}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg>
            <span>Utile</span>
            <span class="st-vote-num">${c.votes || 0}</span>
          </button>
        </li>
      `;
    }).join('');

    listEl.querySelectorAll('.st-vote-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const pressed = btn.getAttribute('aria-pressed') === 'true';
        let count = parseInt(btn.dataset.votes, 10) || 0;
        count = pressed ? count - 1 : count + 1;
        btn.dataset.votes = count;
        btn.setAttribute('aria-pressed', pressed ? 'false' : 'true');
        btn.querySelector('.st-vote-num').textContent = count;
      });
    });
  }
  renderComments();

  // 5. Zone de réponse réservée aux membres connectés
  const replyZone = document.getElementById('article-reply-zone');
  if (session && session.name) {
    const stanceOptions = (article.stances || ['Membre']).map((s) => `<option value="${esc(s)}">${esc(s)}</option>`).join('');
    replyZone.innerHTML = `
      <h3 style="margin: 0 0 0.35rem 0; font-family: var(--font-display); font-size: 1.25rem;">Ajouter votre réponse</h3>
      <p style="margin: 0 0 1rem 0; font-size: 0.875rem; color: var(--st-ink-muted);">Connecté en tant que <strong>${esc(session.name)}</strong></p>
      <form id="article-reply-form" style="display: flex; flex-direction: column; gap: 0.85rem;">
        <div>
          <label for="reply-stance" class="form-label">Votre profil ou camp</label>
          <select id="reply-stance" class="sort-select" style="width: 100%;">${stanceOptions}</select>
        </div>
        <div>
          <label for="reply-msg" class="form-label">Votre message</label>
          <textarea id="reply-msg" class="form-textarea" rows="3" placeholder="Partagez votre avis sur ce sujet..." required></textarea>
        </div>
        <div style="display: flex; justify-content: flex-end;">
          <button type="submit" class="st-btn st-btn-primary">Publier ma réponse</button>
        </div>
      </form>
    `;
    document.getElementById('article-reply-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = (document.getElementById('reply-msg').value || '').trim();
      const stance = document.getElementById('reply-stance').value;
      if (!msg) return;
      const all = getStoredComments();
      all.push({
        articleId: article.id,
        articleLabel: article.title,
        author: session.name,
        avatar: session.avatar || '/assets/images/avatars/minji.jpg',
        stance,
        message: msg,
        votes: 0,
        time: "À l'instant"
      });
      localStorage.setItem(commentsKey, JSON.stringify(all));
      document.getElementById('reply-msg').value = '';
      renderComments();
    });
  } else {
    replyZone.innerHTML = `
      <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem;">
        <div>
          <h3 style="margin: 0 0 0.25rem 0; font-family: var(--font-display); font-size: 1.2rem;">Connectez-vous pour participer au débat</h3>
          <p style="margin: 0; font-size: 0.9rem; color: var(--st-ink-muted);">La publication de réponses est réservée aux membres connectés.</p>
        </div>
        <a href="/pages/login.html" class="st-btn st-btn-primary">
          <span>Se connecter pour répondre</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
      </div>
    `;
  }

  // 6. Tout en bas uniquement : Autres sujets qui pourraient vous plaire
  const relatedGrid = document.getElementById('related-articles-grid');
  const others = Object.values(articles).filter((a) => a.id !== article.id);
  relatedGrid.innerHTML = others.map((a) => {
    const thumb = a.mediaType === 'video' ? a.posterSrc : a.imageSrc;
    const totalCount = a.comments.length + getStoredComments().filter((c) => c.articleId === a.id).length;
    return `
      <article class="st-look-card">
        <div class="st-look-media">
          <a href="/pages/article.html?id=${esc(a.id)}" aria-label="Lire : ${esc(a.title)}">
            <img src="${esc(thumb)}" alt="${esc(a.mediaAlt)}" loading="lazy">
          </a>
          <span class="st-gen-stamp">${esc(a.tag)}</span>
        </div>
        <div class="st-look-body">
          <h3 class="st-look-title"><a href="/pages/article.html?id=${esc(a.id)}">${esc(a.title)}</a></h3>
          <p class="st-look-sub">${totalCount} réponses</p>
          <p class="st-look-desc">${esc(a.summary)}</p>
        </div>
      </article>
    `;
  }).join('');
});
