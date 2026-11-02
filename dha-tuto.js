/* =========================================================
   DHA — Tutoriel de première connexion (dashboard)
   Cinématique d'arrivée, puis visite guidée étape par étape :
   chaque élément est mis en lumière, le membre lit et appuie sur OK.
   Vu une seule fois (mémorisé par pseudo) ; « Revoir le tuto » pour le relancer.
   ========================================================= */
(function () {
  if (window.__dhaTuto) return; window.__dhaTuto = true;
  var VERSION = 'v1';

  function membre() { try { return JSON.parse(localStorage.getItem('dha_member') || '{}'); } catch (e) { return {}; } }
  function cle() { return 'dha_tuto_' + VERSION + '_' + (membre().pseudo || 'invite'); }
  function dejaVu() { try { return localStorage.getItem(cle()) === '1'; } catch (e) { return true; } }
  function marquerVu() { try { localStorage.setItem(cle(), '1'); } catch (e) {} }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  var css = '' +
    /* cinématique */
    '.tt-cine{position:fixed;inset:0;z-index:10050;background:#02040a;display:flex;align-items:center;justify-content:center;flex-direction:column;overflow:hidden;color:#E8F4FF;text-align:center;padding:24px;}' +
    '.tt-cine::before{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(30,100,255,0.09) 1px,transparent 1px),linear-gradient(90deg,rgba(30,100,255,0.09) 1px,transparent 1px);background-size:44px 44px;transform:perspective(500px) rotateX(58deg) translateY(30%);transform-origin:bottom;animation:ttGrid 6s linear infinite;opacity:.7;}' +
    '.tt-cine::after{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(0,212,255,0.16),transparent 60%);animation:ttPulse 3s ease-in-out infinite;}' +
    '.tt-sweep{position:absolute;top:0;bottom:0;width:30%;left:-40%;background:linear-gradient(90deg,transparent,rgba(0,212,255,0.25),transparent);animation:ttSweep 2.2s .3s ease-in-out both;z-index:1;}' +
    '.tt-logo{position:relative;z-index:2;font-family:Orbitron,"Chakra Petch",sans-serif;font-weight:900;font-size:clamp(64px,18vw,140px);letter-spacing:.18em;text-shadow:0 0 30px rgba(0,212,255,0.8),0 0 80px rgba(30,100,255,0.6);animation:ttLogo 1.6s .2s cubic-bezier(.2,.8,.2,1) both;}' +
    '.tt-sub{position:relative;z-index:2;font-family:Orbitron,"Chakra Petch",sans-serif;font-size:clamp(9px,2.4vw,12px);letter-spacing:.5em;color:#00D4FF;margin-top:6px;animation:ttFade .8s 1.4s both;}' +
    '.tt-wel{position:relative;z-index:2;margin-top:34px;font-family:Orbitron,"Chakra Petch",sans-serif;font-size:clamp(14px,3.6vw,20px);letter-spacing:.2em;animation:ttFade .8s 2.1s both;}' +
    '.tt-name{position:relative;z-index:2;font-family:Orbitron,"Chakra Petch",sans-serif;font-weight:900;font-size:clamp(28px,8vw,52px);color:#FFD700;text-shadow:0 0 24px rgba(255,215,0,0.55);margin-top:8px;animation:ttName 1s 2.7s cubic-bezier(.2,.8,.2,1) both;}' +
    '.tt-line{position:relative;z-index:2;margin-top:16px;font-size:16px;color:rgba(232,244,255,0.75);max-width:420px;line-height:1.6;animation:ttFade .8s 3.5s both;}' +
    '.tt-go{position:relative;z-index:2;margin-top:30px;padding:16px 28px;border-radius:14px;border:none;cursor:pointer;background:linear-gradient(135deg,#1E64FF,#00D4FF);color:#020610;font-family:Orbitron,"Chakra Petch",sans-serif;font-weight:900;font-size:13px;letter-spacing:2px;box-shadow:0 0 40px rgba(0,212,255,0.45);animation:ttFade .8s 4.1s both,ttGlow 2s 5s ease-in-out infinite;}' +
    '.tt-skip{position:absolute;z-index:3;top:16px;right:16px;background:none;border:1px solid rgba(255,255,255,0.15);color:rgba(232,244,255,0.55);border-radius:99px;padding:7px 14px;font-size:12px;cursor:pointer;animation:ttFade .6s 1s both;}' +
    '.tt-cine.out{animation:ttOut .7s ease both;}' +
    '@keyframes ttGrid{to{background-position:0 44px,0 0}}' +
    '@keyframes ttPulse{0%,100%{opacity:.6}50%{opacity:1}}' +
    '@keyframes ttSweep{to{left:110%}}' +
    '@keyframes ttLogo{0%{opacity:0;transform:scale(2.6);filter:blur(18px)}60%{opacity:1;filter:blur(0)}100%{opacity:1;transform:scale(1)}}' +
    '@keyframes ttFade{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}' +
    '@keyframes ttName{0%{opacity:0;transform:scale(.6);letter-spacing:.6em}100%{opacity:1;transform:none;letter-spacing:.04em}}' +
    '@keyframes ttGlow{0%,100%{box-shadow:0 0 30px rgba(0,212,255,0.35)}50%{box-shadow:0 0 60px rgba(0,212,255,0.7)}}' +
    '@keyframes ttOut{to{opacity:0;transform:scale(1.08);filter:blur(6px)}}' +
    /* visite guidée */
    '.tt-veil{position:fixed;inset:0;z-index:10040;}' +
    '.tt-hole{position:fixed;z-index:10041;border-radius:18px;box-shadow:0 0 0 9999px rgba(2,4,10,0.82);border:2px solid #00D4FF;transition:all .45s cubic-bezier(.4,0,.2,1);pointer-events:none;animation:ttHole 2s ease-in-out infinite;}' +
    '.tt-hole.none{border-color:transparent;animation:none;}' +
    '@keyframes ttHole{0%,100%{outline:0 solid rgba(0,212,255,0.4)}50%{outline:6px solid rgba(0,212,255,0.15)}}' +
    '.tt-card{position:fixed;z-index:10042;width:min(440px,calc(100vw - 24px));background:#080e1f;border:1px solid rgba(0,212,255,0.35);border-radius:20px;padding:22px 20px 18px;color:#E8F4FF;font-family:"Exo 2","Rajdhani",sans-serif;box-shadow:0 20px 60px rgba(0,0,0,0.7);transition:top .45s cubic-bezier(.4,0,.2,1),left .45s cubic-bezier(.4,0,.2,1);animation:ttCard .45s ease both;max-height:calc(100vh - 24px);overflow-y:auto;}' +
    '.tt-card::before{content:"";position:absolute;top:0;left:0;right:0;height:2px;border-radius:20px 20px 0 0;background:linear-gradient(90deg,#1E64FF,#00D4FF,#FFD700);}' +
    '@keyframes ttCard{from{opacity:0;transform:translateY(14px) scale(.97)}to{opacity:1;transform:none}}' +
    '.tt-step{font-family:Orbitron,"Chakra Petch",sans-serif;font-size:9px;letter-spacing:3px;color:#00D4FF;margin-bottom:8px;}' +
    '.tt-t{font-family:Orbitron,"Chakra Petch",sans-serif;font-size:17px;font-weight:900;letter-spacing:1px;margin-bottom:10px;line-height:1.3;}' +
    '.tt-p{font-size:15px;line-height:1.6;color:rgba(232,244,255,0.85);}' +
    '.tt-p b{color:#FFD700;font-weight:700;}' +
    '.tt-list{list-style:none;padding:0;margin:12px 0 0;display:flex;flex-direction:column;gap:7px;}' +
    '.tt-list li{display:flex;gap:10px;align-items:flex-start;font-size:14px;line-height:1.45;color:rgba(232,244,255,0.85);padding:8px 10px;border-radius:10px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);}' +
    '.tt-list li span{flex-shrink:0;}' +
    '.tt-list li em{margin-left:auto;font-style:normal;font-weight:700;color:#00FF88;white-space:nowrap;padding-left:8px;}' +
    '.tt-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:18px;}' +
    '.tt-dots{display:flex;gap:5px;flex-wrap:wrap;}' +
    '.tt-dots i{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,0.15);}' +
    '.tt-dots i.on{background:#00D4FF;box-shadow:0 0 8px #00D4FF;}' +
    '.tt-ok{padding:13px 22px;border-radius:12px;border:none;cursor:pointer;background:linear-gradient(135deg,#1E64FF,#00D4FF);color:#020610;font-family:Orbitron,"Chakra Petch",sans-serif;font-weight:900;font-size:12px;letter-spacing:1.5px;white-space:nowrap;}' +
    '.tt-ok.gold{background:linear-gradient(135deg,#FFD700,#FF9F00);color:#1a1200;}' +
    '.tt-back{background:none;border:none;color:rgba(232,244,255,0.5);cursor:pointer;font-size:13px;padding:8px 4px;}' +
    '.tt-quit{display:block;margin:12px auto 0;background:none;border:none;color:rgba(232,244,255,0.35);font-size:12px;cursor:pointer;text-decoration:underline;}' +
    '.tt-ok:focus-visible,.tt-go:focus-visible,.tt-back:focus-visible,.tt-quit:focus-visible,.tt-skip:focus-visible{outline:2px solid #FFD700;outline-offset:2px;}' +
    '.tt-ban{position:relative;display:flex;align-items:center;margin:0 0 16px;border-radius:18px;border:1px solid rgba(0,212,255,0.45);background:linear-gradient(135deg,rgba(30,100,255,0.22),rgba(0,212,255,0.10));box-shadow:0 0 24px rgba(0,212,255,0.18);}' +
    '.tt-ban a{flex:1;display:flex;align-items:center;gap:12px;padding:14px 44px 14px 14px;text-decoration:none;color:#F2F6FF;}' +
    '.tt-ban-ic{font-size:26px;}' +
    '.tt-ban b{display:block;font-family:Sora,sans-serif;font-size:15px;}' +
    '.tt-ban small{display:block;font-size:13px;color:#A9B8D6;margin-top:2px;}' +
    '.tt-ban-go{margin-left:auto;font-family:Sora,sans-serif;font-size:12px;font-weight:800;letter-spacing:1px;color:#00D4FF;white-space:nowrap;}' +
    '.tt-ban button{position:absolute;top:6px;right:6px;width:30px;height:30px;border:none;border-radius:50%;background:transparent;color:#A9B8D6;font-size:14px;cursor:pointer;}' +
    '.tt-again{font-family:Orbitron,"Chakra Petch",sans-serif;font-size:8px;letter-spacing:2px;color:#00D4FF;text-decoration:none;opacity:.8;}' +
    '@media (prefers-reduced-motion:reduce){.tt-cine *,.tt-cine::before,.tt-cine::after,.tt-hole,.tt-card{animation:none!important;transition:none!important;}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ---------- les étapes ---------- */
  function etapes() {
    var m = membre(), prenom = esc(m.prenom || m.pseudo || 'Hustler');
    return [
      { cible: '.player-card', titre: '🎮 TA CARTE JOUEUR',
        texte: 'Ça, c\'est toi, ' + prenom + ' ! Ton <b>pseudo</b>, ton <b>rang</b>, ton <b>XP total</b>, ton <b>level</b> et le nombre de <b>jours</b> depuis que tu as rejoint la DHA.<br><br>📷 Clique sur ta photo pour mettre la tienne.' },
      { cible: '.xp-bar-wrap', titre: '⭐ LEVELS & RANGS',
        texte: 'Chaque action te rapporte de l\'<b>XP</b>. Avec l\'XP tu montes de <b>level</b>, et tes levels te font monter de <b>rang</b> :',
        liste: [['🎮', 'New Hustler'], ['⚡', 'Hustler : débloque les Avantages membres'], ['🚀', 'Pro'], ['👑', 'Ambassadeur'], ['🏆', 'Legend']],
        apres: 'Clique sur « Voir tous les rangs » pour voir le détail.' },
      { cible: null, titre: '⚡ COMMENT GAGNER DE L\'XP',
        texte: 'Plus tu bosses, plus tu montes. Voici ce qui rapporte le plus :',
        liste: [['🎤', 'Venir à un séminaire', '+500'], ['🎉', 'Sortie ou événement en équipe', '+400'], ['🎯', 'Preuve d\'exercice', '+200'], ['🤝', 'Parrainer un ami', '+150'], ['📈', 'Envoyer une analyse trading', '+100'], ['👥', 'Appel de groupe (mardi & jeudi)', '+75'], ['📚', 'Finir un module (+ quiz et exercice)', '+40'], ['🔌', 'Te connecter chaque jour', '+10']],
        apres: 'Tout est détaillé dans le <b>Guide XP</b>, à côté des quêtes.' },
      { cible: function () { var l = document.getElementById('dq-list'); return l && l.closest('.card'); }, titre: '🎯 LES QUÊTES DU JOUR',
        texte: 'Chaque jour, <b>4 quêtes</b> tombent au hasard. Chaque quête réussie = <b>+25 XP</b> en plus de l\'XP de l\'action. Les 4 terminées = <b>+100 XP bonus</b>.<br><br>⏱️ Le compteur te montre quand les nouvelles quêtes arrivent (à minuit). Ne les laisse pas filer !' },
      { cible: '.dc-btn', titre: '✉️ TON COURRIER XP',
        texte: 'Chaque fois que tu gagnes de l\'XP, une <b>lettre</b> arrive ici : combien, quand et pourquoi. La <b>pastille rouge</b> te dit que tu as du nouveau.' },
      { cible: '#module-classe', titre: '📚 TA FORMATION',
        texte: 'C\'est le cœur de la DHA : <b>17 modules</b>, des bases jusqu\'à l\'exécution complète. Dans chaque module :',
        liste: [['🎥', 'La vidéo et le cours'], ['🧠', 'Le quiz (jusqu\'à +50 XP)'], ['💪', 'L\'exercice pratique (+75 XP)'], ['✅', '« Terminer le bloc » pour valider le module']],
        apres: 'Finis le <b>Module 1</b> et tu passes direct <b>niveau 2</b> 🔥' },
      { cible: function () { var s = document.querySelector('.sidebar'); return (s && s.getBoundingClientRect().width > 0 && innerWidth > 768) ? s : null; }, titre: '🧭 TON MENU',
        texte: innerWidth > 768 ? 'Tout le reste est dans le menu à gauche :' : 'Tout le reste est dans le menu (le bouton ☰ en haut à gauche) :',
        liste: [['👥', 'Mon Squad : le groupe WhatsApp et le Discord'], ['📺', 'Lives & Replays : le planning et les replays'], ['🏆', 'Leaderboard : le classement des membres'], ['📁', 'Ressources : plan, journal et checklist'], ['💰', 'Recommandation : 20 % sur chaque ami qui rejoint'], ['📞', 'Appel Mentor : ton appel avec Quincy'], ['🛠️', 'Signaler : un bug ou une idée, on lit tout']] },
      { cible: null, final: true, titre: '🚀 À TOI DE JOUER, ' + prenom.toUpperCase(),
        texte: 'Ta première mission : <b>le Module 1</b>. Regarde la vidéo, fais le quiz, valide le bloc… et passe <b>niveau 2</b>.<br><br>On se retrouve en haut du classement 💪' }
    ];
  }

  /* ---------- cinématique ---------- */
  function cinematique(suite) {
    var m = membre();
    var c = document.createElement('div');
    c.className = 'tt-cine'; c.setAttribute('role', 'dialog'); c.setAttribute('aria-modal', 'true'); c.setAttribute('aria-label', 'Bienvenue dans la DHA');
    c.innerHTML = '<div class="tt-sweep"></div><button type="button" class="tt-skip">Passer</button>' +
      '<div class="tt-logo">DHA</div><div class="tt-sub">DIGITAL HUSTLER ACADEMY</div>' +
      '<div class="tt-wel">BIENVENUE DANS LA DHA</div><div class="tt-name">' + esc((m.prenom || m.pseudo || 'Hustler')) + '</div>' +
      '<div class="tt-line">Ton aventure commence maintenant. Je vais te montrer comment utiliser la plateforme, étape par étape.</div>' +
      '<button type="button" class="tt-go">▶ C\'EST PARTI</button>';
    document.body.appendChild(c);
    document.body.style.overflow = 'hidden';
    function fin(lancer) {
      c.classList.add('out');
      setTimeout(function () { c.remove(); document.body.style.overflow = ''; if (lancer) suite(); else marquerVu(); }, 650);
    }
    c.querySelector('.tt-go').onclick = function () { fin(true); };
    c.querySelector('.tt-skip').onclick = function () { fin(false); };
    setTimeout(function () { var g = c.querySelector('.tt-go'); if (g) g.focus({ preventScroll: true }); }, 4300);
  }

  /* ---------- visite guidée ---------- */
  function visite() {
    var E = etapes(), i = 0;
    var veil = document.createElement('div'); veil.className = 'tt-veil';
    var hole = document.createElement('div'); hole.className = 'tt-hole none';
    var card = document.createElement('div'); card.className = 'tt-card'; card.setAttribute('role', 'dialog'); card.setAttribute('aria-modal', 'true');
    document.body.appendChild(veil); document.body.appendChild(hole); document.body.appendChild(card);
    var padAvant = document.body.style.paddingBottom; document.body.style.paddingBottom = '70vh'; // de quoi faire remonter les éléments du bas

    function cible(e) {
      var t = typeof e.cible === 'function' ? e.cible() : (e.cible ? document.querySelector(e.cible) : null);
      if (!t) return null;
      var r = t.getBoundingClientRect();
      return (r.width > 0 && r.height > 0) ? t : null;
    }
    function placer() {
      var e = E[i], t = cible(e), pad = 8;
      if (!t) {
        hole.className = 'tt-hole none';
        hole.style.cssText = 'top:50%;left:50%;width:0;height:0;';
        card.style.top = Math.max(12, (innerHeight - card.offsetHeight) / 2) + 'px';
        card.style.left = Math.max(12, (innerWidth - card.offsetWidth) / 2) + 'px';
        return;
      }
      var r = t.getBoundingClientRect();
      var h = Math.min(r.height + pad * 2, innerHeight * 0.55);
      hole.className = 'tt-hole';
      hole.style.cssText = 'top:' + (r.top - pad) + 'px;left:' + (r.left - pad) + 'px;width:' + (r.width + pad * 2) + 'px;height:' + h + 'px;';
      var ch = card.offsetHeight, cw = card.offsetWidth, top;
      var dessous = r.top - pad + h + 14, dessus = r.top - pad - 14 - ch;
      if (dessous + ch <= innerHeight - 12) top = dessous;
      else if (dessus >= 12) top = dessus;
      else top = innerHeight - ch - 12;
      var left = innerWidth > 768 ? Math.min(Math.max(12, r.left), innerWidth - cw - 12) : (innerWidth - cw) / 2;
      if (innerWidth > 768 && r.width < 300 && r.left + r.width + cw + 30 < innerWidth && top === innerHeight - ch - 12) { left = r.right + 20; top = Math.max(12, Math.min(r.top, innerHeight - ch - 12)); }
      card.style.top = Math.max(12, top) + 'px'; card.style.left = Math.max(12, left) + 'px';
    }
    function afficher() {
      var e = E[i], t = cible(e);
      card.style.animation = 'none'; void card.offsetWidth; card.style.animation = '';
      card.setAttribute('aria-label', e.titre.replace(/<[^>]+>/g, ''));
      card.innerHTML = '<div class="tt-step">ÉTAPE ' + (i + 1) + ' / ' + E.length + '</div>' +
        '<div class="tt-t">' + e.titre + '</div><div class="tt-p">' + e.texte + '</div>' +
        (e.liste ? '<ul class="tt-list">' + e.liste.map(function (l) { return '<li><span>' + l[0] + '</span><div>' + l[1] + '</div>' + (l[2] ? '<em>' + l[2] + '</em>' : '') + '</li>'; }).join('') + '</ul>' : '') +
        (e.apres ? '<div class="tt-p" style="margin-top:12px;font-size:14px;color:rgba(232,244,255,0.65)">' + e.apres + '</div>' : '') +
        '<div class="tt-foot">' + (i > 0 ? '<button type="button" class="tt-back">← Retour</button>' : '<div class="tt-dots">' + E.map(function (_, k) { return '<i' + (k === i ? ' class="on"' : '') + '></i>'; }).join('') + '</div>') +
        (e.final ? '<button type="button" class="tt-ok gold" data-go="module1">▶ COMMENCER LE MODULE 1</button>' : '<button type="button" class="tt-ok">OK ✓</button>') + '</div>' +
        (e.final ? '<button type="button" class="tt-quit" data-go="rester">Rester sur le dashboard</button>' : '<button type="button" class="tt-quit" data-go="quitter">Passer le tuto</button>');
      if (t) {
        var r = t.getBoundingClientRect();
        var fixe = getComputedStyle(t).position === 'fixed' || t.classList.contains('sidebar');
        var y = window.scrollY + r.top - (innerWidth > 768 ? 90 : Math.max(70, (innerHeight - Math.min(r.height, innerHeight * 0.55) - card.offsetHeight - 40) / 2));
        if (!fixe) window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      }
      placer(); setTimeout(placer, 420); setTimeout(placer, 800);
      var ok = card.querySelector('.tt-ok'); if (ok) ok.focus({ preventScroll: true });
    }
    function fermer() {
      window.removeEventListener('resize', placer); window.removeEventListener('scroll', placer);
      document.removeEventListener('keydown', clavier);
      [veil, hole, card].forEach(function (n) { n.remove(); });
      document.body.style.paddingBottom = padAvant;
      marquerVu();
    }
    function clavier(e) {
      if (e.key === 'Escape') fermer();
      else if (e.key === 'ArrowRight') { if (i < E.length - 1) { i++; afficher(); } }
      else if (e.key === 'ArrowLeft') { if (i > 0) { i--; afficher(); } }
    }
    card.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var go = b.getAttribute('data-go');
      if (go === 'module1') { fermer(); location.href = 'dha-module1.html'; return; }
      if (go === 'rester' || go === 'quitter') { fermer(); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
      if (b.classList.contains('tt-back')) { if (i > 0) { i--; afficher(); } return; }
      if (b.classList.contains('tt-ok')) { if (i < E.length - 1) { i++; afficher(); } else fermer(); }
    });
    window.addEventListener('resize', placer); window.addEventListener('scroll', placer, { passive: true });
    document.addEventListener('keydown', clavier);
    afficher();
  }

  function lancer() { cinematique(visite); }
  window.DHATuto = { lancer: lancer, visite: visite };

  function init() {
    // lien « Revoir le tuto » sous la carte joueur
    var zone = document.querySelector('.xp-bar-wrap > div:last-child');
    if (zone && !document.querySelector('.tt-again')) {
      var a = document.createElement('a'); a.href = '#'; a.className = 'tt-again'; a.textContent = '🎮 REVOIR LE TUTO';
      a.onclick = function (e) { e.preventDefault(); lancer(); };
      zone.appendChild(a); zone.style.flexWrap = 'wrap'; zone.style.gap = '8px';
    }
    // Mobile : proposer d'installer l'appli (pas si déjà ouverte comme appli)
    var mobile = /iphone|ipad|ipod|android/i.test(navigator.userAgent || '');
    var appli = window.navigator.standalone === true || (window.matchMedia && matchMedia('(display-mode: standalone)').matches);
    if (mobile && !appli) {
      if (zone && !document.querySelector('.tt-app')) {
        var l = document.createElement('a'); l.href = 'dha-appli.html'; l.className = 'tt-again tt-app'; l.textContent = '📲 INSTALLER L\'APPLI';
        zone.appendChild(l);
      }
      var cache = false; try { cache = localStorage.getItem('dha_appli_ban') === '1'; } catch (e) {}
      var tb = document.querySelector('.main .topbar');
      if (!cache && tb && !document.querySelector('.tt-ban')) {
        var bn = document.createElement('div'); bn.className = 'tt-ban';
        bn.innerHTML = '<a href="dha-appli.html"><span class="tt-ban-ic">📲</span><span><b>Installe l\'appli DHA</b><small>L\'icône sur ton écran d\'accueil, en 30 secondes</small></span><span class="tt-ban-go">VOIR ›</span></a><button type="button" aria-label="Masquer">✕</button>';
        bn.querySelector('button').onclick = function () { bn.remove(); try { localStorage.setItem('dha_appli_ban', '1'); } catch (e) {} };
        tb.parentNode.insertBefore(bn, tb.nextSibling);
      }
    }
    if (!membre().pseudo || dejaVu()) return;
    // attendre que le dashboard soit chargé (pseudo, quêtes, courrier)
    var essais = 0;
    (function attendre() {
      var pret = document.getElementById('player-pseudo') && document.getElementById('player-pseudo').textContent !== '---';
      if ((pret && document.getElementById('dq-list')) || essais++ > 25) {
        if (document.querySelector('.lu-ov')) { setTimeout(attendre, 1500); return; }
        setTimeout(lancer, 400);
      } else setTimeout(attendre, 200);
    })();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
