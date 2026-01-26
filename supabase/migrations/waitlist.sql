create table if not exists waitlist (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  first_name text,
  last_name text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table waitlist enable row level security;

-- Allow public insert (anyone can join waitlist)
create policy "Allow public insert"
  on waitlist for insert
  with check (true);

-- Only admins/service role can view
create policy "Allow service role view"
  on waitlist for select
  using (auth.role() = 'service_role');
