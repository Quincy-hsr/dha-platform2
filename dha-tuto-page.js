/* =========================================================
   DHA — Présentation de chaque page (première visite)
   Cinématique courte, puis visite guidée étape par étape de la page.
   Pages : Formation, modules, Mon Squad, Lives & Replays, Recommandation, Appel Mentor.
   (Dashboard : dha-tuto.js · Leaderboard : dha-tuto-lb.js · pas de présentation pour Copy trading)
   Vue une seule fois par page et par pseudo ; bouton « 🎬 Revoir la présentation » pour la relancer.
   ========================================================= */
(function () {
  if (window.__dhaTutoPage) return; window.__dhaTutoPage = true;
  var VERSION = 'v1';
  function membre() { try { return JSON.parse(localStorage.getItem('dha_member') || '{}'); } catch (e) { return {}; } }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function $(s) { return document.querySelector(s); }
  function carte(label) { var l = [].slice.call(document.querySelectorAll('.card-label')).filter(function (x) { return x.textContent.indexOf(label) > -1; })[0]; return l ? (l.closest('.card') || l.parentNode) : null; }
  function lv(titre) { var h = [].slice.call(document.querySelectorAll('.lv-h')).filter(function (x) { return x.textContent.indexOf(titre) > -1; })[0]; return h ? h.closest('.lv-card') : null; }
  function visible(el) { if (!el) return false; var r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).display !== 'none'; }

  /* ---------- le contenu de chaque page ---------- */
  var fichier = (location.pathname.split('/').pop() || '').toLowerCase();
  var estModule = /^dha-module\d+\.html$/.test(fichier);
  var PAGES = {
    'dha-formation.html': {
      couleur: ['#1E64FF', '#00D4FF'], ic: '📈', k: 'TA FORMATION', h: 'FORMATION<br><span>TRADING</span>',
      chips: ['📚 17 modules', '🧠 Un quiz par module', '💪 Des exercices', '🎓 Un certificat à la fin'],
      ligne: 'C\'est le cœur de la DHA : des bases jusqu\'à l\'exécution complète, étape par étape.',
      etapes: [
        { cible: function () { return $('.formation-header'); }, titre: '📊 TA PROGRESSION', texte: 'Ici tu vois combien de <b>modules</b> tu as terminés et ta <b>progression globale</b>. Le bouton <b>Mon certificat</b> se débloque quand tout est fini.' },
        { cible: function () { return $('.category-card'); }, titre: '🗂️ LES 5 PARCOURS', texte: 'La formation est rangée en <b>5 parcours</b>, à faire dans l\'ordre :',
          liste: [['📘', 'Bases : les fondamentaux'], ['🎯', 'Stratégie avancée : la méthode SMC'], ['⚡', 'Exécution : du compte démo au trade géré'], ['📄', 'Analyse fondamentale : l\'actu économique'], ['💰', 'Encaisser : passer en réel et les prop firms']] },
        { cible: null, titre: '🔓 UN MODULE APRÈS L\'AUTRE', texte: 'Chaque module terminé <b>débloque le suivant</b>. Ouvre un parcours, puis clique sur le module disponible pour commencer.' }
      ],
      fin: { titre: '🚀 COMMENCE PAR LE MODULE 1', texte: 'Ouvre <b>Bases</b> puis le <b>Module 1</b>. Une présentation t\'expliquera comment marche un module.' }
    },
    'module': {
      couleur: ['#9D4EDD', '#00D4FF'], ic: '🎓', k: 'COMMENT MARCHE UN MODULE', h: 'TON<br><span>MODULE</span>',
      chips: ['🎥 La vidéo', '📖 Le cours', '🧠 Le quiz', '✅ Terminer le bloc'],
      ligne: 'Chaque module suit le même chemin. Fais-le dans l\'ordre et tu gagnes de l\'XP à chaque étape.',
      etapes: [
        { cible: function () { return $('.module-header'); }, titre: '📌 LE MODULE', texte: 'Le titre, ce que tu vas apprendre et l\'<b>XP</b> que tu peux gagner.' },
        { cible: function () { var f = document.querySelector('.bloc iframe, .video-wrap, iframe'); return f ? (f.closest('.video-wrap') || f.parentNode) : null; }, titre: '🎥 LA VIDÉO', texte: 'Commence toujours par la <b>vidéo</b> : elle résume tout le bloc.' },
        { cible: function () { return $('.bloc-text'); }, titre: '📖 LE COURS', texte: 'Le cours écrit reprend les <b>points clés</b> avec des exemples et des schémas. Tu peux y revenir quand tu veux.' },
        { cible: function () { return $('.quiz-section'); }, titre: '🧠 LE QUIZ', texte: 'Réponds aux questions pour valider tes acquis : jusqu\'à <b>+50 XP</b>. Tu peux le <b>refaire</b> une fois pour réviser.' },
        { cible: function () { return $('.exercice-section'); }, saute: true, titre: '💪 L\'EXERCICE', texte: 'Mets en pratique sur ton graphique, puis envoie ta <b>preuve</b> sur WhatsApp : <b>+200 XP</b>.' },
        { cible: function () { return $('.question-box'); }, titre: '💬 UNE QUESTION ?', texte: 'Si quelque chose n\'est pas clair, écris ta question ici : elle arrive directement à Quincy.' },
        { cible: function () { return $('#complete-btn'); }, titre: '✅ TERMINER LE BLOC', texte: 'Quand tu as tout fait, appuie sur <b>Terminer le bloc</b> : le module est validé et le suivant se débloque.' }
      ],
      fin: { titre: '🔥 À TOI DE JOUER', texte: 'Lance la vidéo et c\'est parti. Chaque module validé te rapproche du <b>certificat DHA</b>.' }
    },
    'dha-squad.html': {
      couleur: ['#5865F2', '#25D366'], ic: '👥', k: 'TA TEAM', h: 'MON<br><span>SQUAD</span>',
      chips: ['🎮 Discord', '💬 WhatsApp', '📞 Les appels de groupe', '🤝 L\'entraide'],
      ligne: 'Ici tu rejoins le groupe. Personne n\'avance seul à la DHA.',
      etapes: [
        { cible: function () { return $('.squad-block.discord'); }, titre: '🎮 LE DISCORD', texte: 'C\'est là que se passent les <b>appels de groupe</b> et les <b>lives</b>. Rejoins-le avec le bouton.' },
        { cible: function () { return $('.squad-block.wa'); }, titre: '💬 LE GROUPE WHATSAPP', texte: 'Pour échanger au quotidien : tes <b>analyses</b>, tes questions, les <b>fichiers</b> et les annonces.' },
        { cible: function () { return $('.dha-features'); }, saute: true, titre: '🧭 SUR LA PLATEFORME', texte: 'Le reste (formation, quêtes, classement…) se passe ici, sur la plateforme.' }
      ],
      fin: { titre: '🤝 PRÉSENTE-TOI', texte: 'Rejoins le groupe et envoie un premier message : chaque message rapporte de l\'<b>XP</b>.' }
    },
    'dha-lives.html': {
      couleur: ['#9D4EDD', '#FF4466'], ic: '📺', k: 'EN DIRECT', h: 'LIVES &amp;<br><span>REPLAYS</span>',
      chips: ['📅 Le planning', '🗓️ Le programme du mois', '🎬 Les replays'],
      ligne: 'Les lives, c\'est là où tu poses tes questions en direct et où on trade ensemble.',
      pret: function () { return !!($('.lv-lock') || $('.lv-h')); },
      verrou: function () { return !!$('.lv-lock'); },
      etapes: [
        { cible: function () { return lv('CHAQUE SEMAINE'); }, titre: '📅 CHAQUE SEMAINE', texte: 'Les <b>jours et heures</b> des lives. Celui du jour est mis en avant.' },
        { cible: function () { return lv('PROGRAMME'); }, saute: true, titre: '🗓️ LE PROGRAMME DU MOIS', texte: 'Le <b>thème de chaque live</b> du mois, pour savoir ce qu\'on va voir.' },
        { cible: function () { return lv('REPLAYS'); }, titre: '🎬 LES REPLAYS', texte: 'Tu as raté un live ? Tous les <b>replays</b> sont ici, à revoir quand tu veux.' }
      ],
      fin: { titre: '📺 RENDEZ-VOUS EN LIVE', texte: 'Participer aux appels de groupe rapporte <b>+75 XP</b> à chaque fois.' }
    },
    'dha-affiliation.html': {
      couleur: ['#FFD700', '#00FF88'], ic: '💰', k: 'GAGNE AVEC LA DHA', h: '<span>RECOMMAN-</span><br>DATION',
      chips: ['🔗 Ton lien', '👥 Tes filleuls', '💳 Tes revenus'],
      ligne: 'Tu connais quelqu\'un que la DHA pourrait aider ? Recommande-le et touche une commission.',
      etapes: [
        { cible: function () { return carte('TON LIEN'); }, titre: '🔗 TON LIEN', texte: 'Ton lien personnel. <b>Copie-le</b> et envoie-le : chaque inscription passe par lui.' },
        { cible: function () { return carte('TES STATISTIQUES'); }, saute: true, titre: '📊 TES STATS', texte: 'Combien de personnes tu as recommandées et ce que ça t\'a rapporté.' },
        { cible: function () { return carte('COMMENT ÇA MARCHE'); }, saute: true, titre: '🤝 COMMENT ÇA MARCHE', texte: 'Les <b>étapes</b> et les <b>paliers</b> de la recommandation.' },
        { cible: function () { return carte('MES REVENUS'); }, saute: true, titre: '💳 TES REVENUS', texte: 'Tes commissions <b>en cours</b> et <b>versées</b>. Ajoute ton RIB pour être payé.' }
      ],
      fin: { titre: '🚀 PARTAGE TON LIEN', texte: 'Chaque ami qui rejoint la DHA grâce à toi = une commission et <b>+150 XP</b>.' }
    },
    'dha-mentor.html': {
      couleur: ['#00FF88', '#00D4FF'], ic: '📞', k: 'TON MENTOR', h: 'APPEL<br><span>MENTOR</span>',
      chips: ['📅 Tu choisis ton créneau', '🎯 Un appel 1:1 avec Quincy', '⚡ +300 XP'],
      ligne: 'Un appel individuel pour faire le point, débloquer une difficulté et avancer plus vite.',
      verrou: function () { var a = $('#mentor-lock'), b = $('#mentor-lock-groupe'); return visible(a) || visible(b); },
      etapes: [
        { cible: function () { return $('.info-grid'); }, saute: true, titre: '📋 LES INFOS', texte: 'La <b>durée</b>, le <b>format</b> et comment se passe l\'appel.' },
        { cible: function () { return $('.calendly-wrap') || $('#mentor-cal'); }, titre: '📅 RÉSERVE TON CRÉNEAU', texte: 'Choisis un jour et une heure qui t\'arrangent : tu reçois la confirmation directement.' }
      ],
      fin: { titre: '🎯 PRÉPARE TES QUESTIONS', texte: 'Arrive avec tes questions et tes analyses : chaque appel avec ton mentor rapporte <b>+300 XP</b>.' }
    },
    'dha-mindset.html': {
      couleur: ['#9D4EDD', '#00FF88'], ic: '🧠', k: 'TON MENTAL', h: 'LE<br><span>MINDSET</span>',
      chips: ['🌱 Prise de conscience', '🎬 Des vidéos qui rapportent de l\'XP', '📚 Une bibliothèque', '🧠 Badge Mindset aguerri'],
      ligne: 'La stratégie, tout le monde peut l\'apprendre. Ce qui fait la différence, c\'est ta tête : ta discipline, ta patience, ta façon de voir l\'argent. C\'est ici que ça se construit.',
      etapes: [
        { cible: function () { return $('.ms-tabs'); }, titre: '🗂️ DEUX PARTIES', texte: '<b>Développement personnel</b> : la Prise de conscience, à faire en premier. <b>Mindset trading</b> : la psychologie du trader, qui arrive bientôt.' },
        { cible: function () { return $('.pc-hero'); }, titre: '🌱 LA PRISE DE CONSCIENCE', texte: 'La partie <b>la plus importante</b> avant de trader. Elle t\'aide à casser tes vieilles croyances sur l\'argent et à comprendre <b>pourquoi</b> tu fais tout ça. Lis chaque étape <b>dans l\'ordre</b>.' },
        { cible: function () { return $('#pcProg'); }, titre: '📊 TA PROGRESSION', texte: 'Combien de vidéos tu as vues et l\'<b>XP</b> gagné. Finis la Partie 1 pour <b>+100 XP</b> de bonus.' },
        { cible: function () { return $('.pc-vid'); }, titre: '▶ CHAQUE VIDÉO = DE L\'XP', texte: 'Lance la vidéo, regarde-la, puis appuie sur <b>« J\'ai regardé »</b> : <b>+50 XP</b>. Une vidéo vue valide aussi ta <b>quête du jour</b>.' },
        { cible: function () { return $('.pc-feat'); }, saute: true, titre: '🎬 LE FILM « LE SECRET »', texte: 'La dernière vidéo de la Partie 1. Elle vaut le <b>triple</b> : <b>+150 XP</b>.' },
        { cible: function () { return $('#pcDone'); }, saute: true, titre: '🧠 MINDSET AGUERRI', texte: 'Partie 1 finie : badge <b>Mindset aguerri</b> sur ta carte joueur et un nouveau titre à débloquer.' },
        { cible: function () { return $('.pc-lib-h'); }, titre: '📚 LA BIBLIOTHÈQUE', texte: 'La Partie 2, à ton rythme : Bob Proctor, Napoléon Hill, Joe Dispenza… <b>+50 XP</b> par vidéo et les livres à avoir.' }
      ],
      fin: { titre: '🔥 COMMENCE PAR L\'ÉTAPE 1', texte: 'Ne la survole pas : prends ton temps, regarde les vidéos en entier et va <b>jusqu\'au bout de la Partie 1</b>. Un mental solide, c\'est ce qui te fera tenir quand le marché sera dur.' }
    }
  };
  var cleCfg = estModule ? 'module' : fichier;
  var P = PAGES[cleCfg]; if (!P) return;
  function cle() { return 'dha_tuto_page_' + VERSION + '_' + cleCfg + '_' + (membre().pseudo || 'invite'); }
  function dejaVu() { try { return localStorage.getItem(cle()) === '1'; } catch (e) { return true; } }
  function marquerVu() { try { localStorage.setItem(cle(), '1'); } catch (e) {} }

  var c1 = P.couleur[0], c2 = P.couleur[1];
  var css = '' +
    '.tp-cine{position:fixed;inset:0;z-index:10050;background:#02040a;display:flex;align-items:center;justify-content:safe center;flex-direction:column;overflow-x:hidden;overflow-y:auto;color:#F2F6FF;text-align:center;padding:30px 18px;font-family:Manrope,system-ui,sans-serif}' +
    '.tp-cine:before{content:"";position:fixed;inset:0;background-image:linear-gradient(rgba(30,100,255,0.09) 1px,transparent 1px),linear-gradient(90deg,rgba(30,100,255,0.09) 1px,transparent 1px);background-size:44px 44px;animation:tpGrid 4s linear infinite;pointer-events:none}' +
    '.tp-cine:after{content:"";position:fixed;inset:0;background:radial-gradient(ellipse at 50% 42%,' + c1 + '33,' + c2 + '14 40%,transparent 70%);animation:tpPulse 3s ease-in-out infinite;pointer-events:none}' +
    '.tp-sweep{position:fixed;top:0;bottom:0;width:30%;left:-40%;background:linear-gradient(90deg,transparent,' + c2 + '38,transparent);animation:tpSweep 2.2s .2s ease-in-out both;z-index:1;pointer-events:none}' +
    '.tp-orb{position:relative;z-index:2;width:132px;height:132px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:62px;background:radial-gradient(circle at 35% 30%,' + c2 + '55,' + c1 + '33 55%,rgba(5,9,20,0.9));border:2px solid ' + c2 + ';box-shadow:0 0 60px ' + c1 + '88,inset 0 0 30px ' + c2 + '55;animation:tpOrb 1.2s .2s cubic-bezier(.2,1.4,.4,1) both,tpFloat 3.5s 1.6s ease-in-out infinite}' +
    '.tp-ring{position:absolute;inset:-14px;border-radius:50%;border:2px dashed ' + c2 + '88;animation:tpSpin 9s linear infinite}' +
    '.tp-k{position:relative;z-index:2;margin-top:26px;font-family:Sora,sans-serif;font-weight:800;font-size:12px;letter-spacing:.45em;color:' + c2 + ';animation:tpFade .7s .9s both}' +
    '.tp-h{position:relative;z-index:2;font-family:Sora,sans-serif;font-weight:800;font-size:clamp(36px,10vw,66px);line-height:1.02;margin-top:10px;text-shadow:0 0 30px ' + c1 + '99;animation:tpLogo 1.2s 1.1s cubic-bezier(.2,.9,.3,1) both}' +
    '.tp-h span{background:linear-gradient(90deg,' + c1 + ',' + c2 + ');-webkit-background-clip:text;background-clip:text;color:transparent}' +
    '.tp-chips{position:relative;z-index:2;display:flex;flex-wrap:wrap;justify-content:center;gap:8px;max-width:480px;margin:22px auto 0}' +
    '.tp-chips span{padding:9px 14px;border-radius:999px;border:1px solid ' + c2 + '66;background:' + c1 + '22;font-size:13px;font-weight:700;animation:tpPop .5s cubic-bezier(.2,1.4,.4,1) both}' +
    '.tp-line{position:relative;z-index:2;margin:18px auto 0;font-size:15px;color:rgba(232,244,255,0.78);max-width:420px;line-height:1.55;animation:tpFade .8s 3s both}' +
    '.tp-go{position:relative;z-index:2;margin-top:24px;padding:16px 30px;border-radius:999px;border:none;cursor:pointer;background:linear-gradient(135deg,' + c1 + ',' + c2 + ');color:#020610;font-family:Sora,sans-serif;font-weight:800;font-size:14px;letter-spacing:1px;animation:tpFade .6s 3.4s both,tpGlow 2s 4s ease-in-out infinite}' +
    '.tp-skip{position:fixed;z-index:4;top:16px;right:16px;background:rgba(2,4,10,0.6);border:1px solid rgba(255,255,255,0.15);color:rgba(232,244,255,0.6);border-radius:99px;padding:7px 14px;font-size:12px;cursor:pointer}' +
    '.tp-cine.out{animation:tpOut .55s ease both}' +
    '@keyframes tpGrid{to{background-position:0 44px,0 0}}@keyframes tpPulse{0%,100%{opacity:.6}50%{opacity:1}}@keyframes tpSweep{to{left:110%}}' +
    '@keyframes tpFade{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}' +
    '@keyframes tpLogo{0%{opacity:0;transform:scale(2.2);filter:blur(16px)}60%{opacity:1;filter:blur(0)}100%{opacity:1;transform:scale(1)}}' +
    '@keyframes tpOrb{0%{opacity:0;transform:scale(0) rotate(-180deg)}100%{opacity:1;transform:none}}' +
    '@keyframes tpFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}@keyframes tpSpin{to{transform:rotate(360deg)}}' +
    '@keyframes tpPop{from{opacity:0;transform:scale(.4) translateY(10px)}to{opacity:1;transform:none}}' +
    '@keyframes tpGlow{0%,100%{box-shadow:0 0 26px ' + c2 + '55}50%{box-shadow:0 0 56px ' + c2 + 'bb}}' +
    '@keyframes tpOut{to{opacity:0;transform:scale(1.06);filter:blur(6px)}}' +
    '.tp-hole{position:fixed;z-index:10041;border-radius:18px;box-shadow:0 0 0 9999px rgba(2,4,10,0.84);border:2px solid ' + c2 + ';transition:all .45s cubic-bezier(.4,0,.2,1);pointer-events:none}.tp-hole.none{border-color:transparent}' +
    '.tp-veil{position:fixed;inset:0;z-index:10040}' +
    '.tp-box{position:fixed;z-index:10042;width:min(440px,calc(100vw - 24px));background:#080e1f;border:1px solid ' + c2 + '55;border-radius:20px;padding:22px 20px 18px;color:#F2F6FF;font-family:Manrope,system-ui,sans-serif;box-shadow:0 20px 60px rgba(0,0,0,0.6);animation:tpFade .35s both;text-align:left}' +
    '.tp-box:before{content:"";position:absolute;top:0;left:0;right:0;height:2px;border-radius:20px 20px 0 0;background:linear-gradient(90deg,' + c1 + ',' + c2 + ')}' +
    '.tp-st{font-family:Sora,sans-serif;font-size:10px;font-weight:700;letter-spacing:3px;color:' + c2 + ';margin-bottom:8px}' +
    '.tp-t{font-family:Sora,sans-serif;font-size:18px;font-weight:800;margin-bottom:10px;line-height:1.3}' +
    '.tp-p{font-size:15px;line-height:1.6;color:rgba(232,244,255,0.85)}.tp-p b{color:#FFD700}' +
    '.tp-list{list-style:none;padding:0;margin:12px 0 0;display:flex;flex-direction:column;gap:7px}' +
    '.tp-list li{display:flex;gap:10px;align-items:flex-start;font-size:14px;line-height:1.45;color:rgba(232,244,255,0.88);padding:8px 10px;border-radius:10px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06)}' +
    '.tp-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:18px}' +
    '.tp-ok{padding:13px 22px;border-radius:12px;border:none;cursor:pointer;background:linear-gradient(135deg,' + c1 + ',' + c2 + ');color:#020610;font-family:Sora,sans-serif;font-weight:800;font-size:13px}' +
    '.tp-back,.tp-quit{background:none;border:none;color:rgba(232,244,255,0.5);cursor:pointer;font-size:13px;padding:8px 4px}.tp-quit{display:block;margin:10px auto 0;text-decoration:underline;font-size:12px}' +
    '.tp-again{display:inline-flex;align-items:center;gap:6px;margin-top:6px;padding:2px 0;background:none;border:none;color:' + c2 + ';font-size:12px;font-weight:700;cursor:pointer;opacity:.85}' +
    '.tp-go:focus-visible,.tp-ok:focus-visible,.tp-skip:focus-visible,.tp-back:focus-visible,.tp-quit:focus-visible,.tp-again:focus-visible{outline:2px solid #FFD700;outline-offset:2px}' +
    '@media (prefers-reduced-motion:reduce){.tp-cine *,.tp-cine:before,.tp-cine:after,.tp-box,.tp-hole{animation:none!important;transition:none!important}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ---------- cinématique ---------- */
  function cinematique(suite) {
    var c = document.createElement('div');
    c.className = 'tp-cine th-keep'; c.setAttribute('role', 'dialog'); c.setAttribute('aria-modal', 'true'); c.setAttribute('aria-label', 'Présentation de la page');
    c.innerHTML = '<div class="tp-sweep"></div><button type="button" class="tp-skip">Passer</button>' +
      '<div class="tp-orb"><span class="tp-ring"></span>' + P.ic + '</div><div class="tp-k">' + P.k + '</div><div class="tp-h">' + P.h + '</div>' +
      '<div class="tp-chips">' + P.chips.map(function (t, i) { return '<span style="animation-delay:' + (1.9 + i * 0.2).toFixed(1) + 's">' + t + '</span>'; }).join('') + '</div>' +
      '<div class="tp-line">' + P.ligne + '</div><button type="button" class="tp-go">▶ DÉCOUVRIR</button>';
    document.body.appendChild(c);
    document.documentElement.style.overflow = 'hidden';
    function fin(lancer) { c.classList.add('out'); setTimeout(function () { c.remove(); document.documentElement.style.overflow = ''; if (lancer) suite(); else marquerVu(); }, 520); }
    c.querySelector('.tp-go').onclick = function () { fin(true); };
    c.querySelector('.tp-skip').onclick = function () { fin(false); };
    setTimeout(function () { var g = c.querySelector('.tp-go'); if (g) g.focus({ preventScroll: true }); }, 3600);
  }

  /* ---------- visite guidée ---------- */
  function visite() {
    var E = P.etapes.filter(function (e) { return !e.saute || visible(e.cible && e.cible()); }).concat([{ cible: null, fin: true, titre: P.fin.titre, texte: P.fin.texte }]);
    var i = 0;
    var veil = document.createElement('div'); veil.className = 'tp-veil';
    var hole = document.createElement('div'); hole.className = 'tp-hole none';
    var box = document.createElement('div'); box.className = 'tp-box th-keep'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true');
    document.body.appendChild(veil); document.body.appendChild(hole); document.body.appendChild(box);
    var pad0 = document.body.style.paddingBottom; document.body.style.paddingBottom = '60vh';
    function cible(e) { var t = e.cible ? e.cible() : null; return visible(t) ? t : null; }
    function placer() {
      var t = cible(E[i]), pad = 8;
      if (!t) { hole.className = 'tp-hole none'; hole.style.cssText = 'top:50%;left:50%;width:0;height:0;'; box.style.top = Math.max(12, (innerHeight - box.offsetHeight) / 2) + 'px'; box.style.left = Math.max(12, (innerWidth - box.offsetWidth) / 2) + 'px'; return; }
      var r = t.getBoundingClientRect(), h = Math.min(r.height + pad * 2, innerHeight * 0.5);
      hole.className = 'tp-hole'; hole.style.cssText = 'top:' + (r.top - pad) + 'px;left:' + (r.left - pad) + 'px;width:' + (r.width + pad * 2) + 'px;height:' + h + 'px;';
      var bh = box.offsetHeight, dessous = r.top - pad + h + 14, dessus = r.top - pad - 14 - bh, top;
      if (dessous + bh <= innerHeight - 12) top = dessous;
      else if (dessus >= 12) top = dessus;
      else {
        top = innerHeight - bh - 12;
        var hMax = top - 14 - (r.top - pad);   // le cadre s'arrête au-dessus de la bulle
        if (hMax > 50) hole.style.height = Math.min(h, hMax) + 'px';
      }
      var left = innerWidth > 900 ? Math.min(Math.max(12, r.left), innerWidth - box.offsetWidth - 12) : (innerWidth - box.offsetWidth) / 2;
      box.style.top = top + 'px'; box.style.left = Math.max(12, left) + 'px';
    }
    function afficher() {
      var e = E[i], t = cible(e);
      box.style.animation = 'none'; void box.offsetWidth; box.style.animation = '';
      box.setAttribute('aria-label', e.titre);
      box.innerHTML = '<div class="tp-st">ÉTAPE ' + (i + 1) + ' / ' + E.length + '</div><div class="tp-t">' + e.titre + '</div><div class="tp-p">' + e.texte + '</div>' +
        (e.liste ? '<ul class="tp-list">' + e.liste.map(function (l) { return '<li><span>' + l[0] + '</span><div>' + l[1] + '</div></li>'; }).join('') + '</ul>' : '') +
        '<div class="tp-foot">' + (i > 0 ? '<button type="button" class="tp-back">← Retour</button>' : '<span></span>') +
        '<button type="button" class="tp-ok">' + (e.fin ? '🚀 C\'EST PARTI' : 'OK ✓') + '</button></div>' +
        (e.fin ? '' : '<button type="button" class="tp-quit">Passer la présentation</button>');
      if (t) { var r = t.getBoundingClientRect(); window.scrollTo({ top: Math.max(0, scrollY + r.top - (innerWidth > 900 ? 100 : 80)), behavior: 'smooth' }); }
      placer(); setTimeout(placer, 420); setTimeout(placer, 850);
      var ok = box.querySelector('.tp-ok'); if (ok) ok.focus({ preventScroll: true });
    }
    function fermer() {
      window.removeEventListener('resize', placer); window.removeEventListener('scroll', placer); document.removeEventListener('keydown', clavier);
      [veil, hole, box].forEach(function (n) { n.remove(); }); document.body.style.paddingBottom = pad0; marquerVu();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    function clavier(e) { if (e.key === 'Escape') fermer(); else if (e.key === 'ArrowRight' && i < E.length - 1) { i++; afficher(); } else if (e.key === 'ArrowLeft' && i > 0) { i--; afficher(); } }
    box.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.classList.contains('tp-quit')) { fermer(); return; }
      if (b.classList.contains('tp-back')) { if (i > 0) { i--; afficher(); } return; }
      if (b.classList.contains('tp-ok')) { if (i < E.length - 1) { i++; afficher(); } else fermer(); }
    });
    window.addEventListener('resize', placer); window.addEventListener('scroll', placer); document.addEventListener('keydown', clavier);
    afficher();
  }
  function lancer() { cinematique(visite); }
  window.DHATutoPage = { lancer: lancer };

  function init() {
    // bouton « Revoir la présentation » sous le titre de la page
    var tt = $('.topbar-title') || $('.header-title') || $('.module-header');
    if (tt && !$('.tp-again')) {
      var a = document.createElement('button'); a.type = 'button'; a.className = 'tp-again'; a.textContent = '🎬 Revoir la présentation';
      a.onclick = function () { if (P.verrou && P.verrou()) return; lancer(); };
      var hote = tt.classList.contains('module-header') ? tt : tt.parentNode;
      hote.appendChild(a);
    }
    if (!membre().pseudo || dejaVu()) return;
    var n = 0;
    (function attendre() {
      if (document.querySelector('.tt-cine,.tt-card,.lu-ov,.dfo-ov.show')) { if (n++ < 60) return setTimeout(attendre, 500); return; }
      if (n++ < 6 || (P.pret && !P.pret() && n < 30)) return setTimeout(attendre, 300);
      if (P.verrou && P.verrou()) return;
      lancer();
    })();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
