-- DHA — Sécurité, étapes 2 et 3 (déjà appliquées le 23/10/2026)
-- Mots de passe chiffrés (bcrypt)
update public.membres set password = public._dha_hash(password)
 where password is not null and password <> '' and password not like '$2%';
-- Tables verrouillées : plus aucun accès direct avec la clé publique (tout passe par les fonctions dha_*)
alter table public.membres enable row level security;
alter table public.xp_historique enable row level security;
alter policy "allow anon update" on public.membres using (false) with check (false);
alter policy "candidatures_select" on public.candidatures using (false);
alter policy "candidatures_update" on public.candidatures using (false) with check (false);
alter policy "cerveau acces" on public.cerveau_docs using (false) with check (false);
-- (le formulaire de candidature garde le droit d'envoyer une candidature : policy candidatures_insert)
