/* DHA — Cinématique « Nouveau déblocage » sur la carte joueur
   Compare ce que le membre a débloqué (titres, effets, badge Mindset, perfs vérifiées)
   avec ce qu'il a déjà vu sur cet appareil, et lance une cinématique pour chaque nouveauté.
   Utilise : DHA.rpc('dha_fiche'), DHAFiche (chargé à la demande).
   API : DHADeblocage.verifier() — à appeler juste après un déblocage (ex. fin de la Prise de conscience). */
(function () {
  if (window.DHADeblocage) return;
  var OCCUPE = '.tt-cine,.tt-card,.tp-veil,.lt-veil,.dq-cine,.fj-ov.on,.fj-sov.on,.db-cine';
  var TITRES = { regulier: 'Le Régulier', discipline: 'Le Discipliné', studieux: 'Le Studieux', diplome: 'Le Diplômé', funded: 'Le Funded', imperturbable: "L'Imperturbable", aguerri: 'Le Mindset aguerri' };
  var TITRES_COND = { regulier: '30 jours de suite sur la plateforme', discipline: '50 quêtes du jour validées', studieux: '9 modules terminés', diplome: 'Les 17 modules terminés', funded: 'Challenge prop firm vérifié', imperturbable: 'Rang LEGEND atteint', aguerri: 'Prise de conscience terminée' };
  var FX = { neon: ['💡', 'Cadre néon'], banniere: ['🌈', 'Bannière animée'], particules: ['✨', 'Particules'], holo: ['🪩', 'Holographique'], flammes: ['🔥', 'Flammes'], eclairs: ['⚡', 'Éclairs'], aura: ['💎', 'Aura LEGEND'] };
  var FX_COND = { neon: 'Rang HUSTLER atteint', banniere: '30 jours de suite', particules: 'Rang PRO HUSTLER atteint', holo: 'Rang AMBASSADEUR atteint', flammes: '100 jours de suite', eclairs: 'Top 3 du mois', aura: 'Rang LEGEND atteint' };

  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function cle(p) { return 'dha_debloc_' + String(p || '').toLowerCase(); }
  function lire(p) { try { var v = JSON.parse(localStorage.getItem(cle(p)) || 'null'); return Array.isArray(v) ? v : null; } catch (e) { return null; } }
  function ecrire(p, a) { try { localStorage.setItem(cle(p), JSON.stringify(a)); } catch (e) {} }

  // Tout ce qui est débloqué sur la carte, sous forme d'items { id, ic, type, nom, cond, couleur }
  function items(d) {
    var out = [];
    if (d.mindset) out.push({ id: 'mindset', ic: '🧠', type: 'NOUVEAU BADGE', nom: 'Mindset aguerri', cond: 'Tu as terminé la Prise de conscience. Le badge est sur ta carte.', c: ['#9D4EDD', '#C77DFF'] });
    (d.titres || []).forEach(function (t) { if (TITRES[t]) out.push({ id: 't:' + t, ic: '🏷️', type: 'NOUVEAU TITRE', nom: '« ' + TITRES[t] + ' »', cond: TITRES_COND[t] + '. Choisis-le dans « Modifier ma fiche ».', c: ['#00A3FF', '#00D4FF'], titre: t }); });
    (d.effets_ok || []).forEach(function (k) { if (FX[k]) out.push({ id: 'e:' + k, ic: FX[k][0], type: 'NOUVEL EFFET DE CARTE', nom: FX[k][1], cond: FX_COND[k] + '. Active-le dans « Modifier ma fiche ».', c: ['#FF9F00', '#FFD700'], effet: k }); });
    (d.perfs || []).forEach(function (p) { if (p.statut === 'verifie') out.push({ id: 'p:' + p.id, ic: '✔️', type: 'PERF VÉRIFIÉE', nom: [p.valeur, p.firm].filter(Boolean).join(' · ') || 'Ta perf', cond: 'Quincy a contrôlé ta preuve : ta carte affiche « Vérifié ».', c: ['#00C46A', '#00FF88'] }); });
    return out;
  }

  var css = '' +
    '.db-cine{position:fixed;inset:0;z-index:2147483100;display:flex;align-items:center;justify-content:center;overflow:hidden;background:radial-gradient(circle at 50% 40%,color-mix(in srgb,var(--c1) 45%,#050914),#03060f 70%);animation:dbFade .45s ease both;font-family:Manrope,sans-serif;color:#E8F4FF}' +
    '.db-cine .db-rays{position:absolute;left:50%;top:38%;width:1400px;height:1400px;margin:-700px 0 0 -700px;background:repeating-conic-gradient(from 0deg,color-mix(in srgb,var(--c2) 22%,transparent) 0 6deg,transparent 6deg 18deg);animation:dbSpin 18s linear infinite;mask:radial-gradient(circle,#000 10%,transparent 60%);-webkit-mask:radial-gradient(circle,#000 10%,transparent 60%)}' +
    '.db-cine .db-ring{position:absolute;left:50%;top:38%;width:140px;height:140px;margin:-70px 0 0 -70px;border-radius:50%;border:3px solid var(--c2);box-shadow:0 0 40px var(--c2);animation:dbRing 1.8s ease-out infinite;opacity:0}' +
    '.db-cine .db-ring.r2{animation-delay:.6s}.db-cine .db-ring.r3{animation-delay:1.2s}' +
    '.db-cine .db-box{position:relative;z-index:2;width:min(420px,calc(100% - 32px));max-height:100%;overflow:auto;text-align:center;padding:24px 0}' +
    '.db-cine .db-k{font-family:Sora,Orbitron,sans-serif;font-size:11px;font-weight:900;letter-spacing:4px;color:var(--c2);animation:dbUp .5s ease both .1s}' +
    '.db-cine .db-ic{width:116px;height:116px;margin:16px auto 14px;border-radius:30px;display:flex;align-items:center;justify-content:center;font-size:60px;background:linear-gradient(135deg,var(--c1),var(--c2));box-shadow:0 0 60px color-mix(in srgb,var(--c2) 75%,transparent);animation:dbPop .8s cubic-bezier(.2,1.7,.4,1) both .25s}' +
    '.db-cine h2{font-family:Sora,Orbitron,sans-serif;font-size:clamp(22px,6vw,30px);font-weight:900;margin:0 0 8px;text-shadow:0 0 28px color-mix(in srgb,var(--c2) 80%,transparent);animation:dbUp .5s ease both .55s}' +
    '.db-cine p{margin:0 auto 18px;max-width:340px;font-size:14.5px;line-height:1.5;color:rgba(232,244,255,0.75);animation:dbUp .5s ease both .7s}' +
    '.db-cine .db-card{position:relative;margin:0 auto 18px;width:300px;max-width:100%;height:300px;overflow:hidden;border-radius:22px;animation:dbCard .9s cubic-bezier(.2,1.2,.4,1) both .85s;-webkit-mask:linear-gradient(#000 80%,transparent);mask:linear-gradient(#000 80%,transparent)}' +
    '.db-cine .db-card>div{transform:scale(.78);transform-origin:top center;pointer-events:none}' +
    '.db-cine .db-acts{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;animation:dbUp .5s ease both 1.1s}' +
    '.db-cine .db-b{padding:13px 20px;border-radius:14px;font:800 14px Sora,sans-serif;cursor:pointer;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.06);color:#fff;text-decoration:none}' +
    '.db-cine .db-b.go{background:linear-gradient(135deg,var(--c1),var(--c2));border-color:transparent;color:#050914}' +
    '.db-cine .db-n{margin-top:14px;font-family:Sora,sans-serif;font-size:10px;letter-spacing:3px;color:rgba(232,244,255,0.45)}' +
    '.db-cine .db-pt{position:absolute;left:50%;top:38%;width:9px;height:9px;border-radius:2px;background:var(--c2);animation:dbBurst 1.5s cubic-bezier(.1,.8,.3,1) both .3s}' +
    '@keyframes dbFade{from{opacity:0}to{opacity:1}}@keyframes dbSpin{to{transform:rotate(360deg)}}' +
    '@keyframes dbRing{0%{transform:scale(.4);opacity:1}100%{transform:scale(6);opacity:0}}' +
    '@keyframes dbPop{0%{transform:scale(.2) rotate(-25deg);opacity:0}100%{transform:scale(1) rotate(0);opacity:1}}' +
    '@keyframes dbUp{from{transform:translateY(14px);opacity:0}to{transform:none;opacity:1}}' +
    '@keyframes dbCard{from{transform:translateY(60px) rotateX(35deg);opacity:0}to{transform:none;opacity:1}}' +
    '@keyframes dbBurst{0%{transform:translate(0,0) rotate(0);opacity:1}100%{transform:translate(var(--dx),var(--dy)) rotate(600deg);opacity:0}}' +
    '@media (prefers-reduced-motion:reduce){.db-cine *{animation:none!important}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function chargerFiche() {
    if (window.DHAFiche) return Promise.resolve(true);
    return new Promise(function (ok) { var s = document.createElement('script'); s.src = 'dha-fiche.js'; s.onload = function () { ok(true); }; s.onerror = function () { ok(false); }; document.head.appendChild(s); });
  }
  function attendreLibre() {
    return new Promise(function (ok) { var n = 0; (function t() { if (!document.querySelector(OCCUPE) || n++ > 40) return ok(); setTimeout(t, 1500); })(); });
  }

  function montrer(liste, d, fini) {
    var i = 0, ov = document.createElement('div');
    ov.className = 'db-cine th-keep'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Nouveau déblocage');
    document.body.appendChild(ov); document.documentElement.style.overflow = 'hidden';
    function fermer() { ov.remove(); document.documentElement.style.overflow = ''; document.removeEventListener('keydown', key); if (fini) fini(); }
    function key(e) { if (e.key === 'Escape') fermer(); }
    document.addEventListener('keydown', key);
    function etape() {
      var it = liste[i];
      ov.style.setProperty('--c1', it.c[0]); ov.style.setProperty('--c2', it.c[1]);
      var pts = ''; for (var k = 0; k < 18; k++) { var a = k / 18 * 6.283, r = 160 + Math.random() * 160; pts += '<i class="db-pt" style="--dx:' + Math.round(Math.cos(a) * r) + 'px;--dy:' + Math.round(Math.sin(a) * r) + 'px;animation-delay:' + (0.3 + Math.random() * 0.2).toFixed(2) + 's"></i>'; }
      ov.innerHTML = '<div class="db-rays"></div><div class="db-ring"></div><div class="db-ring r2"></div><div class="db-ring r3"></div>' + pts +
        '<div class="db-box"><div class="db-k">🔓 ' + esc(it.type) + '</div><div class="db-ic">' + it.ic + '</div><h2>' + esc(it.nom) + '</h2><p>' + esc(it.cond) + '</p>' +
        '<div class="db-card" aria-hidden="true"></div>' +
        '<div class="db-acts"><a class="db-b" href="dha-ma-fiche.html">Voir ma carte</a><button type="button" class="db-b go" data-db="next">' + (i < liste.length - 1 ? 'Suivant ›' : 'Continuer') + '</button></div>' +
        (liste.length > 1 ? '<div class="db-n">' + (i + 1) + ' / ' + liste.length + '</div>' : '') + '</div>';
      // Aperçu de la carte avec la nouveauté (titre / effet mis en place pour l'aperçu)
      if (window.DHAFiche) {
        var dd = JSON.parse(JSON.stringify(d)); dd.fiche = dd.fiche || {};
        if (it.titre) dd.fiche.titre = it.titre;
        if (it.effet) { var fx = (dd.fiche.effets || []).filter(function (x) { return x !== it.effet; }); fx.unshift(it.effet); dd.fiche.effets = fx.slice(0, 3); }
        try { DHAFiche.render(dd, ov.querySelector('.db-card'), { apercu: true, sansPerfs: true }); } catch (e) {}
      }
      ov.querySelector('[data-db="next"]').onclick = function () { i++; if (i < liste.length) etape(); else fermer(); };
      if (navigator.vibrate) try { navigator.vibrate([30, 40, 60]); } catch (e) {}
    }
    etape();
  }

  var enCours = false;
  async function verifier() {
    if (enCours || !window.DHA) return; enCours = true;
    try {
      var m = DHA.local(); if (!m || !m.pseudo) return;
      var d = await DHA.rpc('dha_fiche', { p_token: await DHA.token(), p_pseudo: m.pseudo });
      if (!d) return;
      var tous = items(d), vus = lire(m.pseudo);
      if (!vus) { ecrire(m.pseudo, tous.map(function (x) { return x.id; })); return; } // 1re fois sur cet appareil : pas de rattrapage
      var nouveaux = tous.filter(function (x) { return vus.indexOf(x.id) < 0; });
      if (!nouveaux.length) return;
      await attendreLibre();
      await chargerFiche();
      ecrire(m.pseudo, vus.concat(nouveaux.map(function (x) { return x.id; })));
      await new Promise(function (ok) { montrer(nouveaux.slice(0, 5), d, ok); });
    } catch (e) { console.error('Déblocages :', e); }
    finally { enCours = false; }
  }

  window.DHADeblocage = { verifier: verifier, demo: function (d, liste) { chargerFiche().then(function () { montrer(liste || items(d), d); }); } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(verifier, 2500); });
  else setTimeout(verifier, 2500);
})();
