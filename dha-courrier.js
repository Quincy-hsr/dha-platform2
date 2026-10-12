/* =========================================================
   DHA — Courrier XP (dashboard)
   À inclure en bas du dashboard : <script src="dha-courrier.js"></script>
   - Remplace le lien « Historique XP » par une lettre avec notification
   - Liste tous les XP gagnés, jour par jour, à quelle heure et pourquoi
   - Temps réel : vérifie toutes les 15 s s'il y a du nouveau
   ========================================================= */
(function () {
  var URL_ = window.SUPABASE_URL || (typeof SUPABASE_URL !== 'undefined' ? SUPABASE_URL : '');
  var KEY_ = window.SUPABASE_KEY || (typeof SUPABASE_KEY !== 'undefined' ? SUPABASE_KEY : '');
  var HDR = { apikey: KEY_, Authorization: 'Bearer ' + KEY_ };
  var POLL_MS = 15000;

  function moi() { try { return JSON.parse(localStorage.getItem('dha_member') || '{}'); } catch (e) { return {}; } }
  var pseudo = moi().pseudo || 'guest';
  var CLE_VU = 'dha_' + pseudo + '_courrier_vu';

  var entrees = [];          // du plus récent au plus ancien
  var dernierVu = null;      // date ISO du dernier courrier lu
  var modalOuvert = null;
  var nouveauxDansModal = new Set();

  /* ---------- styles ---------- */
  var css = '' +
  '.dc-btn{position:relative;display:inline-flex;align-items:center;gap:8px;padding:7px 12px 7px 10px;border-radius:99px;background:rgba(255,215,0,0.08);border:1px solid rgba(255,215,0,0.35);color:#FFD700;font-family:"Orbitron",sans-serif;font-size:8px;font-weight:900;letter-spacing:2px;cursor:pointer;text-decoration:none;transition:background .2s;}' +
  '.dc-btn:hover{background:rgba(255,215,0,0.16);}' +
  '.dc-btn:focus-visible{outline:2px solid #FFD700;outline-offset:2px;}' +
  '.dc-env{font-size:15px;line-height:1;display:inline-block;}' +
  '.dc-btn.has-new .dc-env{animation:dcShake 1.6s ease-in-out infinite;transform-origin:50% 80%;}' +
  '.dc-badge{display:none;position:absolute;top:-7px;right:-7px;min-width:18px;height:18px;padding:0 5px;border-radius:99px;background:#FF4466;color:#fff;font-family:"Exo 2",sans-serif;font-size:10px;font-weight:700;letter-spacing:0;align-items:center;justify-content:center;box-shadow:0 0 12px rgba(255,68,102,0.7);}' +
  '.dc-btn.has-new .dc-badge{display:inline-flex;}' +
  '@keyframes dcShake{0%,70%,100%{transform:rotate(0)}75%{transform:rotate(-14deg)}80%{transform:rotate(12deg)}85%{transform:rotate(-8deg)}90%{transform:rotate(5deg)}}' +
  '.dc-ov{position:fixed;inset:0;z-index:9999;background:rgba(5,9,20,0.9);backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:center;padding:16px;animation:dcFade .25s ease both;}' +
  '.dc-card{position:relative;background:#080e1f;border:1px solid rgba(255,215,0,0.22);border-radius:20px;width:100%;max-width:600px;max-height:88vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,0.5);animation:dcUp .35s cubic-bezier(.2,1.2,.4,1) both;font-family:"Exo 2",sans-serif;color:#E8F4FF;}' +
  '.dc-top{position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#1E64FF,#FFD700,#9D4EDD);}' +
  '.dc-head{padding:26px 26px 16px;border-bottom:1px solid rgba(30,100,255,0.15);}' +
  '.dc-title{display:flex;align-items:center;justify-content:space-between;gap:12px;}' +
  '.dc-title h3{margin:0;font-family:"Orbitron",sans-serif;font-size:15px;font-weight:900;letter-spacing:2px;}' +
  '.dc-live{display:inline-flex;align-items:center;gap:6px;font-family:"Orbitron",sans-serif;font-size:8px;letter-spacing:2px;color:#00FF88;}' +
  '.dc-live i{width:7px;height:7px;border-radius:50%;background:#00FF88;box-shadow:0 0 8px #00FF88;animation:dcPulse 1.6s ease-in-out infinite;}' +
  '.dc-sub{font-size:13px;color:rgba(232,244,255,0.5);margin:6px 0 14px;}' +
  '.dc-sum{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}' +
  '.dc-sum div{padding:10px 12px;border-radius:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(30,100,255,0.15);}' +
  '.dc-sum b{display:block;font-family:"Orbitron",sans-serif;font-size:16px;font-weight:900;color:#FFD700;font-variant-numeric:tabular-nums;}' +
  '.dc-sum span{font-family:"Orbitron",sans-serif;font-size:7px;letter-spacing:2px;color:rgba(232,244,255,0.4);}' +
  '.dc-list{overflow-y:auto;padding:6px 26px 10px;flex:1;}' +
  '.dc-day{display:flex;justify-content:space-between;align-items:baseline;margin:18px 0 8px;font-family:"Orbitron",sans-serif;font-size:9px;letter-spacing:3px;color:rgba(232,244,255,0.45);}' +
  '.dc-day b{color:#FFD700;font-size:10px;letter-spacing:1px;}' +
  '.dc-item{display:grid;grid-template-columns:44px minmax(0,1fr) auto;gap:12px;align-items:start;padding:12px 12px 12px 10px;border-radius:12px;border:1px solid transparent;border-left:3px solid transparent;margin-bottom:6px;background:rgba(255,255,255,0.02);}' +
  '.dc-item.new{background:rgba(0,212,255,0.06);border-color:rgba(0,212,255,0.25);border-left-color:#00D4FF;}' +
  '.dc-item.live{animation:dcIn .6s cubic-bezier(.2,1.4,.4,1) both;}' +
  '.dc-time{font-family:"Orbitron",sans-serif;font-size:10px;color:rgba(232,244,255,0.45);padding-top:3px;font-variant-numeric:tabular-nums;}' +
  '.dc-why{min-width:0;}' +
  '.dc-why .t{font-size:14px;font-weight:600;line-height:1.35;overflow-wrap:anywhere;}' +
  '.dc-why ul{margin:6px 0 0;padding:0;list-style:none;display:grid;gap:3px;}' +
  '.dc-why li{font-size:12px;color:rgba(232,244,255,0.65);overflow-wrap:anywhere;}' +
  '.dc-why q{display:block;margin-top:8px;padding:8px 10px;border-radius:8px;background:rgba(157,78,221,0.1);border:1px solid rgba(157,78,221,0.3);font-size:12px;font-style:italic;color:#E0CCFF;quotes:none;overflow-wrap:anywhere;}' +
  '.dc-why q::before{content:"💬 Quincy : ";font-style:normal;font-weight:700;}' +
  '.dc-tag{display:inline-block;margin-left:6px;padding:1px 6px;border-radius:99px;background:#00D4FF;color:#050914;font-family:"Orbitron",sans-serif;font-size:7px;font-weight:900;letter-spacing:1px;vertical-align:middle;}' +
  '.dc-xp{font-family:"Orbitron",sans-serif;font-size:14px;font-weight:900;color:#FFD700;white-space:nowrap;font-variant-numeric:tabular-nums;padding-top:1px;}' +
  '.dc-empty{text-align:center;padding:40px 10px;color:rgba(232,244,255,0.4);font-size:13px;line-height:1.6;}' +
  '.dc-foot{padding:14px 26px 20px;border-top:1px solid rgba(30,100,255,0.15);text-align:center;}' +
  '.dc-close{padding:11px 28px;border-radius:10px;background:rgba(255,215,0,0.1);border:1px solid rgba(255,215,0,0.3);color:#FFD700;font-family:"Orbitron",sans-serif;font-size:9px;font-weight:900;letter-spacing:2px;cursor:pointer;}' +
  '.dc-toast{position:fixed;top:18px;right:18px;z-index:9998;max-width:340px;display:flex;gap:12px;align-items:center;padding:14px 16px;border-radius:14px;background:#0a1128;border:1px solid rgba(255,215,0,0.45);box-shadow:0 12px 40px rgba(0,0,0,0.5),0 0 30px rgba(255,215,0,0.15);color:#E8F4FF;font-family:"Exo 2",sans-serif;cursor:pointer;animation:dcToast .5s cubic-bezier(.2,1.4,.4,1) both;}' +
  '.dc-toast .e{font-size:26px;}' +
  '.dc-toast b{display:block;font-family:"Orbitron",sans-serif;font-size:9px;letter-spacing:2px;color:#FFD700;margin-bottom:3px;}' +
  '.dc-toast span{font-size:13px;line-height:1.4;}' +
  '@keyframes dcFade{from{opacity:0}to{opacity:1}}' +
  '@keyframes dcUp{from{opacity:0;transform:translateY(20px) scale(.97)}to{opacity:1;transform:none}}' +
  '@keyframes dcIn{from{opacity:0;transform:translateY(-10px);background:rgba(255,215,0,0.25)}to{opacity:1;transform:none}}' +
  '@keyframes dcPulse{0%,100%{opacity:1}50%{opacity:.35}}' +
  '@keyframes dcToast{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:none}}' +
  '@media (max-width:520px){.dc-head{padding:22px 18px 14px}.dc-list{padding:4px 14px 10px}.dc-sum b{font-size:14px}.dc-item{grid-template-columns:38px minmax(0,1fr) auto;gap:8px}.dc-toast{left:12px;right:12px;max-width:none}}' +
  '@media (prefers-reduced-motion:reduce){.dc-btn.has-new .dc-env,.dc-live i{animation:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ---------- utilitaires ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function jourCle(d) { return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function libelleJour(d) {
    var auj = new Date(), hier = new Date(); hier.setDate(auj.getDate() - 1);
    if (jourCle(d) === jourCle(auj)) return "AUJOURD'HUI";
    if (jourCle(d) === jourCle(hier)) return 'HIER';
    return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase();
  }
  function heure(d) { return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }); }
  function estNouveau(e) { return !!dernierVu && new Date(e.created_at).getTime() > new Date(dernierVu).getTime(); }
  function sansXP(l) { return String(l).replace(/\s*\(\+\d+ XP\)\s*$/, ''); }
  function nbNonLus() { return entrees.filter(estNouveau).length; }

  // « 📞 Appel mentor (+75 XP) · 📞 Appel mentor (+75 XP) · 📝 note » → lignes regroupées + note de Quincy
  function decouper(raison) {
    var parts = String(raison || '').split(' · ').map(function (s) { return s.trim(); }).filter(Boolean);
    var note = null, lignes = [], compte = {};
    parts.forEach(function (p) {
      if (p.indexOf('📝 ') === 0) { note = p.slice(p.indexOf(' ') + 1).trim(); return; }
      if (compte[p]) compte[p]++; else { compte[p] = 1; lignes.push(p); }
    });
    lignes = lignes.map(function (l) {
      if (compte[l] < 2) return l;
      var m = l.match(/^(.*)\(\+(\d+) XP\)$/);
      return m ? m[1].trim() + ' ×' + compte[l] + ' (+' + (m[2] * compte[l]) + ' XP)' : l + ' ×' + compte[l];
    });
    return { lignes: lignes, note: note };
  }

  /* ---------- bouton lettre ---------- */
  var btn = document.createElement('a');
  btn.href = '#'; btn.className = 'dc-btn'; btn.id = 'dc-btn';
  btn.setAttribute('aria-label', 'Ouvrir mon courrier XP');
  btn.innerHTML = '<span class="dc-env">✉️</span>COURRIER XP<span class="dc-badge" id="dc-badge">0</span>';
  btn.addEventListener('click', function (e) { e.preventDefault(); ouvrir(); });
  var ancien = document.querySelector('a[onclick*="showHistoriqueXP"]');
  if (ancien) ancien.parentNode.replaceChild(btn, ancien);
  window.showHistoriqueXP = function () { ouvrir(); };

  function majBadge() {
    var n = nbNonLus();
    var b = document.getElementById('dc-badge');
    if (b) b.textContent = n > 9 ? '9+' : String(n);
    btn.classList.toggle('has-new', n > 0);
    btn.setAttribute('aria-label', n ? 'Ouvrir mon courrier XP (' + n + ' nouveau' + (n > 1 ? 'x' : '') + ')' : 'Ouvrir mon courrier XP');
  }

  /* ---------- fenêtre courrier ---------- */
  function itemHTML(e, live) {
    var d = new Date(e.created_at), p = decouper(e.raison);
    var titre = p.lignes.length === 1 ? sansXP(p.lignes[0]) : (p.lignes.length ? 'Plusieurs actions validées' : (p.note ? 'Message de Quincy' : 'XP gagnés'));
    var nouveau = estNouveau(e) || nouveauxDansModal.has(e.id || e.created_at);
    return '<div class="dc-item' + (nouveau ? ' new' : '') + (live ? ' live' : '') + '">' +
      '<div class="dc-time">' + heure(d) + '</div>' +
      '<div class="dc-why"><div class="t">' + esc(titre) + (nouveau ? '<span class="dc-tag">NOUVEAU</span>' : '') + '</div>' +
      (p.lignes.length > 1 ? '<ul>' + p.lignes.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') + '</ul>' : '') +
      (p.note ? '<q>' + esc(p.note) + '</q>' : '') +
      '</div><div class="dc-xp">+' + (e.xp_gagne || 0) + ' XP</div></div>';
  }

  function listeHTML(liveIds) {
    if (!entrees.length) return '<div class="dc-empty">📭 Ton courrier est vide pour l\'instant.<br/>Termine un module, valide un quiz ou participe à un appel : chaque XP gagné arrive ici avec la raison.</div>';
    var h = '', jourCourant = null;
    var totaux = {};
    entrees.forEach(function (e) { var k = jourCle(new Date(e.created_at)); totaux[k] = (totaux[k] || 0) + (e.xp_gagne || 0); });
    entrees.forEach(function (e) {
      var d = new Date(e.created_at), k = jourCle(d);
      if (k !== jourCourant) { jourCourant = k; h += '<div class="dc-day"><span>' + libelleJour(d) + '</span><b>+' + totaux[k] + ' XP</b></div>'; }
      h += itemHTML(e, liveIds && liveIds.has(e.id || e.created_at));
    });
    return h;
  }

  function resumeHTML() {
    var auj = jourCle(new Date()), sept = Date.now() - 7 * 864e5, tAuj = 0, t7 = 0;
    entrees.forEach(function (e) {
      var d = new Date(e.created_at);
      if (jourCle(d) === auj) tAuj += e.xp_gagne || 0;
      if (d.getTime() >= sept) t7 += e.xp_gagne || 0;
    });
    var m = moi();
    return '<div><b>+' + tAuj + '</b><span>AUJOURD\'HUI</span></div><div><b>+' + t7 + '</b><span>7 DERNIERS JOURS</span></div><div><b>' + (m.xp || 0).toLocaleString('fr-FR') + '</b><span>XP TOTAL</span></div>';
  }

  function ouvrir() {
    if (modalOuvert) return;
    nouveauxDansModal = new Set(entrees.filter(estNouveau).map(function (e) { return e.id || e.created_at; }));
    var ov = document.createElement('div');
    ov.className = 'dc-ov';
    ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Courrier XP');
    ov.innerHTML = '<div class="dc-card"><div class="dc-top"></div>' +
      '<div class="dc-head"><div class="dc-title"><h3>📬 COURRIER XP</h3><span class="dc-live"><i></i>EN DIRECT</span></div>' +
      '<div class="dc-sub">Tous tes XP gagnés, jour par jour : combien, à quelle heure, et pourquoi.</div>' +
      '<div class="dc-sum" id="dc-sum">' + resumeHTML() + '</div></div>' +
      '<div class="dc-list" id="dc-list">' + listeHTML() + '</div>' +
      '<div class="dc-foot"><button class="dc-close" type="button">FERMER</button></div></div>';
    function fermer() { ov.remove(); modalOuvert = null; document.removeEventListener('keydown', onKey); majBadge(); }
    function onKey(e) { if (e.key === 'Escape') fermer(); }
    ov.addEventListener('click', function (e) { if (e.target === ov || e.target.closest('.dc-close')) fermer(); });
    document.addEventListener('keydown', onKey);
    document.body.appendChild(ov);
    modalOuvert = ov;
    ov.querySelector('.dc-close').focus({ preventScroll: true });
    marquerLu();
  }

  function marquerLu() {
    if (entrees.length) dernierVu = entrees[0].created_at;
    try { localStorage.setItem(CLE_VU, dernierVu || new Date().toISOString()); } catch (e) {}
    majBadge();
  }

  function toast(nouvelles) {
    var tot = nouvelles.reduce(function (s, e) { return s + (e.xp_gagne || 0); }, 0);
    var p = decouper(nouvelles[0].raison);
    var why = nouvelles.length > 1 ? nouvelles.length + ' nouveaux gains' : (sansXP(p.lignes[0] || '') || (p.note ? 'Message de Quincy' : 'XP gagnés'));
    var old = document.querySelector('.dc-toast'); if (old) old.remove();
    var t = document.createElement('div');
    t.className = 'dc-toast'; t.setAttribute('role', 'status');
    t.innerHTML = '<div class="e">📬</div><div><b>NOUVEAU COURRIER · +' + tot + ' XP</b><span>' + esc(why) + '</span></div>';
    t.addEventListener('click', function () { t.remove(); ouvrir(); });
    document.body.appendChild(t);
    setTimeout(function () { if (t.parentNode) t.remove(); }, 7000);
  }

  /* ---------- données ---------- */
  async function charger(depuis) {
    var url = URL_ + '/rest/v1/xp_historique?membre_pseudo=eq.' + encodeURIComponent(pseudo) +
      (depuis ? '&created_at=gt.' + encodeURIComponent(depuis) : '') + '&order=created_at.desc&limit=100';
    var r = await fetch(url, { headers: HDR });
    if (!r.ok) throw new Error('courrier ' + r.status);
    var d = await r.json();
    return Array.isArray(d) ? d : [];
  }

  // Met à jour l'XP affiché (barre, niveau, cinématique de level up) quand un gain arrive de l'extérieur
  async function rafraichirXP() {
    try {
      var m = moi(); if (!m.email) return;
      var r = await fetch(URL_ + '/rest/v1/membres?email=eq.' + encodeURIComponent(m.email) + '&select=xp', { headers: HDR });
      var d = await r.json();
      if (!Array.isArray(d) || !d[0] || d[0].xp == null) return;
      if (typeof member !== 'undefined' && member && member.xp !== d[0].xp) {
        member.xp = d[0].xp;
        if (typeof getLevelFromXP === 'function') member.level = getLevelFromXP(member.xp);
        try { localStorage.setItem('dha_member', JSON.stringify(member)); } catch (e) {}
        if (typeof renderMember === 'function') renderMember();
      }
    } catch (e) {}
  }

  async function verifierNouveaux() {
    if (document.visibilityState !== 'visible') return;
    try {
      var depuis = entrees.length ? entrees[0].created_at : null;
      var nouvelles = await charger(depuis);
      if (!nouvelles.length) return;
      var ids = new Set(entrees.map(function (e) { return e.id || e.created_at; }));
      nouvelles = nouvelles.filter(function (e) { return !ids.has(e.id || e.created_at); });
      if (!nouvelles.length) return;
      entrees = nouvelles.concat(entrees);
      toast(nouvelles);
      rafraichirXP();
      if (modalOuvert) {
        var live = new Set(nouvelles.map(function (e) { return e.id || e.created_at; }));
        live.forEach(function (k) { nouveauxDansModal.add(k); });
        modalOuvert.querySelector('#dc-list').innerHTML = listeHTML(live);
        modalOuvert.querySelector('#dc-sum').innerHTML = resumeHTML();
        marquerLu();
      } else majBadge();
    } catch (e) {}
  }

  (async function init() {
    try { dernierVu = localStorage.getItem(CLE_VU); } catch (e) {}
    try { entrees = await charger(null); } catch (e) { entrees = []; }
    if (!dernierVu) {
      // Première fois : les gains des dernières 24 h comptent comme nouveaux
      dernierVu = new Date(Date.now() - 864e5).toISOString();
      try { localStorage.setItem(CLE_VU, dernierVu); } catch (e) {}
    }
    majBadge();
    setInterval(verifierNouveaux, POLL_MS);
    document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') verifierNouveaux(); });
  })();
})();
