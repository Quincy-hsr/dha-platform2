-- =========================================================
-- DHA — Validation d'une commission de parrainage en UNE opération
-- À coller une fois dans Supabase > SQL Editor > Run.
-- Avant : 2 écritures séparées (filleul puis parrain). Si la 2e échouait,
-- le filleul était marqué validé sans que le parrain soit crédité.
-- Maintenant : tout passe, ou rien ne passe.
-- =========================================================

create or replace function public.dha_admin_valider_commission(p_key text, p_id uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare f public.membres; p public.membres; parts int[]; n int; montant int;
begin
  perform public._dha_admin(p_key);

  select * into f from public.membres where id = p_id for update;
  if f.id is null then raise exception 'membre_introuvable'; end if;
  if f.parraine_par is null or f.plan = 'demo' then raise exception 'pas_de_parrainage'; end if;

  -- Même barème que l'admin : 20 % du pack, versé paiement par paiement
  parts := case coalesce(f.pack::text, '')
             when '180' then array[36]
             when '500' then array[33,33,34]
             when '750' then array[50,50,50]
           end;
  if parts is null then raise exception 'ancien_systeme'; end if;

  n := coalesce(f.commission_valides, 0);
  if n >= array_length(parts, 1) then raise exception 'deja_valide'; end if;
  montant := parts[n + 1];

  select * into p from public.membres
   where lower(pseudo) = lower(ltrim(f.parraine_par, '@')) for update;
  if p.id is null then raise exception 'parrain_introuvable'; end if;

  update public.membres set commission_valides = n + 1 where id = f.id returning * into f;
  update public.membres
     set commissions_encours = coalesce(commissions_encours, 0) + montant,
         commissions_total   = coalesce(commissions_total, 0) + montant,
         nb_affilies         = coalesce(nb_affilies, 0) + (case when n = 0 then 1 else 0 end)
   where id = p.id returning * into p;

  return jsonb_build_object('montant', montant, 'filleul', public._dha_pub(f), 'parrain', public._dha_pub(p));
end $$;

revoke all on function public.dha_admin_valider_commission(text, uuid) from public;
grant execute on function public.dha_admin_valider_commission(text, uuid) to anon, authenticated;
