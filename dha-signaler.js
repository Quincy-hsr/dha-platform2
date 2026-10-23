/* =========================================================
   DHA — Signaler un bug / une erreur / proposer une idée
   Inclus sur toutes les pages membres (après dha-api.js).
   - Bouton flottant 🛠️ + entrée dans le menu de gauche
   - Envoi : RPC dha_signaler (stocké dans Supabase, visible dans le Cerveau)
   - Notification email à Quincy via Formspree
   ========================================================= */
(function () {
  if (window.__dhaSignaler) return; window.__dhaSignaler = true;
  var FORMSPREE = 'https://formspree.io/f/mjgjrojb';
  var TYPES = [
    { k: 'bug', ico: '🐞', label: 'Bug', aide: 'Quelque chose ne marche pas (bouton, page, XP, quiz…)' },
    { k: 'erreur', ico: '⚠️', label: 'Erreur dans un cours', aide: 'Une faute, une info fausse ou pas claire dans un module' },
    { k: 'idee', ico: '💡', label: 'Idée', aide: 'Une amélioration que tu aimerais voir sur la plateforme' }
  ];
  var STATUTS = { nouveau: ['Reçu', '#8fa3bf'], en_cours: ['En cours', '#FFD700'], regle: ['Réglé ✓', '#00FF88'], refuse: ['Pas retenu', '#FF4466'] };

  var css = '' +
    '.dsg-fab{position:fixed;right:18px;bottom:18px;z-index:8000;width:50px;height:50px;border-radius:50%;border:1px solid rgba(0,212,255,0.45);background:rgba(8,14,31,0.95);color:#E8F4FF;font-size:22px;cursor:pointer;box-shadow:0 6px 24px rgba(0,0,0,0.5),0 0 18px rgba(0,212,255,0.18);display:flex;align-items:center;justify-content:center;transition:transform .15s,border-color .15s;}' +
    '.dsg-fab:hover{transform:scale(1.07);border-color:#00D4FF;}' +
    '.dsg-fab:focus-visible,.dsg-box button:focus-visible,.dsg-box textarea:focus-visible{outline:2px solid #00D4FF;outline-offset:2px;}' +
    'body.dsg-demo .dsg-fab{bottom:78px;}' +
    '.dsg-ov{position:fixed;inset:0;z-index:9500;background:rgba(0,0,0,0.7);display:none;align-items:center;justify-content:center;padding:16px;}' +
    '.dsg-ov.show{display:flex;}' +
    '.dsg-box{width:100%;max-width:480px;max-height:92vh;overflow-y:auto;background:#080e1f;border:1px solid rgba(0,212,255,0.3);border-radius:18px;padding:22px 20px;color:#E8F4FF;font-family:"Exo 2","Rajdhani",sans-serif;box-shadow:0 20px 60px rgba(0,0,0,0.6);}' +
    '.dsg-h{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:4px;}' +
    '.dsg-h b{font-family:Orbitron,"Chakra Petch",sans-serif;font-size:15px;letter-spacing:1px;}' +
    '.dsg-x{background:none;border:none;color:#8fa3bf;font-size:24px;cursor:pointer;line-height:1;padding:4px 8px;}' +
    '.dsg-sub{font-size:14px;color:#8fa3bf;margin:0 0 16px;}' +
    '.dsg-types{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:8px;}' +
    '.dsg-t{background:rgba(255,255,255,0.03);border:1px solid rgba(30,100,255,0.25);border-radius:12px;padding:10px 6px;color:#E8F4FF;cursor:pointer;font-family:inherit;font-size:13px;font-weight:600;display:flex;flex-direction:column;align-items:center;gap:4px;}' +
    '.dsg-t span{font-size:20px;}' +
    '.dsg-t.on{border-color:#00D4FF;background:rgba(0,212,255,0.1);}' +
    '.dsg-aide{font-size:13px;color:#8fa3bf;min-height:18px;margin-bottom:10px;}' +
    '.dsg-box textarea{width:100%;box-sizing:border-box;min-height:120px;resize:vertical;background:#050914;border:1px solid rgba(30,100,255,0.3);border-radius:12px;color:#E8F4FF;padding:12px;font-family:inherit;font-size:15px;}' +
    '.dsg-page{font-size:12px;color:#5f7391;margin:6px 0 14px;}' +
    '.dsg-send{width:100%;padding:14px;border:none;border-radius:12px;background:linear-gradient(135deg,#1E64FF,#00D4FF);color:#020610;font-family:Orbitron,"Chakra Petch",sans-serif;font-weight:700;font-size:13px;letter-spacing:1.5px;cursor:pointer;}' +
    '.dsg-send:disabled{opacity:.5;cursor:default;}' +
    '.dsg-msg{font-size:14px;margin-top:10px;min-height:20px;text-align:center;}' +
    '.dsg-mes{margin-top:18px;border-top:1px solid rgba(30,100,255,0.18);padding-top:14px;}' +
    '.dsg-mes h4{margin:0 0 10px;font-size:13px;letter-spacing:1px;color:#8fa3bf;font-family:Orbitron,"Chakra Petch",sans-serif;font-weight:400;}' +
    '.dsg-it{background:rgba(255,255,255,0.02);border:1px solid rgba(30,100,255,0.15);border-radius:10px;padding:10px 12px;margin-bottom:8px;font-size:14px;}' +
    '.dsg-it .top{display:flex;justify-content:space-between;gap:8px;font-size:12px;color:#8fa3bf;margin-bottom:4px;}' +
    '.dsg-it .txt{color:#c9d6e8;white-space:pre-wrap;word-break:break-word;}' +
    '.dsg-it .rep{margin-top:8px;padding:8px 10px;border-left:2px solid #00D4FF;background:rgba(0,212,255,0.06);color:#E8F4FF;border-radius:0 8px 8px 0;}' +
    '@media(max-width:480px){.dsg-fab{right:14px;bottom:14px;width:46px;height:46px;font-size:20px;}.dsg-t{font-size:12px;}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pageNom() {
    var t = (document.title || '').replace(/\s*[—|-]\s*Digital Hustler Academy.*$/i, '').trim();
    var f = location.pathname.split('/').pop() || 'index.html';
    return (t ? t + ' — ' : '') + f;
  }

  var type = 'bug';
  var ov = document.createElement('div'); ov.className = 'dsg-ov';
  ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Signaler un problème ou proposer une idée');
  ov.innerHTML = '<div class="dsg-box">' +
    '<div class="dsg-h"><b>🛠️ AIDE-NOUS À AMÉLIORER LA DHA</b><button type="button" class="dsg-x" aria-label="Fermer">×</button></div>' +
    '<p class="dsg-sub">Un bug, une erreur, une idée ? Dis-nous tout, on lit chaque message.</p>' +
    '<div class="dsg-types">' + TYPES.map(function (t) { return '<button type="button" class="dsg-t" data-k="' + t.k + '"><span>' + t.ico + '</span>' + t.label + '</button>'; }).join('') + '</div>' +
    '<div class="dsg-aide"></div>' +
    '<textarea maxlength="2000" placeholder="Explique ce qui se passe : sur quelle page, ce que tu as fait, ce qui s\'est passé…"></textarea>' +
    '<div class="dsg-page"></div>' +
    '<button type="button" class="dsg-send">ENVOYER</button>' +
    '<div class="dsg-msg" aria-live="polite"></div>' +
    '<div class="dsg-mes" hidden><h4>MES SIGNALEMENTS</h4><div class="dsg-liste"></div></div>' +
    '</div>';
  var fab = document.createElement('button');
  fab.type = 'button'; fab.className = 'dsg-fab'; fab.title = 'Signaler un bug ou proposer une idée';
  fab.setAttribute('aria-label', 'Signaler un bug ou proposer une idée'); fab.textContent = '🛠️';

  function q(s) { return ov.querySelector(s); }
  function setType(k) {
    type = k;
    ov.querySelectorAll('.dsg-t').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-k') === k); b.setAttribute('aria-pressed', b.getAttribute('data-k') === k); });
    q('.dsg-aide').textContent = TYPES.filter(function (t) { return t.k === k; })[0].aide;
  }
  function fermer() { ov.classList.remove('show'); fab.focus(); }
  function ouvrir() {
    setType(type);
    q('.dsg-page').textContent = '📍 Page : ' + pageNom();
    q('.dsg-msg').textContent = '';
    ov.classList.add('show');
    setTimeout(function () { q('textarea').focus(); }, 50);
    chargerMes();
  }

  async function chargerMes() {
    if (!window.DHA) return;
    try {
      var tk = await DHA.token(); if (!tk) return;
      var l = await DHA.rpc('dha_mes_signalements', { p_token: tk });
      if (!Array.isArray(l) || !l.length) { q('.dsg-mes').hidden = true; return; }
      q('.dsg-mes').hidden = false;
      q('.dsg-liste').innerHTML = l.slice(0, 8).map(function (s) {
        var t = TYPES.filter(function (x) { return x.k === s.type; })[0] || TYPES[0];
        var stt = STATUTS[s.statut] || STATUTS.nouveau;
        var d = new Date(s.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
        return '<div class="dsg-it"><div class="top"><span>' + t.ico + ' ' + t.label + ' · ' + d + '</span><span style="color:' + stt[1] + ';font-weight:700">' + stt[0] + '</span></div>' +
          '<div class="txt">' + esc(s.message.length > 160 ? s.message.slice(0, 160) + '…' : s.message) + '</div>' +
          (s.reponse ? '<div class="rep"><b>Réponse DHA :</b> ' + esc(s.reponse) + '</div>' : '') + '</div>';
      }).join('');
    } catch (e) {}
  }

  async function envoyer() {
    var txt = q('textarea').value.trim(), msg = q('.dsg-msg'), btn = q('.dsg-send');
    if (txt.length < 5) { msg.style.color = '#FF4466'; msg.textContent = 'Écris un peu plus de détails 🙏'; return; }
    if (!window.DHA) { msg.style.color = '#FF4466'; msg.textContent = 'Erreur de chargement, recharge la page.'; return; }
    btn.disabled = true; msg.style.color = '#8fa3bf'; msg.textContent = 'Envoi…';
    try {
      var tk = await DHA.token();
      var appareil = (window.innerWidth <= 768 ? 'Téléphone' : 'Ordinateur') + ' · ' + window.innerWidth + 'px · ' + navigator.userAgent.slice(0, 120);
      var r = await DHA.rpc('dha_signaler', { p_token: tk, p_type: type, p_message: txt, p_page: pageNom(), p_appareil: appareil });
      if (!r || !r.ok) {
        var e = r && r.erreur;
        throw new Error(e === 'limite' ? 'Tu as déjà envoyé 10 messages aujourd\'hui, réessaie demain.' : e === 'session' ? 'Ta session a expiré, reconnecte-toi.' : 'Envoi impossible, réessaie.');
      }
      try {
        var m = DHA.local() || {};
        var t = TYPES.filter(function (x) { return x.k === type; })[0];
        fetch(FORMSPREE, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ _subject: 'DHA ' + t.ico + ' ' + t.label + ' — ' + (m.pseudo || 'membre'), type: t.label, membre: m.pseudo || '', email: m.email || '', page: pageNom(), message: txt }) }).catch(function () {});
      } catch (e2) {}
      q('textarea').value = '';
      msg.style.color = '#00FF88'; msg.textContent = '✅ Merci ! Message bien reçu, on regarde ça.';
      chargerMes();
    } catch (err) {
      msg.style.color = '#FF4466'; msg.textContent = err.message || 'Envoi impossible, réessaie.';
    }
    btn.disabled = false;
  }

  function init() {
    document.body.appendChild(ov); document.body.appendChild(fab);
    fab.addEventListener('click', ouvrir);
    q('.dsg-x').addEventListener('click', fermer);
    ov.addEventListener('click', function (e) { if (e.target === ov) fermer(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && ov.classList.contains('show')) fermer(); });
    ov.querySelectorAll('.dsg-t').forEach(function (b) { b.addEventListener('click', function () { setType(b.getAttribute('data-k')); }); });
    q('.dsg-send').addEventListener('click', envoyer);
    // Entrée dans le menu de gauche
    var sb = document.querySelector('.sidebar');
    if (sb && !sb.querySelector('.dsg-nav')) {
      var a = document.createElement('a'); a.className = 'nav-item dsg-nav'; a.href = '#';
      a.innerHTML = '<span class="nav-icon">🛠️</span> Signaler / Idée';
      a.addEventListener('click', function (e) { e.preventDefault(); if (typeof window.closeSidebar === 'function') { try { window.closeSidebar(); } catch (x) {} } ouvrir(); });
      var bas = sb.querySelector('.sidebar-bottom');
      if (bas) sb.insertBefore(a, bas); else sb.appendChild(a);
    }
    // Remonter le bouton si la bannière démo est affichée
    setTimeout(function () { if (document.querySelector('.dha-demo-banner')) document.body.classList.add('dsg-demo'); }, 1500);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.DHASignaler = { ouvrir: ouvrir };
})();
