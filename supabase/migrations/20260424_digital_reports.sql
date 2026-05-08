-- =============================================================
-- Digital Report Forms — Schema Migration
-- Run this in the Supabase SQL Editor
-- =============================================================

-- 1. Make file_url nullable (PDF link is now optional for digital reports)
ALTER TABLE results ALTER COLUMN file_url DROP NOT NULL;
ALTER TABLE results ALTER COLUMN file_url SET DEFAULT NULL;

-- 2. Add new columns for digital reports
ALTER TABLE results
  ADD COLUMN IF NOT EXISTS report_type TEXT NOT NULL DEFAULT 'pdf-link',
  ADD COLUMN IF NOT EXISTS form_data   JSONB,
  ADD COLUMN IF NOT EXISTS media_urls  JSONB DEFAULT '[]'::jsonb;

-- 3. Add a check so pdf-link reports must still have a file_url
-- (Optional safety constraint — remove if you prefer to handle this in the UI only)
-- ALTER TABLE results ADD CONSTRAINT check_pdf_has_url
--   CHECK (report_type != 'pdf-link' OR file_url IS NOT NULL);

-- =============================================================
-- Supabase Storage: results-media bucket
-- =============================================================

-- Create the bucket (public so URLs work without signing)
INSERT INTO storage.buckets (id, name, public)
VALUES ('results-media', 'results-media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload results media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'results-media'
  AND auth.role() = 'authenticated'
);

-- Allow anyone authenticated to read (parents, staff, admins)
CREATE POLICY "Authenticated users can read results media"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'results-media'
  AND auth.role() = 'authenticated'
);

-- Allow uploader to delete their own files
CREATE POLICY "Authenticated users can delete results media"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'results-media'
  AND auth.role() = 'authenticated'
);
