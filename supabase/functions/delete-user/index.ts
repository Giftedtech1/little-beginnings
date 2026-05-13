import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Verify caller is admin
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Missing Authorization header')
    const token = authHeader.replace('Bearer ', '')
    
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) throw new Error('Unauthorized')

    const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user.id).single()
    const adminRoles = ['admin', 'super_admin', 'admin_2', 'admin_3']
    if (!adminRoles.includes(profile?.role)) throw new Error('Forbidden: Admins only')

    // Parse request body for user ID to delete
    const { user_id } = await req.json()
    if (!user_id) throw new Error('Missing user_id to delete')

    // Delete the user from auth.users (cascades to profiles)
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user_id)
    if (deleteError) throw deleteError

    return new Response(
      JSON.stringify({ message: 'User deleted successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
