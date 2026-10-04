/* =========================================================
   DHA — Contrôle d'accès des membres
   À inclure dans le <head> de CHAQUE page de la plateforme :
   <script src="dha-guard.js"></script>
   (pas sur la landing, l'inscription ni la connexion)
   ========================================================= */
(function () {
  const SUPABASE_URL = 'https://kdetwppxsfoagyndrlzr.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkZXR3cHB4c2ZvYWd5bmRybHpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMzM3NjQsImV4cCI6MjA5MjgwOTc2NH0.OodaFQKEHcncDYdO6uM121NAUbyxD4UxpptSjzzZOi0';
  const PAGE_CONNEXION = 'dha-connexion.html';
  const INTERVALLE_MS = 2 * 60 * 1000; // vérification toutes les 2 minutes

  function getMembreLocal() {
    try { return JSON.parse(localStorage.getItem('dha_member') || 'null'); }
    catch (e) { return null; }
  }

  function couperAcces() {
    try { localStorage.removeItem('dha_member'); } catch (e) {}
    window.location.replace(PAGE_CONNEXION + '?acces=retire');
  }

  function afficherPage() {
    document.documentElement.style.visibility = '';
  }

  // Pas de membre enregistré dans ce navigateur → connexion
  const local = getMembreLocal();
  if (!local || !local.email) {
    try { localStorage.removeItem('dha_member'); } catch (e) {}
    window.location.replace(PAGE_CONNEXION);
    return;
  }

  // On cache la page le temps de la première vérification
  document.documentElement.style.visibility = 'hidden';
  setTimeout(afficherPage, 4000); // sécurité : on affiche quoi qu'il arrive au bout de 4 s

  async function interrogerSupabase(colonnes) {
    const url = SUPABASE_URL + '/rest/v1/membres?email=eq.' +
      encodeURIComponent(local.email) + '&select=' + colonnes;
    return fetch(url, { headers: { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + SUPABASE_KEY } });
  }

  // Renvoie true si le membre a toujours accès, false sinon
  async function verifierAcces() {
    try {
      let res = await interrogerSupabase('email,actif');
      if (!res.ok) res = await interrogerSupabase('email'); // si la colonne "actif" n'existe pas encore
      if (!res.ok) { afficherPage(); return true; }         // souci réseau/serveur : on ne vire personne

      const data = await res.json();
      const membre = Array.isArray(data) ? data[0] : null;

      if (!membre || membre.actif === false) {
        couperAcces();
        return false;
      }
      afficherPage();
      return true;
    } catch (e) {
      afficherPage(); // hors ligne : on ne déconnecte pas
      return true;
    }
  }

  // Accessible depuis les autres scripts de la page, ex. avant d'ouvrir un module :
  //   if (!(await dhaVerifierAcces())) return;
  window.dhaVerifierAcces = verifierAcces;

  // 1. Au chargement
  verifierAcces();
  // 2. Toutes les 2 minutes, même si l'onglet reste ouvert sans rien toucher
  setInterval(verifierAcces, INTERVALLE_MS);
  // 3. Quand le membre revient sur l'onglet
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') verifierAcces();
  });
  window.addEventListener('focus', verifierAcces);
})();
