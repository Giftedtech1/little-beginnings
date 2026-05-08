-- =============================================================
-- Newsletter Subscribers — Schema Migration
-- Run this in the Supabase SQL Editor
-- =============================================================

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  subscribed_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Allow anonymous users to subscribe (insert)
-- But prevent them from reading the list (select)
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe to the newsletter"
ON newsletter_subscribers FOR INSERT
WITH CHECK (true);

-- Admins can read the list
CREATE POLICY "Admins can view newsletter subscribers"
ON newsletter_subscribers FOR SELECT
USING (
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);
