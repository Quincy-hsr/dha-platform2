/* =========================================================
   DHA — Animations de progression (level up + montée de rang)
   À inclure dans le <head> :  <script src="dha-levelup.js"></script>
   Puis appeler après chaque mise à jour de l'XP :
     DHALevelUp.check({pseudo, xp, level, rang, rangs, avantages})
   - Level up : à chaque niveau gagné (1→2, 2→3, ...)
   - Rang : uniquement quand un nouveau rang est débloqué
   La 1re fois qu'un membre passe ici, on mémorise son niveau
   sans rien afficher (pas d'animation pour les anciens membres).
   ========================================================= */
(function () {
  const CSS = `
.lu-ov{position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;padding:16px;overflow:hidden;font-family:Inter,system-ui,sans-serif;--lu-accent:#00D4FF;}
.lu-bg{position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,rgba(5,9,20,0.75),rgba(5,9,20,0.97) 70%);backdrop-filter:blur(8px);animation:luFade .35s ease both;}
.lu-flash{position:absolute;inset:0;background:#E8F4FF;opacity:0;animation:luFlash .5s ease-out .05s both;pointer-events:none;}
.lu-cv{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;}
.lu-rays{position:absolute;left:50%;top:50%;width:160vmax;height:160vmax;margin:-80vmax 0 0 -80vmax;background:repeating-conic-gradient(from 0deg,color-mix(in srgb,var(--lu-accent) 18%,transparent) 0deg 6deg,transparent 6deg 18deg);-webkit-mask:radial-gradient(circle,#000 0,transparent 45%);mask:radial-gradient(circle,#000 0,transparent 45%);opacity:0;animation:luRays .8s ease .3s forwards,luSpin 24s linear infinite;pointer-events:none;}
.lu-ring{position:absolute;left:50%;top:50%;width:40px;height:40px;margin:-20px 0 0 -20px;border-radius:50%;border:3px solid var(--lu-accent);opacity:0;pointer-events:none;}
.lu-r1{animation:luShock 1.1s cubic-bezier(.1,.7,.3,1) .15s both;}
.lu-r2{animation:luShock 1.3s cubic-bezier(.1,.7,.3,1) .35s both;border-width:2px;}
.lu-r3{animation:luShock 1.5s cubic-bezier(.1,.7,.3,1) .55s both;border-width:1px;}
.lu-stage{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;text-align:center;gap:14px;width:100%;max-width:520px;color:#E8F4FF;animation:luShake .45s ease .45s both;}
.lu-kicker{font-family:Orbitron,sans-serif;font-size:clamp(9px,2.4vw,11px);letter-spacing:6px;color:var(--lu-accent);opacity:0;animation:luUp .5s ease .9s both;}
.lu-big{font-family:Orbitron,sans-serif;font-weight:900;font-size:clamp(44px,13vw,96px);line-height:.95;letter-spacing:2px;margin:0;color:#E8F4FF;text-shadow:0 0 18px var(--lu-accent),0 0 48px var(--lu-accent),0 0 90px var(--lu-accent);animation:luSlam .65s cubic-bezier(.2,1.6,.4,1) .3s both;}
.lu-lvl{display:flex;align-items:center;gap:18px;opacity:0;animation:luUp .5s ease 1s both;}
.lu-old,.lu-new{font-family:Orbitron,sans-serif;font-weight:900;font-variant-numeric:tabular-nums;}
.lu-old{font-size:clamp(22px,6vw,32px);color:rgba(232,244,255,0.3);text-decoration:line-through;text-decoration-thickness:2px;}
.lu-arrow{color:var(--lu-accent);font-size:22px;animation:luNudge 1s ease-in-out 1.6s infinite;}
.lu-new{font-size:clamp(48px,14vw,84px);color:var(--lu-accent);text-shadow:0 0 30px var(--lu-accent);animation:luPop .55s cubic-bezier(.2,1.8,.4,1) 1.35s both;}
.lu-new small{display:block;font-size:9px;letter-spacing:4px;color:rgba(232,244,255,0.5);text-shadow:none;margin-top:4px;}
.lu-emblem{position:relative;width:clamp(120px,32vw,170px);aspect-ratio:1;max-width:100%;display:flex;align-items:center;justify-content:center;--lu-rc:#1E64FF;animation:luEmblem .9s cubic-bezier(.2,1.6,.4,1) .25s both;}
.lu-emblem::before{content:'';position:absolute;inset:0;border-radius:30%;background:radial-gradient(circle,color-mix(in srgb,var(--lu-rc) 45%,transparent),transparent 70%);border:2px solid var(--lu-rc);box-shadow:0 0 40px var(--lu-rc);transform:rotate(45deg);animation:luPulse 1.8s ease-in-out 1.2s infinite;}
.lu-emblem span{position:relative;font-size:clamp(56px,15vw,80px);filter:drop-shadow(0 0 20px var(--lu-rc));}
.lu-rname{font-family:Orbitron,sans-serif;font-weight:900;font-size:clamp(30px,9vw,60px);letter-spacing:5px;color:#E8F4FF;margin:0;animation:luSlam .6s cubic-bezier(.2,1.6,.4,1) .9s both;}
.lu-rewards{display:flex;flex-direction:column;gap:8px;width:100%;}
.lu-rw{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:12px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);text-align:left;opacity:0;animation:luSlide .45s ease both;}
.lu-rw i{font-style:normal;font-size:20px;flex-shrink:0;}
.lu-rw b{display:block;font-family:Orbitron,sans-serif;font-size:9px;letter-spacing:2px;color:#FFD700;}
.lu-rw p{margin:2px 0 0;font-size:12px;color:rgba(232,244,255,0.8);}
.lu-rw.lu-gold{background:rgba(255,215,0,0.07);border-color:rgba(255,215,0,0.35);box-shadow:0 0 20px rgba(255,215,0,0.12);}
.lu-go{margin-top:6px;padding:14px 36px;border-radius:12px;background:color-mix(in srgb,var(--lu-accent) 14%,transparent);border:1px solid var(--lu-accent);color:var(--lu-accent);font-family:Orbitron,sans-serif;font-size:11px;font-weight:900;letter-spacing:3px;cursor:pointer;opacity:0;animation:luUp .5s ease both;}
.lu-go:hover{background:color-mix(in srgb,var(--lu-accent) 24%,transparent);}
.lu-go:focus-visible{outline:2px solid #E8F4FF;outline-offset:3px;}
@keyframes luFade{from{opacity:0}to{opacity:1}}
@keyframes luFlash{0%{opacity:0}15%{opacity:.85}100%{opacity:0}}
@keyframes luRays{to{opacity:1}}
@keyframes luSpin{to{transform:rotate(360deg)}}
@keyframes luShock{0%{transform:scale(.2);opacity:1}100%{transform:scale(28);opacity:0}}
@keyframes luSlam{0%{transform:scale(3.2);opacity:0;filter:blur(14px)}60%{opacity:1;filter:blur(0)}100%{transform:scale(1);opacity:1}}
@keyframes luShake{0%,100%{transform:translate(0)}20%{transform:translate(-8px,4px)}40%{transform:translate(7px,-5px)}60%{transform:translate(-5px,3px)}80%{transform:translate(3px,-2px)}}
@keyframes luUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes luPop{0%{transform:scale(0);opacity:0}100%{transform:scale(1);opacity:1}}
@keyframes luNudge{0%,100%{transform:translateX(0)}50%{transform:translateX(5px)}}
@keyframes luEmblem{0%{transform:scale(0) rotate(-180deg);opacity:0}100%{transform:scale(1) rotate(0);opacity:1}}
@keyframes luPulse{0%,100%{box-shadow:0 0 40px var(--lu-rc)}50%{box-shadow:0 0 80px var(--lu-rc)}}
@keyframes luSlide{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:none}}
@media(prefers-reduced-motion:reduce){.lu-ov *,.lu-ov *::before{animation-duration:.01ms!important;animation-delay:0s!important;animation-iteration-count:1!important;}.lu-rays{display:none;}}
`;

  let styled = false, queue = [], playing = false;
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fr = n => Number(n).toLocaleString('fr-FR');

  function injectCSS() {
    if (styled) return; styled = true;
    const s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
  }
  function storeKey(pseudo) { return 'dha_' + (pseudo || 'guest') + '_progress'; }
  function readStore(pseudo) { try { return JSON.parse(localStorage.getItem(storeKey(pseudo)) || 'null'); } catch (e) { return null; } }
  function writeStore(pseudo, v) { try { localStorage.setItem(storeKey(pseudo), JSON.stringify(v)); } catch (e) {} }

  /* ---------- particules ---------- */
  function particles(cv, colors, big) {
    const ctx = cv.getContext('2d'); let parts = [], raf = null, alive = true;
    const d = window.devicePixelRatio || 1;
    function size() { cv.width = innerWidth * d; cv.height = innerHeight * d; }
    size(); addEventListener('resize', size);
    function burst(n, delay) {
      setTimeout(() => {
        if (!alive) return;
        for (let i = 0; i < n; i++) {
          const a = Math.random() * Math.PI * 2, sp = (4 + Math.random() * 14) * d;
          parts.push({ x: cv.width / 2, y: cv.height / 2, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 3 * d, g: .18 * d, life: 1, decay: .006 + Math.random() * .012, s: (2 + Math.random() * 5) * d, c: colors[i % colors.length], rot: Math.random() * 6, vr: (Math.random() - .5) * .3, sq: Math.random() < .5 });
        }
        if (!raf) loop();
      }, delay);
    }
    function rain(ms) {
      const end = performance.now() + ms;
      (function drip() {
        if (!alive || performance.now() > end) return;
        for (let i = 0; i < 3; i++) parts.push({ x: Math.random() * cv.width, y: -10 * d, vx: (Math.random() - .5) * 2 * d, vy: (2 + Math.random() * 3) * d, g: .05 * d, life: 1, decay: .004, s: (2 + Math.random() * 4) * d, c: colors[Math.floor(Math.random() * colors.length)], rot: Math.random() * 6, vr: (Math.random() - .5) * .2, sq: true });
        if (!raf) loop();
        setTimeout(drip, 60);
      })();
    }
    function loop() {
      ctx.clearRect(0, 0, cv.width, cv.height);
      parts = parts.filter(p => p.life > 0 && p.y < cv.height + 40);
      for (const p of parts) {
        p.vx *= .985; p.vy = p.vy * .985 + p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= p.decay;
        ctx.save(); ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = p.c; ctx.shadowColor = p.c; ctx.shadowBlur = 12;
        ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        if (p.sq) ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); else { ctx.beginPath(); ctx.arc(0, 0, p.s / 2, 0, 7); ctx.fill(); }
        ctx.restore();
      }
      raf = parts.length && alive ? requestAnimationFrame(loop) : null;
    }
    if (!reduce) {
      burst(big ? 260 : 160, 300);
      burst(big ? 140 : 70, 1350);
      if (big) rain(4500);
    }
    return () => { alive = false; removeEventListener('resize', size); if (raf) cancelAnimationFrame(raf); };
  }

  /* ---------- scènes ---------- */
  function sceneLevel(e) {
    let next = '';
    if (e.nextRang) next = `<div class="lu-rewards"><div class="lu-rw" style="animation-delay:1.8s"><i>${e.nextRang.icon}</i><div><b>PROCHAIN RANG</b><p>Plus que ${fr(e.nextRang.min - e.xp)} XP avant le rang ${e.nextRang.name.charAt(0) + e.nextRang.name.slice(1).toLowerCase()}</p></div></div></div>`;
    return {
      accent: '#00D4FF', rc: null, big: false,
      colors: ['#00D4FF', '#1E64FF', '#E8F4FF', '#00FF88'],
      html: `<div class="lu-kicker">NOUVEAU PALIER ATTEINT</div>
        <h2 class="lu-big">LEVEL UP</h2>
        <div class="lu-lvl"><span class="lu-old">${e.from}</span><span class="lu-arrow">➜</span><span class="lu-new">${e.to}<small>NIVEAU</small></span></div>
        ${next}
        <button class="lu-go" style="animation-delay:2.2s" data-lu-close>CONTINUER 👊</button>`
    };
  }
  function sceneRang(e) {
    const r = e.rang, av = e.avantages || [];
    let rw = `<div class="lu-rw" style="animation-delay:1.7s"><i>🏅</i><div><b>BADGE ${r.name}</b><p>Le badge ${r.icon} s'affiche maintenant sur ton profil</p></div></div>`;
    av.forEach((a, i) => {
      rw += `<div class="lu-rw lu-gold" style="animation-delay:${2 + i * .3}s"><i>${a.icon}</i><div><b>AVANTAGE DÉBLOQUÉ</b><p>${a.titre}</p></div></div>`;
    });
    const btnDelay = 2.3 + av.length * .3;
    const cta = av.length && typeof window.showAvantages === 'function'
      ? `<button class="lu-go" style="animation-delay:${btnDelay}s" data-lu-close data-lu-avantages>VOIR MES AVANTAGES 🎁</button>`
      : `<button class="lu-go" style="animation-delay:${btnDelay}s" data-lu-close>CONTINUER 👊</button>`;
    return {
      accent: '#FFD700', rc: r.color, big: true,
      colors: ['#FFD700', r.color, '#00D4FF', '#E8F4FF', '#FFB000'],
      html: `<div class="lu-kicker" style="animation-delay:.6s">NOUVEAU RANG DÉBLOQUÉ</div>
        <div class="lu-emblem" style="--lu-rc:${r.color}"><span>${r.icon}</span></div>
        <h2 class="lu-rname" style="text-shadow:0 0 20px ${r.color},0 0 60px ${r.color}">${r.name}</h2>
        <div class="lu-rewards">${rw}</div>
        ${cta}`
    };
  }

  function playNext() {
    if (playing || !queue.length) return;
    playing = true; injectCSS();
    const ev = queue.shift();
    const sc = ev.type === 'rang' ? sceneRang(ev) : sceneLevel(ev);
    const ov = document.createElement('div');
    ov.className = 'lu-ov'; ov.style.setProperty('--lu-accent', sc.accent);
    ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true');
    ov.innerHTML = `<div class="lu-bg"></div><div class="lu-rays"></div><canvas class="lu-cv"></canvas>
      <div class="lu-ring lu-r1"></div><div class="lu-ring lu-r2"></div><div class="lu-ring lu-r3"></div>
      <div class="lu-flash"></div><div class="lu-stage">${sc.html}</div>`;
    document.body.appendChild(ov);
    const stop = particles(ov.querySelector('.lu-cv'), sc.colors, sc.big);
    const t = setTimeout(() => { const b = ov.querySelector('[data-lu-close]'); b && b.focus({ preventScroll: true }); }, 2600);
    function close(openAv) {
      clearTimeout(t); stop(); ov.remove(); document.removeEventListener('keydown', onKey);
      playing = false;
      if (openAv && typeof window.showAvantages === 'function') window.showAvantages();
      else setTimeout(playNext, 250);
    }
    function onKey(e) { if (e.key === 'Escape') close(false); }
    document.addEventListener('keydown', onKey);
    ov.addEventListener('click', e => {
      const b = e.target.closest('[data-lu-close]');
      if (b) close(b.hasAttribute('data-lu-avantages'));
    });
  }

  window.DHALevelUp = {
    /* opts: {pseudo, xp, level, rang:{name,...}, rangs:[...], avantages:[...]} */
    check(opts) {
      if (!opts || opts.level == null || !opts.rang) return;
      const prev = readStore(opts.pseudo);
      writeStore(opts.pseudo, { level: opts.level, rang: opts.rang.name });
      if (!prev) return; // 1re visite : on mémorise sans animer
      const rangs = opts.rangs || [];
      const idx = n => rangs.findIndex(r => r.name === n);
      const nextRang = rangs[idx(opts.rang.name) + 1] || null;
      if (opts.level > prev.level) {
        queue.push({ type: 'level', from: prev.level, to: opts.level, xp: opts.xp || 0, nextRang });
      }
      if (idx(opts.rang.name) > idx(prev.rang)) {
        const av = (opts.avantages || []).filter(a => a.rangMin === opts.rang.name);
        queue.push({ type: 'rang', rang: opts.rang, avantages: av });
      }
      playNext();
    },
    /* pour tester depuis la console : DHALevelUp.demo('level') ou DHALevelUp.demo('rang') */
    demo(type) {
      const r = { name: 'HUSTLER', icon: '⚡', color: '#1E64FF', min: 5000 };
      queue.push(type === 'rang'
        ? { type: 'rang', rang: r, avantages: [{ icon: '✈️', titre: 'Vols Business & First jusqu\'à -70%' }] }
        : { type: 'level', from: 9, to: 10, xp: 2340, nextRang: r });
      playNext();
    }
  };
})();
