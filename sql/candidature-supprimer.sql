-- =========================================================
-- DHA — Supprimer une candidature depuis le Cerveau (code admin requis)
-- =========================================================
create or replace function public.dha_admin_delete_candidature(p_key text, p_id uuid) returns boolean
language plpgsql security definer set search_path = public as $$
begin
  perform public._dha_admin(p_key);
  delete from public.candidatures where id = p_id;
  return found;
end $$;

revoke all on function public.dha_admin_delete_candidature(text, uuid) from public;
grant execute on function public.dha_admin_delete_candidature(text, uuid) to anon, authenticated;
