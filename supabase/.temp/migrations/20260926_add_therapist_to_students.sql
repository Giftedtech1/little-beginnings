-- Add therapist column to students table
ALTER TABLE students 
  ADD COLUMN IF NOT EXISTS therapist TEXT;

-- Reload Supabase PostgREST schema cache
NOTIFY pgrst, 'reload schema';
