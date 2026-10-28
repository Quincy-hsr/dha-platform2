/* =========================================================
   DHA — Extras des modules
   À inclure juste avant </body> de chaque module :
   <script src="dha-module-extras.js"></script>
   1. Bouton « Refaire le quiz » (+10 XP, une seule fois par module)
   2. Rendu des exercices (capture + explication) corrigé par Quincy dans le Cerveau
   3. Réponses des quiz mélangées
   ========================================================= */
(function () {
  // Liens de la communauté (les mêmes que sur la page Mon Squad)
  var LIEN_WHATSAPP = 'https://chat.whatsapp.com/EK0NudNpfhYADF550JZmXe';
  var LIEN_QUINCY   = 'https://wa.me/qr/OCPS7DRIVP76L1'; // WhatsApp privé de Quincy
  var XP_REFAIT = 10;

  var css = '' +
    '.dha-retake{display:none;width:100%;margin-top:12px;padding:13px;border-radius:12px;background:rgba(157,78,221,0.1);border:1px solid rgba(157,78,221,0.45);color:#C9A0FF;font-family:"Orbitron",sans-serif;font-size:11px;font-weight:900;letter-spacing:2px;cursor:pointer;transition:all .2s;}' +
    '.dha-retake:hover{background:rgba(157,78,221,0.2);}' +
    '.dha-retake-info{font-size:12px;color:rgba(232,244,255,0.5);text-align:center;margin-top:8px;}' +
    '.dha-proof{position:relative;margin:18px 0 14px;padding:20px 18px;border-radius:14px;background:linear-gradient(135deg,rgba(255,215,0,0.14),rgba(255,140,0,0.08));border:2px solid #FFD700;box-shadow:0 0 30px rgba(255,215,0,0.15);animation:dhaProofGlow 2.4s ease-in-out infinite;}' +
    '.dha-proof-title{font-family:"Orbitron",sans-serif;font-size:15px;font-weight:900;letter-spacing:1px;color:#FFD700;line-height:1.35;margin-bottom:8px;}' +
    '.dha-proof-text{font-size:14px;line-height:1.6;color:#E8F4FF;margin-bottom:14px;}' +
    '.dha-proof-btns{display:flex;flex-wrap:wrap;gap:8px;}' +
    '.dha-proof-btns a{flex:1 1 150px;display:flex;align-items:center;justify-content:center;gap:8px;padding:11px 12px;border-radius:10px;font-family:"Orbitron",sans-serif;font-size:10px;font-weight:900;letter-spacing:1.5px;text-decoration:none;color:#050914;background:#FFD700;}' +
    '.dha-proof-btns a.sec{background:rgba(255,215,0,0.1);color:#FFD700;border:1px solid rgba(255,215,0,0.5);}' +
    '@keyframes dhaProofGlow{0%,100%{box-shadow:0 0 22px rgba(255,215,0,0.12)}50%{box-shadow:0 0 42px rgba(255,215,0,0.3)}}' +
    '@media (prefers-reduced-motion:reduce){.dha-proof{animation:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ---------- Rendre son exercice (corrigé par Quincy dans le Cerveau) ---------- */
  var exoBtn = document.getElementById('exercice-btn');
  var cleExo = (document.documentElement.innerHTML.match(/completedActions\.has\('exercice_(m\d+)(?:_b\d+)?'\)/) || [])[1];
  var titreModule = (document.title || '').replace(/^DHA\s*[—-]\s*/, '');
  if (exoBtn && cleExo) {
    var cssR = '' +
      '.dxr{margin:18px 0 14px;padding:20px 18px;border-radius:14px;background:linear-gradient(135deg,rgba(255,215,0,0.12),rgba(255,140,0,0.06));border:2px solid #FFD700;}' +
      '.dxr-t{font-family:"Orbitron",sans-serif;font-size:14px;font-weight:900;letter-spacing:1px;color:#FFD700;margin-bottom:6px;}' +
      '.dxr-s{font-size:14px;line-height:1.6;color:#E8F4FF;margin-bottom:12px;}' +
      '.dxr textarea{width:100%;box-sizing:border-box;min-height:90px;resize:vertical;background:#050914;border:1px solid rgba(255,215,0,0.35);border-radius:10px;color:#E8F4FF;padding:10px 12px;font-family:inherit;font-size:14px;}' +
      '.dxr-imgs{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0;}' +
      '.dxr-imgs .th{position:relative;width:78px;height:78px;border-radius:8px;overflow:hidden;border:1px solid rgba(255,215,0,0.4);}' +
      '.dxr-imgs .th img{width:100%;height:100%;object-fit:cover;display:block;}' +
      '.dxr-imgs .th button{position:absolute;top:2px;right:2px;width:22px;height:22px;border-radius:50%;border:none;background:rgba(0,0,0,0.75);color:#fff;cursor:pointer;font-size:13px;line-height:1;}' +
      '.dxr-add{width:78px;height:78px;border-radius:8px;border:1px dashed rgba(255,215,0,0.6);background:rgba(255,215,0,0.05);color:#FFD700;cursor:pointer;font-size:11px;font-family:inherit;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;}' +
      '.dxr-add span{font-size:22px;}' +
      '.dxr-go{width:100%;padding:13px;border:none;border-radius:10px;background:linear-gradient(135deg,#FFD700,#FF9F00);color:#1a1200;font-family:"Orbitron",sans-serif;font-size:11px;font-weight:900;letter-spacing:1.5px;cursor:pointer;}' +
      '.dxr-go:disabled{opacity:.55;cursor:default;}' +
      '.dxr-msg{font-size:13px;text-align:center;margin-top:8px;min-height:18px;}' +
      '.dxr-alt{font-size:12px;color:rgba(232,244,255,0.55);text-align:center;margin-top:8px;}' +
      '.dxr-alt a{color:#FFD700;}' +
      '.dxr-h{margin-top:14px;display:flex;flex-direction:column;gap:8px;}' +
      '.dxr-i{padding:10px 12px;border-radius:10px;background:rgba(0,0,0,0.25);border:1px solid rgba(255,255,255,0.08);font-size:13px;color:#c9d6e8;}' +
      '.dxr-i .top{display:flex;justify-content:space-between;gap:8px;font-size:12px;color:rgba(232,244,255,0.55);margin-bottom:4px;}' +
      '.dxr-i .cor{margin-top:8px;padding:8px 10px;border-left:2px solid #00FF88;background:rgba(0,255,136,0.06);color:#E8F4FF;border-radius:0 8px 8px 0;white-space:pre-wrap;}' +
      '.dxr-i .cor.refaire{border-left-color:#FF9F00;background:rgba(255,159,0,0.07);}';
    var stR = document.createElement('style'); stR.textContent = cssR; document.head.appendChild(stR);
    var ST_EXO = { a_corriger: ['⏳ En attente de correction', '#FFD700'], valide: ['✅ Validé par Quincy', '#00FF88'], a_refaire: ['🔁 À retravailler', '#FF9F00'] };
    var imgs = [];
    var box = document.createElement('div');
    box.className = 'dxr';
    box.innerHTML =
      '<div class="dxr-t">📤 RENDS TON EXERCICE À QUINCY</div>' +
      '<div class="dxr-s">Ajoute la capture de ton graphique et explique ce que tu as vu. <strong>Quincy le corrige</strong> et tu retrouves sa correction juste ici. Exercice validé = <strong>+25 XP bonus</strong>.</div>' +
      '<textarea maxlength="3000" placeholder="Ce que tu as trouvé, ton raisonnement, tes doutes…" aria-label="Ton explication"></textarea>' +
      '<div class="dxr-imgs"><button type="button" class="dxr-add"><span>📷</span>Capture</button></div>' +
      '<input type="file" accept="image/*" multiple hidden>' +
      '<button type="button" class="dxr-go">ENVOYER MON EXERCICE</button>' +
      '<div class="dxr-msg" aria-live="polite"></div>' +
      '<div class="dxr-alt">Tu peux aussi le partager dans <a href="' + LIEN_WHATSAPP + '" target="_blank" rel="noopener">le groupe WhatsApp</a> 💬</div>' +
      '<div class="dxr-h"></div>';
    exoBtn.parentNode.insertBefore(box, exoBtn);
    var ta = box.querySelector('textarea'), wrap = box.querySelector('.dxr-imgs'), addB = box.querySelector('.dxr-add'),
        file = box.querySelector('input[type=file]'), go = box.querySelector('.dxr-go'), msg = box.querySelector('.dxr-msg'), hist = box.querySelector('.dxr-h');
    function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    function peindreImgs() {
      wrap.querySelectorAll('.th').forEach(function (n) { n.remove(); });
      imgs.forEach(function (d, i) {
        var t = document.createElement('div'); t.className = 'th';
        t.innerHTML = '<img alt="Capture ' + (i + 1) + '"><button type="button" aria-label="Retirer la capture">×</button>';
        t.querySelector('img').src = d;
        t.querySelector('button').onclick = function () { imgs.splice(i, 1); peindreImgs(); };
        wrap.insertBefore(t, addB);
      });
      addB.style.display = imgs.length >= 3 ? 'none' : '';
    }
    function compresser(f) {
      return new Promise(function (ok, ko) {
        var r = new FileReader();
        r.onerror = ko;
        r.onload = function () {
          var im = new Image();
          im.onerror = ko;
          im.onload = function () {
            var max = 1400, w = im.width, h = im.height, k = Math.min(1, max / Math.max(w, h));
            var c = document.createElement('canvas'); c.width = Math.round(w * k); c.height = Math.round(h * k);
            var x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(im, 0, 0, c.width, c.height);
            var q = 0.78, d = c.toDataURL('image/jpeg', q);
            while (d.length > 850000 && q > 0.35) { q -= 0.12; d = c.toDataURL('image/jpeg', q); }
            d.length > 850000 ? ko(new Error('trop lourde')) : ok(d);
          };
          im.src = r.result;
        };
        r.readAsDataURL(f);
      });
    }
    addB.onclick = function () { file.click(); };
    file.onchange = async function () {
      var fs = Array.prototype.slice.call(file.files || []); file.value = '';
      for (var i = 0; i < fs.length && imgs.length < 3; i++) {
        try { imgs.push(await compresser(fs[i])); } catch (e) { msg.style.color = '#FF4466'; msg.textContent = 'Une image n\'a pas pu être ajoutée.'; }
      }
      peindreImgs();
    };
    async function chargerHist() {
      try {
        var tk = await DHA.token(); if (!tk) return;
        var l = await DHA.rpc('dha_mes_exercices', { p_token: tk, p_module: cleExo });
        if (!Array.isArray(l) || !l.length) { hist.innerHTML = ''; return; }
        hist.innerHTML = '<div style="font-family:Orbitron,sans-serif;font-size:10px;letter-spacing:2px;color:rgba(232,244,255,0.55)">MES RENDUS</div>' + l.map(function (e) {
          var st = ST_EXO[e.statut] || ST_EXO.a_corriger;
          var d = new Date(e.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
          return '<div class="dxr-i"><div class="top"><span>Envoyé le ' + d + (e.nb_images ? ' · ' + e.nb_images + ' capture' + (e.nb_images > 1 ? 's' : '') : '') + '</span><span style="color:' + st[1] + ';font-weight:700">' + st[0] + '</span></div>' +
            (e.message ? '<div>' + esc(e.message.length > 200 ? e.message.slice(0, 200) + '…' : e.message) + '</div>' : '') +
            (e.correction ? '<div class="cor' + (e.statut === 'a_refaire' ? ' refaire' : '') + '"><b>Correction de Quincy :</b> ' + esc(e.correction) + '</div>' : '') + '</div>';
        }).join('');
      } catch (e) {}
    }
    go.onclick = async function () {
      var t = ta.value.trim();
      if (!imgs.length && t.length < 3) { msg.style.color = '#FF4466'; msg.textContent = 'Ajoute une capture ou explique ce que tu as fait.'; return; }
      go.disabled = true; msg.style.color = 'rgba(232,244,255,0.6)'; msg.textContent = 'Envoi…';
      try {
        var r = await DHA.rpc('dha_exercice_rendre', { p_token: await DHA.token(), p_module: cleExo, p_titre: titreModule, p_message: t, p_images: imgs });
        if (!r || !r.ok) throw new Error(r && r.erreur === 'limite' ? 'Tu as déjà envoyé beaucoup d\'exercices aujourd\'hui, réessaie demain.' : r && r.erreur === 'session' ? 'Ta session a expiré, reconnecte-toi.' : 'Envoi impossible, réessaie.');
        try {
          var m = DHA.local() || {};
          fetch('https://formspree.io/f/mjgjrojb', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ _subject: 'DHA 📤 Exercice rendu — ' + (m.pseudo || 'membre') + ' — ' + titreModule, membre: m.pseudo || '', module: titreModule, message: t, captures: imgs.length }) }).catch(function () {});
        } catch (e2) {}
        ta.value = ''; imgs = []; peindreImgs();
        msg.style.color = '#00FF88'; msg.textContent = '✅ Exercice envoyé ! Quincy va le corriger.';
        chargerHist();
      } catch (err) { msg.style.color = '#FF4466'; msg.textContent = err.message; }
      go.disabled = false;
    };
    chargerHist();
  }

  /* ---------- Modèle à télécharger dans les modules Plan, Journal et Exécution ---------- */
  var MODELES = { m13: ['📝', 'Ton modèle de plan de trading', 'ressources/DHA-plan-de-trading.pdf', 'PDF'],
                  m14: ['📊', 'Ton journal de trading (Excel)', 'ressources/DHA-journal-de-trading.xlsx', 'EXCEL'],
                  m15: ['✅', 'Ta checklist pré-trade à imprimer', 'ressources/DHA-checklist-pre-trade.pdf', 'PDF'] };
  var numFichier = (location.pathname.match(/dha-module(\d+)\.html/) || [])[1];
  var modele = numFichier && MODELES['m' + numFichier];
  var ancreModele = exoBtn ? (exoBtn.closest('.exercice-section') || exoBtn.parentNode) : document.querySelector('.quiz-section');
  if (modele && ancreModele) {
    var dl = document.createElement('a');
    dl.href = modele[2]; dl.setAttribute('download', '');
    dl.style.cssText = 'display:flex;align-items:center;gap:12px;margin:14px 0;padding:14px 16px;border-radius:12px;border:1px solid rgba(0,212,255,0.4);background:rgba(0,212,255,0.07);color:#E8F4FF;text-decoration:none;';
    dl.innerHTML = '<span style="font-size:24px">' + modele[0] + '</span><span style="flex:1"><b>' + modele[1] + '</b><br><span style="font-size:12px;color:rgba(232,244,255,0.6)">À télécharger · aussi dans l\'onglet « Ressources »</span></span><span style="font-family:Orbitron,sans-serif;font-size:10px;color:#00D4FF;letter-spacing:1px">⬇ ' + modele[3] + '</span>';
    if (exoBtn) { var titre = ancreModele.querySelector('.exercice-step') || ancreModele.firstChild; ancreModele.insertBefore(dl, titre); }
    else ancreModele.parentNode.insertBefore(dl, ancreModele);
  }

  /* ---------- Quiz : réponses mélangées à chaque affichage ----------
     La lettre d'origine reste dans le texte (utilisée par la correction),
     la lettre affichée (A, B, C…) suit le nouvel ordre. */
  var stQ = document.createElement('style');
  stQ.textContent = '.quiz-option-letter.dqx{font-size:0!important}.quiz-option-letter.dqx::after{content:attr(data-l);font-size:var(--dqfs,13px)}';
  document.head.appendChild(stQ);
  function melangerQuiz() {
    document.querySelectorAll('.quiz-options').forEach(function (box) {
      var opts = Array.prototype.slice.call(box.querySelectorAll(':scope > .quiz-option'));
      if (opts.length < 2) return;
      for (var i = opts.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = opts[i]; opts[i] = opts[j]; opts[j] = t; }
      opts.forEach(function (o, k) {
        box.appendChild(o);
        var l = o.querySelector('.quiz-option-letter'); if (!l) return;
        if (!l.classList.contains('dqx')) { l.style.setProperty('--dqfs', getComputedStyle(l).fontSize); l.classList.add('dqx'); }
        l.setAttribute('data-l', String.fromCharCode(65 + k));
      });
    });
  }
  try { melangerQuiz(); } catch (e) {}
  window.dhaMelangerQuiz = melangerQuiz;

  /* ---------- Refaire le quiz ---------- */
  var quizBtn = document.getElementById('quiz-btn');
  if (!quizBtn || typeof submitQuiz !== 'function') return;

  var numModule = ((document.title.match(/Module\s+(\d+)/i) || [])[1]) || '';
  var cleQuizPage = (document.documentElement.innerHTML.match(/completedActions\.has\('(quiz_m\d+(?:_b\d+)?)'\)/) || [])[1];
  function revisionDejaFaite() { try { return !!cleQuizPage && completedActions.has(cleQuizPage + '_refait'); } catch (e) { return false; } }
  var retake = document.createElement('button');
  retake.type = 'button';
  retake.className = 'dha-retake';
  retake.textContent = '🔁 REFAIRE LE QUIZ — +' + XP_REFAIT + ' XP';
  var anchor = document.getElementById('quiz-result') || quizBtn;
  anchor.parentNode.insertBefore(retake, anchor.nextSibling);

  // Le bouton apparaît dès que le quiz est validé (ou déjà fait)
  setInterval(function () {
    retake.style.display = (quizBtn.disabled && !window.dhaQuizRetake) ? 'block' : 'none';
    retake.textContent = revisionDejaFaite() ? '🔁 REFAIRE LE QUIZ (RÉVISION)' : '🔁 REFAIRE LE QUIZ — +' + XP_REFAIT + ' XP';
  }, 400);

  retake.addEventListener('click', function () {
    window.dhaQuizRetake = true;
    try { quizDone = false; } catch (e) {}
    try { Object.keys(quizAnswers).forEach(function (k) { quizAnswers[k] = null; }); } catch (e) {}
    document.querySelectorAll('.quiz-option').forEach(function (o) {
      o.classList.remove('correct', 'wrong', 'selected');
      o.style.borderColor = ''; o.style.background = ''; o.style.color = '';
      var h = o.getAttribute('onclick');
      if (h) o.setAttribute('onclick', h); // réactive le clic retiré à la validation
    });
    document.querySelectorAll('.quiz-feedback').forEach(function (f) { f.className = 'quiz-feedback'; f.textContent = ''; });
    var res = document.getElementById('quiz-result'); if (res) res.classList.remove('show');
    quizBtn.disabled = false;
    quizBtn.textContent = '✓ VALIDER MES RÉPONSES';
    retake.style.display = 'none';
    try { melangerQuiz(); } catch (e) {}
    var first = document.querySelector('.quiz-question');
    if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  // Appelé par submitQuiz() quand c'est une 2e tentative
  window.dhaQuizRetakeReward = async function (cleQuiz) {
    var cle = cleQuiz + '_refait';
    var txt = document.getElementById('quiz-xp-text');
    var gagne = await awardXP(cle, XP_REFAIT, '🔁 Quiz refait — Module ' + numModule);
    if (txt) txt.textContent = gagne
      ? '🔁 Quiz refait : +' + XP_REFAIT + ' XP gagnés !'
      : '🔁 Quiz refait — les ' + XP_REFAIT + ' XP de révision sont déjà gagnés sur ce module.';
    window.dhaQuizRetake = false;
  };

  // Récupère si la révision a déjà été faite (pour ne pas redonner les XP)
  (async function () {
    try {
      var m = JSON.parse(localStorage.getItem('dha_member') || '{}');
      var cle = cleQuizPage;
      if (!m.pseudo || !cle) return;
      var d = await DHA.historique({ keys: [cle + '_refait'] });
      if (Array.isArray(d) && d.length) completedActions.add(cle + '_refait');
    } catch (e) {}
  })();
})();
