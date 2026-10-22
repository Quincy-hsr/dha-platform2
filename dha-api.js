/* =========================================================
   DHA — Accès sécurisé à la base (Supabase)
   Toutes les pages passent par ces fonctions : plus aucune lecture directe
   des tables membres / xp_historique depuis le navigateur.
   À inclure AVANT les autres scripts : <script src="dha-api.js"></script>
   ========================================================= */
(function () {
  var URL_ = 'https://kdetwppxsfoagyndrlzr.supabase.co';
  var KEY_ = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkZXR3cHB4c2ZvYWd5bmRybHpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMzM3NjQsImV4cCI6MjA5MjgwOTc2NH0.OodaFQKEHcncDYdO6uM121NAUbyxD4UxpptSjzzZOi0';

  async function rpc(fn, args) {
    var r = await fetch(URL_ + '/rest/v1/rpc/' + fn, {
      method: 'POST',
      headers: { apikey: KEY_, Authorization: 'Bearer ' + KEY_, 'Content-Type': 'application/json' },
      body: JSON.stringify(args || {})
    });
    var txt = await r.text();
    var data = null; try { data = txt ? JSON.parse(txt) : null; } catch (e) { data = txt; }
    if (!r.ok) { var err = new Error((data && data.message) || ('Erreur ' + r.status)); err.status = r.status; err.data = data; throw err; }
    return data;
  }

  function local() { try { return JSON.parse(localStorage.getItem('dha_member') || 'null'); } catch (e) { return null; } }
  function save(m) { try { if (m && m.token) setTok(m.email, m.token); var c = Object.assign({}, m); delete c.password; localStorage.setItem('dha_member', JSON.stringify(c)); } catch (e) {} }
  function clear() { try { localStorage.removeItem('dha_member'); localStorage.removeItem('dha_token'); } catch (e) {} }
  // Le jeton est rangé à part (les pages réécrivent dha_member avec leur propre copie)
  function getTok() { try { return JSON.parse(localStorage.getItem('dha_token') || 'null'); } catch (e) { return null; } }
  function setTok(email, t) { try { localStorage.setItem('dha_token', JSON.stringify({ email: String(email || '').toLowerCase(), token: t })); } catch (e) {} }

  // Jeton de session. Les membres connectés avant la mise à jour sont reconnectés sans rien faire.
  var enCours = null;
  async function token() {
    var m = local(); if (!m || !m.email) return null;
    var tk = getTok();
    if (tk && tk.token && tk.email === String(m.email).toLowerCase()) {
      if (m.password) save(m);   // on retire l'ancien mot de passe stocké en clair
      return tk.token;
    }
    if (m.token) { setTok(m.email, m.token); return m.token; }
    if (!m.password) return null;
    if (!enCours) enCours = (async function () {
      try {
        var r = await rpc('dha_login', { p_email: m.email, p_password: m.password });
        if (r && r.token) { save(Object.assign({}, m, r.membre, { token: r.token })); return r.token; }
      } catch (e) { }
      return null;
    })();
    return enCours;
  }

  // Profil à jour (null = session invalide ou accès retiré)
  async function me() {
    var t = await token(); if (!t) return null;
    var m = await rpc('dha_me', { p_token: t });
    if (m) save(Object.assign({}, local() || {}, m, { token: t }));
    return m;
  }

  async function login(email, password) {
    var r = await rpc('dha_login', { p_email: email, p_password: password });
    if (r && r.token) save(Object.assign({}, r.membre, { token: r.token }));
    return r;
  }

  async function logout() {
    var t = await token();
    if (t) { try { await rpc('dha_logout', { p_token: t }); } catch (e) {} }
    clear();
  }

  async function historique(opts) {
    opts = opts || {};
    var t = await token(); if (!t) return [];
    return (await rpc('dha_historique', { p_token: t, p_since: opts.since || null, p_keys: opts.keys || null, p_limit: opts.limit || 1000 })) || [];
  }

  // XP gagnée sur la plateforme (le serveur vérifie l'action et le montant)
  async function award(key, amount, raison) {
    var t = await token(); if (!t) return { erreur: 'session' };
    var r = await rpc('dha_award', { p_token: t, p_key: key, p_amount: amount, p_raison: raison });
    if (r && typeof r.xp === 'number') { var m = local(); if (m) { m.xp = r.xp; save(m); } }
    return r;
  }

  /* ---------- admin (Cerveau / admin) ---------- */
  var CLE_ADMIN = 'dha_admin_key';
  function adminKey() { try { return localStorage.getItem(CLE_ADMIN) || ''; } catch (e) { return ''; } }
  function admin(fn, args) { return rpc(fn, Object.assign({ p_key: adminKey() }, args || {})); }

  // Demande le code admin une fois par appareil, puis lance cb()
  function adminGate(cb) {
    var essai = adminKey();
    (essai ? rpc('dha_admin_check', { p_key: essai }) : Promise.resolve(false)).then(function (ok) {
      if (ok) { cb(); return; }
      var ov = document.createElement('div');
      ov.style.cssText = 'position:fixed;inset:0;z-index:2147483000;background:#050914;display:flex;align-items:center;justify-content:center;padding:20px;font-family:system-ui,sans-serif';
      ov.innerHTML = '<form style="width:100%;max-width:360px;background:#0a1228;border:1px solid rgba(30,100,255,.3);border-radius:16px;padding:26px;color:#E8F4FF">' +
        '<div style="font-size:28px;margin-bottom:8px">🔒</div><h2 style="margin:0 0 6px;font-size:20px">Code admin</h2>' +
        '<p style="margin:0 0 16px;font-size:14px;color:rgba(232,244,255,.6)">Entre ton code une seule fois sur cet appareil.</p>' +
        '<input type="password" autocomplete="current-password" style="width:100%;box-sizing:border-box;padding:13px 14px;border-radius:10px;border:1px solid rgba(30,100,255,.35);background:#050914;color:#fff;font-size:16px" placeholder="dha-xxxx-xxxx-xxxx">' +
        '<div class="e" style="color:#FF4466;font-size:13px;min-height:18px;margin:8px 0"></div>' +
        '<button style="width:100%;padding:13px;border:0;border-radius:10px;background:linear-gradient(90deg,#1E64FF,#00D4FF);color:#fff;font-weight:700;font-size:15px;cursor:pointer">Entrer</button></form>';
      document.body.appendChild(ov);
      var f = ov.querySelector('form'), inp = ov.querySelector('input'), e = ov.querySelector('.e');
      setTimeout(function () { inp.focus(); }, 50);
      f.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var k = inp.value.trim(); if (!k) return;
        rpc('dha_admin_check', { p_key: k }).then(function (ok2) {
          if (!ok2) { e.textContent = 'Code incorrect.'; return; }
          try { localStorage.setItem(CLE_ADMIN, k); } catch (x) {}
          ov.remove(); cb();
        }).catch(function () { e.textContent = 'Connexion impossible, réessaie.'; });
      });
    }).catch(function () { cb(); });
  }

  window.DHA = { rpc: rpc, local: local, save: save, clear: clear, token: token, me: me, login: login, logout: logout,
    historique: historique, award: award, admin: admin, adminKey: adminKey, adminGate: adminGate, URL: URL_, KEY: KEY_ };
})();
