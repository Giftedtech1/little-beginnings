-- =============================================================
-- Create public_media Storage Bucket + RLS Policies
-- Run this in Supabase Dashboard → SQL Editor
-- =============================================================

-- 1. Create the public_media bucket (public = anyone can view files)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'public_media',
  'public_media',
  true,
  10485760,  -- 10 MB max file size
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Allow authenticated admins to upload files
CREATE POLICY "Authenticated users can upload to public_media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'public_media');

-- 3. Allow everyone (public) to view/read files
CREATE POLICY "Public can read from public_media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'public_media');

-- 4. Allow authenticated users to update their own uploads
CREATE POLICY "Authenticated users can update public_media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'public_media');

-- 5. Allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete from public_media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'public_media');
