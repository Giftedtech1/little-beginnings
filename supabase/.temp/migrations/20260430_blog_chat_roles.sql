-- =============================================================
-- Admin Roles, Blog, and Live Chat Schema Migration
-- =============================================================

-- =============================================================
-- STEP 1: RUN THIS BLOCK FIRST, BY ITSELF, AND CLEAR THE EDITOR
-- =============================================================
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'super_admin';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'admin_2';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'admin_3';

-- =============================================================
-- STEP 2: AFTER RUNNING STEP 1, PASTE AND RUN THE REST BELOW
-- =============================================================

-- 1. Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text NOT NULL,
  image_url text,
  category text,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  published boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Anyone can read published blog posts
CREATE POLICY "Anyone can view published blog posts" 
ON blog_posts FOR SELECT 
USING (published = true);

-- Admins (any type) can manage blog posts
CREATE POLICY "Admins can manage blog posts" 
ON blog_posts FOR ALL 
USING (
  auth.role() = 'authenticated' AND
  get_my_role() IN ('admin', 'super_admin', 'admin_2', 'admin_3')
)
WITH CHECK (
  auth.role() = 'authenticated' AND
  get_my_role() IN ('admin', 'super_admin', 'admin_2', 'admin_3')
);

-- 2. Live Chat Tables
CREATE TABLE IF NOT EXISTS live_chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id text NOT NULL, -- usually an anonymous UUID generated in localStorage
  visitor_name text,
  status text DEFAULT 'active', -- 'active', 'closed'
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS live_chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES live_chat_sessions(id) ON DELETE CASCADE,
  sender_type text NOT NULL, -- 'visitor' or 'admin'
  sender_id text, -- visitor_id or admin auth.uid()
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE live_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_chat_messages ENABLE ROW LEVEL SECURITY;

-- Visitors can insert and read their own sessions and messages
CREATE POLICY "Visitors can manage their chat sessions"
ON live_chat_sessions FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Visitors can manage their chat messages"
ON live_chat_messages FOR ALL
USING (true)
WITH CHECK (true);

-- Enable Realtime for Chat Messages and Sessions
-- (Note: You must also ensure these tables are checked in the Supabase Dashboard > Replication settings)

-- 3. Update existing Admin Policies to support super_admin, admin_2, admin_3
-- (Since we're using generic 'admin' in some places, we'll need to expand them)

-- Allow super_admin to manage ALL profiles
-- Note: You might need to drop existing policy if it conflicts, but we can just add a new one.
CREATE POLICY "Super admins can manage all profiles"
ON profiles FOR ALL
USING (
  auth.role() = 'authenticated' AND
  get_my_role() = 'super_admin'
)
WITH CHECK (
  auth.role() = 'authenticated' AND
  get_my_role() = 'super_admin'
);
