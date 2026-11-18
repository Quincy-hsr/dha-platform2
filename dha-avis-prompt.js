/* DHA — Fenêtre « Laisse un avis » : 14 jours après l'inscription, une seule fois.
   « Plus tard » la repousse de 7 jours (dha_avis_plus_tard). « Laisser un avis » ouvre dha-avis.html. */
(function () {
  if (window.__dhaAvisPrompt || !window.DHA) return; window.__dhaAvisPrompt = true;
  var css = '.av-ov{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:20px 16px;background:rgba(3,6,15,.82);backdrop-filter:blur(6px);font-family:"Exo 2",Manrope,sans-serif;color:#E8F4FF;animation:avF .35s ease both}' +
    '.av-box{position:relative;width:min(420px,100%);padding:30px 24px 22px;border-radius:24px;text-align:center;background:linear-gradient(160deg,#0f1a3a,#070c1c);border:1px solid rgba(255,215,0,.45);box-shadow:0 0 60px rgba(255,215,0,.15);animation:avU .45s cubic-bezier(.2,1.4,.4,1) both}' +
    '.av-st{font-size:30px;letter-spacing:6px;color:#FFB800;margin-bottom:10px;text-shadow:0 0 18px rgba(255,184,0,.6)}' +
    '.av-box h2{font-family:Orbitron,Sora,sans-serif;font-size:19px;line-height:1.3;margin:0 0 10px}' +
    '.av-box p{margin:0 0 20px;font-size:15px;line-height:1.55;color:rgba(232,244,255,.72)}' +
    '.av-go{display:block;width:100%;padding:15px;border:0;border-radius:14px;font-family:Orbitron,sans-serif;font-size:12px;font-weight:900;letter-spacing:1.5px;cursor:pointer;text-decoration:none;color:#1a1200;background:linear-gradient(135deg,#FFB800,#FFD700)}' +
    '.av-later{display:block;width:100%;margin-top:10px;padding:12px;border:0;background:none;color:rgba(232,244,255,.6);font-size:14px;cursor:pointer;text-decoration:underline}' +
    '.av-go:focus-visible,.av-later:focus-visible{outline:2px solid #00D4FF;outline-offset:2px}' +
    '@keyframes avF{from{opacity:0}to{opacity:1}}@keyframes avU{from{opacity:0;transform:translateY(20px) scale(.96)}to{opacity:1;transform:none}}' +
    '@media(prefers-reduced-motion:reduce){.av-ov,.av-box{animation:none}}';

  function ouvrir(prenom) {
    if (document.querySelector('.av-ov')) return;
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var ov = document.createElement('div'); ov.className = 'av-ov';
    ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-labelledby', 'av-t');
    ov.innerHTML = '<div class="av-box"><div class="av-st" aria-hidden="true">★★★★★</div>' +
      '<h2 id="av-t">J\'espère que tu apprécies ton parcours dans la DHA' + (prenom ? ', ' + String(prenom).replace(/[<>&"]/g, '') : '') + ' 🙏</h2>' +
      '<p>Ton avis m\'aide à améliorer la DHA et aide d\'autres personnes à se lancer. Ça prend 1 minute.</p>' +
      '<a class="av-go" href="dha-avis.html">⭐ LAISSER UN AVIS</a>' +
      '<button type="button" class="av-later">Me redemander plus tard</button></div>';
    document.body.appendChild(ov);
    var later = ov.querySelector('.av-later');
    function fermer() { ov.remove(); document.removeEventListener('keydown', esc); }
    function esc(e) { if (e.key === 'Escape') plusTard(); }
    async function plusTard() { fermer(); try { await DHA.rpc('dha_avis_plus_tard', { p_token: await DHA.token() }); } catch (e) {} }
    later.onclick = plusTard; document.addEventListener('keydown', esc);
    setTimeout(function () { var g = ov.querySelector('.av-go'); if (g) g.focus(); }, 100);
  }

  async function verifier() {
    try {
      var t = await DHA.token(); if (!t) return;
      var r = await DHA.rpc('dha_avis_etat', { p_token: t });
      if (!r || !r.montrer) return;
      /* attend qu'aucune autre fenêtre (cinématique, tuto…) ne soit ouverte */
      var essais = 0;
      (function attendre() {
        var occupe = [].some.call(document.querySelectorAll('[aria-modal="true"]:not(.av-ov),[role="dialog"]:not(.av-ov)'), function (el) { var c = getComputedStyle(el); return c.display !== 'none' && c.visibility !== 'hidden' && el.getClientRects().length > 0; });
        if (occupe && essais++ < 40) return setTimeout(attendre, 3000);
        ouvrir(r.prenom);
      })();
    } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(verifier, 4000); });
  else setTimeout(verifier, 4000);
  window.DHAAvis = { ouvrir: ouvrir };
})();
