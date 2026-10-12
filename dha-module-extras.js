/* =========================================================
   DHA — Extras des modules
   À inclure juste avant </body> de chaque module :
   <script src="dha-module-extras.js"></script>
   1. Bouton « Refaire le quiz » (+10 XP, une seule fois par module)
   2. Encadré « Envoie une preuve de ton travail » sur les exercices
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

  /* ---------- Encadré preuve sur les exercices ---------- */
  var exoBtn = document.getElementById('exercice-btn');
  if (exoBtn) {
    var box = document.createElement('div');
    box.className = 'dha-proof';
    box.innerHTML =
      '<div class="dha-proof-title">📸 ENVOIE UNE PREUVE DE TON TRAVAIL</div>' +
      '<div class="dha-proof-text">Fais une capture d\'écran de ton exercice et envoie-la <strong>dans le groupe de la communauté</strong> ou <strong>directement en privé à Quincy</strong>. C\'est comme ça qu\'on peut te corriger et te faire progresser.</div>' +
      '<div class="dha-proof-btns">' +
        '<a href="' + LIEN_WHATSAPP + '" target="_blank" rel="noopener">💬 GROUPE WHATSAPP</a>' +
        '<a class="sec" href="' + LIEN_QUINCY + '" target="_blank" rel="noopener">📩 EN PRIVÉ À QUINCY</a>' +
      '</div>';
    exoBtn.parentNode.insertBefore(box, exoBtn);
  }

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
      var r = await fetch(SUPABASE_URL + '/rest/v1/xp_historique?membre_pseudo=eq.' + encodeURIComponent(m.pseudo) + '&action_key=eq.' + cle + '_refait&select=action_key',
        { headers: { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + SUPABASE_KEY } });
      var d = await r.json();
      if (Array.isArray(d) && d.length) completedActions.add(cle + '_refait');
    } catch (e) {}
  })();
})();
