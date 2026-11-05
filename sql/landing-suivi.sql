-- Suivi de la page vidéo (dha-video.html) : vues, clics sur la vidéo, clics sur les boutons de candidature
-- Les visiteurs peuvent seulement AJOUTER une ligne ; seul le Cerveau (code admin) peut lire les chiffres.

create table if not exists public.landing_events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  event text not null check (event in ('vue','play','clic_cta')),
  visiteur text check (char_length(visiteur) <= 64),
  emplacement text check (char_length(emplacement) <= 40),
  provenance text check (char_length(provenance) <= 80),
  appareil text check (appareil in ('mobile','desktop'))
);
alter table public.landing_events enable row level security;
drop policy if exists landing_events_insert on public.landing_events;
create policy landing_events_insert on public.landing_events for insert to anon with check (true);
create index if not exists landing_events_created_idx on public.landing_events (created_at);

-- Stats pour le Cerveau, depuis une date (null = depuis le début)
create or replace function public.dha_admin_landing(p_key text, p_depuis timestamptz default null) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare d timestamptz := coalesce(p_depuis, '-infinity'::timestamptz);
begin
  perform public._dha_admin(p_key);
  return jsonb_build_object(
    'visiteurs', (select count(distinct visiteur) from landing_events where event='vue' and created_at>=d),
    'play',      (select count(distinct visiteur) from landing_events where event='play' and created_at>=d),
    'clic',      (select count(distinct visiteur) from landing_events where event='clic_cta' and created_at>=d),
    'cand',      (select count(*) from candidatures where source_lien='video' and created_at>=d),
    'boutons',   coalesce((select jsonb_agg(x order by x.n desc) from (select emplacement as k, count(distinct visiteur) as n from landing_events where event='clic_cta' and created_at>=d group by 1) x), '[]'::jsonb),
    'provenances', coalesce((select jsonb_agg(x order by x.n desc) from (select coalesce(provenance,'direct') as k, count(distinct visiteur) as n from landing_events where event='vue' and created_at>=d group by 1 limit 8) x), '[]'::jsonb),
    'appareils', coalesce((select jsonb_agg(x order by x.n desc) from (select coalesce(appareil,'?') as k, count(distinct visiteur) as n from landing_events where event='vue' and created_at>=d group by 1) x), '[]'::jsonb),
    'jours', coalesce((select jsonb_agg(x order by x.j) from (
        select j, sum(v)::int as v, sum(p)::int as p, sum(c)::int as c from (
          select (created_at at time zone 'Europe/Paris')::date as j,
                 count(distinct visiteur) filter (where event='vue') as v,
                 count(distinct visiteur) filter (where event='play') as p, 0 as c
          from landing_events where created_at >= greatest(d, now() - interval '30 days') group by 1
          union all
          select (created_at at time zone 'Europe/Paris')::date, 0, 0, count(*)
          from candidatures where source_lien='video' and created_at >= greatest(d, now() - interval '30 days') group by 1
        ) u group by j) x), '[]'::jsonb)
  );
end $$;
revoke all on function public.dha_admin_landing(text, timestamptz) from public;
grant execute on function public.dha_admin_landing(text, timestamptz) to anon, authenticated;
