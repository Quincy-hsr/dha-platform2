/* =========================================================
   DHA — Accès selon le forfait
   Inclus sur toutes les pages membres (après dha-api.js).
   - Essentiel (180 €)            : pas de Lives & Replays, pas d'Appel Mentor, pas de Discord
   - Accompagnement groupe (500 €): pas d'Appel Mentor
   - Accompagnement 1:1 (750 €)   : tout
   - Anciens forfaits (medium…)   : tout (ils ont payé avant ce découpage)
   Les onglets bloqués gardent leur place dans le menu, avec un cadenas 🔒.
   ========================================================= */
(function () {
  if (window.__dhaForfait) return; window.__dhaForfait = true;
  var LIEN_QUINCY = 'https://wa.me/qr/OCPS7DRIVP76L1';

  function pack(m) { return String((m && m.pack) || ''); }
  function estDemo(m) { return !!(m && m.plan === 'demo'); }
  var ACCES = {
    groupe: function (m) { return pack(m) !== '180'; },
    unUn: function (m) { var p = pack(m); return p === '750' || (p !== '180' && p !== '500' && p !== ''); }
  };
  var VERROUS = [
    { page: 'dha-lives.html', acces: 'groupe', icon: '📺', titre: 'LIVES & REPLAYS',
      msg: 'Si tu veux participer aux lives et voir les replays, augmente ton forfait.',
      offre: 'Inclus dans les offres Accompagnement en groupe (500 €) et 1:1 (750 €).' },
    { page: 'dha-mentor.html', acces: 'unUn', icon: '📞', titre: 'APPEL MENTOR',
      msg: 'Si tu veux un appel individuel avec Quincy, augmente ton forfait.',
      offre: 'Inclus dans l\'offre Accompagnement 1:1 (750 €).' }
  ];
  window.DHAForfait = { acces: ACCES, verrous: VERROUS, lienQuincy: LIEN_QUINCY };

  var css = '' +
    '.dfo-lock{margin-left:auto;font-size:11px;opacity:.7;}' +
    '.dfo-ov{position:fixed;inset:0;z-index:9600;background:rgba(0,0,0,0.72);display:none;align-items:center;justify-content:center;padding:16px;}' +
    '.dfo-ov.show{display:flex;}' +
    '.dfo-box{width:100%;max-width:420px;background:#080e1f;border:1px solid rgba(255,215,0,0.35);border-radius:20px;padding:30px 22px 24px;text-align:center;color:#E8F4FF;font-family:"Exo 2","Rajdhani",sans-serif;box-shadow:0 20px 60px rgba(0,0,0,0.6);}' +
    '.dfo-ic{font-size:44px;margin-bottom:8px;}' +
    '.dfo-t{font-family:Orbitron,"Chakra Petch",sans-serif;font-size:15px;font-weight:900;letter-spacing:1.5px;margin-bottom:12px;}' +
    '.dfo-m{font-size:16px;line-height:1.6;margin-bottom:6px;}' +
    '.dfo-o{font-size:13px;color:rgba(232,244,255,0.55);margin-bottom:20px;}' +
    '.dfo-b{display:flex;flex-direction:column;gap:10px;}' +
    '.dfo-b a,.dfo-b button{padding:14px;border-radius:12px;font-family:Orbitron,"Chakra Petch",sans-serif;font-size:11px;font-weight:700;letter-spacing:1px;text-decoration:none;cursor:pointer;border:none;}' +
    '.dfo-up{background:linear-gradient(135deg,#FFD700,#FF9F00);color:#1a1200;}' +
    '.dfo-sec{background:transparent;color:rgba(232,244,255,0.7);border:1px solid rgba(255,255,255,0.15)!important;}' +
    '.dfo-b a:focus-visible,.dfo-b button:focus-visible{outline:2px solid #00D4FF;outline-offset:2px;}' +
    '.dfo-inline{position:relative;}' +
    '.dfo-inline-lock{margin-top:14px;padding:16px;border-radius:14px;border:1px dashed rgba(255,215,0,0.5);background:rgba(255,215,0,0.06);text-align:center;}' +
    '.dfo-inline-lock b{display:block;font-family:Orbitron,"Chakra Petch",sans-serif;font-size:12px;letter-spacing:1px;margin-bottom:6px;}' +
    '.dfo-inline-lock p{font-size:14px;color:rgba(232,244,255,0.75);margin:0 0 12px;}' +
    '.dfo-inline-lock a{display:inline-block;padding:11px 16px;border-radius:10px;background:linear-gradient(135deg,#FFD700,#FF9F00);color:#1a1200;font-family:Orbitron,"Chakra Petch",sans-serif;font-size:10px;font-weight:700;letter-spacing:1px;text-decoration:none;}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var ov = document.createElement('div');
  ov.className = 'dfo-ov'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true');
  function boite(v) {
    ov.innerHTML = '<div class="dfo-box"><div class="dfo-ic">🔒</div><div class="dfo-t">' + v.icon + ' ' + v.titre + '</div>' +
      '<div class="dfo-m">' + v.msg + '</div><div class="dfo-o">' + v.offre + '</div>' +
      '<div class="dfo-b"><a class="dfo-up" href="' + LIEN_QUINCY + '" target="_blank" rel="noopener">💬 AUGMENTER MON FORFAIT</a>' +
      '<button type="button" class="dfo-sec" data-dfo-close>FERMER</button></div></div>';
    ov.setAttribute('aria-label', v.titre + ' verrouillé');
    ov.classList.add('show');
    var b = ov.querySelector('.dfo-up'); if (b) b.focus();
  }
  function fermer() { ov.classList.remove('show'); }
  ov.addEventListener('click', function (e) { if (e.target === ov || e.target.closest('[data-dfo-close]')) fermer(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fermer(); });

  var membre = null;
  function verrouPour(href) {
    var p = (String(href || '').split('#')[0].split('?')[0].split('/').pop() || '').toLowerCase();
    for (var i = 0; i < VERROUS.length; i++) if (VERROUS[i].page === p) return VERROUS[i];
    return null;
  }
  function bloque(v) { return !!(membre && !estDemo(membre) && !ACCES[v.acces](membre)); }

  function appliquer() {
    // Cadenas dans le menu
    document.querySelectorAll('a.nav-item').forEach(function (a) {
      var v = verrouPour(a.getAttribute('href')); if (!v) return;
      var l = a.querySelector('.dfo-lock');
      if (bloque(v)) { if (!l) { l = document.createElement('span'); l.className = 'dfo-lock'; l.textContent = '🔒'; l.setAttribute('aria-label', 'verrouillé'); a.appendChild(l); } }
      else if (l) l.remove();
    });
    // Mon Squad : le Discord (appels & lives) est réservé à l'accompagnement
    var dc = document.querySelector('.squad-block.discord');
    if (dc) {
      var btn = dc.querySelector('.discord-btn'), box = dc.querySelector('.dfo-inline-lock');
      var off = bloque(VERROUS[0]);
      if (btn) btn.style.display = off ? 'none' : '';
      if (off && !box) {
        box = document.createElement('div'); box.className = 'dfo-inline-lock';
        box.innerHTML = '<b>🔒 RÉSERVÉ À L\'ACCOMPAGNEMENT</b><p>Si tu veux participer aux appels de groupe et aux lives, augmente ton forfait.</p><a href="' + LIEN_QUINCY + '" target="_blank" rel="noopener">💬 AUGMENTER MON FORFAIT</a>';
        dc.appendChild(box);
      } else if (!off && box) box.remove();
    }
  }

  // Clic sur un onglet verrouillé : le pop-up au lieu d'ouvrir la page
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]'); if (!a) return;
    var v = verrouPour(a.getAttribute('href'));
    if (v && bloque(v) && a.target !== '_blank') { e.preventDefault(); e.stopPropagation(); boite(v); }
  }, true);

  function init() {
    document.body.appendChild(ov);
    try { membre = JSON.parse(localStorage.getItem('dha_member') || 'null'); } catch (e) {}
    appliquer();
    if (window.DHA && DHA.me) DHA.me().then(function (m) { if (m) { membre = m; appliquer(); } }).catch(function () {});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
