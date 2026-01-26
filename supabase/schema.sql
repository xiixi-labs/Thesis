
-- Enable Vector Extension
create extension if not exists vector;

-- Folders (Simulating our workspace structure)
create table folders (
  id text primary key,
  org_id text not null,
  name text not null,
  description text,
  team_ids text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Documents Table
create table documents (
  id uuid primary key default gen_random_uuid(),
  folder_id text references folders(id),
  uploader_id text not null, -- references Clerk User ID
  name text not null,
  size text,
  mime_type text,
  content text, -- Extracted text content
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Document Chunks (for RAG)
create table document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references documents(id) on delete cascade,
  content text not null,
  embedding vector(1536), -- Assuming OpenAI embeddings
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Search Function
create or replace function match_documents (
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  allowed_folder_ids text[]
)
returns table (
  id uuid,
  document_id uuid,
  content text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    document_chunks.id,
    document_chunks.document_id,
    document_chunks.content,
    1 - (document_chunks.embedding <=> query_embedding) as similarity
  from document_chunks
  join documents on documents.id = document_chunks.document_id
  where 1 - (document_chunks.embedding <=> query_embedding) > match_threshold
  and documents.folder_id = any(allowed_folder_ids)
  order by document_chunks.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- Seed Data (Optional - just to match our mock)
insert into folders (id, org_id, name, description, team_ids) values
('fld_sales_playbook', 'org_acme', 'Sales Playbook', 'Pitch, objection handling, and talk tracks.', ARRAY['team_sales']),
('fld_sales_pricing', 'org_acme', 'Pricing and Packaging', 'Plans, pricing, discounts, and approvals.', ARRAY['team_sales']),
('fld_mkt_campaigns', 'org_acme', 'Campaign Briefs', 'Messaging, positioning, and launch plans.', ARRAY['team_marketing']),
('fld_company_overview', 'org_acme', 'Company Overview', 'Shared context for everyone.', ARRAY['team_sales', 'team_marketing'])
on conflict (id) do nothing;
