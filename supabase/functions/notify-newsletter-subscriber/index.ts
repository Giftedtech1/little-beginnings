import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email } = await req.json()

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    if (!RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not set, skipping email.')
      return new Response(JSON.stringify({ message: 'Email skipped (no API key)' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200
      })
    }

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #0192c6;">📬 New Newsletter Subscriber</h2>
        <p>A new visitor has subscribed to the Little Beginnings newsletter.</p>
        <div style="background-color: #f0f9ff; border-left: 4px solid #0192c6; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <strong>Subscriber Email:</strong> ${email}
        </div>
        <p style="font-size: 13px; color: #666;">You can view all subscribers in the Admin Panel under the <strong>Newsletter</strong> tab.</p>
      </div>
    `

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Little Beginnings <onboarding@resend.dev>',
        to: 'adminoffice@little-beginnings.org',
        subject: `New Newsletter Subscriber: ${email}`,
        html: htmlContent
      })
    })

    if (!res.ok) {
      const errData = await res.json()
      console.error('Resend error:', errData)
      throw new Error('Failed to send email via Resend')
    }

    return new Response(JSON.stringify({ message: 'Notification sent.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400
    })
  }
})
