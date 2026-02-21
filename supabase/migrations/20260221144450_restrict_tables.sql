-- =========================================================================
-- Secure Tables (documents, document_chunks)
-- This migration enables RLS on previously unrestricted tables and enforces
-- that users can only interact with records tied to their clerk user ID
-- via request.jwt.claim.sub.
-- =========================================================================

-- 1. DOCUMENTS TABLE
-- Assuming 'documents' table exists and has 'uploader_id'.
-- In our upload logic, we inserted with `uploader_id: user.id`.
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only view their own documents"
  ON public.documents
  FOR SELECT
  USING (auth.uid()::text = uploader_id OR (current_setting('request.jwt.claim.sub', true) = uploader_id));

CREATE POLICY "Users can insert their own documents"
  ON public.documents
  FOR INSERT
  WITH CHECK (auth.uid()::text = uploader_id OR (current_setting('request.jwt.claim.sub', true) = uploader_id));

CREATE POLICY "Users can edit their own documents"
  ON public.documents
  FOR UPDATE
  USING (auth.uid()::text = uploader_id OR (current_setting('request.jwt.claim.sub', true) = uploader_id));

CREATE POLICY "Users can delete their own documents"
  ON public.documents
  FOR DELETE
  USING (auth.uid()::text = uploader_id OR (current_setting('request.jwt.claim.sub', true) = uploader_id));

-- 2. DOCUMENT CHUNKS TABLE
-- Assuming 'document_chunks' table exists and maps to documents via 'document_id'.
ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view chunks of their own documents"
  ON public.document_chunks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.documents
      WHERE public.documents.id = public.document_chunks.document_id
      AND (auth.uid()::text = public.documents.uploader_id OR current_setting('request.jwt.claim.sub', true) = public.documents.uploader_id)
    )
  );

CREATE POLICY "Users can insert chunks for their own documents"
  ON public.document_chunks
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.documents
      WHERE public.documents.id = public.document_chunks.document_id
      AND (auth.uid()::text = public.documents.uploader_id OR current_setting('request.jwt.claim.sub', true) = public.documents.uploader_id)
    )
  );

CREATE POLICY "Users can edit chunks for their own documents"
  ON public.document_chunks
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.documents
      WHERE public.documents.id = public.document_chunks.document_id
      AND (auth.uid()::text = public.documents.uploader_id OR current_setting('request.jwt.claim.sub', true) = public.documents.uploader_id)
    )
  );

CREATE POLICY "Users can delete chunks of their own documents"
  ON public.document_chunks
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.documents
      WHERE public.documents.id = public.document_chunks.document_id
      AND (auth.uid()::text = public.documents.uploader_id OR current_setting('request.jwt.claim.sub', true) = public.documents.uploader_id)
    )
  );
