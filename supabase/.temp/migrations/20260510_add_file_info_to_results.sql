-- =============================================================
-- Add missing file_info column to results table
-- Used to store PDF file metadata (name, size) for pdf-upload reports
-- =============================================================

ALTER TABLE results
  ADD COLUMN IF NOT EXISTS file_info JSONB DEFAULT NULL;
