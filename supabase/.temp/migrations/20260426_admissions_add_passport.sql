-- Add passport_url column
ALTER TABLE admissions ADD COLUMN IF NOT EXISTS passport_url TEXT;

-- Create admissions-media bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('admissions-media', 'admissions-media', true)
ON CONFLICT (id) DO NOTHING;

-- RLS for bucket
-- Allow public anon users to upload (required for public application form)
CREATE POLICY "Anon users can upload admissions media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'admissions-media'
);

-- Allow anyone to read the public media
CREATE POLICY "Anyone can read admissions media"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'admissions-media'
);
