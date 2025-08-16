
-- Ensure documents bucket exists (safe if already present)
do $$
begin
  insert into storage.buckets (id, name, public)
  values ('documents', 'documents', false);
exception
  when unique_violation then
    null;
end$$;

-- RLS on storage.objects (enabled by default, harmless to run)
alter table storage.objects enable row level security;

-- Allow anon and authenticated to upload ONLY under 'reseller-applications/**' in 'documents' bucket
create policy if not exists "Public can upload reseller application documents"
on storage.objects
for insert
to anon, authenticated
with check (
  bucket_id = 'documents'
  and name like 'reseller-applications/%'
);

-- Allow anon and authenticated to read ONLY those same documents
create policy if not exists "Public can read reseller application documents"
on storage.objects
for select
to anon, authenticated
using (
  bucket_id = 'documents'
  and name like 'reseller-applications/%'
);

-- Allow admins to manage all documents in the 'documents' bucket
create policy if not exists "Admins can manage all documents"
on storage.objects
for all
to authenticated
using (
  bucket_id = 'documents'
  and public.is_admin()
)
with check (
  bucket_id = 'documents'
  and public.is_admin()
);
