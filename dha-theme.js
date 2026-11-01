/* =========================================================
   DHA — Thème « Glass Néon »
   Inclus sur toutes les pages de la plateforme (en fin de <body>).
   - Polices : Sora (titres) + Manrope (texte), à la place d'Orbitron / Exo 2 / Rajdhani
   - Fond bleu nuit avec halos cyan / bleu, cartes en verre dépoli, néon cyan
   Les couleurs restent celles de la DHA (cyan, bleu, or, vert, violet).
   ========================================================= */
(function () {
  if (window.__dhaTheme) return; window.__dhaTheme = true;

  var f = document.createElement('link');
  f.rel = 'stylesheet';
  f.href = 'https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap';
  document.head.appendChild(f);

  var GLASS = '.card,.player-card,.stat-card,.module-item,.category-card,.formation-header,.module-card,.formation-stat,.bloc,.module-header,.quiz-section,.exercice-section,.question-box,.lv-card,.header-card,.lb-card,.discord-card,.affilies-card,.contrat-card,.paliers-card,.rev-card,.rang-card,.current-rang,.calendly-wrap,.rs,.ct-step,.ce-prog,.hero,.av-card,.info-item,.squad-block,.dha-features,.rp,.lv-slot,.pg-live,.lb-item,.hero-stat';

  var css = '' +
    ':root{--th-glass:linear-gradient(140deg,rgba(22,36,72,0.78),rgba(10,18,40,0.70));--th-line:rgba(255,255,255,0.13);--th-cyan:#00D4FF;--th-blue:#1E64FF;}' +
    'html,body{background:#050914!important;}' +
    '@view-transition{navigation:auto;}' +
    '.fadeup,.fadeup-1,.fadeup-2,.fadeup-3{animation:none!important;opacity:1!important;transform:none!important;}' +
    '::view-transition-old(root),::view-transition-new(root){animation-duration:.28s;}' +
    'body{font-family:Manrope,system-ui,sans-serif!important;-webkit-font-smoothing:antialiased;}' +
    'body::before{content:"";position:fixed;inset:0;z-index:0;pointer-events:none;background:radial-gradient(900px 600px at 82% 4%,rgba(0,212,255,0.22),transparent 62%),radial-gradient(800px 560px at 6% 98%,rgba(30,100,255,0.24),transparent 60%),radial-gradient(560px 420px at 50% 55%,rgba(157,78,221,0.10),transparent 65%),linear-gradient(160deg,#0A1430 0%,#050914 70%);}' +
    'body::after{content:"";position:fixed;width:560px;height:560px;right:-160px;top:-200px;border-radius:50%;z-index:0;pointer-events:none;background:radial-gradient(circle at 35% 35%,rgba(255,255,255,0.14),rgba(0,212,255,0.08) 40%,transparent 70%);animation:thFloat 14s ease-in-out infinite alternate;}' +
    '@keyframes thFloat{to{transform:translate(-40px,30px) scale(1.06)}}' +
    '.bg-grid,.player-card-grid,.stars,.scanlines{display:none!important;}' +
    '.th-bg{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;}' +
    '.th-blob{position:absolute;border-radius:50%;opacity:.6;will-change:transform;transform:translateZ(0);}' +
    '.th-b1{width:620px;height:620px;left:58%;top:-18%;background:radial-gradient(circle,rgba(0,212,255,0.30),rgba(0,212,255,0.08) 40%,transparent 70%);animation:thDrift1 26s ease-in-out infinite alternate;}' +
    '.th-b2{width:700px;height:700px;left:-14%;top:52%;background:radial-gradient(circle,rgba(30,100,255,0.32),rgba(30,100,255,0.08) 40%,transparent 70%);animation:thDrift2 32s ease-in-out infinite alternate;}' +
    '.th-b3{width:480px;height:480px;left:34%;top:30%;background:radial-gradient(circle,rgba(157,78,221,0.22),rgba(157,78,221,0.05) 40%,transparent 70%);animation:thDrift3 38s ease-in-out infinite alternate;}' +
    '.th-cv{position:absolute;inset:0;width:100%;height:100%;}' +
    '@keyframes thDrift1{to{transform:translate(-160px,140px) scale(1.15)}}' +
    '@keyframes thDrift2{to{transform:translate(200px,-160px) scale(1.1)}}' +
    '@keyframes thDrift3{to{transform:translate(-120px,-110px) scale(1.25)}}' +
    '@media (prefers-reduced-motion:reduce){.th-blob{animation:none}.th-cv{display:none}}' +
    '[style*="Orbitron"]{font-family:Sora,system-ui,sans-serif!important;}' +
    '.th-d{font-family:Sora,system-ui,sans-serif!important;letter-spacing:0.02em!important;}' +
    '.th-d.th-small{letter-spacing:0.12em!important;}' +
    '.th-b{font-family:Manrope,system-ui,sans-serif!important;}' +
    /* verre */
    GLASS.split(',').map(function (s) { return s; }).join(',') + '{background:var(--th-glass)!important;border:1px solid var(--th-line)!important;border-radius:24px!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;box-shadow:0 24px 60px rgba(0,0,0,0.40),inset 0 1px 0 rgba(255,255,255,0.12)!important;}' +
    '.lb-item,.pg-live,.lv-slot,.info-item,.hero-stat,.module-item{border-radius:16px!important;box-shadow:none!important;}' +
    '.player-card{background:linear-gradient(140deg,rgba(30,48,92,0.82),rgba(12,22,48,0.74))!important;border-color:rgba(255,255,255,0.18)!important;}' +
    '.player-card::before,.formation-header::before,.module-header::before,.header-card::before,.discord-card::before{opacity:.0;}' +
    /* menu */
    '.sidebar{background:linear-gradient(180deg,rgba(10,20,48,0.92),rgba(5,9,20,0.95))!important;border-right:1px solid var(--th-line)!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;}' +
    '.nav-item{margin:2px 12px!important;padding:11px 14px!important;border-radius:14px!important;border-right:none!important;transition:background .2s,color .2s,box-shadow .2s;}' +
    '.nav-item:hover{background:rgba(255,255,255,0.06)!important;}' +
    '.nav-item.active{background:rgba(0,212,255,0.14)!important;color:#7FE9FF!important;border:1px solid rgba(0,212,255,0.5)!important;box-shadow:0 0 22px rgba(0,212,255,0.30),inset 0 1px 0 rgba(255,255,255,0.15)!important;}' +
    '.sidebar-section{letter-spacing:0.22em!important;}' +
    '.sidebar-logo-text{background:linear-gradient(180deg,#FFFFFF,#00D4FF);-webkit-background-clip:text;background-clip:text;color:transparent!important;text-shadow:none!important;}' +
    '.sidebar-avatar,.player-avatar{border-radius:50%!important;box-shadow:0 0 0 2px rgba(0,212,255,0.6),0 0 22px rgba(0,212,255,0.45)!important;}' +
    /* barres de progression */
    '.xp-bar,.progress-bar,.category-progress-bar,.dq-bar{border-radius:999px!important;background:rgba(255,255,255,0.08)!important;overflow:hidden;}' +
    '.xp-fill,.progress-fill,.category-progress-fill,.dq-bar i{border-radius:999px!important;background:linear-gradient(90deg,#1E64FF,#00D4FF)!important;box-shadow:0 0 14px rgba(0,212,255,0.6)!important;}' +
    /* boutons */
    '.complete-btn,.quiz-submit,.exercice-validate,.lv-btn,.rs-b,.ct-btn,.discord-btn,.wa-btn,.activate-btn,.copy-btn,.question-box-send,.cat-back,.locked-modal-btn,.tt-ok,.tt-go,.dsg-send,.dsg-fab,.dfo-up{border-radius:999px!important;}' +
    '.complete-btn,.quiz-submit,.question-box-send{background:linear-gradient(135deg,#1E64FF,#00D4FF)!important;color:#020610!important;box-shadow:0 0 26px rgba(0,212,255,0.45),inset 0 1px 0 rgba(255,255,255,0.45)!important;border:none!important;}' +
    '.quiz-option{border-radius:16px!important;background:rgba(255,255,255,0.04)!important;border:1px solid var(--th-line)!important;}' +
    '.quiz-option-letter{border-radius:10px!important;}' +
    '.module-num,.exercice-step-num{border-radius:14px!important;}' +
    '.module-badge,.module-meta-item,.xp-pill,.topbar-xp,.player-rang{border-radius:999px!important;}' +
    '.topbar-xp,.xp-pill{background:rgba(255,255,255,0.08)!important;border:1px solid rgba(255,255,255,0.16)!important;}' +
    '.player-rang{background:rgba(255,215,0,0.12)!important;border:1px solid rgba(255,215,0,0.5)!important;color:#FFD700!important;box-shadow:0 0 16px rgba(255,215,0,0.22)!important;}' +
    'iframe{border-radius:18px;}' +
    '.player-card{display:flex;flex-direction:column;justify-content:space-between;}' +
    '.th-ic{width:1em;height:1em;display:inline-block;vertical-align:-0.14em;flex-shrink:0;}' +
    '.th-emo{display:inline;}' +
    '.th-ic[style]{filter:drop-shadow(0 0 4px color-mix(in srgb,var(--th-c) 45%,transparent));}' +
    '.nav-icon .th-ic{width:18px;height:18px;opacity:.85;}' +
    '.player-avatar .th-ic,.sidebar-avatar .th-ic,.lb-avatar .th-ic,.affi-avatar .th-ic{color:#FFFFFF!important;filter:none!important;}' +
    '.nav-item.active .nav-icon .th-ic{opacity:1;filter:drop-shadow(0 0 7px var(--th-c));}' +
    '.stat-card-icon .th-ic,.module-icon .th-ic,.category-card .th-ic:first-child,.lu-emblem .th-ic{filter:drop-shadow(0 0 10px var(--th-c));}' +
    '.th-ring{display:flex;align-items:center;gap:26px;margin:18px 0 6px;position:relative;z-index:1;}' +
    '.th-ring-c{width:150px;height:150px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;box-shadow:0 0 46px rgba(0,212,255,0.40);}' +
    '.th-ring-i{width:128px;height:128px;border-radius:50%;background:radial-gradient(circle at 30% 25%,#10224A,#050914);border:1px solid rgba(255,255,255,0.12);display:flex;flex-direction:column;align-items:center;justify-content:center;}' +
    '.th-ring-i small{font-family:Manrope,sans-serif;font-size:11px;font-weight:800;letter-spacing:.2em;color:#A9B8D6;}' +
    '.th-ring-i b{font-family:Sora,sans-serif;font-weight:800;font-size:50px;line-height:1;color:#FFFFFF;}' +
    '.th-ring-i span{font-family:Manrope,sans-serif;font-size:12px;font-weight:800;color:#00D4FF;}' +
    '.th-ring-t{font-family:Manrope,sans-serif;font-size:16px;color:#C3CDE3;line-height:1.5;}' +
    '.th-ring-t b{color:#FFFFFF;}' +
    '.th-ring-t strong{display:block;font-family:Sora,sans-serif;font-size:22px;color:#FFFFFF;margin-bottom:2px;}' +
    '@media(max-width:600px){.th-ring{gap:16px}.th-ring-c{width:112px;height:112px}.th-ring-i{width:94px;height:94px}.th-ring-i b{font-size:36px}}' +
    /* fenêtres et pop-ups */
    '.locked-modal-card,.dsg-box,.dfo-box,.tt-card,.lu-rw,.dc-modal,.dc-card{border-radius:24px!important;}' +
    '.dsg-box,.dfo-box,.tt-card{background:linear-gradient(160deg,rgba(16,30,66,0.92),rgba(5,9,20,0.95))!important;backdrop-filter:blur(24px);border-color:rgba(0,212,255,0.35)!important;}' +
    '.main,main{position:relative;z-index:1;}.sidebar{z-index:100;}' +
    '@media (prefers-reduced-transparency:reduce){' + GLASS + '{backdrop-filter:none!important;background:#0B1530!important;}}';
  var st = document.createElement('style'); st.id = 'dha-theme'; st.textContent = css;
  document.head.appendChild(st);

  // Remplace les polices d'origine élément par élément (y compris les styles en ligne)
  function convertir(root) {
    var els = (root || document.body).querySelectorAll('*');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.__thDone || el.closest('svg')) continue;
      var ff = getComputedStyle(el).fontFamily || '';
      if (/Orbitron|Chakra Petch/i.test(ff)) {
        el.classList.add('th-d');
        if (parseFloat(getComputedStyle(el).fontSize) < 12) el.classList.add('th-small');
      } else if (/Exo 2|Rajdhani|Inter/i.test(ff)) el.classList.add('th-b');
      el.__thDone = true;
    }
  }

  /* ---------- Emojis → icônes au trait (style plus « mature ») ---------- */
  var ICONES = {"check": "<path d=\"M22 11.08V12a10 10 0 1 1-5.93-9.14\"/><path d=\"m9 11 3 3L22 4\"/>", "x": "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"m15 9-6 6M9 9l6 6\"/>", "zap": "<path d=\"M13 2 3 14h9l-1 8 10-12h-9l1-8z\"/>", "brain": "<path d=\"M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z\"/><path d=\"M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z\"/><path d=\"M12 5v13\"/>", "up": "<path d=\"m22 7-8.5 8.5-5-5L2 17\"/><path d=\"M16 7h6v6\"/>", "down": "<path d=\"m22 17-8.5-8.5-5 5L2 7\"/><path d=\"M16 17h6v-6\"/>", "flame": "<path d=\"M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z\"/>", "book": "<path d=\"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20\"/>", "pad": "<path d=\"M6 12h4M8 10v4M15 13h.01M18 11h.01\"/><rect x=\"2\" y=\"6\" width=\"20\" height=\"12\" rx=\"2\"/>", "muscle": "<path d=\"M6.5 6.5h11M6.5 17.5h11M3 10v4M21 10v4M6 6v12M18 6v12\"/>", "phone": "<path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z\"/>", "coins": "<circle cx=\"8\" cy=\"8\" r=\"6\"/><path d=\"M18.09 10.37A6 6 0 1 1 10.34 18M7 6h1v4\"/>", "msg": "<path d=\"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z\"/>", "users": "<path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\"/><circle cx=\"9\" cy=\"7\" r=\"4\"/><path d=\"M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75\"/>", "trophy": "<path d=\"M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z\"/>", "alert": "<path d=\"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z\"/><path d=\"M12 9v4M12 17h.01\"/>", "target": "<circle cx=\"12\" cy=\"12\" r=\"10\"/><circle cx=\"12\" cy=\"12\" r=\"6\"/><circle cx=\"12\" cy=\"12\" r=\"2\"/>", "radio": "<path d=\"M4.9 19.1C1 15.2 1 8.8 4.9 4.9M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5M19.1 4.9C23 8.8 23 15.1 19.1 19\"/><circle cx=\"12\" cy=\"12\" r=\"2\"/>", "tv": "<rect x=\"2\" y=\"7\" width=\"20\" height=\"15\" rx=\"2\"/><path d=\"m17 2-5 5-5-5\"/>", "folder": "<path d=\"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z\"/>", "lock": "<rect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\"/><path d=\"M7 11V7a5 5 0 0 1 10 0v4\"/>", "unlock": "<rect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\"/><path d=\"M7 11V7a5 5 0 0 1 9.9-1\"/>", "rocket": "<path d=\"M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z\"/><path d=\"m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z\"/>", "bulb": "<path d=\"M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5M9 18h6M10 22h4\"/>", "chart": "<path d=\"M3 3v18h18\"/><path d=\"M18 17V9M13 17V5M8 17v-3\"/>", "mail": "<rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"2\"/><path d=\"m22 7-10 6L2 7\"/>", "video": "<path d=\"m22 8-6 4 6 4V8Z\"/><rect x=\"2\" y=\"6\" width=\"14\" height=\"12\" rx=\"2\"/>", "file": "<path d=\"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z\"/><path d=\"M14 2v6h6M16 13H8M16 17H8M10 9H8\"/>", "grad": "<path d=\"M22 10 12 5 2 10l10 5 10-5Z\"/><path d=\"M6 12v5c3 3 9 3 12 0v-5\"/>", "gem": "<path d=\"M6 3h12l4 6-10 13L2 9Z\"/><path d=\"M11 3 8 9l4 13 4-13-3-6M2 9h20\"/>", "crown": "<path d=\"m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zM5 20h14\"/>", "hand": "<path d=\"m11 17 2 2a1 1 0 1 0 3-3\"/><path d=\"m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4\"/><path d=\"m21 3 1 11h-2M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3M3 4h8\"/>", "wrench": "<path d=\"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z\"/>", "refresh": "<path d=\"M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5\"/>", "spark": "<path d=\"m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z\"/>", "pen": "<path d=\"M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z\"/>", "link": "<path d=\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\"/><path d=\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\"/>", "pin": "<path d=\"M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z\"/><circle cx=\"12\" cy=\"10\" r=\"3\"/>", "cal": "<rect x=\"3\" y=\"4\" width=\"18\" height=\"18\" rx=\"2\"/><path d=\"M16 2v4M8 2v4M3 10h18\"/>", "mic": "<path d=\"M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z\"/><path d=\"M19 10v2a7 7 0 0 1-14 0v-2M12 19v3\"/>", "key": "<circle cx=\"7.5\" cy=\"15.5\" r=\"5.5\"/><path d=\"m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3\"/>", "gift": "<rect x=\"3\" y=\"8\" width=\"18\" height=\"4\" rx=\"1\"/><path d=\"M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5\"/>", "plug": "<path d=\"M12 22v-5M9 8V2M15 8V2M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z\"/>", "cam": "<path d=\"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z\"/><circle cx=\"12\" cy=\"13\" r=\"3\"/>", "eye": "<path d=\"M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/>", "plane": "<path d=\"M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z\"/>", "home": "<path d=\"m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"/><path d=\"M9 22V12h6v10\"/>", "bell": "<path d=\"M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0\"/>", "globe": "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z\"/>", "star": "<path d=\"m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z\"/>", "ban": "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"m4.9 4.9 14.2 14.2\"/>", "compass": "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z\"/>", "clock": "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12 6v6l4 2\"/>", "bug": "<rect x=\"8\" y=\"6\" width=\"8\" height=\"14\" rx=\"4\"/><path d=\"m19 7-3 2M5 7l3 2M19 19l-3-2M5 19l3-2M20 13h-4M4 13h4M10 4l1 2M14 4l-1 2\"/>", "cart": "<circle cx=\"8\" cy=\"21\" r=\"1\"/><circle cx=\"19\" cy=\"21\" r=\"1\"/><path d=\"M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12\"/>", "ruler": "<path d=\"M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z\"/><path d=\"m14.5 12.5 2-2M11.5 9.5l2-2M8.5 6.5l2-2M17.5 15.5l2-2\"/>", "search": "<circle cx=\"11\" cy=\"11\" r=\"8\"/><path d=\"m21 21-4.3-4.3\"/>", "mobile": "<rect x=\"5\" y=\"2\" width=\"14\" height=\"20\" rx=\"2\"/><path d=\"M12 18h.01\"/>", "bank": "<path d=\"M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M12 2l8 5H4z\"/>", "card": "<rect x=\"2\" y=\"5\" width=\"20\" height=\"14\" rx=\"2\"/><path d=\"M2 10h20\"/>", "trash": "<path d=\"M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"/>", "save": "<path d=\"M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z\"/><path d=\"M17 21v-8H7v8M7 3v5h8\"/>", "moon": "<path d=\"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z\"/>", "flag": "<path d=\"M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7\"/>", "medal": "<circle cx=\"12\" cy=\"15\" r=\"6\"/><path d=\"M8.2 10.6 6 2h4l2 5 2-5h4l-2.2 8.6\"/>", "calc": "<rect x=\"4\" y=\"2\" width=\"16\" height=\"20\" rx=\"2\"/><path d=\"M8 6h8M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01\"/>", "scale": "<path d=\"M12 3v18M7 21h10M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1ZM2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z\"/>", "right": "<path d=\"M5 12h14M12 5l7 7-7 7\"/>", "arrup": "<path d=\"M12 19V5M5 12l7-7 7 7\"/>", "settings": "<circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.73 1.17V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 3.6 15H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6V3a2 2 0 1 1 4 0v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09A1.65 1.65 0 0 0 19.4 15z\"/>", "dot": "<circle cx=\"12\" cy=\"12\" r=\"6\" fill=\"currentColor\" stroke=\"none\"/>"};
  var EMOJI = {"✅": "check", "❌": "x", "⚡": "zap", "🧠": "brain", "📈": "up", "🔥": "flame", "📚": "book", "🎮": "pad", "💪": "muscle", "📞": "phone", "💰": "coins", "💶": "coins", "💬": "msg", "👥": "users", "🏆": "trophy", "🥇": "medal", "🥈": "medal", "🥉": "medal", "🏅": "medal", "⚠": "alert", "🚦": "alert", "🎯": "target", "📡": "radio", "📺": "tv", "📁": "folder", "🗂": "folder", "🔒": "lock", "🔓": "unlock", "🚀": "rocket", "💡": "bulb", "📊": "chart", "📩": "mail", "✉": "mail", "📨": "mail", "📬": "mail", "📭": "mail", "🎥": "video", "🎬": "video", "📝": "file", "📄": "file", "📋": "file", "📰": "file", "📘": "book", "🎓": "grad", "💎": "gem", "👑": "crown", "🤝": "hand", "📉": "down", "🛠": "wrench", "⚙": "settings", "🔄": "refresh", "🔁": "refresh", "↻": "refresh", "🎉": "spark", "✨": "spark", "✦": "spark", "✍": "pen", "✏": "pen", "🔗": "link", "📍": "pin", "📅": "cal", "🗓": "cal", "🎤": "mic", "🔑": "key", "🎁": "gift", "🔌": "plug", "📸": "cam", "📷": "cam", "👀": "eye", "👁": "eye", "✈": "plane", "🏠": "home", "🔔": "bell", "🌍": "globe", "⭐": "star", "🛑": "ban", "🚫": "ban", "🧭": "compass", "🕗": "clock", "🕐": "clock", "🐞": "bug", "🛒": "cart", "📐": "ruler", "📏": "ruler", "🔎": "search", "📲": "mobile", "🏦": "bank", "💳": "card", "🗑": "trash", "💾": "save", "🌙": "moon", "🏁": "flag", "🧮": "calc", "🔢": "calc", "⚖": "scale", "➡": "right", "⬆": "arrup", "🔴": "dot", "🟢": "dot", "🟠": "dot", "🟡": "dot", "🧘": "brain", "😤": "flame", "🛤": "right", "🧪": "bulb", "🤖": "settings", "🌤": "star", "❄": "star"};
  var RETIRER = ["🙌", "🙂", "😉", "👊", "👋", "👌", "🙏", "✋", "👻", "🎵"];
  var COULEUR = { check: '#00FF88', x: '#FF4466', alert: '#FFB020',
    zap: '#FFD700', brain: '#B57BFF', up: '#00D4FF', down: '#FF4466', flame: '#FF7A3D', book: '#4FA8FF', pad: '#00D4FF',
    muscle: '#FF9F43', phone: '#3DDC97', coins: '#FFD700', msg: '#25D366', users: '#5B8CFF', trophy: '#FFC83D', medal: '#FFC83D',
    target: '#FF5C7A', radio: '#00E5FF', tv: '#C77DFF', folder: '#FFC857', lock: '#FFD700', unlock: '#00FF88', rocket: '#FF8A3D',
    bulb: '#FFE066', chart: '#4FA8FF', mail: '#7FD1FF', video: '#FF5C9A', file: '#9FB4D8', grad: '#FFD700', gem: '#5CE1E6',
    crown: '#FFD700', hand: '#3DDC97', wrench: '#A9B8D6', settings: '#A9B8D6', refresh: '#00D4FF', spark: '#FFD700', pen: '#FF9F43',
    link: '#7FD1FF', pin: '#FF5C7A', cal: '#5B8CFF', mic: '#C77DFF', key: '#FFD700', gift: '#FF5C9A', plug: '#3DDC97',
    cam: '#9FB4D8', eye: '#7FD1FF', plane: '#7FD1FF', home: '#00D4FF', bell: '#FFC857', globe: '#3DDC97', star: '#FFD700',
    ban: '#FF4466', compass: '#00D4FF', clock: '#7FD1FF', bug: '#FF5C7A', cart: '#FF9F43', ruler: '#9FB4D8', search: '#7FD1FF',
    mobile: '#9FB4D8', bank: '#3DDC97', card: '#5B8CFF', trash: '#FF4466', save: '#5B8CFF', moon: '#B57BFF', flag: '#00FF88',
    calc: '#9FB4D8', scale: '#C77DFF', right: '#00D4FF', arrup: '#00FF88' };
  var DOTS = { '🔴': '#FF4466', '🟢': '#00FF88', '🟠': '#FF9F00', '🟡': '#FFD700' };
  var RE_EMO = /(\p{Extended_Pictographic}|[\u2600-\u27BF\u2B06\u2B50\u21BB])(\uFE0F)?/gu;
  function svg(nom, emo) {
    var c = DOTS[emo] || COULEUR[nom];
    return '<svg class="th-ic th-ic-' + nom + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' + (c ? ' style="color:' + c + ';--th-c:' + c + '"' : '') + '>' + ICONES[nom] + '</svg>';
  }
  var SAUTER = /^(SCRIPT|STYLE|TEXTAREA|TITLE|OPTION|SELECT|INPUT|NOSCRIPT|svg)$/i;
  function iconiser(root) {
    if (!root || !root.ownerDocument && root !== document) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), n, todo = [];
    while ((n = w.nextNode())) { RE_EMO.lastIndex = 0; if (RE_EMO.test(n.nodeValue)) todo.push(n); }
    todo.forEach(function (t) {
      var p = t.parentNode; if (!p || SAUTER.test(p.nodeName) || (p.closest && p.closest('svg,select,textarea'))) return;
      var txt = t.nodeValue, html = '', last = 0, m, touche = false;
      RE_EMO.lastIndex = 0;
      while ((m = RE_EMO.exec(txt))) {
        var e = m[1], nom = EMOJI[e];
        html += esc(txt.slice(last, m.index));
        if (nom) { html += svg(nom, e); touche = true; }
        else if (RETIRER.indexOf(e) > -1 || /\p{Extended_Pictographic}/u.test(e) && e.codePointAt(0) > 0x1F000) { touche = true; }
        else html += esc(m[0]);
        last = m.index + m[0].length;
      }
      if (!touche) return;
      html += esc(txt.slice(last));
      var span = document.createElement('span'); span.className = 'th-emo'; span.innerHTML = html.replace(/^\s+(?=<svg)/, ' ');
      p.replaceChild(span, t);
    });
  }
  function esc(x) { return x.replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }

  // Anneau de level sur la carte joueur (dashboard)
  function anneau() {
    var pc = document.querySelector('.player-card'), stats = pc && pc.querySelector('.player-stats');
    if (!pc || !stats) return;
    var r = pc.querySelector('.th-ring');
    if (!r) {
      r = document.createElement('div'); r.className = 'th-ring';
      r.innerHTML = '<div class="th-ring-c"><div class="th-ring-i"><small>LEVEL</small><b>1</b><span>0 %</span></div></div><div class="th-ring-t"><strong>Ta progression</strong><span></span></div>';
      stats.parentNode.insertBefore(r, stats);
    }
    var lvl = (document.getElementById('stat-level') || {}).textContent || '1';
    var fill = document.getElementById('xp-fill'), pct = fill ? Math.round(parseFloat(fill.style.width) || 0) : 0;
    var nx = ((document.getElementById('xp-next') || {}).textContent || '').match(/(\d[\d\s]*)\s*\/\s*(\d[\d\s]*)/);
    r.querySelector('.th-ring-c').style.background = 'conic-gradient(#00D4FF 0 ' + pct + '%, rgba(255,255,255,0.08) ' + pct + '% 100%)';
    r.querySelector('.th-ring-i b').textContent = lvl.trim();
    r.querySelector('.th-ring-i span').textContent = pct + ' %';
    var reste = nx ? (parseInt(nx[2].replace(/\s/g, ''), 10) - parseInt(nx[1].replace(/\s/g, ''), 10)) : null;
    r.querySelector('.th-ring-t span').innerHTML = reste != null && reste >= 0 ? 'Encore <b>' + reste + ' XP</b> pour passer au niveau ' + (parseInt(lvl, 10) + 1) + '.' : '';
  }
  // Fond animé : halos qui dérivent lentement + particules lumineuses
  function fond() {
    if (document.querySelector('.th-bg')) return;
    var bg = document.createElement('div'); bg.className = 'th-bg'; bg.setAttribute('aria-hidden', 'true');
    bg.innerHTML = '<div class="th-blob th-b1"></div><div class="th-blob th-b2"></div><div class="th-blob th-b3"></div><canvas class="th-cv"></canvas>';
    document.body.insertBefore(bg, document.body.firstChild);
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var cv = bg.querySelector('canvas'), cx = cv.getContext('2d'), W, H, P = [], dpr = Math.min(window.devicePixelRatio || 1, 2);
    function taille() { W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    taille(); window.addEventListener('resize', taille);
    var n = innerWidth < 700 ? 28 : 55, cols = ['0,212,255', '30,100,255', '157,78,221', '255,215,0'];
    for (var i = 0; i < n; i++) P.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.6 + 0.4, vx: (Math.random() - .5) * 0.12, vy: -(Math.random() * 0.25 + 0.05), a: Math.random() * 0.5 + 0.2, t: Math.random() * 6.28, c: cols[i % 7 === 0 ? 3 : i % 3] });
    var sprites = {};
    function sprite(c) {
      if (sprites[c]) return sprites[c];
      var sc = document.createElement('canvas'); sc.width = sc.height = 24; var g = sc.getContext('2d');
      var gr = g.createRadialGradient(12, 12, 0, 12, 12, 12); gr.addColorStop(0, 'rgba(' + c + ',1)'); gr.addColorStop(0.25, 'rgba(' + c + ',0.6)'); gr.addColorStop(1, 'rgba(' + c + ',0)');
      g.fillStyle = gr; g.fillRect(0, 0, 24, 24); return (sprites[c] = sc);
    }
    var der = 0;
    function tick(ts) {
      requestAnimationFrame(tick);
      if (document.hidden || ts - der < 33) return; der = ts;
      cx.clearRect(0, 0, W, H);
      for (var i = 0; i < P.length; i++) {
        var p = P[i]; p.x += p.vx * 2; p.y += p.vy * 2; p.t += 0.04;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; } if (p.x < -10) p.x = W + 10; if (p.x > W + 10) p.x = -10;
        var s = p.r * 7; cx.globalAlpha = p.a * (0.6 + 0.4 * Math.sin(p.t));
        cx.drawImage(sprite(p.c), p.x - s / 2, p.y - s / 2, s, s);
      }
      cx.globalAlpha = 1;
    }
    requestAnimationFrame(tick);
  }
  function go() {
    fond(); convertir(); iconiser(document.body);
    anneau(); setInterval(anneau, 1500);
    var t = null;
    var aFaire = new Set();
    new MutationObserver(function (ms) {
      ms.forEach(function (m) {
        if (m.type === 'characterData') { if (m.target.parentNode) aFaire.add(m.target.parentNode); return; }
        m.addedNodes.forEach(function (n) { aFaire.add(n.nodeType === 1 ? n : n.parentNode); });
      });
      clearTimeout(t);
      t = setTimeout(function () {
        var l = Array.from(aFaire); aFaire.clear();
        l.forEach(function (el) { if (el && el.isConnected) { convertir(el.parentNode || document.body); iconiser(el); } });
      }, 30);
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
