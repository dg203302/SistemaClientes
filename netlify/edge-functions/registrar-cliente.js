/**
 * Edge Function: registrar-cliente
 * Método: POST
 * Body: { Telef, Nombre, Contra, Resp_1, Resp_2, Resp_3 }
 *
 * Ejecuta el INSERT de un nuevo cliente en Supabase.
 * El hashing de la contraseña y el encriptado de respuestas
 * se realizan en el frontend antes de llamar a esta función.
 */
export default async function handler(request, context) {
  // Solo aceptar POST
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método no permitido' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Variables de entorno (configurar en Netlify Dashboard)
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

  const { Telef, Nombre, Contra, Resp_1, Resp_2, Resp_3 } = body;

  // Validar campos requeridos
  if (!Telef || !Nombre || !Contra || !Resp_1 || !Resp_2 || !Resp_3) {
    return new Response(JSON.stringify({ error: 'Faltan campos requeridos' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Llamada a Supabase REST API
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/Clientes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({ Telef, Nombre, Contra, Resp_1, Resp_2, Resp_3 }),
  });

  if (!resp.ok) {
    const errorText = await resp.text();
    let errorMessage = 'Error al registrar el cliente';

    // Detectar violación de clave primaria (usuario duplicado)
    if (resp.status === 409 || errorText.includes('duplicate key')) {
      errorMessage = 'duplicate key value violates unique constraint "Clientes_pkey"';
    }

    return new Response(JSON.stringify({ error: errorMessage, detail: errorText }), {
      status: resp.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
