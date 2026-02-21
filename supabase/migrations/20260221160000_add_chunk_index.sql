-- =========================================================================
-- Add chunk_index to document_chunks for citation positioning
-- =========================================================================

-- 1. Add chunk_index column (nullable for backward compat with existing rows)
ALTER TABLE public.document_chunks
  ADD COLUMN IF NOT EXISTS chunk_index integer;

-- 2. Backfill existing rows: assign chunk_index based on creation order per document
WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY document_id ORDER BY created_at, id) - 1 AS idx
  FROM public.document_chunks
)
UPDATE public.document_chunks
SET chunk_index = numbered.idx
FROM numbered
WHERE public.document_chunks.id = numbered.id
  AND public.document_chunks.chunk_index IS NULL;

-- 3. Recreate match_documents to also return chunk_index
DROP FUNCTION IF EXISTS match_documents;

CREATE OR REPLACE FUNCTION match_documents (
  query_embedding vector(768),
  match_threshold float,
  match_count int,
  allowed_folder_ids text[]
)
RETURNS TABLE (
  id uuid,
  document_id uuid,
  content text,
  similarity float,
  chunk_index integer
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    document_chunks.id,
    document_chunks.document_id,
    document_chunks.content,
    1 - (document_chunks.embedding <=> query_embedding) AS similarity,
    document_chunks.chunk_index
  FROM document_chunks
  JOIN documents ON documents.id = document_chunks.document_id
  WHERE 1 - (document_chunks.embedding <=> query_embedding) > match_threshold
  AND documents.folder_id = ANY(allowed_folder_ids)
  ORDER BY document_chunks.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

