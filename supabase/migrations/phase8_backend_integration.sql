-- =====================================================
-- Thesis Platform - Supabase Database Schema
-- Phase 8: Backend Integration
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. FOLDER NOTES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS folder_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  folder_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(folder_id, user_id)
);

-- Index for faster lookups
CREATE INDEX idx_folder_notes_folder_user ON folder_notes(folder_id, user_id);

-- RLS Policies
ALTER TABLE folder_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notes"
  ON folder_notes FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own notes"
  ON folder_notes FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own notes"
  ON folder_notes FOR UPDATE
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own notes"
  ON folder_notes FOR DELETE
  USING (auth.uid()::text = user_id);

-- =====================================================
-- 2. FOLDERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS folders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  team_id TEXT,
  color VARCHAR(20),
  icon VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_folders_user ON folders(user_id);
CREATE INDEX idx_folders_parent ON folders(parent_id);
CREATE INDEX idx_folders_team ON folders(team_id);

-- RLS Policies
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own folders"
  ON folders FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own folders"
  ON folders FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own folders"
  ON folders FOR UPDATE
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own folders"
  ON folders FOR DELETE
  USING (auth.uid()::text = user_id);

-- =====================================================
-- 3. FILES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  folder_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type VARCHAR(10),
  size BIGINT,
  storage_path TEXT NOT NULL,
  url TEXT,
  uploaded_by TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes
CREATE INDEX idx_files_folder ON files(folder_id);
CREATE INDEX idx_files_uploaded_by ON files(uploaded_by);

-- RLS Policies
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view files in their folders"
  ON files FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM folders
      WHERE folders.id = files.folder_id
      AND folders.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert files to their folders"
  ON files FOR INSERT
  WITH CHECK (
    auth.uid()::text = uploaded_by
    AND EXISTS (
      SELECT 1 FROM folders
      WHERE folders.id = files.folder_id
      AND folders.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can delete their own files"
  ON files FOR DELETE
  USING (auth.uid()::text = uploaded_by);

-- =====================================================
-- 4. QUICK LINKS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS quick_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  folder_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_url TEXT,
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_quick_links_folder ON quick_links(folder_id);

-- RLS Policies
ALTER TABLE quick_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view links in their folders"
  ON quick_links FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM folders
      WHERE folders.id = quick_links.folder_id
      AND folders.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert links to their folders"
  ON quick_links FOR INSERT
  WITH CHECK (
    auth.uid()::text = user_id
    AND EXISTS (
      SELECT 1 FROM folders
      WHERE folders.id = quick_links.folder_id
      AND folders.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can delete their own links"
  ON quick_links FOR DELETE
  USING (auth.uid()::text = user_id);

-- =====================================================
-- 5. FOLDER ACTIVITY TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS folder_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  folder_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  action VARCHAR(50) NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_folder_activity_folder ON folder_activity(folder_id);
CREATE INDEX idx_folder_activity_created ON folder_activity(created_at DESC);

-- RLS Policies
ALTER TABLE folder_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view activity in their folders"
  ON folder_activity FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM folders
      WHERE folders.id = folder_activity.folder_id
      AND folders.user_id = auth.uid()::text
    )
  );

-- =====================================================
-- 6. STORAGE BUCKET FOR FILES
-- =====================================================
-- Run this in Supabase Dashboard → Storage

-- Create bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('thesis-files', 'thesis-files', false)
ON CONFLICT DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload their own files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'thesis-files'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'thesis-files'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'thesis-files'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- =====================================================
-- 7. HELPER FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_folder_notes_updated_at
  BEFORE UPDATE ON folder_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_folders_updated_at
  BEFORE UPDATE ON folders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DONE! Schema is ready for Phase 8 integration
-- =====================================================
