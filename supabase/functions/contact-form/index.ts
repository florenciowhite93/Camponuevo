// supabase/functions/contact-form/index.ts
// Para desplegar: supabase functions deploy contact-form

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const TO_EMAIL = 'info@camponuevo.com.ar'

interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

async function sendEmail(data: ContactFormData) {
  const htmlContent = `
    <h2>Nuevo mensaje de contacto</h2>
    <p><strong>Nombre:</strong> ${data.name}</p>
    <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
    <p><strong>Teléfono:</strong> ${data.phone || 'No proporcionado'}</p>
    <p><strong>Asunto:</strong> ${data.subject}</p>
    <h3>Mensaje:</h3>
    <p>${data.message.replace(/\n/g, '<br>')}</p>
    <hr>
    <p><small>Enviado desde camponuevo.com.ar el ${new Date().toLocaleString('es-AR')}</small></p>
  `

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Camponuevo <onboarding@resend.dev>',
      to: [TO_EMAIL],
      subject: `[Camponuevo] ${data.subject}`,
      html: htmlContent,
      reply_to: data.email,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Resend API error: ${error}`)
  }

  return await response.json()
}

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Parse body
    const data: ContactFormData = await req.json()

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos requeridos: nombre, email y mensaje son obligatorios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return new Response(
        JSON.stringify({ error: 'El email no tiene un formato válido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Save to database
    const { error: dbError } = await supabaseClient
      .from('contact_messages')
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject || 'Sin asunto',
        message: data.message,
      })

    if (dbError) {
      console.error('Database error:', dbError)
      return new Response(
        JSON.stringify({ error: 'Error al guardar el mensaje en la base de datos' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Send email via Resend
    if (RESEND_API_KEY) {
      try {
        await sendEmail(data)
      } catch (emailError) {
        console.error('Email error:', emailError)
        // Don't fail if email fails, message is already saved
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Mensaje enviado correctamente' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
