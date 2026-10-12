/* =========================================================
   DHA — Menu sur téléphone
   À inclure avant </body> de chaque page de la plateforme :
   <script src="dha-mobile-menu.js"></script>
   - Le menu de gauche glisse depuis le bord (au lieu d'être caché)
   - Ajoute le bouton ☰ sur les pages qui n'en ont pas (modules, niveaux)
   ========================================================= */
(function () {
  var sb = document.querySelector('.sidebar');
  if (!sb) return;

  var css = '' +
    '.dha-mm-btn{display:none;position:fixed;top:14px;left:14px;z-index:500;width:42px;height:42px;border-radius:10px;background:rgba(8,14,31,0.95);border:1px solid rgba(30,100,255,0.35);cursor:pointer;align-items:center;justify-content:center;flex-direction:column;gap:5px;padding:0;}' +
    '@media (max-width:768px){' +
      '.sidebar{display:flex!important;transform:translateX(-100%);transition:transform .3s ease;z-index:400!important;backdrop-filter:none!important;background:rgba(8,14,31,0.99)!important;overflow-y:auto;}' +
      '.sidebar.open{transform:translateX(0)!important;box-shadow:12px 0 40px rgba(0,0,0,0.6);}' +
      '.sidebar-overlay{z-index:350!important;}' +
      '.sidebar{padding-top:68px!important;}' +
      '.dha-mm-btn{display:flex;}' +
      'body.dha-mm-has-btn .topbar{padding-left:56px;min-height:42px;}' +
    '}' +
    '.dha-mm-btn span{display:block;width:20px;height:2px;background:#00D4FF;border-radius:2px;}' +
    '.dha-mm-btn:focus-visible{outline:2px solid #00D4FF;outline-offset:2px;}' +
    '.dha-mm-ov{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:350;}' +
    '.dha-mm-ov.show{display:block;}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  // La page a déjà son bouton ☰ (dashboard, formation, squad…) : la correction CSS suffit
  if (document.querySelector('.hamburger, [onclick*="toggleSidebar"]')) return;

  var ov = document.createElement('div'); ov.className = 'dha-mm-ov';
  var btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'dha-mm-btn';
  btn.setAttribute('aria-label', 'Ouvrir le menu'); btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '<span></span><span></span><span></span>';
  document.body.appendChild(ov); document.body.appendChild(btn);
  document.body.classList.add('dha-mm-has-btn');

  function ouvrir(o) {
    sb.classList.toggle('open', o);
    ov.classList.toggle('show', o);
    btn.setAttribute('aria-expanded', o ? 'true' : 'false');
    btn.setAttribute('aria-label', o ? 'Fermer le menu' : 'Ouvrir le menu');
  }
  btn.addEventListener('click', function () { ouvrir(!sb.classList.contains('open')); });
  ov.addEventListener('click', function () { ouvrir(false); });
  sb.addEventListener('click', function (e) { if (e.target.closest('a')) ouvrir(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') ouvrir(false); });
})();
