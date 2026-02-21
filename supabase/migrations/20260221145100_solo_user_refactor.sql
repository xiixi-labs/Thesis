-- =========================================================================
-- Refactoring for Solo Users (Phase 9)
-- This migration strips multi-tenant overhead from the folders table
-- and enforces Row Level Security for solo user architecture.
-- =========================================================================

-- 1. DROP MULTI-TENANT COLUMNS
ALTER TABLE public.folders
  DROP COLUMN IF EXISTS org_id,
  DROP COLUMN IF EXISTS team_ids;

-- 2. ADD USER ID COLUMN
ALTER TABLE public.folders
  ADD COLUMN IF NOT EXISTS user_id TEXT;

-- 3. ENFORCE RLS ON FOLDERS
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can only view their own folders" ON public.folders;
DROP POLICY IF EXISTS "Users can insert their own folders" ON public.folders;
DROP POLICY IF EXISTS "Users can edit their own folders" ON public.folders;
DROP POLICY IF EXISTS "Users can delete their own folders" ON public.folders;

CREATE POLICY "Users can only view their own folders" ON public.folders FOR SELECT USING (auth.uid()::text = user_id OR current_setting('request.jwt.claim.sub', true) = user_id);
CREATE POLICY "Users can insert their own folders" ON public.folders FOR INSERT WITH CHECK (auth.uid()::text = user_id OR current_setting('request.jwt.claim.sub', true) = user_id);
CREATE POLICY "Users can edit their own folders" ON public.folders FOR UPDATE USING (auth.uid()::text = user_id OR current_setting('request.jwt.claim.sub', true) = user_id);
CREATE POLICY "Users can delete their own folders" ON public.folders FOR DELETE USING (auth.uid()::text = user_id OR current_setting('request.jwt.claim.sub', true) = user_id);
