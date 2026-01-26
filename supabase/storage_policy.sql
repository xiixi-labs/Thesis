
-- 1. Ensure Bucket Exists and is Public (Optional, but easier for checking)
insert into storage.buckets (id, name, public) 
values ('documents', 'documents', true)
on conflict (id) do nothing;

-- 2. Allow Insert (Upload) for Anon users (since we are uploading from client without Supabase Auth session)
-- Make sure to enable RLS on storage.objects if not already enabled, though Supabase usually does.
create policy "Allow Public Uploads" 
on storage.objects for insert 
to anon 
with check (bucket_id = 'documents');

-- 3. Allow Select (Download/View) for Anon users
create policy "Allow Public Reads"
on storage.objects for select
to anon
using (bucket_id = 'documents');
