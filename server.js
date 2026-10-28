/**
 * SERVEUR HTTP REST API & FICHIERS STATIQUES HAUTE PERFORMANCE
 * Projet Fil Rouge B3-IN : Forum K-Pop Accessible (RGAA / WCAG AAA)
 * 
 * Fonctionnalités :
 * - API REST mockée intégrée (/api/topic, /api/replies, /api/replies/:id/vote)
 * - Compression Gzip automatique (niveau 9)
 * - En-têtes de cache optimisés & ETag 304 Not Modified
 * - Zéro dépendance externe (Node.js natif standard)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');

const PORT = 8080;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml; charset=UTF-8',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.vtt': 'text/vtt; charset=UTF-8'
};

// Base de données en mémoire pour l'API REST du TP Fil Rouge
let mockDatabase = {
  topic: {
    id: 1,
    title: "De la 2e à la 5e génération : comment la K-Pop a-t-elle redéfini l'industrie musicale mondiale ?",
    author: "Min-ji Park",
    authorRole: "Chercheuse en ethnomusicologie & Passionnée 2nd Gen",
    publishedAt: "2026-10-14T08:30:00Z",
    viewsCount: 1420,
    repliesCount: 3
  },
  replies: [
    {
      id: 1,
      author: "Julien Mercier",
      role: "Producteur MAO & Fan de Stray Kids",
      date: "14 octobre 2026 à 09:15",
      votes: 42,
      content: "La transition vers la 4e et 5e génération est fascinante sur le plan de la production musicale. Avec des groupes comme Stray Kids ou ATEEZ, on est passés d'une production sous-traitée à des 'self-producing idols'. Le son s'est hybridé avec le noise-music et le cyberpunk trap, créant une signature sonore unique qui influence maintenant la pop occidentale."
    },
    {
      id: 2,
      author: "Sarah B.",
      role: "Étudiante en Langues Orientales (Inalco)",
      date: "14 octobre 2026 à 10:02",
      votes: 29,
      content: "Il ne faut pas oublier l'impact des plateformes communautaires globales comme Weverse et Bubble. Si la 2e génération a posé les bases avec les fancafe coréens fermés, la 4e et 5e ont aboli les frontières linguistiques grâce à la traduction instantanée et aux diffusions lives directes."
    },
    {
      id: 3,
      author: "Thomas Leclerc",
      role: "Danseur urbain & Passionné 4th Gen",
      date: "14 octobre 2026 à 10:45",
      votes: 15,
      content: "L'évolution des chorégraphies est aussi un marqueur clé : on est passés de 'points dances' simples et mémorables (type Gee ou Ring Ding Dong) à des performances ultra-techniques pensées pour TikTok et les dance practice en caméra 4K."
    }
  ]
};

// Helper d'envoi JSON
function sendJSON(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=UTF-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.end(JSON.stringify(data));
}

// Router API REST
function handleApiRoutes(req, res) {
  const urlParts = req.url.split('?');
  const pathname = urlParts[0];

  // Gestion des requêtes OPTIONS (CORS preflight)
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.end();
    return true;
  }

  // GET /api/topic
  if (req.method === 'GET' && (pathname === '/api/topic' || pathname === '/api/topics/1')) {
    sendJSON(res, 200, {
      success: true,
      data: {
        topic: mockDatabase.topic,
        replies: mockDatabase.replies,
        totalReplies: mockDatabase.replies.length
      }
    });
    return true;
  }

  // GET /api/replies
  if (req.method === 'GET' && pathname === '/api/replies') {
    sendJSON(res, 200, {
      success: true,
      count: mockDatabase.replies.length,
      data: mockDatabase.replies
    });
    return true;
  }

  // POST /api/login (Authentification & session)
  if (req.method === 'POST' && pathname === '/api/login') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const userName = payload.name || 'Min-ji Park';
        const userRole = payload.role || 'Fan VIP & Chercheuse 2nd Gen';
        sendJSON(res, 200, {
          success: true,
          message: "Authentification réussie.",
          user: {
            id: 101,
            name: userName,
            role: userRole,
            token: "mock-kpop-auth-token-2026"
          }
        });
      } catch (err) {
        sendJSON(res, 400, { success: false, error: "JSON invalide." });
      }
    });
    return true;
  }

  // POST /api/replies (Ajout d'une réponse)
  if (req.method === 'POST' && (pathname === '/api/replies' || pathname === '/api/topics/1/replies')) {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const author = (payload.authorName || '').trim();
        const role = (payload.authorRole || '').trim() || 'Membre de la communauté K-Pop';
        const content = (payload.replyMessage || '').trim();

        if (!author || author.length < 2) {
          sendJSON(res, 400, { success: false, error: "Le nom de l'auteur doit comporter au moins 2 caractères." });
          return;
        }
        if (!content || content.length < 10) {
          sendJSON(res, 400, { success: false, error: "La réponse doit comporter au moins 10 caractères." });
          return;
        }

        const now = new Date();
        const newReply = {
          id: mockDatabase.replies.length + 1,
          author,
          role,
          date: `À l'instant (${now.getDate()} octobre ${now.getFullYear()} à ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')})`,
          votes: 0,
          content
        };

        mockDatabase.replies.push(newReply);
        mockDatabase.topic.repliesCount = mockDatabase.replies.length;

        sendJSON(res, 201, {
          success: true,
          message: "Réponse publiée avec succès.",
          data: newReply,
          totalReplies: mockDatabase.replies.length
        });
      } catch (err) {
        sendJSON(res, 400, { success: false, error: "Format JSON invalide." });
      }
    });
    return true;
  }

  // POST /api/replies/:id/vote (Upvote d'une réponse)
  const voteMatch = pathname.match(/^\/api\/replies\/(\d+)\/vote$/);
  if (req.method === 'POST' && voteMatch) {
    const replyId = parseInt(voteMatch[1], 10);
    const reply = mockDatabase.replies.find(r => r.id === replyId);
    if (!reply) {
      sendJSON(res, 404, { success: false, error: "Réponse introuvable." });
      return true;
    }

    reply.votes += 1;
    sendJSON(res, 200, {
      success: true,
      replyId: reply.id,
      newVotes: reply.votes
    });
    return true;
  }

  return false;
}

const server = http.createServer((req, res) => {
  // 1. Vérifier si c'est une route d'API REST
  if (req.url.startsWith('/api/')) {
    const handled = handleApiRoutes(req, res);
    if (handled) return;
  }

  // 2. Traitement des fichiers statiques
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/favicon.ico') {
    res.statusCode = 204;
    res.end();
    return;
  }
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const filePath = path.join(PUBLIC_DIR, reqPath);

  // Sécurité anti-traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.statusCode = 403;
    res.end('Accès refusé');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
      res.end('Fichier non trouvé');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // ETag & Cache 304
    const etag = `"${stats.size}-${Number(stats.mtime)}"`;
    if (req.headers['if-none-match'] === etag) {
      res.statusCode = 304;
      res.end();
      return;
    }

    // Directives Cache-Control (Mode développement dynamique : pas de cache persistant)
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    res.setHeader('ETag', etag);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Vary', 'Accept-Encoding');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');

    // Support HTTP Range pour le streaming vidéo fluide (.mp4 / .webm)
    if (ext === '.mp4' || ext === '.webm') {
      res.setHeader('Accept-Ranges', 'bytes');
      const range = req.headers.range;
      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
        const chunksize = (end - start) + 1;
        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${stats.size}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': contentType
        });
        fs.createReadStream(filePath, { start, end }).pipe(res);
        return;
      }
    }

    // Compression Gzip
    const acceptEncoding = req.headers['accept-encoding'] || '';
    const isCompressible = /^(text\/|application\/javascript|application\/json|image\/svg\+xml)/.test(contentType);

    if (isCompressible && acceptEncoding.includes('gzip')) {
      res.setHeader('Content-Encoding', 'gzip');
      const rawStream = fs.createReadStream(filePath);
      const gzipStream = zlib.createGzip({ level: 9 });
      rawStream.pipe(gzipStream).pipe(res);
    } else {
      res.setHeader('Content-Length', stats.size);
      const rawStream = fs.createReadStream(filePath);
      rawStream.pipe(res);
    }
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` Serveur Fil Rouge B3-IN actif sur http://localhost:${PORT}`);
  console.log(` - Page Accueil   : http://localhost:${PORT}/index.html`);
  console.log(` - Page Forum     : http://localhost:${PORT}/forum.html`);
  console.log(` - Page Connexion : http://localhost:${PORT}/login.html`);
  console.log(` - Page Profil    : http://localhost:${PORT}/profil.html`);
  console.log(` - API REST Topic : http://localhost:${PORT}/api/topic`);
  console.log(` - API REST Login : http://localhost:${PORT}/api/login`);
  console.log(`=======================================================`);
});
