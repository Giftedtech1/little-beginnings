import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // 2. Verify the user calling this endpoint is an admin
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Missing Authorization header')
    const token = authHeader.replace('Bearer ', '')
    
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) throw new Error('Unauthorized')

    // Verify the user is actually an admin in the profiles table
    const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') throw new Error('Forbidden: Admins only')

    // 3. Parse request body
    const { email, password, role, first_name, last_name } = await req.json()

    if (!email || !password || !role || !first_name || !last_name) {
      throw new Error('Missing required fields')
    }

    // 4. Create the new user using Admin API
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role, first_name, last_name, is_temp_password: true }
    })

    if (createError) throw createError

    // 5. Send Onboarding Email via Resend
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (RESEND_API_KEY) {
      const origin = req.headers.get('origin') || 'http://localhost:5173'
      const htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #14B0B0;">Welcome to Little Beginnings!</h2>
          <p>Hi ${first_name},</p>
          <p>An account has been created for you on the Little Beginnings Portal.</p>
          <p style="background-color: #f4f4f4; padding: 15px; border-radius: 8px;">
            <strong>Your login email:</strong> ${email}<br/>
            <strong>Your temporary password:</strong> ${password}
          </p>
          <p>Please log in using the link below. For your security, you will be asked to choose a new password the first time you log in.</p>
          <a href="${origin}/portal/login" style="display: inline-block; padding: 12px 24px; background-color: #14B0B0; color: white; text-decoration: none; border-radius: 6px; margin-top: 10px; font-weight: bold;">Log in to Portal</a>
          <p style="margin-top: 30px; font-size: 13px; color: #666;">If you have any questions, please reach out to the administration team.</p>
        </div>
      `;

      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`
          },
          body: JSON.stringify({
            from: 'Little Beginnings <onboarding@resend.dev>',
            to: email,
            subject: 'Welcome to Little Beginnings!',
            html: htmlContent
          })
        });

        if (!res.ok) {
          const errorData = await res.json();
          console.error("Resend error:", errorData);
        } else {
          console.log("Welcome email sent successfully to", email);
        }
      } catch (e) {
        console.error("Failed to send welcome email:", e);
      }
    } else {
      console.warn("RESEND_API_KEY not found. Skipping welcome email.");
    }
    // Note: The database trigger `handle_new_user()` will automatically catch this 
    // and create the corresponding row in the `profiles` table!

    return new Response(
      JSON.stringify({ message: 'User created successfully', user: newUser.user }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
