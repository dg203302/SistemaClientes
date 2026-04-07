/**
 * Edge Function: actualizar-preguntas
 * Método: POST
 * Body: { Telef, Resp_1, Resp_2, Resp_3 }
 *
 * Ejecuta el UPDATE de las respuestas de seguridad en Supabase.
 * El encriptado de las respuestas ya fue aplicado en el frontend.
 */
export default async function handler(request, context) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método no permitido' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const SUPABASE_URL = Deno.env.get('Supabase_url');
  const SUPABASE_SERVICE_KEY = Deno.env.get('Supabase_pk');

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return new Response(JSON.stringify({ error: 'Configuración del servidor incompleta' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Body inválido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { Telef, Resp_1, Resp_2, Resp_3 } = body;

  if (!Telef || !Resp_1 || !Resp_2 || !Resp_3) {
    return new Response(JSON.stringify({ error: 'Faltan campos requeridos' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const resp = await fetch(
    `${SUPABASE_URL}/rest/v1/Clientes?Telef=eq.${encodeURIComponent(Telef)}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({ Resp_1, Resp_2, Resp_3 }),
    }
  );

  if (!resp.ok) {
    const errorText = await resp.text();
    return new Response(JSON.stringify({ error: 'Error al actualizar las preguntas de seguridad', detail: errorText }), {
      status: resp.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
