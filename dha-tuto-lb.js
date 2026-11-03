/* =========================================================
   DHA — Présentation des fiches joueurs (leaderboard)
   À la première visite du leaderboard : cinématique (ta carte qui arrive),
   puis 3 étapes guidées. Vu une seule fois par pseudo ;
   « Revoir la présentation » pour la relancer.
   ========================================================= */
(function () {
  if (window.__dhaTutoLb) return; window.__dhaTutoLb = true;
  var VERSION = 'v1';
  function membre() { try { return JSON.parse(localStorage.getItem('dha_member') || '{}'); } catch (e) { return {}; } }
  function cle() { return 'dha_tuto_lb_' + VERSION + '_' + (membre().pseudo || 'invite'); }
  function dejaVu() { try { return localStorage.getItem(cle()) === '1'; } catch (e) { return true; } }
  function marquerVu() { try { localStorage.setItem(cle(), '1'); } catch (e) {} }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  var css = '' +
    '.lt-cine{position:fixed;inset:0;z-index:10050;background:#02040a;display:flex;align-items:center;justify-content:safe center;flex-direction:column;overflow-x:hidden;overflow-y:auto;color:#F2F6FF;text-align:center;padding:30px 16px;font-family:Manrope,system-ui,sans-serif}' +
    '.lt-cine:before{content:"";position:fixed;inset:0;background-image:linear-gradient(rgba(30,100,255,0.09) 1px,transparent 1px),linear-gradient(90deg,rgba(30,100,255,0.09) 1px,transparent 1px);background-size:44px 44px;animation:ltGrid 4s linear infinite;pointer-events:none}' +
    '.lt-cine:after{content:"";position:fixed;inset:0;background:radial-gradient(ellipse at 50% 55%,rgba(199,125,255,0.18),rgba(0,212,255,0.08) 40%,transparent 70%);animation:ltPulse 3s ease-in-out infinite;pointer-events:none}' +
    '.lt-sweep{position:fixed;top:0;bottom:0;width:30%;left:-40%;background:linear-gradient(90deg,transparent,rgba(0,212,255,0.22),transparent);animation:ltSweep 2.2s .2s ease-in-out both;z-index:1;pointer-events:none}' +
    '.lt-k{position:relative;z-index:2;font-family:Sora,sans-serif;font-weight:800;font-size:12px;letter-spacing:.45em;color:#00D4FF;animation:ltFade .7s .3s both}' +
    '.lt-h{position:relative;z-index:2;font-family:Sora,sans-serif;font-weight:800;font-size:clamp(34px,10vw,64px);line-height:1.02;margin:10px 0 0;letter-spacing:.02em;text-shadow:0 0 30px rgba(0,212,255,0.6),0 0 80px rgba(157,78,221,0.5);animation:ltLogo 1.3s .6s cubic-bezier(.2,.9,.3,1) both}' +
    '.lt-h span{background:linear-gradient(90deg,#00D4FF,#C77DFF,#FFD700);-webkit-background-clip:text;background-clip:text;color:transparent}' +
    '.lt-stage{position:relative;z-index:2;width:min(300px,74vw);height:min(380px,44vh);margin:20px auto 0;perspective:1200px;overflow:hidden;-webkit-mask-image:linear-gradient(#000 78%,transparent);mask-image:linear-gradient(#000 78%,transparent);padding-top:6px}' +
    '.lt-cardw{position:absolute;left:50%;top:0;width:430px;transform-origin:top left;animation:ltCard 1.6s 1.7s cubic-bezier(.2,1.2,.35,1) both}' +
    '.lt-cardw{text-align:left}.lt-cardw .fj-acts,.lt-cardw .fj-foot,.lt-cardw .fj-vs{display:none}' +
    '.lt-flash{position:fixed;inset:0;z-index:3;background:radial-gradient(circle at 50% 55%,rgba(255,255,255,0.9),transparent 60%);opacity:0;animation:ltFlash .7s 2.5s ease-out both;pointer-events:none}' +
    '.lt-chips{position:relative;z-index:2;display:flex;flex-wrap:wrap;justify-content:center;gap:8px;max-width:460px;margin:16px auto 0}' +
    '.lt-chips span{padding:8px 13px;border-radius:999px;border:1px solid rgba(0,212,255,0.4);background:rgba(30,100,255,0.14);font-size:13px;font-weight:700;animation:ltPop .5s cubic-bezier(.2,1.4,.4,1) both}' +
    '.lt-line{position:relative;z-index:2;margin:16px auto 0;font-size:15px;color:rgba(232,244,255,0.78);max-width:420px;line-height:1.55;animation:ltFade .8s 4.4s both}' +
    '.lt-go{position:relative;z-index:2;margin-top:22px;padding:16px 30px;border-radius:999px;border:none;cursor:pointer;background:linear-gradient(135deg,#1E64FF,#00D4FF);color:#020610;font-family:Sora,sans-serif;font-weight:800;font-size:14px;letter-spacing:1px;animation:ltFade .6s 4.8s both,ltGlow 2s 5.4s ease-in-out infinite}' +
    '.lt-skip{position:fixed;z-index:4;top:16px;right:16px;background:rgba(2,4,10,0.6);border:1px solid rgba(255,255,255,0.15);color:rgba(232,244,255,0.6);border-radius:99px;padding:7px 14px;font-size:12px;cursor:pointer}' +
    '.lt-cine.out{animation:ltOut .6s ease both}' +
    '@keyframes ltGrid{to{background-position:0 44px,0 0}}@keyframes ltPulse{0%,100%{opacity:.6}50%{opacity:1}}@keyframes ltSweep{to{left:110%}}' +
    '@keyframes ltFade{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}' +
    '@keyframes ltLogo{0%{opacity:0;transform:scale(2.4);filter:blur(18px)}60%{opacity:1;filter:blur(0)}100%{opacity:1;transform:scale(1)}}' +
    '@keyframes ltCard{0%{opacity:0;transform:scale(var(--s)) translateX(-50%) translateY(120px) rotateY(-540deg) rotateX(20deg)}70%{opacity:1}100%{opacity:1;transform:scale(var(--s)) translateX(-50%) rotateY(0) rotateX(0)}}' +
    '@keyframes ltFlash{0%{opacity:0}30%{opacity:.55}100%{opacity:0}}' +
    '@keyframes ltPop{from{opacity:0;transform:scale(.4) translateY(10px)}to{opacity:1;transform:none}}' +
    '@keyframes ltGlow{0%,100%{box-shadow:0 0 26px rgba(0,212,255,0.35)}50%{box-shadow:0 0 56px rgba(0,212,255,0.75)}}' +
    '@keyframes ltOut{to{opacity:0;transform:scale(1.06);filter:blur(6px)}}' +
    /* étapes */
    '.lt-hole{position:fixed;z-index:10041;border-radius:18px;box-shadow:0 0 0 9999px rgba(2,4,10,0.84);border:2px solid #00D4FF;transition:all .45s cubic-bezier(.4,0,.2,1);pointer-events:none}' +
    '.lt-hole.none{border-color:transparent}' +
    '.lt-veil{position:fixed;inset:0;z-index:10040}' +
    '.lt-box{position:fixed;z-index:10042;width:min(440px,calc(100vw - 24px));background:#080e1f;border:1px solid rgba(0,212,255,0.35);border-radius:20px;padding:22px 20px 18px;color:#F2F6FF;font-family:Manrope,system-ui,sans-serif;box-shadow:0 20px 60px rgba(0,0,0,0.6);animation:ltFade .35s both;text-align:left}' +
    '.lt-box:before{content:"";position:absolute;top:0;left:0;right:0;height:2px;border-radius:20px 20px 0 0;background:linear-gradient(90deg,#1E64FF,#00D4FF,#C77DFF,#FFD700)}' +
    '.lt-st{font-family:Sora,sans-serif;font-size:10px;font-weight:700;letter-spacing:3px;color:#00D4FF;margin-bottom:8px}' +
    '.lt-t{font-family:Sora,sans-serif;font-size:18px;font-weight:800;margin-bottom:10px;line-height:1.3}' +
    '.lt-p{font-size:15px;line-height:1.6;color:rgba(232,244,255,0.85)}.lt-p b{color:#FFD700}' +
    '.lt-list{list-style:none;padding:0;margin:12px 0 0;display:flex;flex-direction:column;gap:7px}' +
    '.lt-list li{display:flex;gap:10px;align-items:flex-start;font-size:14px;line-height:1.45;color:rgba(232,244,255,0.88);padding:8px 10px;border-radius:10px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06)}' +
    '.lt-list li em{margin-left:auto;font-style:normal;font-weight:700;color:#C77DFF;white-space:nowrap;padding-left:8px;font-size:12px}' +
    '.lt-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:18px;flex-wrap:wrap}' +
    '.lt-ok{padding:13px 22px;border-radius:12px;border:none;cursor:pointer;background:linear-gradient(135deg,#1E64FF,#00D4FF);color:#020610;font-family:Sora,sans-serif;font-weight:800;font-size:13px;text-decoration:none}' +
    '.lt-ok.gold{background:linear-gradient(135deg,#FFD700,#FF9F00);color:#1a1200}' +
    '.lt-back,.lt-quit{background:none;border:none;color:rgba(232,244,255,0.5);cursor:pointer;font-size:13px;padding:8px 4px}' +
    '.lt-quit{display:block;margin:10px auto 0;text-decoration:underline;font-size:12px}' +
    '.lt-again{display:inline-flex;align-items:center;gap:6px;margin:0 0 0 20px;padding:4px 0 8px;background:none;border:none;color:#C77DFF;font-size:12px;font-weight:700;cursor:pointer}' +
    '.lt-go:focus-visible,.lt-ok:focus-visible,.lt-skip:focus-visible,.lt-back:focus-visible,.lt-quit:focus-visible,.lt-again:focus-visible{outline:2px solid #FFD700;outline-offset:2px}' +
    '@media (prefers-reduced-motion:reduce){.lt-cine *,.lt-cine:before,.lt-cine:after,.lt-box,.lt-hole{animation:none!important;transition:none!important}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  // carte d'exemple si la vraie n'arrive pas
  function exemple() {
    var m = membre();
    return { pseudo: m.pseudo || 'hustler', xp: Number(m.xp) || 0, entree: m.date_inscription, pos: null, modules: 0, serie: 0, actif_auj: true, moi: true,
      attributs: [['Connaissance', 40], ['Régularité', 55], ['Discipline', 45], ['Rigueur', 35], ['Communauté', 50]],
      fiche: { bio: 'Je grind sur la DHA.', titre: 'debutant', effets: ['particules', 'holo'] }, perfs: [] };
  }

  /* ---------- cinématique ---------- */
  function cinematique(suite) {
    var c = document.createElement('div');
    c.className = 'lt-cine th-keep'; c.setAttribute('role', 'dialog'); c.setAttribute('aria-modal', 'true'); c.setAttribute('aria-label', 'Nouveau : les fiches joueurs');
    c.innerHTML = '<div class="lt-sweep"></div><button type="button" class="lt-skip">Passer</button>' +
      '<div class="lt-k">NOUVEAU SUR LA DHA</div><div class="lt-h">FICHES<br><span>JOUEURS</span></div>' +
      '<div class="lt-stage"><div class="lt-cardw" id="ltCard"></div></div><div class="lt-flash"></div>' +
      '<div class="lt-chips"><span style="animation-delay:3.2s">🧠 Tes attributs</span><span style="animation-delay:3.4s">🏆 Tes perfs vérifiées</span><span style="animation-delay:3.6s">✨ Des effets à débloquer</span><span style="animation-delay:3.8s">📸 Ta carte en story</span></div>' +
      '<div class="lt-line">Chaque membre a maintenant sa carte de joueur, comme dans un jeu. Voilà la tienne, ' + esc(membre().prenom || membre().pseudo || 'Hustler') + '.</div>' +
      '<button type="button" class="lt-go">▶ DÉCOUVRIR</button>';
    document.body.appendChild(c);
    document.documentElement.style.overflow = 'hidden';
    var w = c.querySelector('#ltCard'), stage = c.querySelector('.lt-stage');
    function taille() { var s = stage.offsetWidth / 430; w.style.setProperty('--s', s); w.style.transform = 'scale(' + s + ') translateX(-50%)'; }
    function poser(d) { if (window.DHAFiche) { DHAFiche.render(d, w, { apercu: true }); taille(); } }
    poser(exemple());
    (async function () { try { var d = await DHA.rpc('dha_fiche', { p_token: await DHA.token(), p_pseudo: membre().pseudo }); if (d) poser(d); } catch (e) {} })();
    window.addEventListener('resize', taille);
    function fin(lancer) {
      c.classList.add('out'); window.removeEventListener('resize', taille);
      setTimeout(function () { c.remove(); document.documentElement.style.overflow = ''; if (lancer) suite(); else marquerVu(); }, 560);
    }
    c.querySelector('.lt-go').onclick = function () { fin(true); };
    c.querySelector('.lt-skip').onclick = function () { fin(false); };
    setTimeout(function () { var g = c.querySelector('.lt-go'); if (g) g.focus({ preventScroll: true }); }, 5000);
  }

  /* ---------- étapes ---------- */
  function etapes() {
    return [
      { cible: function () { return document.querySelector('.lb-item[data-pseudo]:not(.me)') || document.querySelector('.lb-item[data-pseudo]'); }, titre: '👆 CLIQUE SUR UN MEMBRE',
        texte: 'Dans le classement, <b>clique sur n\'importe quel membre</b> : sa carte de joueur s\'ouvre. Tu vois son rang, son niveau, ses jours dans la DHA et sa série.' },
      { cible: null, titre: '🃏 CE QU\'IL Y A SUR UNE CARTE',
        texte: 'Tout ce qui est calculé par la plateforme est <b>impossible à truquer</b> :',
        liste: [['🧠', 'Les attributs : Connaissance, Régularité, Discipline, Rigueur, Communauté'], ['🏆', 'Les perfs : prop firm, payout, meilleur trade…', '✔ vérifiées'], ['👊', 'Le bouton GG pour donner du respect'], ['⚔️', 'Le mode VS : tes attributs contre les siens'], ['💬', 'WhatsApp, si le membre l\'a activé']] },
      { cible: null, titre: '✨ DÉBLOQUE DES EFFETS',
        texte: 'Plus tu grind, plus ta carte claque :',
        liste: [['💡', 'Cadre néon', '5 000 XP'], ['🌈', 'Bannière animée', 'série 30 j'], ['✨', 'Particules', '15 500 XP'], ['🪩', 'Holographique', '30 000 XP'], ['🔥', 'Flammes', 'série 100 j'], ['⚡', 'Éclairs', 'top 3 du mois'], ['💎', 'Aura LEGEND', '60 000 XP']] },
      { cible: null, final: true, titre: '🪪 À TOI DE CRÉER TA CARTE',
        texte: 'Ajoute ta <b>bio</b>, ton <b>style</b>, tes <b>actifs</b> et tes <b>perfs</b> (avec une capture, je les vérifie). Ensuite, partage ta carte en <b>story Insta</b> 📸' }
    ];
  }
  function visite() {
    var E = etapes(), i = 0;
    var veil = document.createElement('div'); veil.className = 'lt-veil';
    var hole = document.createElement('div'); hole.className = 'lt-hole none';
    var box = document.createElement('div'); box.className = 'lt-box th-keep'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true');
    document.body.appendChild(veil); document.body.appendChild(hole); document.body.appendChild(box);
    function cible(e) { var t = typeof e.cible === 'function' ? e.cible() : null; if (!t) return null; var r = t.getBoundingClientRect(); return r.width > 0 ? t : null; }
    function placer() {
      var t = cible(E[i]), pad = 8;
      if (!t) { hole.className = 'lt-hole none'; hole.style.cssText = 'top:50%;left:50%;width:0;height:0;'; box.style.top = Math.max(12, (innerHeight - box.offsetHeight) / 2) + 'px'; box.style.left = Math.max(12, (innerWidth - box.offsetWidth) / 2) + 'px'; return; }
      var r = t.getBoundingClientRect();
      hole.className = 'lt-hole'; hole.style.cssText = 'top:' + (r.top - pad) + 'px;left:' + (r.left - pad) + 'px;width:' + (r.width + pad * 2) + 'px;height:' + (r.height + pad * 2) + 'px;';
      var top = r.bottom + pad + 14; if (top + box.offsetHeight > innerHeight - 12) top = Math.max(12, r.top - pad - 14 - box.offsetHeight);
      box.style.top = top + 'px'; box.style.left = Math.max(12, (innerWidth - box.offsetWidth) / 2) + 'px';
    }
    function afficher() {
      var e = E[i], t = cible(e);
      box.style.animation = 'none'; void box.offsetWidth; box.style.animation = '';
      box.setAttribute('aria-label', e.titre);
      box.innerHTML = '<div class="lt-st">ÉTAPE ' + (i + 1) + ' / ' + E.length + '</div><div class="lt-t">' + e.titre + '</div><div class="lt-p">' + e.texte + '</div>' +
        (e.liste ? '<ul class="lt-list">' + e.liste.map(function (l) { return '<li><span>' + l[0] + '</span><div>' + l[1] + '</div>' + (l[2] ? '<em>' + l[2] + '</em>' : '') + '</li>'; }).join('') + '</ul>' : '') +
        '<div class="lt-foot">' + (i > 0 ? '<button type="button" class="lt-back">← Retour</button>' : '<span></span>') +
        (e.final ? '<span style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="lt-ok" data-go="voir">👀 Voir ma carte</button><a class="lt-ok gold" href="dha-ma-fiche.html" data-go="creer">✏️ Créer ma carte</a></span>' : '<button type="button" class="lt-ok">OK ✓</button>') + '</div>' +
        '<button type="button" class="lt-quit" data-go="quitter">' + (e.final ? 'Plus tard' : 'Passer la présentation') + '</button>';
      if (t) { var r = t.getBoundingClientRect(); window.scrollTo({ top: Math.max(0, scrollY + r.top - 120), behavior: 'smooth' }); }
      placer(); setTimeout(placer, 420); setTimeout(placer, 800);
      var ok = box.querySelector('.lt-ok'); if (ok) ok.focus({ preventScroll: true });
    }
    function fermer() { window.removeEventListener('resize', placer); window.removeEventListener('scroll', placer); document.removeEventListener('keydown', clavier); [veil, hole, box].forEach(function (n) { n.remove(); }); marquerVu(); }
    function clavier(e) { if (e.key === 'Escape') fermer(); else if (e.key === 'ArrowRight' && i < E.length - 1) { i++; afficher(); } else if (e.key === 'ArrowLeft' && i > 0) { i--; afficher(); } }
    box.addEventListener('click', function (e) {
      var b = e.target.closest('button,a'); if (!b) return;
      var go = b.getAttribute('data-go');
      if (go === 'creer') { marquerVu(); return; }
      if (go === 'voir') { fermer(); if (window.DHAFiche) DHAFiche.open(membre().pseudo); return; }
      if (go === 'quitter') { fermer(); return; }
      if (b.classList.contains('lt-back')) { if (i > 0) { i--; afficher(); } return; }
      if (b.classList.contains('lt-ok')) { if (i < E.length - 1) { i++; afficher(); } else fermer(); }
    });
    window.addEventListener('resize', placer); window.addEventListener('scroll', placer); document.addEventListener('keydown', clavier);
    afficher();
  }
  function lancer() { cinematique(visite); }
  window.DHATutoLb = { lancer: lancer };

  function init() {
    var l = document.getElementById('lb-list');
    if (l && !document.querySelector('.lt-again')) {
      var a = document.createElement('button'); a.type = 'button'; a.className = 'lt-again'; a.textContent = '🎬 Revoir la présentation des fiches joueurs';
      a.onclick = lancer; l.parentNode.insertBefore(a, l);
    }
    if (!membre().pseudo || dejaVu()) return;
    var essais = 0;
    (function attendre() {
      if (document.querySelector('.lb-item[data-pseudo]') || essais++ > 30) setTimeout(lancer, 300);
      else setTimeout(attendre, 200);
    })();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
