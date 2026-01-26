
-- Switch from OpenAI (1536) to Gemini (768) embeddings

-- 1. Drop existing embedding column (will lose data, re-process files if needed)
alter table document_chunks drop column embedding;
alter table document_chunks add column embedding vector(768);

-- 2. Update search function signature for 768 dimensions
drop function if exists match_documents;

create or replace function match_documents (
  query_embedding vector(768),
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
