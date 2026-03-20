// supabase/functions/contact-form/index.ts
// Edge Function protegida para formulario de contacto
// Despliegue: supabase functions deploy contact-form

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const TO_EMAIL = Deno.env.get('TO_EMAIL') || 'info@camponuevo.com.ar'
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

// Rate limiting en memoria
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minuto
const RATE_LIMIT_MAX_REQUESTS = 5; // Máximo 5 requests por minuto

function sanitizeString(str: string): string {
  if (typeof str !== 'string') return '';
  
  return str
    .replace(/<[^>]*>/g, '') // Eliminar tags HTML
    .replace(/[<>'"]/g, '') // Eliminar caracteres peligrosos
    .replace(/javascript:/gi, '') // Eliminar javascript:
    .replace(/on\w+=/gi, '') // Eliminar event handlers
    .trim()
    .slice(0, 5000); // Limitar longitud
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateRateLimit(clientIp: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const normalizedIp = clientIp.split(',')[0].trim(); // Tomar primera IP si hay varias
  
  const record = rateLimitMap.get(normalizedIp);
  
  if (!record || now > record.resetAt) {
    rateLimitMap.set(normalizedIp, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }
  
  record.count++;
  return { allowed: true };
}

async function sendEmail(data: ContactFormData) {
  if (!RESEND_API_KEY) {
    console.log('RESEND_API_KEY no configurada, omitiendo envío de email');
    return null;
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2d5a27; border-bottom: 2px solid #2d5a27; padding-bottom: 10px;">
        Nuevo mensaje de contacto
      </h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">Nombre:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${escapeHtml(data.name)}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Teléfono:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${escapeHtml(data.phone || 'No proporcionado')}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Asunto:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${escapeHtml(data.subject)}</td>
        </tr>
      </table>
      <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 8px;">
        <h3 style="margin-top: 0;">Mensaje:</h3>
        <p style="white-space: pre-wrap; line-height: 1.6;">${escapeHtml(data.message)}</p>
      </div>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #666; font-size: 12px;">
        Enviado desde camponuevo.com.ar el ${new Date().toLocaleString('es-AR')}
      </p>
    </div>
  `

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Camponuevo <onboarding@resend.dev>',
        to: [TO_EMAIL],
        subject: `[Camponuevo] ${sanitizeString(data.subject)}`,
        html: htmlContent,
        reply_to: sanitizeString(data.email),
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Resend API error: ${error}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error enviando email:', error)
    throw error
  }
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

serve(async (req) => {
  // CORS headers más restrictivos
  const allowedOrigins = [
    'https://camponuevo.com.ar',
    'https://www.camponuevo.com.ar',
    'https://*.vercel.app' // Para desarrollo
  ];
  
  const origin = req.headers.get('origin') || '';
  const isAllowedOrigin = allowedOrigins.some(o => 
    o === origin || (o.includes('*') && origin.includes(o.replace('*.', '')))
  );
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': isAllowedOrigin ? origin : 'none',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  }

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Solo permitir POST
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Método no permitido' }),
      { status: 405, headers: corsHeaders }
    )
  }

  // Rate limiting
  const clientIp = req.headers.get('x-forwarded-for') || 
                   req.headers.get('cf-connecting-ip') || 
                   'unknown';
  
  const rateLimitCheck = validateRateLimit(clientIp);
  if (!rateLimitCheck.allowed) {
    return new Response(
      JSON.stringify({ error: 'Demasiadas solicitudes. Intenta más tarde.' }),
      { 
        status: 429, 
        headers: { ...corsHeaders, 'Retry-After': String(rateLimitCheck.retryAfter || 60) }
      }
    )
  }

  try {
    // Verificar API key para evitar accesos no autorizados
    const apiKey = req.headers.get('apikey');
    if (!apiKey || apiKey !== SUPABASE_ANON_KEY) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: corsHeaders }
      )
    }

    // Parse body
    let data: ContactFormData;
    try {
      data = await req.json()
    } catch {
      return new Response(
        JSON.stringify({ error: 'JSON inválido' }),
        { status: 400, headers: corsHeaders }
      )
    }

    // Validar campos requeridos
    if (!data.name || !data.email || !data.message) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos requeridos: nombre, email y mensaje son obligatorios' }),
        { status: 400, headers: corsHeaders }
      )
    }

    // Sanitizar inputs
    const sanitizedData: ContactFormData = {
      name: sanitizeString(data.name),
      email: sanitizeString(data.email).toLowerCase(),
      phone: data.phone ? sanitizeString(data.phone) : undefined,
      subject: sanitizeString(data.subject || 'Sin asunto'),
      message: sanitizeString(data.message)
    }

    // Validar email después de sanitizar
    if (!validateEmail(sanitizedData.email)) {
      return new Response(
        JSON.stringify({ error: 'El email no tiene un formato válido' }),
        { status: 400, headers: corsHeaders }
      )
    }

    // Validar longitud de campos
    if (sanitizedData.name.length < 2) {
      return new Response(
        JSON.stringify({ error: 'El nombre debe tener al menos 2 caracteres' }),
        { status: 400, headers: corsHeaders }
      )
    }

    if (sanitizedData.message.length < 10) {
      return new Response(
        JSON.stringify({ error: 'El mensaje debe tener al menos 10 caracteres' }),
        { status: 400, headers: corsHeaders }
      )
    }

    if (sanitizedData.message.length > 5000) {
      return new Response(
        JSON.stringify({ error: 'El mensaje no puede superar los 5000 caracteres' }),
        { status: 400, headers: corsHeaders }
      )
    }

    // Crear cliente de Supabase (verificado)
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    // Guardar en base de datos
    const { error: dbError } = await supabaseClient
      .from('contact_messages')
      .insert({
        name: sanitizedData.name,
        email: sanitizedData.email,
        phone: sanitizedData.phone || null,
        subject: sanitizedData.subject,
        message: sanitizedData.message,
        created_at: new Date().toISOString(),
        client_ip: clientIp.slice(0, 100) // Guardar IP truncada
      })

    if (dbError) {
      console.error('Database error:', dbError)
      return new Response(
        JSON.stringify({ error: 'Error al guardar el mensaje' }),
        { status: 500, headers: corsHeaders }
      )
    }

    // Enviar email
    try {
      await sendEmail(sanitizedData)
    } catch (emailError) {
      console.error('Email error (mensaje guardado igual):', emailError)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Mensaje enviado correctamente' 
      }),
      { status: 200, headers: corsHeaders }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: corsHeaders }
    )
  }
})
