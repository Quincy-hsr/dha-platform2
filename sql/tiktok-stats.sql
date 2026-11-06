-- Stats TikTok pour le Cerveau (même principe que instagram-stats.sql).
-- Tables tt_profil, tt_jours, tt_videos (RLS activé, aucune politique : lecture seulement via dha_admin_tiktok).
-- tt_sync(p_jours, p_videos, p_comments) : reçoit les réponses brutes de Windsor (tiktok_organic), réservée au propriétaire,
--   appelée 2 fois par jour par la tâche programmée « Sync Instagram + TikTok vers le Cerveau ».
-- dha_admin_tiktok(p_key, p_jours) : renvoie la même forme que dha_admin_instagram pour l'affichage du Cerveau.
-- Définitions appliquées par la migration Supabase "tiktok_stats" (voir l'historique des migrations du projet DHA).

-- dha_admin_reseaux(p_key, p_debut, p_fin) : posts publiés, vues, nouveaux abonnés, interactions et « DHA » Insta + TikTok
--   sur une période (p_fin exclu), pour l'onglet « Mes stats ». Migration Supabase "reseaux_stats_periode".
