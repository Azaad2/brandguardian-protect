
-- 1) Fix audit functions that coalesce UUID with the text 'anonymous'
--    Cast auth.uid() to text before coalescing to avoid invalid UUID errors.

create or replace function public.audit_reseller_application_access()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Log access attempts (extend to write to an audit table if needed)
  raise log 'Reseller application accessed: % by user: %',
    coalesce(new.id, old.id),
    coalesce(auth.uid()::text, 'anonymous');

  return coalesce(new, old);
end;
$$;

create or replace function public.audit_subscription_access()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Log subscription access attempts for security monitoring
  raise log 'Subscription accessed: % by user: % (email: %)',
    coalesce(new.id, old.id),
    coalesce(auth.uid()::text, 'anonymous'),
    coalesce(auth.email(), 'no-email');

  return coalesce(new, old);
end;
$$;

-- 2) Add an FK so PostgREST recognizes the relationship for embedding
--    Use NOT VALID so existing orphaned rows (if any) don't block creation.
--    You can validate later with: ALTER TABLE ... VALIDATE CONSTRAINT ...

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'product_uploads_brand_id_fkey'
  ) then
    alter table public.product_uploads
    add constraint product_uploads_brand_id_fkey
    foreign key (brand_id) references public.profiles(id)
    on delete no action
    not valid;
  end if;
end;
$$;
