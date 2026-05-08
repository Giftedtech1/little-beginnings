import { createClient } from '@supabase/supabase-js'

// TODO: Replace with your actual Supabase project URL and anon key
// Store these in a .env file as:
//   VITE_SUPABASE_URL=https://your-project.supabase.co
//   VITE_SUPABASE_ANON_KEY=your-anon-key

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

const credentialsReady = Boolean(supabaseUrl && supabaseAnonKey)

if (!credentialsReady) {
  console.warn(
    '[Little Beginnings] ⚠️  Supabase credentials not set. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file. Portal features will be unavailable.'
  )
}

// Only create the client when we have real credentials — avoids a crash on the public site
export const supabase = credentialsReady
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

