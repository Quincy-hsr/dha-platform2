/* =========================================================
   DHA — Mode DÉMO (version d'essai gratuite)
   À inclure dans le <head> de chaque page de la plateforme :
   <script src="dha-demo.js"></script>

   Un membre est en démo quand sa colonne Supabase "plan" vaut 'demo'.
   En démo : tout est visible, mais seul le Module 01 (Introduction
   au Trading) est jouable. Le reste affiche un cadenas et le bouton
   « Passer à la version payante ».
   Les membres payants (plan vide, '180', '500', '750') ne voient rien changer.
   ========================================================= */
(function () {
  var SUPABASE_URL = 'https://kdetwppxsfoagyndrlzr.supabase.co';
  var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkZXR3cHB4c2ZvYWd5bmRybHpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMzM3NjQsImV4cCI6MjA5MjgwOTc2NH0.OodaFQKEHcncDYdO6uM121NAUbyxD4UxpptSjzzZOi0';
  var URL_OFFRES = 'index.html#pricing';

  // Pages jouables en démo (le reste de la plateforme est verrouillé)
  var PAGES_LIBRES = ['dha-dashboard.html', 'dha-formation.html', 'dha-module1.html'];

  // Pages de la plateforme concernées par le verrou
  var PAGES_PLATEFORME = /^dha-(module\d+|mindset|squad|leaderboard|affiliation|mentor|niveaux|formation|dashboard)\.html$/;

  // Ce que chaque page verrouillée débloque (texte du pop-up)
  var INFOS = {
    'dha-mindset.html':     { icon: '🧠', titre: 'Module Mindset', txt: 'La fondation mentale du trader : discipline, gestion des émotions, routine.' },
    'dha-squad.html':       { icon: '👥', titre: 'Mon Squad', txt: 'Le Discord pour les lives trading et appels de groupe, et le groupe WhatsApp des membres.' },
    'dha-leaderboard.html': { icon: '🏆', titre: 'Leaderboard', txt: 'Le classement des membres : grimpe les rangs avec ton XP.' },
    'dha-affiliation.html': { icon: '💰', titre: 'Recommandation', txt: '20% de commission sur chaque personne que tu recommandes.' },
    'dha-mentor.html':      { icon: '📞', titre: 'Appel Mentor', txt: 'Réserve tes appels avec ton mentor selon ton offre.' },
    'dha-niveaux.html':     { icon: '⭐', titre: 'Niveaux & rangs', txt: 'Le système de progression complet de la plateforme.' },
    'avantages':            { icon: '🎁', titre: 'Avantages membres', txt: 'Les avantages réservés aux membres, comme les vols business et first à prix réduit.' }
  };

  function pageCourante() {
    var p = (location.pathname.split('/').pop() || '').toLowerCase();
    return p || 'index.html';
  }

  function getMembre() {
    try { return JSON.parse(localStorage.getItem('dha_member') || 'null'); }
    catch (e) { return null; }
  }

  function estDemo(m) { return !!(m && m.plan === 'demo'); }

  function pageVerrouillee(page) {
    return PAGES_PLATEFORME.test(page) && PAGES_LIBRES.indexOf(page) === -1;
  }

  function nomPage(href) {
    if (!href) return '';
    return (href.split('#')[0].split('?')[0].split('/').pop() || '').toLowerCase();
  }

  function infosPour(page) {
    if (INFOS[page]) return INFOS[page];
    var n = page.match(/^dha-module(\d+)\.html$/);
    if (n) return { icon: '📈', titre: 'Formation complète', txt: 'Les 17 modules de la formation trading, avec quiz, exercices et XP.' };
    return { icon: '🔒', titre: 'Contenu verrouillé', txt: 'Ce contenu fait partie de la version complète de DHA.' };
  }

  /* ---------- Styles ---------- */
  var CSS = '' +
    '.dha-demo-banner{position:fixed;left:0;right:0;bottom:0;z-index:9000;display:flex;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap;padding:10px 16px;background:linear-gradient(90deg,rgba(255,215,0,0.12),rgba(0,212,255,0.12));border-top:1px solid rgba(255,215,0,0.35);backdrop-filter:blur(10px);font-family:"Orbitron",sans-serif;font-size:10px;letter-spacing:2px;color:#FFD700;text-align:center;}' +
    '.dha-demo-banner a{padding:8px 16px;border-radius:99px;background:#FFD700;color:#050914;font-weight:900;text-decoration:none;white-space:nowrap;}' +
    'body.dha-demo-on{padding-bottom:56px;}' +
    '.dha-demo-lockable{position:relative !important;}' +
    '.dha-demo-cardlock{position:absolute;inset:0;z-index:5;border-radius:inherit;display:flex;align-items:center;justify-content:center;gap:8px;background:rgba(5,9,20,0.72);backdrop-filter:blur(3px);font-family:"Orbitron",sans-serif;font-size:9px;font-weight:900;letter-spacing:2px;color:#FFD700;cursor:pointer;text-align:center;padding:8px;}' +
    '.dha-demo-navlock{margin-left:6px;font-size:11px;opacity:0.8;}' +
    '.dha-demo-modal{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(5,9,20,0.88);backdrop-filter:blur(12px);}' +
    '.dha-demo-modal.plein{background:rgba(5,9,20,0.6);backdrop-filter:blur(9px);}' +
    '.dha-demo-card{background:#080e1f;border:1px solid rgba(255,215,0,0.3);border-radius:20px;padding:34px 28px;max-width:440px;width:100%;text-align:center;box-shadow:0 0 50px rgba(255,215,0,0.08);font-family:"Exo 2",sans-serif;color:#E8F4FF;}' +
    '.dha-demo-lockicon{font-size:42px;margin-bottom:10px;}' +
    '.dha-demo-tag{font-family:"Orbitron",sans-serif;font-size:8px;letter-spacing:3px;color:rgba(0,212,255,0.7);margin-bottom:8px;}' +
    '.dha-demo-title{font-family:"Orbitron",sans-serif;font-size:17px;font-weight:900;letter-spacing:1px;margin-bottom:10px;}' +
    '.dha-demo-txt{font-size:14px;line-height:1.6;color:rgba(232,244,255,0.6);margin-bottom:22px;}' +
    '.dha-demo-cta{display:block;padding:15px 18px;border-radius:12px;background:linear-gradient(90deg,#FFD700,#FFB800);color:#050914;font-family:"Orbitron",sans-serif;font-size:11px;font-weight:900;letter-spacing:2px;text-decoration:none;margin-bottom:12px;}' +
    '.dha-demo-sec{display:inline-block;background:none;border:none;color:rgba(232,244,255,0.45);font-family:"Orbitron",sans-serif;font-size:9px;letter-spacing:2px;cursor:pointer;text-decoration:none;padding:6px;}';

  function injecterStyles() {
    if (document.getElementById('dha-demo-css')) return;
    var s = document.createElement('style');
    s.id = 'dha-demo-css';
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  /* ---------- Pop-up « Passer à la version payante » ---------- */
  function carteHTML(info, plein) {
    return '<div class="dha-demo-card">' +
      '<div class="dha-demo-lockicon">🔒</div>' +
      '<div class="dha-demo-tag">VERSION DÉMO</div>' +
      '<div class="dha-demo-title">' + info.icon + ' ' + info.titre + '</div>' +
      '<div class="dha-demo-txt">' + info.txt + '<br/><br/>Disponible dans la version complète de DHA.</div>' +
      '<a class="dha-demo-cta" href="' + URL_OFFRES + '">PASSER À LA VERSION PAYANTE →</a>' +
      (plein
        ? '<a class="dha-demo-sec" href="dha-dashboard.html">← RETOUR AU DASHBOARD</a>'
        : '<button class="dha-demo-sec" data-demo-close>CONTINUER LA DÉMO</button>') +
      '</div>';
  }

  function ouvrirPopup(info) {
    var old = document.querySelector('.dha-demo-modal:not(.plein)');
    if (old) old.remove();
    var m = document.createElement('div');
    m.className = 'dha-demo-modal';
    m.innerHTML = carteHTML(info, false);
    m.addEventListener('click', function (e) {
      if (e.target === m || e.target.closest('[data-demo-close]')) m.remove();
    });
    document.body.appendChild(m);
  }
  window.dhaDemoPopup = function (page) { ouvrirPopup(infosPour(page || '')); };

  /* ---------- Application du verrou ---------- */
  function appliquer() {
    if (document.body.classList.contains('dha-demo-on')) return;
    document.body.classList.add('dha-demo-on');
    var page = pageCourante();

    // Bandeau permanent en bas
    var b = document.createElement('div');
    b.className = 'dha-demo-banner';
    b.innerHTML = '<span>🎮 VERSION DÉMO · SEUL LE MODULE 01 EST DÉBLOQUÉ</span><a href="' + URL_OFFRES + '">PASSER À LA VERSION PAYANTE</a>';
    document.body.appendChild(b);

    // Page entièrement verrouillée (accès direct par l'URL) : on la montre floutée derrière
    if (pageVerrouillee(page)) {
      var m = document.createElement('div');
      m.className = 'dha-demo-modal plein';
      m.innerHTML = carteHTML(infosPour(page), true);
      document.body.appendChild(m);
      document.body.style.overflow = 'hidden';
      return;
    }

    // Cadenas sur les liens du menu qui mènent à une page verrouillée
    var liens = document.querySelectorAll('a[href]');
    for (var i = 0; i < liens.length; i++) {
      var a = liens[i];
      var cible = nomPage(a.getAttribute('href'));
      if (!pageVerrouillee(cible)) continue;
      if (a.classList.contains('nav-item') && !a.querySelector('.dha-demo-navlock')) {
        var l = document.createElement('span');
        l.className = 'dha-demo-navlock';
        l.textContent = '🔒';
        a.appendChild(l);
      }
      // Cartes de modules (formation) et de formations (dashboard)
      if (a.classList.contains('module-card') || a.classList.contains('module-item')) {
        a.classList.add('dha-demo-lockable');
        if (!a.querySelector('.dha-demo-cardlock')) {
          var c = document.createElement('div');
          c.className = 'dha-demo-cardlock';
          c.innerHTML = '🔒 PASSER À LA VERSION PAYANTE POUR Y ACCÉDER';
          a.appendChild(c);
        }
      }
    }
  }

  // Interception des clics (capture) : liens vers pages verrouillées + Avantages
  document.addEventListener('click', function (e) {
    if (!estDemo(getMembre())) return;
    var t = e.target;
    if (!t || !t.closest) return;
    if (t.closest('.dha-demo-modal')) return;
    var av = t.closest('[onclick*="showAvantages"]');
    if (av) {
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
      ouvrirPopup(INFOS.avantages);
      return;
    }
    var a = t.closest('a[href]');
    if (!a) return;
    var cible = nomPage(a.getAttribute('href'));
    if (pageVerrouillee(cible)) {
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
      ouvrirPopup(infosPour(cible));
    }
  }, true);

  function demarrer() {
    injecterStyles();
    appliquer();
  }

  if (estDemo(getMembre())) {
    injecterStyles();
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer);
    else demarrer();
  }

  // Vérifie le plan à jour dans Supabase : si le membre est passé payant, on débloque
  (function rafraichir() {
    var m = getMembre();
    if (!m || !m.email) return;
    if (!window.DHA) return;
    DHA.me().then(function (d) {
        if (!d) return;
        var plan = d.plan || null;
        var avant = m.plan || null;
        if (plan === avant) return;
        // Changement de statut → on recharge pour appliquer / retirer le verrou
        location.reload();
      }).catch(function () {});
  })();
})();
