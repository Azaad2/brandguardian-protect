
-- 1) RPC to allow admins to add manual reseller applications safely, bypassing RLS
create or replace function public.admin_add_manual_reseller_application(p_email text, p_company_name text)
returns public.reseller_applications
language plpgsql
security definer
set search_path = public
as $$
declare
  v_app public.reseller_applications;
begin
  -- Ensure caller is admin
  if not public.is_admin() then
    raise exception 'Not authorized - admin access required';
  end if;

  insert into public.reseller_applications (
    email,
    company_name,
    business_type,
    ein_number,
    product_categories,
    sales_volume,
    wholesale_budget,
    phone,
    status,
    application_status,
    user_id
  )
  values (
    p_email,
    p_company_name,
    'manual',
    'manual-entry',
    array['other']::text[],
    'under_10k',
    'under_5k',
    'manual-entry',
    'pending',
    'submitted',
    null
  )
  returning * into v_app;

  return v_app;
end;
$$;

-- 2) Allow authenticated clients to call the RPC (function itself enforces admin)
grant execute on function public.admin_add_manual_reseller_application(text, text) to authenticated;
