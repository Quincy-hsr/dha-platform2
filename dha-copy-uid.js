/* DHA — Accès copy trading validé : cinématique puis numéro UID Vantage
   DHACopyUid.ouvrir(function(uid){ ... })  → affiche « Ton accès a été validé », puis demande l'UID.
   Utilise DHA.rpc('dha_copy_uid'). */
(function () {
  if (window.DHACopyUid) return;
  var css = '' +
    '.cu-ov{position:fixed;inset:0;z-index:2147483200;display:flex;align-items:center;justify-content:center;overflow:auto;padding:24px 16px;background:radial-gradient(circle at 50% 35%,#06301f,#03060f 70%);font-family:"Exo 2",Manrope,sans-serif;color:#E8F4FF;animation:cuF .4s ease both}' +
    '.cu-rays{position:fixed;left:50%;top:35%;width:1400px;height:1400px;margin:-700px 0 0 -700px;background:repeating-conic-gradient(from 0deg,rgba(0,255,136,0.16) 0 6deg,transparent 6deg 18deg);animation:cuS 20s linear infinite;-webkit-mask:radial-gradient(circle,#000 8%,transparent 58%);mask:radial-gradient(circle,#000 8%,transparent 58%);pointer-events:none}' +
    '.cu-ring{position:fixed;left:50%;top:35%;width:140px;height:140px;margin:-70px 0 0 -70px;border-radius:50%;border:3px solid #00FF88;box-shadow:0 0 40px #00FF88;opacity:0;animation:cuR 2s ease-out infinite;pointer-events:none}' +
    '.cu-ring.r2{animation-delay:.7s}.cu-ring.r3{animation-delay:1.4s}' +
    '.cu-pt{position:fixed;left:50%;top:35%;width:9px;height:9px;border-radius:2px;background:#00FF88;animation:cuB 1.6s cubic-bezier(.1,.8,.3,1) both .25s;pointer-events:none}' +
    '.cu-box{position:relative;z-index:2;width:min(440px,100%);text-align:center}' +
    '.cu-k{font-family:Orbitron,sans-serif;font-size:11px;font-weight:900;letter-spacing:4px;color:#00FF88;animation:cuU .5s ease both .1s}' +
    '.cu-ic{width:112px;height:112px;margin:16px auto 14px;border-radius:30px;display:flex;align-items:center;justify-content:center;font-size:56px;background:linear-gradient(135deg,#00C46A,#00FF88);box-shadow:0 0 60px rgba(0,255,136,.7);animation:cuP .8s cubic-bezier(.2,1.7,.4,1) both .2s}' +
    '.cu-box h2{font-family:Orbitron,Sora,sans-serif;font-size:clamp(20px,6vw,26px);font-weight:900;margin:0 0 10px;letter-spacing:1px;text-shadow:0 0 26px rgba(0,255,136,.6);animation:cuU .5s ease both .5s}' +
    '.cu-box p{margin:0 auto 18px;max-width:380px;font-size:15px;line-height:1.55;color:rgba(232,244,255,.78);animation:cuU .5s ease both .65s}' +
    '.cu-b{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:14px 22px;border:0;border-radius:14px;font-family:Orbitron,sans-serif;font-size:11px;font-weight:700;letter-spacing:1.5px;cursor:pointer;background:linear-gradient(135deg,#00C46A,#00FF88);color:#03150D;animation:cuU .5s ease both .8s}' +
    '.cu-b:focus-visible,.cu-in:focus-visible{outline:2px solid #FFD700;outline-offset:2px}' +
    '.cu-card{background:rgba(8,14,31,.92);border:1px solid rgba(0,255,136,.35);border-radius:20px;padding:22px;text-align:left;animation:cuU .45s ease both}' +
    '.cu-card h3{font-family:Orbitron,sans-serif;font-size:14px;letter-spacing:1px;margin:0 0 8px}' +
    '.cu-how{display:grid;grid-template-columns:150px 1fr;gap:16px;align-items:center;margin:14px 0 16px}' +
    '.cu-ph{position:relative;width:150px;height:190px;border-radius:22px;border:2px solid rgba(255,255,255,.18);background:#0b0f1a;overflow:hidden}' +
    '.cu-ph .bar{position:absolute;left:0;right:0;top:0;height:64px;background:#121a2c}' +
    '.cu-ph .av{position:absolute;left:12px;top:14px;width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#1E64FF,#00D4FF);box-shadow:0 0 0 3px #FFD700;animation:cuPulse 1.6s ease-in-out infinite}' +
    '.cu-ph .ps{position:absolute;left:12px;top:72px;font-size:11px;font-weight:700;color:#fff}' +
    '.cu-ph .ud{position:absolute;left:10px;top:90px;padding:3px 6px;border-radius:6px;font-size:10px;font-weight:700;color:#FFD700;border:1.5px solid #FFD700;background:rgba(255,215,0,.08)}' +
    '.cu-ph .ln{position:absolute;left:12px;right:12px;height:8px;border-radius:4px;background:rgba(255,255,255,.07)}' +
    '.cu-steps{margin:0;padding-left:18px;font-size:14px;line-height:1.7;color:rgba(232,244,255,.82)}.cu-steps b{color:#FFD700}' +
    '.cu-in{width:100%;box-sizing:border-box;padding:14px;border-radius:12px;border:1px solid rgba(0,255,136,.4);background:#050914;color:#fff;font:700 18px "Exo 2",sans-serif;letter-spacing:2px}' +
    '.cu-e{color:#FF4466;font-size:13px;min-height:18px;margin:8px 0}' +
    '@keyframes cuF{from{opacity:0}to{opacity:1}}@keyframes cuS{to{transform:rotate(360deg)}}@keyframes cuR{0%{transform:scale(.4);opacity:1}100%{transform:scale(6);opacity:0}}' +
    '@keyframes cuP{0%{transform:scale(.2) rotate(-25deg);opacity:0}100%{transform:none;opacity:1}}@keyframes cuU{from{transform:translateY(14px);opacity:0}to{transform:none;opacity:1}}' +
    '@keyframes cuB{0%{transform:translate(0,0) rotate(0);opacity:1}100%{transform:translate(var(--dx),var(--dy)) rotate(560deg);opacity:0}}@keyframes cuPulse{0%,100%{box-shadow:0 0 0 3px #FFD700}50%{box-shadow:0 0 0 7px rgba(255,215,0,.35)}}' +
    '@media(max-width:480px){.cu-how{grid-template-columns:1fr;justify-items:center}}' +
    '@media(prefers-reduced-motion:reduce){.cu-ov *{animation:none!important}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function ouvrir(fini) {
    var ov = document.createElement('div');
    ov.className = 'cu-ov'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Accès validé');
    var pts = ''; for (var k = 0; k < 20; k++) { var a = k / 20 * 6.283, r = 150 + Math.random() * 170; pts += '<i class="cu-pt" style="--dx:' + Math.round(Math.cos(a) * r) + 'px;--dy:' + Math.round(Math.sin(a) * r) + 'px;animation-delay:' + (0.25 + Math.random() * 0.2).toFixed(2) + 's"></i>'; }
    ov.innerHTML = '<div class="cu-rays"></div><div class="cu-ring"></div><div class="cu-ring r2"></div><div class="cu-ring r3"></div>' + pts +
      '<div class="cu-box"><div class="cu-k">🔓 COPY TRADING</div><div class="cu-ic">✅</div><h2>TON ACCÈS A ÉTÉ VALIDÉ</h2>' +
      '<p>J\'ai vérifié ton compte, tout est bon. Dernière petite étape avant de découvrir tes canaux.</p>' +
      '<button type="button" class="cu-b" data-cu="suite">CONTINUER →</button></div>';
    document.body.appendChild(ov); document.documentElement.style.overflow = 'hidden';
    if (navigator.vibrate) try { navigator.vibrate([30, 40, 70]); } catch (e) {}
    ov.querySelector('[data-cu="suite"]').onclick = etapeUid;
    setTimeout(function () { var b = ov.querySelector('[data-cu="suite"]'); if (b) b.focus(); }, 900);

    function etapeUid() {
      ov.querySelector('.cu-box').innerHTML = '<div class="cu-card">' +
        '<div class="cu-k" style="text-align:left;margin-bottom:6px">DERNIÈRE ÉTAPE</div><h3>INDIQUE TON NUMÉRO UID VANTAGE</h3>' +
        '<div style="font-size:14px;color:rgba(232,244,255,.75);line-height:1.55">Il permet de relier ton compte Vantage à ton accès aux canaux.</div>' +
        '<div class="cu-how"><div class="cu-ph" aria-hidden="true"><div class="bar"></div><div class="av"></div><div class="ps">Ton pseudo</div><div class="ud">UID 12345678</div><div class="ln" style="top:122px"></div><div class="ln" style="top:138px;right:40px"></div><div class="ln" style="top:154px"></div></div>' +
        '<ol class="cu-steps"><li>Ouvre l\'appli <b>Vantage</b>.</li><li>Clique sur <b>ton profil</b>, en haut à gauche.</li><li>Ton <b>numéro UID</b> est juste en dessous de ton pseudo.</li></ol></div>' +
        '<label for="cu-uid" style="display:block;font-size:13px;font-weight:700;color:rgba(232,244,255,.7);margin-bottom:6px">Ton numéro UID</label>' +
        '<input class="cu-in" id="cu-uid" inputmode="numeric" autocomplete="off" placeholder="ex. 12345678" maxlength="20">' +
        '<div class="cu-e" id="cu-e" role="alert"></div>' +
        '<button type="button" class="cu-b" data-cu="ok" style="width:100%">VALIDER ET VOIR MES ACCÈS</button></div>';
      var inp = ov.querySelector('#cu-uid'), err = ov.querySelector('#cu-e'), b = ov.querySelector('[data-cu="ok"]');
      setTimeout(function () { inp.focus(); }, 100);
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') b.click(); });
      b.onclick = async function () {
        var u = inp.value.replace(/\s/g, '');
        if (!/^[0-9]{5,15}$/.test(u)) { err.textContent = 'Ton UID, c\'est uniquement des chiffres (entre 5 et 15). Vérifie dans ton profil Vantage.'; return; }
        b.disabled = true; b.textContent = 'ENREGISTREMENT…';
        try {
          var r = await DHA.rpc('dha_copy_uid', { p_token: await DHA.token(), p_uid: u });
          if (r && r.ok) { fin(u); return; }
          err.textContent = r && r.erreur === 'uid' ? 'Ce numéro ne ressemble pas à un UID Vantage.' : 'Impossible pour le moment, réessaie.';
        } catch (e) { err.textContent = 'Connexion impossible, réessaie.'; }
        b.disabled = false; b.textContent = 'VALIDER ET VOIR MES ACCÈS';
      };
    }
    function fin(u) {
      ov.querySelector('.cu-box').innerHTML = '<div class="cu-k">C\'EST BON</div><div class="cu-ic">🔑</div><h2>TU AS ACCÈS !</h2>' +
        '<p>Tes canaux sont dans l\'onglet <b>Tes accès</b>. Lis bien les 3 règles avant de prendre ton premier trade.</p>' +
        '<button type="button" class="cu-b" data-cu="go">VOIR MES ACCÈS</button>';
      ov.querySelector('[data-cu="go"]').onclick = function () { ov.remove(); document.documentElement.style.overflow = ''; if (fini) fini(u); };
    }
  }
  window.DHACopyUid = { ouvrir: ouvrir };
})();
