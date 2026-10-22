-- =====================================================================
-- DHA — Sécurité, étape 1 : fonctions sécurisées (n'enlève aucun accès)
-- Les pages appellent ces fonctions au lieu de lire/écrire les tables.
-- =====================================================================

-- Sessions des membres (jeton remis à la connexion)
create table if not exists public.dha_sessions (
  token text primary key default encode(extensions.gen_random_bytes(32), 'hex'),
  membre_id uuid not null references public.membres(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '90 days'
);
create index if not exists dha_sessions_membre on public.dha_sessions(membre_id);
alter table public.dha_sessions enable row level security;   -- aucune policy : invisible depuis la clé publique

-- Réglages privés (code admin chiffré)
create table if not exists public.dha_config (cle text primary key, valeur text not null);
alter table public.dha_config enable row level security;

-- Colonnes du contrat de recommandation (la page les envoyait déjà, elles n'existaient pas)
alter table public.membres add column if not exists contrat_signe boolean default false;
alter table public.membres add column if not exists contrat_date timestamptz;
alter table public.membres add column if not exists contrat_nom text;

create index if not exists xp_historique_pseudo_key on public.xp_historique(membre_pseudo, action_key);
create index if not exists xp_historique_pseudo_date on public.xp_historique(membre_pseudo, created_at desc);

-- ---------- outils internes ----------
create or replace function public._dha_pub(m public.membres) returns jsonb
language sql immutable set search_path = public as $$
  select to_jsonb(m) - 'password' - 'RIB' || jsonb_build_object('rib', m."RIB");
$$;

create or replace function public._dha_jour() returns date
language sql stable as $$ select (now() at time zone 'Europe/Paris')::date $$;

create or replace function public._dha_membre(p_token text) returns public.membres
language plpgsql stable security definer set search_path = public as $$
declare m public.membres;
begin
  select mb.* into m from public.dha_sessions s join public.membres mb on mb.id = s.membre_id
   where s.token = p_token and s.expires_at > now();
  return m;   -- null si jeton invalide
end $$;

create or replace function public._dha_mdp_ok(p_saisi text, p_stocke text) returns boolean
language sql immutable set search_path = public, extensions as $$
  select case when p_stocke is null or p_saisi is null then false
              when p_stocke like '$2%' then extensions.crypt(p_saisi, p_stocke) = p_stocke
              else p_stocke = p_saisi end;
$$;

create or replace function public._dha_hash(p text) returns text
language sql volatile set search_path = public, extensions as $$
  select extensions.crypt(p, extensions.gen_salt('bf', 10));
$$;

create or replace function public._dha_session(p_id uuid) returns text
language plpgsql security definer set search_path = public as $$
declare t text;
begin
  delete from public.dha_sessions where expires_at < now();
  insert into public.dha_sessions(membre_id) values (p_id) returning token into t;
  return t;
end $$;

-- ---------- connexion / session ----------
create or replace function public.dha_login(p_email text, p_password text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare m public.membres;
begin
  select * into m from public.membres where lower(email) = lower(trim(p_email)) order by date_inscription desc nulls last limit 1;
  if m.id is null then return jsonb_build_object('erreur', 'introuvable'); end if;
  if not public._dha_mdp_ok(p_password, m.password) then return jsonb_build_object('erreur', 'mdp'); end if;
  if m.actif is false then return jsonb_build_object('erreur', 'inactif'); end if;
  -- mot de passe encore en clair → on le chiffre au passage
  if m.password not like '$2%' then update public.membres set password = public._dha_hash(p_password) where id = m.id; end if;
  return jsonb_build_object('token', public._dha_session(m.id), 'membre', public._dha_pub(m));
end $$;

create or replace function public.dha_me(p_token text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare m public.membres;
begin
  m := public._dha_membre(p_token);
  if m.id is null or m.actif is false then return null; end if;
  return public._dha_pub(m);
end $$;

create or replace function public.dha_logout(p_token text) returns void
language sql security definer set search_path = public as $$
  delete from public.dha_sessions where token = p_token;
$$;

-- ---------- inscription ----------
create or replace function public.dha_pseudo_dispo(p_pseudo text) returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'libre', not exists(select 1 from public.membres where lower(pseudo) = lower(trim(p_pseudo)) and coalesce(plan,'') <> 'demo'),
    'demo',  exists(select 1 from public.membres where lower(pseudo) = lower(trim(p_pseudo)) and plan = 'demo'));
$$;

create or replace function public.dha_signup(p jsonb) returns jsonb
language plpgsql security definer set search_path = public as $$
declare m public.membres; ps text := trim(p->>'pseudo'); em text := lower(trim(p->>'email'));
begin
  if coalesce(ps,'') = '' or coalesce(em,'') = '' or coalesce(p->>'password','') = '' then
    return jsonb_build_object('erreur', 'champs'); end if;
  if exists(select 1 from public.membres where lower(email) = em and coalesce(plan,'') <> 'demo') then
    return jsonb_build_object('erreur', 'email'); end if;
  -- pseudo pris par une démo : on libère le pseudo
  update public.membres set pseudo = pseudo || '_demo' || substr(md5(random()::text), 1, 4)
   where lower(pseudo) = lower(ps) and plan = 'demo';
  if exists(select 1 from public.membres where lower(pseudo) = lower(ps)) then
    return jsonb_build_object('erreur', 'pseudo'); end if;
  insert into public.membres(prenom, nom, pseudo, email, telephone, pays, ville, classe, password, xp, level, rang, statut, parraine_par, pack, commission_valides, date_inscription)
  values (p->>'prenom', p->>'nom', ps, em, coalesce(p->>'telephone',''), p->>'pays', p->>'ville', p->>'classe',
          public._dha_hash(p->>'password'), 10, 1, 'NEW HUSTLER', 'membre', coalesce(p->>'parraine_par',''), p->>'pack', 0, now())
  returning * into m;
  return jsonb_build_object('token', public._dha_session(m.id), 'membre', public._dha_pub(m));
end $$;

create or replace function public.dha_demo(p jsonb) returns jsonb
language plpgsql security definer set search_path = public as $$
declare m public.membres; ps text := trim(p->>'pseudo');
  nc text := regexp_replace(lower(coalesce(p->>'contact','')), '[^a-z0-9@]', '', 'g');
begin
  select * into m from public.membres where lower(pseudo) = lower(ps) limit 1;
  if m.id is not null then
    if m.plan = 'demo' and m.actif is not false
       and regexp_replace(lower(coalesce(m.telephone,'')), '[^a-z0-9@]', '', 'g') = nc then
      return jsonb_build_object('token', public._dha_session(m.id), 'membre', public._dha_pub(m));
    end if;
    return jsonb_build_object('erreur', 'pseudo');
  end if;
  insert into public.membres(prenom, nom, pseudo, email, password, telephone, pays, ville, classe, xp, level, rang, statut, plan, parraine_par, date_inscription)
  values (p->>'prenom', p->>'nom', ps, 'demo-' || substr(md5(random()::text), 1, 10) || '@demo.dha',
          public._dha_hash(md5(random()::text)), p->>'contact', '', '', 'trading', 10, 1, 'NEW HUSTLER', 'membre', 'demo',
          coalesce(p->>'parraine_par',''), now())
  returning * into m;
  return jsonb_build_object('token', public._dha_session(m.id), 'membre', public._dha_pub(m));
end $$;

-- ---------- données du membre ----------
create or replace function public.dha_historique(p_token text, p_since timestamptz default null, p_keys text[] default null, p_limit int default 1000)
returns table(action_key text, xp_gagne int, raison text, created_at timestamptz)
language plpgsql stable security definer set search_path = public as $$
declare m public.membres;
begin
  m := public._dha_membre(p_token);
  if m.id is null then return; end if;
  return query select h.action_key, h.xp_gagne, h.raison, h.created_at from public.xp_historique h
   where h.membre_pseudo = m.pseudo
     and (p_since is null or h.created_at >= p_since)
     and (p_keys is null or h.action_key = any(p_keys))
   order by h.created_at desc limit least(coalesce(p_limit,1000), 2000);
end $$;

-- XP gagnée sur la plateforme : seules les actions connues, au montant maximum prévu, une seule fois
create or replace function public.dha_award(p_token text, p_key text, p_amount int, p_raison text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare m public.membres; mx int; j date := public._dha_jour(); jt text := to_char(public._dha_jour(), 'YYYY-MM-DD');
  q text; nb int;
begin
  m := public._dha_membre(p_token);
  if m.id is null then return jsonb_build_object('erreur', 'session'); end if;
  if p_key is null or p_amount is null or p_amount <= 0 then return jsonb_build_object('erreur', 'action'); end if;

  if p_key ~ '^quiz_m[0-9]+(_b[0-9]+)?_refait$' then mx := 10;
  elsif p_key ~ '^quiz_m[0-9]+(_b[0-9]+)?$' then mx := 50;
  elsif p_key ~ '^bloc_m[0-9]+(_b[0-9]+)?$' then mx := 40;
  elsif p_key ~ '^exercice_m[0-9]+(_b[0-9]+)?$' then mx := 75;
  elsif p_key = 'bonus_m1_niveau2' then mx := greatest(0, 200 - coalesce(m.xp,0));
  elsif p_key = 'connexion_' || jt then mx := 10;
  elsif p_key ~ ('^quete_(co|mo|gr|an|ex|ga|pc|ag)_' || jt || '$') then
    mx := 25; q := substring(p_key from '^quete_([a-z]+)_');
    -- la quête doit vraiment être faite aujourd'hui
    if q = 'co' then
      if not exists(select 1 from public.xp_historique where membre_pseudo = m.pseudo and action_key = 'connexion_' || jt) then mx := 0; end if;
    elsif q = 'mo' then
      if not exists(select 1 from public.xp_historique where membre_pseudo = m.pseudo and action_key ~ '^bloc_m' and (created_at at time zone 'Europe/Paris')::date = j) then mx := 0; end if;
    else
      if not exists(select 1 from public.xp_historique where membre_pseudo = m.pseudo and action_key like 'man-%'
                     and q = any(string_to_array(action_key, '-')) and (created_at at time zone 'Europe/Paris')::date = j) then mx := 0; end if;
    end if;
  elsif p_key = 'quetes_toutes_' || jt then
    mx := 100;
    select count(*) into nb from public.xp_historique where membre_pseudo = m.pseudo and action_key ~ ('^quete_[a-z]+_' || jt || '$');
    if nb < 4 then mx := 0; end if;
  else
    return jsonb_build_object('erreur', 'action');
  end if;

  if mx <= 0 then return jsonb_build_object('erreur', 'non_valide'); end if;
  perform pg_advisory_xact_lock(hashtext(m.pseudo));
  if exists(select 1 from public.xp_historique where membre_pseudo = m.pseudo and action_key = p_key) then
    return jsonb_build_object('deja', true, 'xp', m.xp);
  end if;
  p_amount := least(p_amount, mx);
  update public.membres set xp = coalesce(xp,0) + p_amount, xp_semaine = coalesce(xp_semaine,0) + p_amount where id = m.id returning xp into nb;
  insert into public.xp_historique(membre_pseudo, xp_gagne, raison, action_key) values (m.pseudo, p_amount, left(coalesce(p_raison,''), 300), p_key);
  return jsonb_build_object('ok', true, 'xp', nb, 'gagne', p_amount);
end $$;

-- Parrainage : +150 XP par ami inscrit (hors démo), une seule fois par filleul
create or replace function public.dha_parrainages(p_token text) returns int
language plpgsql security definer set search_path = public as $$
declare m public.membres; f record; k text; n int := 0;
begin
  m := public._dha_membre(p_token);
  if m.id is null or coalesce(m.pseudo,'') = '' then return 0; end if;
  perform pg_advisory_xact_lock(hashtext(m.pseudo));
  for f in select pseudo from public.membres where parraine_par = m.pseudo and coalesce(plan,'') <> 'demo' loop
    k := 'parrainage_' || regexp_replace(coalesce(f.pseudo,''), '[^A-Za-z0-9_.]', '', 'g');
    if not exists(select 1 from public.xp_historique where membre_pseudo = m.pseudo and action_key = k) then
      update public.membres set xp = coalesce(xp,0) + 150, xp_semaine = coalesce(xp_semaine,0) + 150 where id = m.id;
      insert into public.xp_historique(membre_pseudo, xp_gagne, raison, action_key) values (m.pseudo, 150, '🤝 Ami parrainé : @' || f.pseudo, k);
      n := n + 1;
    end if;
  end loop;
  return n;
end $$;

create or replace function public.dha_filleuls(p_token text) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare m public.membres;
begin
  m := public._dha_membre(p_token);
  if m.id is null then return '[]'::jsonb; end if;
  return coalesce((select jsonb_agg(jsonb_build_object('pseudo', pseudo, 'prenom', prenom, 'date_inscription', date_inscription,
           'pack', pack, 'commission_valides', commission_valides, 'plan', plan) order by date_inscription desc)
    from public.membres where parraine_par = m.pseudo and coalesce(plan,'') <> 'demo'), '[]'::jsonb);
end $$;

-- Le membre modifie ses propres infos (RIB, contrat)
create or replace function public.dha_update_moi(p_token text, p jsonb) returns jsonb
language plpgsql security definer set search_path = public as $$
declare m public.membres;
begin
  m := public._dha_membre(p_token);
  if m.id is null then return jsonb_build_object('erreur', 'session'); end if;
  update public.membres set
    "RIB" = case when p ? 'rib' then p->>'rib' else "RIB" end,
    contrat_signe = case when p ? 'contrat_signe' then (p->>'contrat_signe')::boolean else contrat_signe end,
    contrat_date = case when p ? 'contrat_date' then (p->>'contrat_date')::timestamptz else contrat_date end,
    contrat_nom = case when p ? 'contrat_nom' then left(p->>'contrat_nom', 120) else contrat_nom end
  where id = m.id returning * into m;
  return public._dha_pub(m);
end $$;

-- Classement public : uniquement pseudo, XP et pack
create or replace function public.dha_leaderboard(p_limit int default 100) returns table(pseudo text, xp int, pack text)
language sql stable security definer set search_path = public as $$
  select pseudo, xp, pack from public.membres
   where coalesce(plan,'') <> 'demo' and actif is not false
   order by xp desc nulls last limit least(coalesce(p_limit,100), 500);
$$;

-- ---------- espace admin (Cerveau / admin), protégé par le code admin ----------
create or replace function public._dha_admin(p_key text) returns void
language plpgsql stable security definer set search_path = public as $$
declare h text;
begin
  select valeur into h from public.dha_config where cle = 'admin_hash';
  if h is null or p_key is null or extensions.crypt(p_key, h) <> h then
    raise exception 'acces_admin_refuse' using errcode = '42501';
  end if;
end $$;

create or replace function public.dha_admin_check(p_key text) returns boolean
language plpgsql stable security definer set search_path = public as $$
begin
  perform public._dha_admin(p_key); return true;
exception when others then return false;
end $$;

create or replace function public.dha_admin_membres(p_key text) returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  perform public._dha_admin(p_key);
  return coalesce((select jsonb_agg(public._dha_pub(m) order by m.xp desc nulls last) from public.membres m), '[]'::jsonb);
end $$;

create or replace function public.dha_admin_update_membre(p_key text, p_id uuid, p jsonb) returns jsonb
language plpgsql security definer set search_path = public as $$
declare k text; t text; m public.membres;
begin
  perform public._dha_admin(p_key);
  for k in select jsonb_object_keys(p) loop
    if k in ('password','id','RIB','rib') then continue; end if;
    select format_type(atttypid, atttypmod) into t from pg_attribute
     where attrelid = 'public.membres'::regclass and attname = k and attnum > 0 and not attisdropped;
    if t is null then continue; end if;
    execute format('update public.membres set %I = ($1->>%L)::%s where id = $2', k, k, t) using p, p_id;
  end loop;
  select * into m from public.membres where id = p_id;
  return public._dha_pub(m);
end $$;

create or replace function public.dha_admin_add_xp(p_key text, p_id uuid, p_amount int, p_raison text, p_action_key text) returns int
language plpgsql security definer set search_path = public as $$
declare m public.membres; nv int;
begin
  perform public._dha_admin(p_key);
  select * into m from public.membres where id = p_id;
  if m.id is null then raise exception 'membre_introuvable'; end if;
  update public.membres set xp = coalesce(xp,0) + p_amount, xp_semaine = coalesce(xp_semaine,0) + greatest(p_amount,0) where id = p_id returning xp into nv;
  insert into public.xp_historique(membre_pseudo, xp_gagne, raison, action_key) values (m.pseudo, p_amount, p_raison, p_action_key);
  return nv;
end $$;

create or replace function public.dha_admin_historique(p_key text, p_pseudos text[], p_since timestamptz default null)
returns setof public.xp_historique
language plpgsql stable security definer set search_path = public as $$
begin
  perform public._dha_admin(p_key);
  return query select * from public.xp_historique h
   where (p_pseudos is null or h.membre_pseudo = any(p_pseudos)) and (p_since is null or h.created_at >= p_since)
   order by h.created_at desc limit 5000;
end $$;

create or replace function public.dha_admin_candidatures(p_key text) returns setof public.candidatures
language plpgsql stable security definer set search_path = public as $$
begin
  perform public._dha_admin(p_key);
  return query select * from public.candidatures order by created_at desc;
end $$;

create or replace function public.dha_admin_update_candidature(p_key text, p_id uuid, p jsonb) returns void
language plpgsql security definer set search_path = public as $$
begin
  perform public._dha_admin(p_key);
  update public.candidatures set
    statut = case when p ? 'statut' then p->>'statut' else statut end,
    note = case when p ? 'note' then p->>'note' else note end
  where id = p_id;
end $$;

create or replace function public.dha_admin_docs(p_key text, p_colls text[]) returns setof public.cerveau_docs
language plpgsql stable security definer set search_path = public as $$
begin
  perform public._dha_admin(p_key);
  return query select * from public.cerveau_docs where p_colls is null or coll = any(p_colls);
end $$;

create or replace function public.dha_admin_doc_put(p_key text, p_rows jsonb) returns void
language plpgsql security definer set search_path = public as $$
begin
  perform public._dha_admin(p_key);
  insert into public.cerveau_docs(coll, id, data, updated_at)
  select r.coll, r.id, coalesce(r.data, '{}'::jsonb), coalesce(r.updated_at, now())
    from jsonb_populate_recordset(null::public.cerveau_docs, p_rows) r
  on conflict (coll, id) do update set data = excluded.data, updated_at = excluded.updated_at;
end $$;

create or replace function public.dha_admin_doc_del(p_key text, p_coll text, p_id text) returns void
language plpgsql security definer set search_path = public as $$
begin
  perform public._dha_admin(p_key);
  delete from public.cerveau_docs where coll = p_coll and id = p_id;
end $$;

-- Droits : la clé publique peut appeler les fonctions dha_*, pas les outils internes
revoke all on function public._dha_pub(public.membres), public._dha_jour(), public._dha_membre(text), public._dha_mdp_ok(text,text),
  public._dha_hash(text), public._dha_session(uuid), public._dha_admin(text) from public, anon, authenticated;
grant execute on function public.dha_login(text,text), public.dha_me(text), public.dha_logout(text), public.dha_pseudo_dispo(text),
  public.dha_signup(jsonb), public.dha_demo(jsonb), public.dha_historique(text,timestamptz,text[],int), public.dha_award(text,text,int,text),
  public.dha_parrainages(text), public.dha_filleuls(text), public.dha_update_moi(text,jsonb), public.dha_leaderboard(int),
  public.dha_admin_check(text), public.dha_admin_membres(text), public.dha_admin_update_membre(text,uuid,jsonb),
  public.dha_admin_add_xp(text,uuid,int,text,text), public.dha_admin_historique(text,text[],timestamptz),
  public.dha_admin_candidatures(text), public.dha_admin_update_candidature(text,uuid,jsonb),
  public.dha_admin_docs(text,text[]), public.dha_admin_doc_put(text,jsonb), public.dha_admin_doc_del(text,text,text)
  to anon, authenticated;
