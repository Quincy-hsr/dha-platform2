/* =========================================================
   DHA — Quêtes du jour (dashboard)
   - 4 quêtes tirées au hasard chaque jour (les mêmes sur tous les appareils)
   - +25 XP par quête accomplie, +100 XP bonus si les 4 sont faites
   - Minuteur jusqu'aux prochaines quêtes (minuit, heure locale)
   - Cinématique verte quand toutes les quêtes sont terminées
   - Connexion quotidienne (+10 XP) et parrainage (+150 XP) crédités automatiquement
   Les actions « validées par ton mentor » sont ajoutées par Quincy depuis le Cerveau :
   l'XP est enregistrée avec une clé man-<actions>-<horodatage>, ce qui coche la quête.
   ========================================================= */
(function () {
  var XP_QUETE = 25, XP_BONUS = 100, XP_CONNEXION = 10, XP_PARRAIN = 150;
  var NB_QUETES = 4, NB_MODULES = 16;
  var MODULES = ['bloc_m1','bloc_m2_b1','bloc_m4','bloc_m5','bloc_m6','bloc_m7_b1','bloc_m8_b1','bloc_m10_b1','bloc_m11_b1','bloc_m12_b1','bloc_m13_b1','bloc_m14_b1','bloc_m15_b1','bloc_m16','bloc_m17','bloc_m18'];

  // Actions qu'on peut faire tous les jours (les autres — séminaire, sortie, appel mentor, parrainage — n'entrent pas dans les quêtes)
  var POOL = [
    { k: 'co', i: '🔌', n: 'Connecte-toi à la plateforme', x: XP_CONNEXION, auto: true },
    { k: 'mo', i: '📚', n: 'Termine un module', x: 40, auto: true },
    { k: 'gr', i: '✍️', n: 'Envoie un message ou une image dans le groupe', x: 10 },
    { k: 'an', i: '📈', n: 'Envoie une analyse trading', x: 100 },
    { k: 'ex', i: '🎯', n: "Envoie une preuve d'exercice (au mentor ou dans le groupe)", x: 200 },
    { k: 'ga', i: '💰', n: 'Partage un gain en trading', x: 60 },
    { k: 'pc', i: '🧠', n: 'Regarde une vidéo du fichier Prise de conscience', x: 50 },
    { k: 'ag', i: '📞', n: "Participe à l'appel de groupe", x: 75, jours: [2, 4] } // mardi et jeudi
  ];

  function M() { return (typeof member !== 'undefined' && member) ? member : null; }

  function jourLocal(d) { d = d || new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function minuitLocal() { var d = new Date(); d.setHours(0, 0, 0, 0); return d; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // Tirage déterministe : même pseudo + même jour = mêmes quêtes
  function graine(str) { var h = 1779033703 ^ str.length; for (var i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; } return h >>> 0; }
  function alea(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function tirer(pseudo, jour, formationFinie) {
    var dow = new Date().getDay();
    var dispo = POOL.filter(function (q) {
      if (q.jours && q.jours.indexOf(dow) < 0) return false;
      if (q.k === 'mo' && formationFinie) return false;
      return true;
    });
    var r = alea(graine(pseudo + '|' + jour));
    for (var i = dispo.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = dispo[i]; dispo[i] = dispo[j]; dispo[j] = t; }
    return dispo.slice(0, NB_QUETES);
  }

  var etat = { jour: null, quetes: [], faites: {}, cles: new Set(), bonus: false, enCours: false };

  /* ---------- styles ---------- */
  var css = '' +
    '.dq-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px;flex-wrap:wrap}' +
    '.dq-timer{display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:12px;background:rgba(0,212,255,0.06);border:1px solid rgba(0,212,255,0.18);margin-bottom:8px}' +
    '.dq-timer span{font-size:12px;color:rgba(232,244,255,0.55)}' +
    '.dq-timer b{font-family:Orbitron,sans-serif;font-size:13px;color:#00D4FF;font-variant-numeric:tabular-nums;letter-spacing:1px;margin-left:auto}' +
    '.dq-prog{display:flex;align-items:center;gap:10px;margin:6px 0 4px}' +
    '.dq-bar{flex:1;height:6px;border-radius:99px;background:rgba(255,255,255,0.06);overflow:hidden}' +
    '.dq-bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#00C46A,#00FF88);border-radius:99px;transition:width .6s}' +
    '.dq-count{font-family:Orbitron,sans-serif;font-size:11px;font-weight:900;color:#00FF88}' +
    '.dq-sub{font-size:10px;color:rgba(232,244,255,0.4);margin-top:2px}' +
    '.dq-bonus{margin-top:14px;padding:12px;border-radius:12px;text-align:center;background:rgba(255,215,0,0.06);border:1px solid rgba(255,215,0,0.15)}' +
    '.dq-bonus.ok{background:rgba(0,255,136,0.08);border-color:rgba(0,255,136,0.35)}' +
    '.dq-bonus small{display:block;font-family:Orbitron,sans-serif;font-size:8px;letter-spacing:2px;color:rgba(255,215,0,0.55);margin-bottom:4px}' +
    '.dq-bonus.ok small{color:rgba(0,255,136,0.7)}' +
    '.dq-bonus b{font-family:Orbitron,sans-serif;font-size:18px;font-weight:900;color:#FFD700}' +
    '.dq-bonus.ok b{color:#00FF88}' +
    /* cinématique verte */
    '.dq-cine{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 50%,rgba(0,80,44,0.97),rgba(2,12,8,0.99) 65%);animation:dqFade .4s ease both;cursor:pointer;overflow:hidden}' +
    '.dq-cine .ring{position:absolute;z-index:0;opacity:.6;left:50%;top:50%;width:120px;height:120px;margin:-60px 0 0 -60px;border-radius:50%;border:3px solid #00FF88;box-shadow:0 0 40px #00FF88;animation:dqRing 1.6s ease-out infinite}' +
    '.dq-cine .ring.r2{animation-delay:.5s}.dq-cine .ring.r3{animation-delay:1s}' +
    '.dq-cine .box{position:relative;z-index:2;text-align:center;padding:0 20px;animation:dqPop .7s cubic-bezier(.2,1.6,.4,1) both .15s}' +
    '.dq-cine .chk{width:110px;height:110px;margin:0 auto 22px;border-radius:50%;background:linear-gradient(135deg,#00C46A,#00FF88);display:flex;align-items:center;justify-content:center;font-size:58px;color:#03140b;box-shadow:0 0 60px rgba(0,255,136,0.8)}' +
    '.dq-cine h2{font-family:Orbitron,sans-serif;font-size:clamp(20px,5vw,32px);font-weight:900;letter-spacing:3px;color:#E8FFF2;margin:0 0 10px;text-shadow:0 0 30px rgba(0,255,136,0.8)}' +
    '.dq-cine p{font-size:15px;color:rgba(232,255,242,0.7);margin:0 0 18px}' +
    '.dq-cine .xp{font-family:Orbitron,sans-serif;font-size:clamp(34px,9vw,56px);font-weight:900;color:#00FF88;text-shadow:0 0 40px rgba(0,255,136,0.9)}' +
    '.dq-cine .tap{margin-top:26px;font-family:Orbitron,sans-serif;font-size:9px;letter-spacing:3px;color:rgba(232,255,242,0.45)}' +
    '.dq-cine .pt{position:absolute;width:8px;height:8px;border-radius:2px;background:#00FF88;top:50%;left:50%;animation:dqBurst 1.4s cubic-bezier(.1,.8,.3,1) both}' +
    '@keyframes dqFade{from{opacity:0}to{opacity:1}}' +
    '@keyframes dqRing{0%{transform:scale(.4);opacity:1}100%{transform:scale(6);opacity:0}}' +
    '@keyframes dqPop{0%{transform:scale(.3);opacity:0}100%{transform:scale(1);opacity:1}}' +
    '@keyframes dqBurst{0%{transform:translate(0,0) rotate(0);opacity:1}100%{transform:translate(var(--dx),var(--dy)) rotate(540deg);opacity:0}}' +
    '@media (prefers-reduced-motion:reduce){.dq-cine *{animation:none!important}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ---------- données ---------- */
  async function lireJour() {
    var d = await DHA.historique({ since: minuitLocal().toISOString(), limit: 500 });
    var s = new Set(); (d || []).forEach(function (x) { if (x.action_key) s.add(x.action_key); });
    return s;
  }
  async function formationFinie() {
    try {
      var d = await DHA.historique({ keys: MODULES });
      return new Set((d || []).map(function (x) { return x.action_key; })).size >= NB_MODULES;
    } catch (e) { return false; }
  }

  // Le serveur vérifie l'action, enregistre l'XP et l'historique ; on anime la barre du dashboard
  async function crediter(xp, raison, cle) {
    if (!M() || etat.cles.has(cle)) return false;
    etat.cles.add(cle);
    try {
      var r = await DHA.award(cle, xp, raison);
      if (r && r.ok) {
        member.xp = r.xp - r.gagne;
        if (typeof updateXP === 'function') updateXP(r.gagne); else member.xp = r.xp;
        return true;
      }
      if (r && r.deja) return true;
      etat.cles.delete(cle); return false;
    } catch (e) { etat.cles.delete(cle); console.error('Quêtes : XP non enregistrée', e); return false; }
  }

  function estFaite(q, cles) {
    if (q.k === 'co') return cles.has('connexion_' + etat.jour);
    if (q.k === 'mo') { var ok = false; cles.forEach(function (c) { if (/^bloc_m\d+/.test(c)) ok = true; }); return ok; }
    var f = false;
    cles.forEach(function (c) { if (c.indexOf('man-') === 0 && c.split('-').indexOf(q.k) > 0) f = true; });
    return f;
  }

  /* ---------- rendu ---------- */
  function rendre() {
    var box = document.getElementById('dq-list'); if (!box) return;
    var n = 0;
    box.innerHTML = etat.quetes.map(function (q) {
      var ok = !!etat.faites[q.k]; if (ok) n++;
      return '<div class="quete-item' + (ok ? ' done' : '') + '">' +
        '<div class="quete-check' + (ok ? ' done' : '') + '">' + (ok ? '✓' : q.i) + '</div>' +
        '<div class="quete-info"><div class="quete-name">' + esc(q.n) + '</div>' +
        '<div class="quete-xp">+' + q.x + ' XP · +' + XP_QUETE + ' XP de quête</div>' +
        (q.auto ? '' : '<div class="dq-sub">Validé par ton mentor</div>') + '</div></div>';
    }).join('');
    var pct = etat.quetes.length ? Math.round(n / etat.quetes.length * 100) : 0;
    var bar = document.getElementById('dq-bar'); if (bar) bar.style.width = pct + '%';
    var cnt = document.getElementById('dq-count'); if (cnt) cnt.textContent = n + ' / ' + etat.quetes.length;
    var bonus = document.getElementById('dq-bonus');
    if (bonus) {
      var tot = etat.quetes.reduce(function (s, q) { return s + q.x + XP_QUETE; }, 0) + XP_BONUS;
      bonus.className = 'dq-bonus' + (etat.bonus ? ' ok' : '');
      bonus.innerHTML = etat.bonus
        ? '<small>TOUTES LES QUÊTES SONT FAITES ✅</small><b>+' + XP_BONUS + ' XP BONUS GAGNÉS</b>'
        : '<small>TERMINE LES ' + etat.quetes.length + ' QUÊTES : +' + XP_BONUS + ' XP BONUS</small><b>' + tot + ' XP À GAGNER AUJOURD\'HUI</b>';
    }
  }

  function minuteur() {
    var el = document.getElementById('dq-time'); if (!el) return;
    var fin = minuitLocal(); fin.setDate(fin.getDate() + 1);
    var s = Math.max(0, Math.floor((fin - new Date()) / 1000));
    el.textContent = String(Math.floor(s / 3600)).padStart(2, '0') + ':' + String(Math.floor(s % 3600 / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
    if (etat.jour && jourLocal() !== etat.jour) { etat = { jour: null, quetes: [], faites: {}, cles: new Set(), bonus: false, enCours: false }; verifier(); }
  }

  // Attend que la cinématique de level up soit fermée, puis lance la verte
  function cinematique() {
    if (document.querySelector('.lu-ov')) { setTimeout(cinematique, 600); return; }
    cinematiqueVerte();
  }
  function cinematiqueVerte() {
    var ov = document.createElement('div'); ov.className = 'dq-cine'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-label', 'Quêtes du jour terminées');
    var pts = ''; var cols = ['#00FF88', '#00C46A', '#B6FFD8', '#FFD700'];
    for (var i = 0; i < 36; i++) { var a = Math.random() * Math.PI * 2, d = 140 + Math.random() * 260; pts += '<i class="pt" style="--dx:' + Math.round(Math.cos(a) * d) + 'px;--dy:' + Math.round(Math.sin(a) * d) + 'px;background:' + cols[i % 4] + ';animation-delay:' + (0.2 + Math.random() * 0.3).toFixed(2) + 's"></i>'; }
    ov.innerHTML = '<div class="ring"></div><div class="ring r2"></div><div class="ring r3"></div>' + pts +
      '<div class="box"><div class="chk">✓</div><h2>QUÊTES DU JOUR TERMINÉES</h2><p>Les ' + etat.quetes.length + ' quêtes sont validées, bien joué ' + esc(member.prenom || member.pseudo || '') + ' 🔥</p>' +
      '<div class="xp">+' + XP_BONUS + ' XP</div><div class="tap">TOUCHE POUR CONTINUER</div></div>';
    document.body.appendChild(ov);
    var fermer = function () { ov.style.transition = 'opacity .3s'; ov.style.opacity = '0'; setTimeout(function () { ov.remove(); }, 300); };
    ov.addEventListener('click', fermer); setTimeout(fermer, 7000);
  }

  /* ---------- logique ---------- */
  async function verifier() {
    if (!M() || etat.enCours) return;
    etat.enCours = true;
    try {
      var pseudo = member.pseudo || 'guest';
      var jour = jourLocal();
      if (etat.jour !== jour) {
        etat.jour = jour;
        etat.quetes = tirer(pseudo, jour, await formationFinie());
      }
      var cles = await lireJour();
      cles.forEach(function (c) { etat.cles.add(c); });

      // Connexion quotidienne (+10 XP), à chaque nouveau jour
      if (!cles.has('connexion_' + jour)) { if (await crediter(XP_CONNEXION, '🔌 Connexion quotidienne', 'connexion_' + jour)) cles.add('connexion_' + jour); }

      // Quêtes accomplies → +25 XP chacune
      for (var i = 0; i < etat.quetes.length; i++) {
        var q = etat.quetes[i];
        etat.faites[q.k] = estFaite(q, cles);
        var cq = 'quete_' + q.k + '_' + jour;
        if (etat.faites[q.k] && !cles.has(cq)) { if (await crediter(XP_QUETE, '✅ Quête du jour : ' + q.n, cq)) cles.add(cq); }
      }
      // Les 4 quêtes faites → bonus +100 XP + cinématique verte
      var toutes = etat.quetes.length && etat.quetes.every(function (q) { return etat.faites[q.k]; });
      var cb = 'quetes_toutes_' + jour;
      etat.bonus = cles.has(cb);
      rendre();
      if (toutes && !etat.bonus) {
        if (await crediter(XP_BONUS, '🏆 Toutes les quêtes du jour terminées', cb)) { etat.bonus = true; rendre(); cinematique(); }
      }
      rendre();
      parrainage();
    } catch (e) { console.error('Quêtes du jour :', e); }
    etat.enCours = false;
  }

  // +150 XP pour chaque ami parrainé (hors comptes démo) — calculé par le serveur
  var parrainVu = false;
  async function parrainage() {
    if (parrainVu || !M()) return; parrainVu = true;
    try {
      var n = await DHA.rpc('dha_parrainages', { p_token: await DHA.token() });
      if (n > 0) { var d = await DHA.me(); if (d && typeof updateXP === 'function') { var gain = d.xp - (member.xp || 0); if (gain > 0) updateXP(gain); } }
    } catch (e) { }
  }

  window.DHAQuetes = { verifier: verifier, demoCinematique: function () { etat.quetes = etat.quetes.length ? etat.quetes : POOL.slice(0, 4); cinematique(); } };

  function demarrer() {
    if (!document.getElementById('dq-list')) return;
    minuteur(); setInterval(minuteur, 1000);
    verifier();
    // Re-vérifie toutes les 60 s (si Quincy valide une action pendant que le membre est sur la page)
    setInterval(function () { if (document.visibilityState === 'visible') verifier(); }, 60000);
    document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') verifier(); });
  }
  window.DHAQuetes.demarrer = demarrer;
})();
