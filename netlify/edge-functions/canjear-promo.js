/**
 * Edge Function: canjear-promo
 * Método: POST
 * Body: { Telef, idPromo }
 *
 * Maneja el canjeo de una promoción de puntos de forma atómica en el servidor:
 * 1. Lee la promo para obtener nombre, puntos y validez
 * 2. Lee el cliente para verificar puntos disponibles
 * 3. Valida vigencia y puntos
 * 4. UPDATE Clientes.Puntos (descuento)
 * 5. INSERT en Codigos_sorteos O Codigos_promos_puntos (según tipo de promo)
 * 6. INSERT en Historial_Puntos
 *
 * Responde con { ok, tipo, codigo, nuevosPuntos, titulo }
 */

const PROMOS_TABLE = 'Promos_puntos';
const CODIGOS_SORTEOS_TABLE = 'Codigos_sorteos';
const CODIGOS_PROMOS_TABLE = 'Codigos_promos_puntos';
const HISTORIAL_TABLE = 'Historial_Puntos';

const SUPABASE_URL = 'https://qxbkfmvugutmggqwxhrb.supabase.co'
const SUPABASE_SERVICE_KEY = Deno.env.get('Supabase_pk');

// ─── Helpers ────────────────────────────────────────────────────────────────

function generarCodigo() {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('');
}

/**
 * Verifica si la promo sigue vigente.
 * El campo `validez` viene como string "dd/mm/yyyy" o vacío.
 * Si no hay fecha, se considera vigente.
 */
function verificarVigencia(fecha_venc) {
  const raw = String(fecha_venc || '').trim();
  if (!raw) return true;

  const partes = raw.split('/').map(Number);
  if (partes.length !== 3) return true; // formato inesperado = vigente

  const [dia, mes, anio] = partes;
  const fecha = new Date(anio, mes - 1, dia);

  if (Number.isNaN(fecha.getTime())) return true;

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return hoy <= fecha;
}

function jsonHeaders() {
  return {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
  };
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function supabaseGet(endpoint) {
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
    headers: jsonHeaders(),
  });
  const texto = await resp.text();

  let data;
  try {
    data = JSON.parse(texto);
  } catch {
    return { data: null, error: `Respuesta no JSON: ${texto}` };
  }

  if (!resp.ok) {
    return { data: null, error: data };
  }

  return { data, error: null };
}

async function supabasePatch(endpoint, body) {
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
    method: 'PATCH',
    headers: { ...jsonHeaders(), 'Prefer': 'return=minimal' },
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    const error = await resp.text();
    return { error };
  }
  return { error: null };
}

async function supabaseInsert(endpoint, body) {
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
    method: 'POST',
    headers: { ...jsonHeaders(), 'Prefer': 'return=minimal' },
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    const errorText = await resp.text();
    return { error: errorText, status: resp.status };
  }
  return { error: null, status: resp.status };
}

// ─── Handler principal ───────────────────────────────────────────────────────

