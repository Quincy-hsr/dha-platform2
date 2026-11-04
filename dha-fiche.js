/* =========================================================
   DHA — Fiche joueur
   Carte de joueur qui s'ouvre au clic sur un membre (leaderboard, dashboard).
   DHAFiche.open(pseudo)      : ouvre la carte dans une fenêtre
   DHAFiche.render(data, el)  : dessine une carte (aperçu sur « Ma fiche »)
   Données : RPC dha_fiche (calculées par la plateforme + personnalisées par le membre).
   Jamais affiché : forfait, solde, gains en euros non vérifiés.
   ========================================================= */
(function () {
  if (window.DHAFiche) return;

  var RANGS = [
    { min: 0, name: 'NEW HUSTLER', icon: '🎮', k: 'new', r: '#C8CDD8', r2: '#7D8597', ban: ['#141a28', '#3a4256', '#8a93a8'] },
    { min: 5000, name: 'HUSTLER', icon: '⚡', k: 'hus', r: '#3D85FF', r2: '#0b3db3', ban: ['#06123a', '#0b3db3', '#3D85FF'] },
    { min: 15500, name: 'PRO HUSTLER', icon: '🚀', k: 'pro', r: '#00D4FF', r2: '#1E64FF', ban: ['#0b1d4f', '#1E64FF', '#00D4FF'] },
    { min: 30000, name: 'AMBASSADEUR', icon: '👑', k: 'amb', r: '#FFD700', r2: '#FF9F00', ban: ['#2b1d00', '#c78a00', '#FFD700'] },
    { min: 60000, name: 'LEGEND', icon: '💎', k: 'leg', r: '#C77DFF', r2: '#7B2CBF', ban: ['#1a0b3d', '#7B2CBF', '#C77DFF'] }
  ];
  var TITRES = { debutant: 'Le Débutant motivé', regulier: 'Le Régulier', discipline: 'Le Discipliné', studieux: 'Le Studieux', diplome: 'Le Diplômé', funded: 'Le Funded', imperturbable: "L'Imperturbable", aguerri: 'Le Mindset aguerri' };
  var TITRES_COND = { debutant: 'Dès ton arrivée', regulier: 'Série de 30 jours', discipline: '50 quêtes du jour', studieux: '9 modules terminés', diplome: 'Les 17 modules terminés', funded: 'Un challenge prop firm vérifié', imperturbable: 'Rang LEGEND', aguerri: 'Prise de conscience terminée' };
  var STYLES = { scalper: 'Scalper', day: 'Day trader', swing: 'Swing' };
  var SESSIONS = { asie: 'Session Asie', londres: 'Session Londres', ny: 'Session New York' };
  var FX = [
    { k: 'neon', e: '💡', n: 'Cadre néon', c: 'Rang HUSTLER (5 000 XP)' },
    { k: 'banniere', e: '🌈', n: 'Bannière animée', c: 'Série de 30 jours' },
    { k: 'particules', e: '✨', n: 'Particules', c: 'Rang PRO HUSTLER (15 500 XP)' },
    { k: 'holo', e: '🪩', n: 'Holographique', c: 'Rang AMBASSADEUR (30 000 XP)' },
    { k: 'flammes', e: '🔥', n: 'Flammes', c: 'Série de 100 jours' },
    { k: 'eclairs', e: '⚡', n: 'Éclairs', c: 'Top 3 du mois' },
    { k: 'aura', e: '💎', n: 'Aura LEGEND', c: 'Rang LEGEND (60 000 XP)' }
  ];
  var PERF = {
    propfirm: { ic: '🏆', k: 'PROP FIRM', n: 'Challenge prop firm validé', c: ['#3d2a00', '#a87b00', '#FFD700', 'rgba(255,215,0,0.35)'] },
    payout: { ic: '💸', k: 'PAYOUT', n: 'Payout reçu', c: ['#032b1c', '#00915a', '#00FF88', 'rgba(0,255,136,0.3)'] },
    encours: { ic: '⏳', k: 'EN COURS', n: 'Challenge en cours', c: ['#1a0b3d', '#6a2cb0', '#C77DFF', 'rgba(199,125,255,0.35)'] },
    trade: { ic: '🎯', k: 'MEILLEUR TRADE', n: 'Meilleur trade', c: ['#0b1d4f', '#1E64FF', '#00D4FF', 'rgba(0,212,255,0.35)'] },
    reel: { ic: '📈', k: 'COMPTE RÉEL', n: 'Compte réel', c: ['#3d0b14', '#a3203d', '#FF6B81', 'rgba(255,68,102,0.3)'] }
  };

  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function rangOf(xp) { var r = RANGS[0]; RANGS.forEach(function (x) { if ((xp || 0) >= x.min) r = x; }); return r; }
  function levelOf(xp) { xp = Number(xp) || 0; var l = 1; while (l < 100) { var n = l; if (xp < n * 200 + 15 * n * (n - 1) / 2) break; l++; } return l; }
  function fmt(n) { return Number(n || 0).toLocaleString('fr-FR'); }
  function initials(p) { p = String(p || '?').replace(/^@/, ''); return p.slice(0, 2).toUpperCase(); }
  function waLink(n) { var d = String(n || '').replace(/[^0-9+]/g, ''); if (/^0[67]/.test(d)) d = '33' + d.slice(1); return 'https://wa.me/' + d.replace(/^\+/, ''); }

  /* ---------- styles ---------- */
  var css = '' +
    '.fj-ov{position:fixed;inset:0;z-index:9400;background:rgba(2,5,14,0.84);display:none;align-items:flex-start;justify-content:center;overflow-y:auto;padding:66px 12px 40px;-webkit-overflow-scrolling:touch}' +
    '.fj-ov.on{display:flex}' +
    '.fj-x{position:fixed;top:14px;right:14px;z-index:9410;width:42px;height:42px;border-radius:50%;border:1px solid rgba(255,255,255,0.15);background:rgba(16,28,62,0.95);color:#fff;font-size:16px;cursor:pointer}' +
    '.fj-scene{width:100%;max-width:430px;perspective:1400px;animation:fjpop .5s cubic-bezier(.2,1.3,.4,1) both;font-family:Manrope,system-ui,sans-serif;color:#F2F6FF;text-align:left}' +
    '@keyframes fjpop{from{opacity:0;transform:translateY(30px) scale(.92) rotateX(12deg)}to{opacity:1;transform:none}}' +
    '.fj-load{text-align:center;padding:60px 0;color:#A9B8D6;font-family:Sora,sans-serif;letter-spacing:2px;font-size:13px}' +
    '.fj-pc{--r:#FFD700;--r2:#FF9F00;--rg:rgba(255,215,0,0.35);position:relative;border-radius:28px;padding:2px;background:linear-gradient(150deg,var(--r),rgba(255,255,255,0.08) 40%,rgba(255,255,255,0.05) 60%,var(--r2));box-shadow:0 0 50px var(--rg),0 30px 70px rgba(0,0,0,0.6);transform-style:preserve-3d;transition:transform .15s ease-out}' +
    '.fj-pc.leg{background:linear-gradient(120deg,#7B2CBF,#C77DFF,#00D4FF,#FFD700,#C77DFF,#7B2CBF);background-size:300% 300%;animation:fjlegb 5s linear infinite,fjlegg 2.6s ease-in-out infinite}' +
    '@keyframes fjlegb{to{background-position:300% 50%}}@keyframes fjlegg{50%{box-shadow:0 0 85px rgba(199,125,255,0.75),0 0 30px rgba(0,212,255,0.35),0 30px 70px rgba(0,0,0,0.6)}}' +
    '.fj-in{border-radius:26px;overflow:hidden;background:linear-gradient(180deg,#0c1634,#070d20);position:relative}' +
    '.fj-holo{position:absolute;inset:0;pointer-events:none;border-radius:26px;background:radial-gradient(circle at var(--hx,50%) var(--hy,20%),rgba(255,255,255,0.14),transparent 40%);mix-blend-mode:screen;z-index:5}' +
    '.fj-ban{height:118px;position:relative;overflow:hidden}.fj-ban svg{position:absolute;inset:0;width:100%;height:100%}' +
    '.fj-ban:after{content:"";position:absolute;top:0;bottom:0;width:40%;left:-50%;background:linear-gradient(100deg,transparent,rgba(255,255,255,0.3),transparent);animation:fjshine 4s ease-in-out infinite}' +
    '@keyframes fjshine{0%{left:-50%}55%,100%{left:120%}}' +
    '.fj-tag{position:absolute;top:12px;padding:6px 11px;border-radius:999px;background:rgba(5,9,20,0.72);font-family:Sora,sans-serif;font-size:11px;font-weight:800;letter-spacing:1.3px;z-index:2}' +
    '.fj-rar{left:12px;border:1px solid var(--r);color:var(--r)}.fj-pos{right:12px;border:1px solid rgba(255,255,255,0.15);color:#fff}' +
    '.fj-id{display:flex;align-items:flex-end;gap:14px;padding:0 18px;margin-top:-40px;position:relative;z-index:6}' +
    '.fj-av{width:96px;height:96px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:Sora,sans-serif;font-weight:800;font-size:31px;color:#fff;flex-shrink:0;position:relative;border:3px solid var(--r);box-shadow:0 0 28px var(--rg);background:linear-gradient(135deg,var(--r2),var(--r))}' +
    '.fj-av img{width:100%;height:100%;object-fit:cover;border-radius:50%}' +
    '.fj-pc.leg .fj-av{animation:fjlegav 2.6s ease-in-out infinite}@keyframes fjlegav{50%{box-shadow:0 0 42px rgba(199,125,255,0.95),0 0 14px rgba(255,215,0,0.6)}}' +
    '.fj-lvl{position:absolute;bottom:-6px;right:-6px;min-width:36px;height:34px;padding:0 6px;border-radius:11px;background:linear-gradient(135deg,var(--r),var(--r2));color:#120c00;font-family:Sora,sans-serif;font-weight:800;font-size:14px;display:flex;align-items:center;justify-content:center;border:2px solid #070d20}' +
    '.fj-on{position:absolute;top:4px;right:4px;width:16px;height:16px;border-radius:50%;background:#00FF88;border:3px solid #070d20;box-shadow:0 0 10px #00FF88}' +
    '.fj-idt{min-width:0;margin-bottom:-2px}.fj-idt b{display:block;font-family:Sora,sans-serif;font-size:21px;font-weight:800;overflow-wrap:anywhere}' +
    '.fj-titre{display:inline-block;margin-top:3px;font-size:12px;font-weight:800;color:var(--r)}' +
    '.fj-body{padding:14px 18px 18px;position:relative;z-index:6}' +
    '.fj-meta{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:12px;color:#A9B8D6;margin-bottom:12px}.fj-meta b{color:#fff}' +
    '.fj-bio{font-size:14px;line-height:1.5;color:#D5DEF2;font-style:italic;border-left:3px solid var(--r);padding:2px 0 2px 12px;margin:0 0 14px}' +
    '.fj-bio.vide{color:#7d8aa8}' +
    '.fj-fxb{display:flex;gap:6px;flex-wrap:wrap;margin:-4px 0 12px}.fj-fxb span{font-size:11px;font-weight:700;padding:4px 9px;border-radius:99px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:#A9B8D6}' +
    '.fj-st{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:16px}' +
    '.fj-st div{text-align:center;padding:10px 4px;border-radius:12px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.12)}' +
    '.fj-st b{display:block;font-family:Sora,sans-serif;font-size:17px}.fj-st small{font-size:10px;letter-spacing:1px;color:#A9B8D6}' +
    '.fj-sec{display:flex;justify-content:space-between;align-items:center;font-family:Sora,sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;color:#A9B8D6;margin:0 0 10px}' +
    '.fj-sec span{letter-spacing:0;font-family:Manrope,sans-serif;font-weight:600;font-size:11px}' +
    '.fj-ovr{display:inline-flex;padding:4px 10px;border-radius:999px;background:linear-gradient(135deg,var(--r),var(--r2));color:#120c00!important;font-family:Sora,sans-serif!important;font-weight:800!important;font-size:12px!important;letter-spacing:0}' +
    '.fj-radar{display:grid;grid-template-columns:140px 1fr;gap:12px;align-items:center;margin-bottom:16px}.fj-radar svg{width:140px;height:140px;overflow:visible}' +
    '.fj-rp{transform-origin:70px 70px;animation:fjgrow 1s cubic-bezier(.2,1.2,.4,1) both .2s}@keyframes fjgrow{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}' +
    '.fj-attrs{display:grid;gap:6px}.fj-at{display:grid;grid-template-columns:1fr auto;gap:6px;font-size:12.5px;align-items:center}.fj-at b{font-family:Sora,sans-serif}' +
    '.fj-at i{grid-column:1/-1;height:5px;border-radius:9px;background:rgba(255,255,255,0.08);overflow:hidden;position:relative;margin-top:-2px}' +
    '.fj-at i:after{content:"";position:absolute;inset:0;width:var(--v);border-radius:9px;background:linear-gradient(90deg,#1E64FF,#00D4FF);animation:fjbar 1.1s ease-out both .3s;transform-origin:left}' +
    '.fj-pc.leg .fj-at i:after{background:linear-gradient(90deg,#7B2CBF,#C77DFF,#00D4FF)}@keyframes fjbar{from{transform:scaleX(0)}}' +
    '.fj-mind{position:relative;display:flex;align-items:center;gap:11px;margin:0 0 14px;padding:10px 13px;border-radius:14px;background:linear-gradient(120deg,rgba(157,78,221,0.22),rgba(0,212,255,0.12));border:1px solid rgba(199,125,255,0.55);box-shadow:0 0 18px rgba(157,78,221,0.28);overflow:hidden}' +
    '.fj-mind:after{content:"";position:absolute;inset:0;background:linear-gradient(100deg,transparent 30%,rgba(255,255,255,0.18) 50%,transparent 70%);transform:translateX(-100%);animation:fjMind 3.2s ease-in-out infinite}' +
    '.fj-mind i{font-style:normal;font-size:24px;filter:drop-shadow(0 0 8px rgba(199,125,255,0.9))}.fj-mind b{display:block;font-family:Sora,sans-serif;font-size:12.5px;font-weight:900;letter-spacing:1.6px;color:#E4C6FF}.fj-mind small{display:block;font-size:11.5px;color:rgba(232,244,255,0.7)}' +
    '@keyframes fjMind{0%,40%{transform:translateX(-100%)}100%{transform:translateX(100%)}}' +
    '.fj-chips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px}.fj-chip{padding:6px 10px;border-radius:999px;font-size:12px;font-weight:700;background:rgba(30,100,255,0.14);border:1px solid rgba(0,212,255,0.3)}' +
    '.fj-chip.g{background:rgba(255,215,0,0.1);border-color:rgba(255,215,0,0.4);color:#FFE680}' +
    '.fj-perfs{display:flex;gap:12px;overflow-x:auto;padding:4px 2px 12px;margin:0 -4px 6px;scroll-snap-type:x mandatory}' +
    '.fj-pf{flex:0 0 150px;height:206px;perspective:900px;scroll-snap-align:start;border:none;background:none;padding:0;text-align:left;cursor:pointer;color:#fff;font-family:inherit;animation:fjdeal .6s cubic-bezier(.2,1.2,.4,1) both}' +
    '.fj-pf:nth-child(2){animation-delay:.08s}.fj-pf:nth-child(3){animation-delay:.16s}.fj-pf:nth-child(4){animation-delay:.24s}' +
    '@keyframes fjdeal{from{opacity:0;transform:translateY(24px) rotate(-6deg)}to{opacity:1;transform:none}}' +
    '.fj-pfi{position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform .6s cubic-bezier(.3,1.3,.5,1)}.fj-pf.flip .fj-pfi{transform:rotateY(180deg)}' +
    '.fj-pff,.fj-pfb{position:absolute;inset:0;border-radius:16px;backface-visibility:hidden;-webkit-backface-visibility:hidden;overflow:hidden;padding:12px;display:flex;flex-direction:column}' +
    '.fj-pff{background:linear-gradient(160deg,var(--c1),var(--c2));border:1.5px solid var(--c3);box-shadow:0 0 22px var(--cg)}' +
    '.fj-pff:before{content:"";position:absolute;inset:0;background:linear-gradient(115deg,transparent 20%,rgba(255,255,255,0.35) 40%,transparent 55%);background-size:250% 100%;animation:fjholo 3.5s ease-in-out infinite;mix-blend-mode:overlay}' +
    '@keyframes fjholo{0%{background-position:150% 0}100%{background-position:-100% 0}}' +
    '.fj-pfb{transform:rotateY(180deg);background:#0b1430;border:1.5px solid var(--c3);font-size:12px;line-height:1.45;color:#A9B8D6;gap:6px}.fj-pfb b{color:#fff;font-family:Sora,sans-serif;font-size:12px}' +
    '.fj-pk{font-family:Sora,sans-serif;font-size:9px;font-weight:800;letter-spacing:1.5px;opacity:.85;position:relative}' +
    '.fj-pic{font-size:30px;margin:10px 0 4px;position:relative}.fj-pv{font-family:Sora,sans-serif;font-size:22px;font-weight:800;line-height:1.05;position:relative;overflow-wrap:anywhere}' +
    '.fj-ps{font-size:12px;font-weight:600;opacity:.9;margin-top:4px;position:relative}' +
    '.fj-ok{margin-top:auto;display:inline-flex;align-items:center;gap:5px;font-size:10px;font-weight:800;padding:4px 8px;border-radius:99px;background:rgba(0,0,0,0.35);width:max-content;position:relative}' +
    '.fj-ok.v{color:#00FF88}.fj-ok.d{color:#FFE680}.fj-ok.a{color:#9fd8ff}.fj-ok.r{color:#ff8aa0}' +
    '.fj-prog{height:6px;border-radius:9px;background:rgba(0,0,0,0.3);overflow:hidden;margin-top:8px;position:relative}.fj-prog i{display:block;height:100%;width:var(--v);background:#fff;border-radius:9px}' +
    '.fj-disc{font-size:11px;color:#A9B8D6;line-height:1.4;margin:0 0 14px}.fj-vide{padding:14px;border:1px dashed rgba(255,255,255,0.15);border-radius:14px;text-align:center;font-size:12px;color:#A9B8D6;margin-bottom:14px}' +
    '.fj-acts{display:grid;grid-template-columns:1fr 1fr;gap:8px}' +
    '.fj-ab{display:flex;align-items:center;justify-content:center;gap:8px;padding:13px 10px;border-radius:14px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.05);font-family:Sora,sans-serif;font-weight:700;font-size:13px;text-decoration:none;color:#fff;position:relative;cursor:pointer}' +
    '.fj-ab.full{grid-column:1/-1}.fj-ab.wa{background:linear-gradient(135deg,#128C7E,#25D366);border:none;color:#04140c}' +
    '.fj-ab.story{background:linear-gradient(135deg,#f9ce34,#ee2a7b 50%,#6228d7);border:none;color:#fff}' +
    '.fj-ab.edit{background:linear-gradient(135deg,#1E64FF,#00D4FF);border:none;color:#020610}' +
    '.fj-ab.gg.on{border-color:#FFD700;color:#FFD700;background:rgba(255,215,0,0.1)}' +
    '.fj-ab:focus-visible,.fj-pf:focus-visible,.fj-x:focus-visible{outline:3px solid #FFD700;outline-offset:2px}' +
    '.fj-burst{position:absolute;pointer-events:none;font-size:18px;animation:fjup .9s ease-out forwards}@keyframes fjup{to{transform:translate(var(--dx),-70px) scale(1.4);opacity:0}}' +
    '.fj-foot{display:flex;justify-content:space-between;gap:10px;margin-top:12px;font-size:12px;color:#A9B8D6}.fj-foot a{color:#fff;text-decoration:none;font-weight:700}' +
    '.fj-vs{display:none;margin-top:12px;border-radius:16px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.04);padding:12px}.fj-vs.on{display:block;animation:fjpop .4s both}' +
    '.fj-vsr{display:grid;grid-template-columns:30px 1fr 92px 1fr 30px;gap:6px;align-items:center;font-size:12px;margin:6px 0}' +
    '.fj-vsr .l,.fj-vsr .rr{height:6px;border-radius:9px;background:rgba(255,255,255,0.08);position:relative;overflow:hidden}' +
    '.fj-vsr .l i{position:absolute;right:0;top:0;bottom:0;width:var(--v);background:#00D4FF;border-radius:9px}.fj-vsr .rr i{position:absolute;left:0;top:0;bottom:0;width:var(--v);background:var(--r);border-radius:9px}' +
    '.fj-vsr span{text-align:center;color:#A9B8D6}.fj-vsr b{font-family:Sora,sans-serif;text-align:center}' +
    /* effets */
    '.fj-fxl{position:absolute;inset:0;pointer-events:none;overflow:hidden;border-radius:26px;z-index:4}' +
    '.fx-neon{animation:fjneon 2s ease-in-out infinite}@keyframes fjneon{50%{box-shadow:0 0 70px var(--rg),0 0 24px var(--r),0 30px 70px rgba(0,0,0,0.6)}}' +
    '.fj-ptc{position:absolute;bottom:-10px;width:5px;height:5px;border-radius:50%;background:var(--r);box-shadow:0 0 8px var(--r);opacity:0;animation:fjrise linear infinite}' +
    '@keyframes fjrise{0%{transform:translateY(0);opacity:0}15%{opacity:1}100%{transform:translateY(-640px) translateX(var(--dx));opacity:0}}' +
    '.fx-holo .fj-holo{background:radial-gradient(circle at var(--hx,50%) var(--hy,20%),rgba(255,255,255,0.22),transparent 45%),linear-gradient(115deg,rgba(255,0,128,0.12),rgba(255,215,0,0.12),rgba(0,255,136,0.12),rgba(0,212,255,0.14),rgba(199,125,255,0.14));background-size:100% 100%,300% 300%;animation:fjhol 6s linear infinite}' +
    '@keyframes fjhol{to{background-position:0 0,300% 0}}' +
    '.fx-banniere .fj-ban svg{animation:fjhue 6s linear infinite}@keyframes fjhue{to{filter:hue-rotate(360deg)}}' +
    '.fj-flm{position:absolute;left:0;right:0;bottom:0;height:120px;background:radial-gradient(ellipse 30% 90% at 20% 100%,rgba(255,120,0,0.55),transparent 70%),radial-gradient(ellipse 30% 100% at 50% 100%,rgba(255,60,0,0.5),transparent 70%),radial-gradient(ellipse 30% 90% at 80% 100%,rgba(255,170,0,0.5),transparent 70%);filter:blur(6px);animation:fjflame 1.2s ease-in-out infinite alternate;transform-origin:bottom}' +
    '@keyframes fjflame{to{transform:scaleY(1.25) scaleX(1.05);opacity:.75}}' +
    '.fj-zap{position:absolute;inset:0;border-radius:26px;box-shadow:inset 0 0 0 2px #fff,inset 0 0 40px rgba(0,212,255,0.8);opacity:0;animation:fjzap 3.2s infinite}' +
    '@keyframes fjzap{0%,86%,100%{opacity:0}88%{opacity:1}90%{opacity:.2}92%{opacity:.9}95%{opacity:0}}' +
    /* story */
    '.fj-sov{position:fixed;inset:0;z-index:9500;background:rgba(2,5,14,0.92);display:none;align-items:center;justify-content:center;padding:20px;flex-direction:column;gap:14px}.fj-sov.on{display:flex}' +
    '.fj-sov img{max-height:70vh;max-width:90vw;border-radius:18px;box-shadow:0 20px 60px rgba(0,0,0,0.6);animation:fjpop .5s both}' +
    '.fj-sov .row{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}.fj-sov .fj-ab{min-width:150px}' +
    '.fj-sov p{color:#A9B8D6;font-size:13px;text-align:center;max-width:360px;font-family:Manrope,sans-serif}' +
    '@media (prefers-reduced-motion:reduce){.fj-scene *,.fj-scene *:before,.fj-scene *:after,.fj-scene{animation:none!important;transition:none!important}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ---------- dessin de la carte ---------- */
  var GID = 0;
  function ban(c) {
    var id = 'fjg' + (++GID);
    return '<svg viewBox="0 0 430 118" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c[0] + '"/><stop offset=".6" stop-color="' + c[1] + '"/><stop offset="1" stop-color="' + c[2] + '"/></linearGradient></defs><rect width="430" height="118" fill="url(#' + id + ')"/><g stroke="rgba(255,255,255,0.10)"><line x1="0" y1="20" x2="430" y2="20"/><line x1="0" y1="50" x2="430" y2="50"/><line x1="0" y1="80" x2="430" y2="80"/></g><polyline fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="2.5" points="0,96 40,88 70,92 100,70 130,76 165,52 195,60 230,38 260,46 300,26 335,34 370,14 430,20"/></svg>';
  }
  function radar(at) {
    var cx = 70, cy = 70, R = 56, n = at.length;
    function pt(i, v) { var a = -Math.PI / 2 + i * 2 * Math.PI / n; return [cx + Math.cos(a) * R * v, cy + Math.sin(a) * R * v]; }
    var g = '';
    [1, .66, .33].forEach(function (s) { g += '<polygon points="' + at.map(function (_, i) { return pt(i, s).join(','); }).join(' ') + '" fill="none" stroke="rgba(255,255,255,0.12)"/>'; });
    at.forEach(function (_, i) { var p = pt(i, 1); g += '<line x1="70" y1="70" x2="' + p[0] + '" y2="' + p[1] + '" stroke="rgba(255,255,255,0.08)"/>'; });
    g += '<polygon class="fj-rp" points="' + at.map(function (a, i) { return pt(i, Math.max(0.04, a[1] / 100)).join(','); }).join(' ') + '" fill="rgba(0,212,255,0.25)" stroke="#00D4FF" stroke-width="2"/>';
    return '<svg viewBox="0 0 140 140" aria-hidden="true">' + g + '</svg>';
  }
  function fxLayer(fx) {
    var h = '';
    if (fx.indexOf('particules') > -1) for (var i = 0; i < 14; i++) h += '<span class="fj-ptc" style="left:' + (5 + i * 6.6) + '%;animation-duration:' + (4 + (i % 5)) + 's;animation-delay:' + (i * 0.37) + 's;--dx:' + ((i % 2 ? 1 : -1) * (10 + i * 2)) + 'px"></span>';
    if (fx.indexOf('flammes') > -1) h += '<span class="fj-flm"></span>';
    if (fx.indexOf('eclairs') > -1) h += '<span class="fj-zap"></span>';
    return '<div class="fj-fxl">' + h + '</div>';
  }
  function perfHtml(p) {
    var t = PERF[p.type] || PERF.trade, c = t.c;
    var ok = p.statut === 'verifie' ? ['v', '✔ VÉRIFIÉ'] : p.statut === 'attente' ? ['a', '⏳ EN VÉRIFICATION'] : p.statut === 'refuse' ? ['r', '✕ REFUSÉ'] : ['d', '• DÉCLARÉ'];
    var sous = [p.firm, p.date_perf].filter(Boolean).join(' · ') || t.n;
    return '<button type="button" class="fj-pf" style="--c1:' + c[0] + ';--c2:' + c[1] + ';--c3:' + c[2] + ';--cg:' + c[3] + '" aria-label="Retourner la carte ' + esc(t.k) + '"><div class="fj-pfi">' +
      '<div class="fj-pff"><span class="fj-pk">' + t.k + '</span><span class="fj-pic">' + t.ic + '</span><span class="fj-pv">' + esc(p.valeur || '—') + '</span><span class="fj-ps">' + esc(sous) + '</span>' +
      (p.type === 'encours' && p.prog != null ? '<span class="fj-prog"><i style="--v:' + Number(p.prog) + '%"></i></span>' : '') +
      '<span class="fj-ok ' + ok[0] + '">' + ok[1] + '</span></div>' +
      '<div class="fj-pfb"><b>' + esc(t.n) + (p.valeur ? ' · ' + esc(p.valeur) : '') + '</b>' + esc(p.detail || 'Pas de détail.') +
      (p.statut === 'verifie' ? '<span style="color:#00FF88">Preuve vérifiée par Quincy.</span>' : '') + '<span style="margin-top:auto;font-size:11px">Appuie pour retourner</span></div></div></button>';
  }
  function entreeTxt(d) { if (!d) return null; var x = new Date(d); if (isNaN(x)) return null; return x.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }); }
  function jours(d) { var x = new Date(d); if (isNaN(x)) return 0; return Math.max(0, Math.floor((Date.now() - x.getTime()) / 864e5)); }

  function cardHtml(d, opt) {
    opt = opt || {};
    var r = rangOf(d.xp), f = d.fiche || {}, fx = (f.effets || []).slice(0, 3), at = d.attributs || [];
    var cls = 'fj-pc ' + (fx.indexOf('aura') > -1 ? 'leg ' : '') + fx.filter(function (k) { return k !== 'aura'; }).map(function (k) { return 'fx-' + k; }).join(' ');
    var style = '--r:' + r.r + ';--r2:' + r.r2 + ';--rg:' + (r.k === 'leg' ? 'rgba(157,78,221,0.45)' : r.k === 'amb' ? 'rgba(255,215,0,0.35)' : r.k === 'pro' ? 'rgba(0,212,255,0.35)' : r.k === 'hus' ? 'rgba(61,133,255,0.35)' : 'rgba(200,205,216,0.18)');
    var ovr = at.length ? Math.round(at.reduce(function (t, a) { return t + Number(a[1] || 0); }, 0) / at.length) : 0;
    var lvl = levelOf(d.xp), ent = entreeTxt(d.entree);
    var chips = [];
    if (f.style && STYLES[f.style]) chips.push('<span class="fj-chip">' + STYLES[f.style] + '</span>');
    if (f.session && SESSIONS[f.session]) chips.push('<span class="fj-chip">' + SESSIONS[f.session] + '</span>');
    (f.actifs || []).forEach(function (a) { chips.push('<span class="fj-chip g">' + esc(a) + '</span>'); });
    var perfs = (d.perfs || []).filter(function (p) { return opt.mesPerfs || p.statut !== 'refuse'; });
    var h = '<div class="' + cls + '" style="' + style + '"><div class="fj-in"><div class="fj-holo"></div>' + fxLayer(fx) +
      '<div class="fj-ban">' + ban(r.ban) + '<span class="fj-tag fj-rar">' + r.icon + ' ' + r.name + '</span>' + (d.pos ? '<span class="fj-tag fj-pos">#' + d.pos + ' au classement</span>' : '') + '</div>' +
      '<div class="fj-id"><span class="fj-av">' + (d.avatar && /^data:image\//.test(d.avatar) ? '<img src="' + d.avatar + '" alt="">' : esc(initials(d.pseudo))) + '<span class="fj-lvl">' + lvl + '</span>' + (d.actif_auj ? '<span class="fj-on" title="Actif aujourd\'hui"></span>' : '') + '</span>' +
      '<div class="fj-idt"><b>@' + esc(String(d.pseudo || '').replace(/^@/, '')) + '</b><span class="fj-titre">« ' + esc(TITRES[f.titre] || TITRES.debutant) + ' »</span></div></div>' +
      '<div class="fj-body"><div class="fj-meta">' + (ent ? '<span>📅 Entré le <b>' + ent + '</b></span><span>⏱ <b>' + jours(d.entree) + '</b> jours dans la DHA</span>' : '') + '</div>' +
      '<p class="fj-bio' + (f.bio ? '' : ' vide') + '">' + (f.bio ? esc(f.bio) : (d.moi ? 'Ajoute ta bio dans « Modifier ma fiche ».' : 'Pas encore de bio.')) + '</p>' +
      (d.mindset ? '<div class="fj-mind th-keep"><i>🧠</i><div><b>MINDSET AGUERRI</b><small>Prise de conscience terminée</small></div></div>' : '') +
      (fx.length ? '<div class="fj-fxb">' + fx.map(function (k) { var e = FX.filter(function (x) { return x.k === k; })[0]; return e ? '<span>' + e.e + ' ' + e.n + '</span>' : ''; }).join('') + '</div>' : '') +
      '<div class="fj-st"><div><b>' + fmt(d.xp) + '</b><small>XP</small></div><div><b>' + lvl + '</b><small>LEVEL</small></div><div><b>' + (d.modules || 0) + '/17</b><small>MODULES</small></div><div><b>🔥' + (d.serie || 0) + '</b><small>SÉRIE</small></div></div>' +
      (at.length ? '<div class="fj-sec">ATTRIBUTS <span class="fj-ovr">NOTE ' + ovr + '</span></div><div class="fj-radar">' + radar(at) + '<div class="fj-attrs">' + at.map(function (a) { return '<div class="fj-at"><span>' + esc(a[0]) + '</span><b>' + a[1] + '</b><i style="--v:' + a[1] + '%"></i></div>'; }).join('') + '</div></div>' : '') +
      (chips.length ? '<div class="fj-sec">MON STYLE</div><div class="fj-chips">' + chips.join('') + '</div>' : '') +
      (opt.sansPerfs ? '' : '<div class="fj-sec">MES PERFS ' + (perfs.length ? '<span>appuie pour retourner →</span>' : '') + '</div>' +
      (perfs.length ? '<div class="fj-perfs">' + perfs.map(perfHtml).join('') + '</div><p class="fj-disc">Perfs renseignées par le membre. « Vérifié » = preuve contrôlée par Quincy. Les résultats passés ne garantissent pas les résultats futurs.</p>'
        : '<div class="fj-vide">' + (d.moi ? 'Ajoute ta première perf dans « Modifier ma fiche » 💪' : 'Pas encore de perf renseignée.') + '</div>'));
    if (!opt.apercu) {
      h += '<div class="fj-acts"><button type="button" class="fj-ab story full" data-fj="story">📸 Partager ma carte en story</button>';
      if (d.moi) h += '<a class="fj-ab edit full" href="dha-ma-fiche.html">✏️ Modifier ma fiche</a>';
      else {
        if (d.wa) h += '<a class="fj-ab wa full" href="' + waLink(d.wa) + '" target="_blank" rel="noopener">💬 Écrire sur WhatsApp</a>';
        h += '<button type="button" class="fj-ab gg' + (d.gg_moi ? ' on' : '') + '" data-fj="gg" aria-pressed="' + !!d.gg_moi + '">👊 GG <span data-fj-ggn>' + (d.gg || 0) + '</span></button><button type="button" class="fj-ab" data-fj="vs">⚔️ Comparer avec moi</button>';
      }
      h += '</div>';
      if (!d.moi) h += '<div class="fj-vs" data-fj-vs></div>';
      h += '<div class="fj-foot"><span>' + (d.actif_auj ? '🟢 Actif aujourd\'hui' : '') + (d.moi ? ' · 👊 ' + (d.gg || 0) + ' GG reçus' : '') + '</span>' + (f.insta ? '<a href="https://instagram.com/' + encodeURIComponent(f.insta) + '" target="_blank" rel="noopener">Instagram ›</a>' : '') + '</div>';
    }
    h += '</div></div></div>';
    return h;
  }

  function animer(root) {
    var pc = root.querySelector('.fj-pc'); if (!pc) return;
    var holo = pc.querySelector('.fj-holo');
    if (window.matchMedia && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      pc.addEventListener('pointermove', function (e) {
        if (e.pointerType === 'touch' || e.target.closest('.fj-pf')) return;
        var r = pc.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        pc.style.transform = 'rotateY(' + ((px - .5) * 10) + 'deg) rotateX(' + ((.5 - py) * 8) + 'deg)';
        holo.style.setProperty('--hx', (px * 100) + '%'); holo.style.setProperty('--hy', (py * 100) + '%');
      });
      pc.addEventListener('pointerleave', function () { pc.style.transform = ''; });
    }
    root.querySelectorAll('.fj-pf').forEach(function (b) { b.addEventListener('click', function () { b.classList.toggle('flip'); }); });
  }

  /* ---------- fenêtre ---------- */
  var ov, scene, cur = null, moiData = null;
  function build() {
    if (ov) return;
    ov = document.createElement('div'); ov.className = 'fj-ov th-keep'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Fiche joueur');
    ov.innerHTML = '<button type="button" class="fj-x" aria-label="Fermer">✕</button><div class="fj-scene"></div>';
    document.body.appendChild(ov);
    scene = ov.querySelector('.fj-scene');
    ov.querySelector('.fj-x').onclick = fermer;
    ov.addEventListener('click', function (e) { if (e.target === ov) fermer(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { if (sov && sov.classList.contains('on')) sov.classList.remove('on'); else if (ov.classList.contains('on')) fermer(); } });
    ov.addEventListener('click', onAction);
  }
  function fermer() { ov.classList.remove('on'); document.documentElement.style.overflow = ''; }
  async function open(pseudo) {
    build();
    scene.innerHTML = '<div class="fj-load">CHARGEMENT DE LA CARTE…</div>';
    ov.classList.add('on'); ov.scrollTop = 0; document.documentElement.style.overflow = 'hidden';
    ov.querySelector('.fj-x').focus();
    try {
      var t = await DHA.token();
      var d = await DHA.rpc('dha_fiche', { p_token: t, p_pseudo: pseudo });
      if (!d) { scene.innerHTML = '<div class="fj-load">Carte introuvable.</div>'; return; }
      cur = d;
      scene.style.animation = 'none'; void scene.offsetWidth; scene.style.animation = '';
      scene.innerHTML = cardHtml(d);
      animer(scene);
    } catch (e) { scene.innerHTML = '<div class="fj-load">Impossible de charger la carte. Réessaie.</div>'; }
  }
  async function onAction(e) {
    var b = e.target.closest('[data-fj]'); if (!b || !cur) return;
    var a = b.getAttribute('data-fj');
    if (a === 'story') return story(cur);
    if (a === 'gg') {
      b.disabled = true;
      try {
        var r = await DHA.rpc('dha_gg', { p_token: await DHA.token(), p_pseudo: cur.pseudo });
        if (r) {
          cur.gg_moi = r.on; cur.gg = r.n; b.classList.toggle('on', r.on); b.setAttribute('aria-pressed', r.on);
          b.querySelector('[data-fj-ggn]').textContent = r.n;
          if (r.on) for (var k = 0; k < 6; k++) { var s = document.createElement('span'); s.className = 'fj-burst'; s.textContent = ['👊', '🔥', '⭐'][k % 3]; s.style.left = (40 + Math.random() * 30) + '%'; s.style.top = '20%'; s.style.setProperty('--dx', (Math.random() * 80 - 40) + 'px'); s.style.animationDelay = (k * 0.05) + 's'; b.appendChild(s); setTimeout(function (x) { return function () { x.remove(); }; }(s), 1200); }
        }
      } catch (er) {}
      b.disabled = false;
    }
    if (a === 'vs') {
      var box = scene.querySelector('[data-fj-vs]'); if (!box) return;
      if (box.classList.contains('on')) { box.classList.remove('on'); return; }
      if (!moiData) { try { var m = DHA.local() || {}; moiData = await DHA.rpc('dha_fiche', { p_token: await DHA.token(), p_pseudo: m.pseudo }); } catch (er) {} }
      var mine = (moiData && moiData.attributs) || [], his = cur.attributs || [];
      box.innerHTML = '<div class="fj-vsr" style="margin-bottom:10px"><b style="color:#00D4FF">Toi</b><span></span><span></span><span></span><b style="color:var(--r)">' + esc(initials(cur.pseudo)) + '</b></div>' +
        his.map(function (h, i) { var v = mine[i] ? mine[i][1] : 0; return '<div class="fj-vsr"><b style="color:#00D4FF">' + v + '</b><div class="l"><i style="--v:' + v + '%"></i></div><span>' + esc(h[0]) + '</span><div class="rr"><i style="--v:' + h[1] + '%"></i></div><b style="color:var(--r)">' + h[1] + '</b></div>'; }).join('');
      box.classList.add('on');
      box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  /* ---------- story Instagram ---------- */
  var sov, LOGO = new Image(); LOGO.src = 'DHA_logo.png';
  function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
  function loadImg(src) { return new Promise(function (ok) { if (!src) return ok(null); var i = new Image(); i.onload = function () { ok(i); }; i.onerror = function () { ok(null); }; i.src = src; }); }
  async function storyCanvas(d) {
    try { await document.fonts.ready; } catch (e) {}
    var av = d.avatar && /^data:image\//.test(d.avatar) ? await loadImg(d.avatar) : null;
    var W = 1080, H = 1920, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    var c = cv.getContext('2d'), rg = rangOf(d.xp), col = [rg.r, rg.r2], F = 'Sora, Manrope, sans-serif', f = d.fiche || {};
    var g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#071026'); g.addColorStop(1, '#03060f'); c.fillStyle = g; c.fillRect(0, 0, W, H);
    [[200, 300, 500, col[0]], [900, 1300, 600, '#1E64FF'], [300, 1700, 420, col[1]]].forEach(function (b) { var r = c.createRadialGradient(b[0], b[1], 0, b[0], b[1], b[2]); r.addColorStop(0, b[3] + '55'); r.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = r; c.fillRect(0, 0, W, H); });
    for (var i = 0; i < 70; i++) { c.fillStyle = 'rgba(255,255,255,' + (Math.random() * 0.5) + ')'; c.beginPath(); c.arc(Math.random() * W, Math.random() * H, Math.random() * 2.2, 0, 7); c.fill(); }
    if (LOGO.complete && LOGO.naturalWidth) { c.save(); rr(c, 330, 70, 420, 305, 36); c.clip(); c.drawImage(LOGO, 300, 120, 936, 680, 330, 70, 420, 305); c.restore(); }
    var X = 90, Y = 430, CW = 900, CH = 1210;
    var bg = c.createLinearGradient(X, Y, X + CW, Y + CH); bg.addColorStop(0, col[0]); bg.addColorStop(.45, 'rgba(255,255,255,0.15)'); bg.addColorStop(1, col[1]);
    c.save(); c.shadowColor = col[0]; c.shadowBlur = 80; rr(c, X, Y, CW, CH, 60); c.fillStyle = bg; c.fill(); c.restore();
    rr(c, X + 6, Y + 6, CW - 12, CH - 12, 54); var ig = c.createLinearGradient(0, Y, 0, Y + CH); ig.addColorStop(0, '#0c1634'); ig.addColorStop(1, '#070d20'); c.fillStyle = ig; c.fill();
    c.save(); rr(c, X + 6, Y + 6, CW - 12, CH - 12, 54); c.clip(); var bn = c.createLinearGradient(X, Y, X + CW, Y + 260); bn.addColorStop(0, rg.ban[0]); bn.addColorStop(.6, rg.ban[1]); bn.addColorStop(1, rg.ban[2]); c.fillStyle = bn; c.fillRect(X, Y, CW, 250);
    c.strokeStyle = 'rgba(255,255,255,0.5)'; c.lineWidth = 5; c.beginPath(); [[0, 210], [120, 190], [220, 200], [330, 150], [430, 165], [540, 110], [650, 125], [760, 70], [900, 85]].forEach(function (p, i) { c[i ? 'lineTo' : 'moveTo'](X + p[0], Y + p[1]); }); c.stroke(); c.restore();
    c.textBaseline = 'middle';
    function pill(t, x, y, stroke, fill) { c.font = '800 30px ' + F; var w = c.measureText(t).width + 44; rr(c, x, y, w, 62, 31); c.fillStyle = 'rgba(5,9,20,0.75)'; c.fill(); c.strokeStyle = stroke; c.lineWidth = 2.5; c.stroke(); c.fillStyle = fill; c.textAlign = 'left'; c.fillText(t, x + 22, y + 32); return w; }
    pill(rg.icon + ' ' + rg.name, X + 36, Y + 36, col[0], col[0]);
    if (d.pos) { var t2 = '#' + d.pos + ' au classement'; c.font = '800 30px ' + F; pill(t2, X + CW - 36 - (c.measureText(t2).width + 44), Y + 36, 'rgba(255,255,255,0.3)', '#fff'); }
    var ax = X + 150, ay = Y + 290, ar = 105;
    c.save(); c.shadowColor = col[0]; c.shadowBlur = 40; c.beginPath(); c.arc(ax, ay, ar + 8, 0, 7); c.fillStyle = col[0]; c.fill(); c.restore();
    c.save(); c.beginPath(); c.arc(ax, ay, ar, 0, 7); c.clip();
    if (av) { var s = Math.min(av.width, av.height); c.drawImage(av, (av.width - s) / 2, (av.height - s) / 2, s, s, ax - ar, ay - ar, ar * 2, ar * 2); }
    else { var ag = c.createLinearGradient(ax - ar, ay - ar, ax + ar, ay + ar); ag.addColorStop(0, col[1]); ag.addColorStop(1, col[0]); c.fillStyle = ag; c.fillRect(ax - ar, ay - ar, ar * 2, ar * 2); c.fillStyle = '#fff'; c.font = '800 78px ' + F; c.textAlign = 'center'; c.fillText(initials(d.pseudo), ax, ay + 4); }
    c.restore();
    var lvl = levelOf(d.xp);
    rr(c, ax + 50, ay + 50, 88, 76, 22); c.fillStyle = col[0]; c.fill(); c.fillStyle = '#120c00'; c.font = '800 40px ' + F; c.textAlign = 'center'; c.fillText(lvl, ax + 94, ay + 90);
    c.textAlign = 'left'; c.fillStyle = '#fff'; c.font = '800 60px ' + F;
    var ps = '@' + String(d.pseudo || '').replace(/^@/, ''); while (c.measureText(ps).width > 560 && ps.length > 3) ps = ps.slice(0, -1);
    c.fillText(ps, X + 290, Y + 300); c.fillStyle = col[0]; c.font = '800 34px ' + F; c.fillText('« ' + (TITRES[f.titre] || TITRES.debutant) + ' »', X + 292, Y + 360);
    if (d.mindset) { c.save(); c.shadowColor = '#9D4EDD'; c.shadowBlur = 24; pill('🧠 MINDSET AGUERRI', X + 290, Y + 396, '#C77DFF', '#E4C6FF'); c.restore(); }
    var bio = f.bio || 'Je grind sur la DHA.';
    c.font = 'italic 600 34px Manrope, sans-serif'; var words = bio.split(' '), line = '', ly = Y + (d.mindset ? 515 : 470), nl = 0;
    c.fillStyle = col[0]; c.fillRect(X + 60, ly - 28, 6, 96); c.fillStyle = '#D5DEF2';
    words.forEach(function (w) { if (nl > 1) return; var tt = line + w + ' '; if (c.measureText(tt).width > 720) { if (nl === 1) { c.fillText(line.trim() + '…', X + 90, ly); nl = 2; return; } c.fillText(line, X + 90, ly); line = w + ' '; ly += 48; nl++; } else line = tt; });
    if (nl < 2) c.fillText(line, X + 90, ly);
    var sy = Y + 600, sw = (CW - 120 - 36) / 4;
    [[fmt(d.xp), 'XP'], [lvl, 'LEVEL'], [(d.modules || 0) + '/17', 'MODULES'], ['🔥' + (d.serie || 0), 'SÉRIE']].forEach(function (s, i) { var sx = X + 60 + i * (sw + 12); rr(c, sx, sy, sw, 150, 26); c.fillStyle = 'rgba(255,255,255,0.05)'; c.fill(); c.strokeStyle = 'rgba(255,255,255,0.12)'; c.lineWidth = 2; c.stroke(); c.textAlign = 'center'; c.fillStyle = '#fff'; c.font = '800 44px ' + F; c.fillText(s[0], sx + sw / 2, sy + 62); c.fillStyle = '#A9B8D6'; c.font = '700 22px ' + F; c.fillText(s[1], sx + sw / 2, sy + 112); });
    var at = d.attributs || [];
    if (at.length) {
      var cx = X + 230, cy = Y + 905, R = 132, n = at.length;
      var pt = function (i, v) { var a = -Math.PI / 2 + i * 2 * Math.PI / n; return [cx + Math.cos(a) * R * v, cy + Math.sin(a) * R * v]; };
      [1, .66, .33].forEach(function (k) { c.beginPath(); at.forEach(function (_, i) { var p = pt(i, k); c[i ? 'lineTo' : 'moveTo'](p[0], p[1]); }); c.closePath(); c.strokeStyle = 'rgba(255,255,255,0.15)'; c.lineWidth = 2; c.stroke(); });
      c.beginPath(); at.forEach(function (a, i) { var p = pt(i, Math.max(0.04, a[1] / 100)); c[i ? 'lineTo' : 'moveTo'](p[0], p[1]); }); c.closePath(); c.fillStyle = 'rgba(0,212,255,0.28)'; c.fill(); c.strokeStyle = '#00D4FF'; c.lineWidth = 5; c.stroke();
      var ovr = Math.round(at.reduce(function (t, a) { return t + Number(a[1] || 0); }, 0) / n);
      c.textAlign = 'left'; c.fillStyle = '#A9B8D6'; c.font = '700 26px ' + F; c.fillText('NOTE GLOBALE', X + 470, Y + 820); c.fillStyle = col[0]; c.font = '800 150px ' + F; c.fillText(ovr, X + 462, Y + 925);
      var best = at.slice().sort(function (a, b) { return b[1] - a[1]; }).slice(0, 2);
      c.fillStyle = '#A9B8D6'; c.font = '600 26px Manrope, sans-serif'; best.forEach(function (a, i) { c.fillText(a[0] + ' · ' + a[1], X + 470, Y + 1015 + i * 38); });
    }
    var pf = (d.perfs || []).filter(function (p) { return p.statut === 'verifie'; })[0] || (d.perfs || []).filter(function (p) { return p.statut !== 'refuse'; })[0];
    if (pf) {
      var t = PERF[pf.type] || PERF.trade, py = Y + 1125, pw = CW - 120;
      var pg = c.createLinearGradient(X + 60, py, X + 60 + pw, py); pg.addColorStop(0, t.c[0]); pg.addColorStop(1, t.c[1]); rr(c, X + 60, py - 38, pw, 76, 22); c.fillStyle = pg; c.fill(); c.strokeStyle = t.c[2]; c.lineWidth = 3; c.stroke();
      c.fillStyle = '#fff'; c.font = '800 30px ' + F; c.textAlign = 'left';
      var full = t.ic + '  ' + [pf.valeur, pf.firm || t.n].filter(Boolean).join(' · '), txt = full, mx = pw - (pf.statut === 'verifie' ? 230 : 60);
      while (c.measureText(txt).width > mx && txt.length > 4) txt = txt.slice(0, -2); if (txt !== full) txt += '…';
      c.fillText(txt, X + 90, py + 2);
      if (pf.statut === 'verifie') { c.textAlign = 'right'; c.fillStyle = '#00FF88'; c.font = '800 24px ' + F; c.fillText('✔ VÉRIFIÉ', X + 60 + pw - 26, py + 2); }
    }
    c.textAlign = 'center'; c.fillStyle = '#fff'; c.font = '800 50px ' + F; c.fillText('Je grind sur la DHA 🔥', W / 2, 1730);
    c.fillStyle = '#00D4FF'; c.font = '700 34px ' + F; c.fillText('digitalhustleracademy.digital', W / 2, 1800);
    return cv;
  }
  async function story(d) {
    if (!sov) {
      sov = document.createElement('div'); sov.className = 'fj-sov th-keep'; sov.setAttribute('role', 'dialog'); sov.setAttribute('aria-modal', 'true'); sov.setAttribute('aria-label', 'Carte en story');
      sov.innerHTML = '<img alt="Carte DHA au format story"/><div class="row"><button type="button" class="fj-ab story" data-s="share">📲 Partager sur Insta</button><a class="fj-ab" data-s="dl" download="carte-dha.png">⬇ Télécharger</a><button type="button" class="fj-ab" data-s="close">Fermer</button></div><p>Sur téléphone, « Partager sur Insta » ouvre le partage : choisis Instagram puis Story.</p>';
      document.body.appendChild(sov);
      sov.querySelector('[data-s="close"]').onclick = function () { sov.classList.remove('on'); };
    }
    var cv = await storyCanvas(d), url = cv.toDataURL('image/png');
    sov.querySelector('img').src = url; sov.querySelector('[data-s="dl"]').href = url;
    sov.querySelector('[data-s="share"]').onclick = function () {
      cv.toBlob(function (bl) {
        var file = new File([bl], 'carte-dha.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) navigator.share({ files: [file], title: 'Ma carte DHA' }).catch(function () {});
        else sov.querySelector('[data-s="dl"]').click();
      }, 'image/png');
    };
    sov.classList.add('on');
  }

  window.DHAFiche = {
    open: open,
    render: function (d, el, opt) { el.innerHTML = cardHtml(d, opt); animer(el); },
    story: story,
    TITRES: TITRES, TITRES_COND: TITRES_COND, STYLES: STYLES, SESSIONS: SESSIONS, FX: FX, PERF: PERF, rangOf: rangOf, levelOf: levelOf
  };
})();
