/**
 * Edge Function: eliminar-cliente
 * Método: POST
 * Body: { Telef }
 *
 * Ejecuta el DELETE del cliente en Supabase.
 */
export default async function handler(request, context) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método no permitido' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const SUPABASE_URL = 'https://qxbkfmvugutmggqwxhrb.supabase.co'
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

  const { Telef } = body;

  if (!Telef) {
    return new Response(JSON.stringify({ error: 'Falta el campo requerido: Telef' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const resp = await fetch(
    `${SUPABASE_URL}/rest/v1/Clientes?Telef=eq.${encodeURIComponent(Telef)}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'return=minimal',
      },
    }
  );

  if (!resp.ok) {
    const errorText = await resp.text();
    return new Response(JSON.stringify({ error: 'Error al eliminar el cliente', detail: errorText }), {
      status: resp.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