export default async function handler(request, context) {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Método no permitido' }, 405);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Body inválido' }, 400);
  }

  const { Telef, idPromo } = body;

  if (!Telef || !idPromo) {
    return jsonResponse({ error: 'Faltan campos requeridos: Telef e idPromo' }, 400);
  }

  // ── 1. Leer datos de la promo ──────────────────────────────────────────────
  const { data: promoRaw, error: promoError } = await supabaseGet(
    `${PROMOS_TABLE}?id_promo=eq.${encodeURIComponent(idPromo)}&select=Nombre_promo,cantidad_puntos_canjeo,validez&limit=1`
  );

  if (promoError) {
    return jsonResponse({ error: 'Error al leer la promo', detail: promoError }, 500);
  }

  if (!Array.isArray(promoRaw) || promoRaw.length === 0) {
    return jsonResponse({ error: 'Promo no encontrada', idPromo }, 404);
  }

  const promo = promoRaw[0];

  // ── 2. Leer puntos actuales del cliente ────────────────────────────────────
  const { data: clienteRaw, error: clienteError } = await supabaseGet(
    `Clientes?Telef=eq.${encodeURIComponent(Telef)}&select=Puntos&limit=1`
  );

  if (clienteError) {
    return jsonResponse({ error: 'Error al leer el cliente', detail: clienteError }, 500);
  }

  if (!Array.isArray(clienteRaw) || clienteRaw.length === 0) {
    return jsonResponse({ error: 'Cliente no encontrado', Telef }, 404);
  }

  const puntosActuales = Number(clienteRaw[0].Puntos) || 0;
  const puntosNecesarios = Number(promo.cantidad_puntos_canjeo) || 0;
  const vigente = verificarVigencia(promo.validez);
  const tienePuntos = puntosActuales >= puntosNecesarios;

  // ── 3. Validaciones ────────────────────────────────────────────────────────
  if (!tienePuntos && !vigente) {
    return jsonResponse({ error: 'Promoción vencida y puntos insuficientes' }, 422);
  }
  if (!tienePuntos) {
    return jsonResponse({
      error: 'Puntos insuficientes',
      puntosActuales,
      puntosNecesarios,
    }, 422);
  }
  if (!vigente) {
    return jsonResponse({ error: 'Promoción vencida', validez: promo.validez }, 422);
  }

  const nuevosPuntos = puntosActuales - puntosNecesarios;
  const esSorteo = typeof promo.Nombre_promo === 'string' &&
    promo.Nombre_promo.toLowerCase().includes('sorteo');

  // ── 4. UPDATE Clientes.Puntos ──────────────────────────────────────────────
  const { error: updateError } = await supabasePatch(
    `Clientes?Telef=eq.${encodeURIComponent(Telef)}`,
    { Puntos: nuevosPuntos }
  );

  if (updateError) {
    return jsonResponse({ error: 'Error al actualizar los puntos', detail: updateError }, 500);
  }

  // ── 5. INSERT código (sorteo o promo regular) ──────────────────────────────
  let codigoGenerado = null;

  if (esSorteo) {
    const MAX_INTENTOS = 5;
    let insertOk = false;

    for (let intento = 1; intento <= MAX_INTENTOS; intento++) {
      codigoGenerado = generarCodigo();
      const { error: insertError, status } = await supabaseInsert(
        CODIGOS_SORTEOS_TABLE,
        { Telef, codigo_sorteo: codigoGenerado }
      );

      if (!insertError) {
        insertOk = true;
        break;
      }

      // Solo reintentar si es conflicto de duplicado
      if (status !== 409 && !String(insertError).includes('duplicate key')) {
        // Error inesperado → revertir puntos
        await supabasePatch(
          `Clientes?Telef=eq.${encodeURIComponent(Telef)}`,
          { Puntos: puntosActuales }
        );
        return jsonResponse({ error: 'Error al registrar el código de sorteo', detail: insertError }, 500);
      }
    }

    if (!insertOk) {
      await supabasePatch(
        `Clientes?Telef=eq.${encodeURIComponent(Telef)}`,
        { Puntos: puntosActuales }
      );
      return jsonResponse({ error: 'No se pudo generar un código único para el sorteo' }, 500);
    }
  } else {
    // Promo regular
    codigoGenerado = generarCodigo();
    const { error: insertError } = await supabaseInsert(
      CODIGOS_PROMOS_TABLE,
      { Telef, codigo_canjeado: codigoGenerado, nom_promo: promo.Nombre_promo }
    );

    if (insertError) {
      await supabasePatch(
        `Clientes?Telef=eq.${encodeURIComponent(Telef)}`,
        { Puntos: puntosActuales }
      );
      return jsonResponse({ error: 'Error al registrar el código de promo', detail: insertError }, 500);
    }
  }

  // ── 6. INSERT Historial_Puntos ─────────────────────────────────────────────
  const { error: historialError } = await supabaseInsert(
    HISTORIAL_TABLE,
    { Telef_cliente: Telef, Cantidad_Puntos: -puntosNecesarios, Monto_gastado: 0 }
  );

  if (historialError) {
    // El código ya fue emitido, solo reportamos el error de historial
    return jsonResponse({ error: 'Error al registrar en historial', detail: historialError }, 500);
  }

  // ── Respuesta exitosa ──────────────────────────────────────────────────────
  return jsonResponse({
    ok: true,
    tipo: esSorteo ? 'sorteo' : 'regular',
    codigo: codigoGenerado,
    nuevosPuntos,
    puntosGastados: puntosNecesarios,
    titulo: promo.Nombre_promo,
  });
}
