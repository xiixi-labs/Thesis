-- ==============================================================================
-- 1. Create Tables
-- ==============================================================================

create table if not exists conversations (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  title text default 'New Conversation',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid references conversations(id) on delete cascade not null,
  role text not null, -- 'user' or 'assistant'
  content text not null,
  citations jsonb, -- Array of citations
  feedback integer, -- 1 like, -1 dislike
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 2. Indexes
-- ==============================================================================

create index if not exists idx_conversations_user_id on conversations(user_id);
create index if not exists idx_messages_conversation_id on messages(conversation_id);
create index if not exists idx_conversations_updated_at on conversations(updated_at desc);

-- ==============================================================================
-- 3. RLS - Row Level Security (Optional if using Service Role key)
-- ==============================================================================
-- We rely on the Server (using Service Key) to enforce user_id checks for now.
-- Enabling RLS is best practice, but minimal policy needed for now.

alter table conversations enable row level security;
alter table messages enable row level security;

-- Allow Service Role full access (implicit, but explicit policy helps if using RLS)
-- Since we are using Supabase JS with Service Key, it bypasses RLS automatically.
-- So we actually don't NEED policies if we only access via backend.
-- But if we access via frontend (anon key), we'd need them.
-- For now, keep it locked down (no public policies).
