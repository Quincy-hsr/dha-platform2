-- Stats Instagram (@quincy_hsr) pour le Cerveau.
-- Remplies automatiquement chaque jour depuis Windsor.ai par une tâche programmée.
-- Aucune politique RLS : personne ne lit ces tables directement, seul le Cerveau (code admin) passe par dha_admin_instagram.

create table if not exists public.ig_profil (
  id int primary key default 1 check (id = 1),
  abonnes int,
  abonnements int,
  nb_posts int,
  maj timestamptz not null default now()
);

create table if not exists public.ig_jours (
  jour date primary key,
  nouveaux_abonnes int,
  portee int,
  vues int,
  comptes_engages int,
  likes int,
  commentaires int,
  partages int,
  enregistrements int,
  interactions int,
  maj timestamptz not null default now()
);

create table if not exists public.ig_posts (
  media_id text primary key,
  publie_le date,
  legende text,
  format text,
  lien text,
  vues int,
  portee int,
  enregistrements int,
  partages int,
  commentaires_dha int not null default 0,
  maj timestamptz not null default now()
);
create index if not exists ig_posts_publie_idx on public.ig_posts (publie_le);

alter table public.ig_profil enable row level security;
alter table public.ig_jours enable row level security;
alter table public.ig_posts enable row level security;

-- Stats pour le Cerveau sur les p_jours derniers jours
create or replace function public.dha_admin_instagram(p_key text, p_jours int default 30) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  n int := greatest(1, least(coalesce(p_jours, 30), 90));
  d date := (now() at time zone 'Europe/Paris')::date - n;
begin
  perform public._dha_admin(p_key);
  return jsonb_build_object(
    'profil', (select to_jsonb(p) from ig_profil p where id = 1),
    'jours', n,
    'total', (select jsonb_build_object(
        'nouveaux_abonnes', coalesce(sum(nouveaux_abonnes), 0),
        'vues', coalesce(sum(vues), 0),
        'interactions', coalesce(sum(interactions), 0),
        'partages', coalesce(sum(partages), 0),
        'enregistrements', coalesce(sum(enregistrements), 0))
      from ig_jours where jour > d),
    'precedent', (select jsonb_build_object(
        'nouveaux_abonnes', coalesce(sum(nouveaux_abonnes), 0),
        'vues', coalesce(sum(vues), 0))
      from ig_jours where jour > d - n and jour <= d),
    'dha', (select coalesce(sum(commentaires_dha), 0) from ig_posts where publie_le > d),
    'par_jour', coalesce((select jsonb_agg(jsonb_build_object('j', jour, 'v', vues, 'a', nouveaux_abonnes) order by jour)
      from ig_jours where jour > d), '[]'::jsonb),
    'posts', coalesce((select jsonb_agg(to_jsonb(x) order by x.publie_le desc) from (
        select media_id, publie_le, left(legende, 160) as legende, format, lien, vues, portee, enregistrements, partages, commentaires_dha
        from ig_posts where publie_le > (now() at time zone 'Europe/Paris')::date - 90) x), '[]'::jsonb),
    'maj', (select max(maj) from ig_jours)
  );
end $$;
revoke all on function public.dha_admin_instagram(text, int) from public;
grant execute on function public.dha_admin_instagram(text, int) to anon, authenticated;

-- ig_sync(...) : reçoit les réponses brutes de Windsor et met à jour les tables ig_*.
-- Réservée au rôle propriétaire (appelée par la tâche programmée via le connecteur Supabase), jamais depuis le site.
-- Définition appliquée par la migration "instagram_sync_function" (voir l'historique des migrations Supabase).
