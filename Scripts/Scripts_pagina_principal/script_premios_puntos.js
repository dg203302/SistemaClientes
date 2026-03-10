const supabaseUrl = 'https://qxbkfmvugutmggqwxhrb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4YmtmbXZ1Z3V0bWdncXd4aHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNTEzMDEsImV4cCI6MjA3MzgyNzMwMX0.Qsx0XpQaSgt2dKUaLs8GvMmH8Qt6Dp_TQM25a_WOa8E';
const { createClient } = supabase;
const client = createClient(supabaseUrl, supabaseKey);
const usuario_l = leerUsuarioLoggeado();
const PROMOS_TABLE = 'Promos_puntos';

window.promosPuntosPageBridge = {
  refrescarPuntos: refrescarPuntosServidor,
  canjearPromo: canjearPromoPorId,
  recargarPromos: cargarPromociones,
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarPaginaPromos);
} else {
  inicializarPaginaPromos();
}

async function inicializarPaginaPromos() {
  sincronizarPuntosEnPagina();
  await cargarPromociones();
}

async function cargarPromociones() {
  try {
    const { data, error } = await client
      .from(PROMOS_TABLE)
      .select('*');

    if (error) {
      throw error;
    }

    const promos = Array.isArray(data) ? [...data].reverse().map(mapearPromo) : [];

    if (window.promosPuntosPage?.setData) {
      window.promosPuntosPage.setData(promos, obtenerPuntosUsuario());
    }
  } catch (error) {
    console.error(error);

    if (window.promosPuntosPage?.setData) {
      window.promosPuntosPage.setData([], obtenerPuntosUsuario());
    }

    if (typeof window.showError === 'function') {
      await window.showError('Error al cargar las promociones', 'Error');
    }
  }
}

function mapearPromo(promo) {
  const titulo = String(leerCampo(promo, ['Nombre_promo', 'nombre_promo', 'nombre', 'titulo']) || 'Promoción especial');

  return {
    id: leerCampo(promo, ['id_promo', 'id']) ?? crypto.randomUUID(),
    titulo,
    descripcion: String(leerCampo(promo, ['descripcion_promo', 'descripcion', 'detalle', 'detalle_promo']) || 'Canjeá esta promo con tus puntos acumulados.'),
    categoria: String(leerCampo(promo, ['categoria', 'Categoria', 'tipo', 'seccion']) || 'Especial'),
    costo: obtenerNumero(leerCampo(promo, ['cantidad_puntos_canjeo', 'costo', 'puntos']), 0),
    stock: obtenerStockPromocion(promo),
    img: obtenerUrlImagenPromo(promo),
    fallbackImg: crearPlaceholderImagen(titulo),
    validez: String(leerCampo(promo, ['validez', 'vigencia']) || ''),
    raw: promo,
  };
}

function leerUsuarioLoggeado() {
  try {
    return JSON.parse(localStorage.getItem('usuario_loggeado')) || null;
  } catch {
    return null;
  }
}

function obtenerPuntosUsuario() {
  return obtenerNumero(usuario_l?.puntos_u, 0);
}

function sincronizarPuntosEnPagina() {
  const cantidadPuntos = document.getElementById('puntos-usuario');

  if (cantidadPuntos) {
    cantidadPuntos.textContent = obtenerPuntosUsuario();
  }

  if (window.promosPuntosPage?.setPuntos) {
    window.promosPuntosPage.setPuntos(obtenerPuntosUsuario());
  }
}

function leerCampo(objeto, campos) {
  for (const campo of campos) {
    const valor = objeto?.[campo];

    if (valor === 0) {
      return valor;
    }

    if (typeof valor === 'string' && valor.trim() !== '') {
      return valor.trim();
    }

    if (valor !== null && valor !== undefined && valor !== '') {
      return valor;
    }
  }

  return null;
}

function obtenerNumero(valor, fallback = 0) {
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : fallback;
}

function obtenerStockPromocion(promo) {
  const rawStock = leerCampo(promo, ['stock', 'Stock', 'cantidad_stock', 'stock_disponible', 'cupos', 'disponibles']);

  if (rawStock === null) {
    return null;
  }

  const numero = Number(rawStock);
  return Number.isFinite(numero) ? Math.max(0, numero) : null;
}

function obtenerUrlImagenPromo(promo) {
  const rawUrl = String(leerCampo(promo, ['Url_img', 'url_img', 'urlImg', 'imagen', 'imagen_url', 'image_url']) || '').trim();

  if (!rawUrl) {
    return crearPlaceholderImagen(leerCampo(promo, ['Nombre_promo', 'nombre_promo', 'nombre', 'titulo']) || 'Promoción');
  }

  if (/^(https?:|data:|blob:|\/)/i.test(rawUrl) || rawUrl.startsWith('./') || rawUrl.startsWith('../')) {
    return rawUrl;
  }

  return `/${rawUrl.replace(/^\/+/, '')}`;
}

function crearPlaceholderImagen(texto) {
  const titulo = String(texto || 'Promoción').slice(0, 28);

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#3a2a16" />
          <stop offset="100%" stop-color="#140f0a" />
        </linearGradient>
        <linearGradient id="shine" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#f1d08a" stop-opacity="0.28" />
          <stop offset="100%" stop-color="#f1d08a" stop-opacity="0" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#bg)" />
      <circle cx="680" cy="70" r="170" fill="url(#shine)" />
      <circle cx="130" cy="410" r="150" fill="#c49a4a" fill-opacity="0.12" />
      <text x="60" y="255" fill="#f5edd8" font-family="Outfit, Arial, sans-serif" font-size="42" font-weight="600">${escapeHtml(titulo)}</text>
      <text x="60" y="305" fill="#c4b49a" font-family="Outfit, Arial, sans-serif" font-size="24">Imagen no disponible</text>
    </svg>
  `)}`;
}

function escapeHtml(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function verificar_validez(puntosUsu, puntosCanje) {
  if (isNaN(puntosUsu) || isNaN(puntosCanje)) return false;
  return puntosUsu >= puntosCanje;
}

function verificar_vencimiento(fecha_venc) {
  const [dia, mes, anio] = String(fecha_venc || '').split('/').map(Number);
  const fecha = new Date(anio, mes - 1, dia);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  if (Number.isNaN(fecha.getTime())) {
    return true;
  }

  return hoy <= fecha;
}

function generar_codigo() {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('');
}

async function insertarCodigoSorteoConReintentos(telef, maxAttempts = 5) {
  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const codigoGenerado = generar_codigo();
    const { error } = await client
      .from('Codigos_sorteos')
      .insert([{ Telef: telef, codigo_sorteo: codigoGenerado }]);

    if (!error) {
      return { codigo: codigoGenerado };
    }

    if (error?.code === '23505' || error?.status === 409 || error?.code === '409') {
      lastError = error;
      continue;
    }

    return { error };
  }

  return { error: lastError ?? new Error('No se pudo generar un código único') };
}

function verificar_promo(usuario, data) {
  if (verificar_validez(usuario.puntos_u, data.cantidad_puntos_canjeo) && verificar_vencimiento(data.validez)) {
    return true;
  }

  if (!verificar_validez(usuario.puntos_u, data.cantidad_puntos_canjeo) && !verificar_vencimiento(data.validez)) {
    window.showError('Promoción vencida y puntos insuficientes!', 'Atención');
    return false;
  }

  if (!verificar_validez(usuario.puntos_u, data.cantidad_puntos_canjeo) && verificar_vencimiento(data.validez)) {
    window.showError('Puntos insuficientes', 'Atención');
    return false;
  }

  if (verificar_validez(usuario.puntos_u, data.cantidad_puntos_canjeo) && !verificar_vencimiento(data.validez)) {
    window.showError('Promoción vencida!', 'Atención');
    return false;
  }

  return false;
}

async function Canjearpuntos(event) {
  const botonPromo = event.currentTarget;
  const idPromo = botonPromo.dataset.id;
  await canjearPromoPorId(idPromo);
}

async function canjearPromoPorId(idPromo, options = {}) {
  const { silentSuccess = false } = options;

  if (!usuario_l?.tele_u) {
    if (typeof window.showError === 'function') {
      await window.showError('No se encontró la sesión del usuario', 'Error');
    }
    return { ok: false };
  }

  const { data: promoData, error: promoError } = await client
    .from(PROMOS_TABLE)
    .select('Nombre_promo, cantidad_puntos_canjeo, validez')
    .eq('id_promo', idPromo)
    .single();

  if (promoError) {
    if (typeof window.showError === 'function') {
      await window.showError('Error al canjear los puntos: ' + promoError.message, 'Error');
    }
    return { ok: false, error: promoError };
  }

  if (!verificar_promo(usuario_l, promoData)) {
    return { ok: false };
  }

  if (typeof promoData.Nombre_promo === 'string' && promoData.Nombre_promo.toLowerCase().includes('sorteo')) {
    return await canjearSorteo(idPromo, promoData, { silentSuccess });
  }

  return await canjearPromoRegular(idPromo, promoData, { silentSuccess });
}

async function canjearSorteo(idPromo, promoData, options = {}) {
  const { silentSuccess = false } = options;
  const nuevosPuntos = usuario_l.puntos_u - promoData.cantidad_puntos_canjeo;

  const { error: updateError } = await client
    .from('Clientes')
    .update({ Puntos: nuevosPuntos })
    .eq('Telef', usuario_l.tele_u);

  if (updateError) {
    await window.showError('Error al actualizar los puntos', 'Error');
    return { ok: false, error: updateError };
  }

  const { codigo, error: insertError } = await insertarCodigoSorteoConReintentos(usuario_l.tele_u);
  if (insertError) {
    await client
      .from('Clientes')
      .update({ Puntos: usuario_l.puntos_u })
      .eq('Telef', usuario_l.tele_u);

    localStorage.setItem('usuario_loggeado', JSON.stringify(usuario_l));
    sincronizarPuntosEnPagina();
    await window.showError('No se pudo registrar el canjeo del sorteo. Intente nuevamente.', 'Error');
    return { ok: false, error: insertError };
  }

  const { error: historialError } = await client
    .from('Historial_Puntos')
    .insert([{ Telef_cliente: usuario_l.tele_u, Cantidad_Puntos: -promoData.cantidad_puntos_canjeo, Monto_gastado: 0 }]);

  if (historialError) {
    await window.showError('Error al registrar el canjeo en el historial', 'Error');
    return { ok: false, error: historialError };
  }

  usuario_l.puntos_u = nuevosPuntos;
  localStorage.setItem('usuario_loggeado', JSON.stringify(usuario_l));
  sincronizarPuntosEnPagina();

  if (!silentSuccess) {
    await window.showSuccess(`Promo canjeada exitosamente, revise el código (${codigo}) en su perfil`);
  }

  return {
    ok: true,
    promoId: idPromo,
    puntosActuales: usuario_l.puntos_u,
    puntosGastados: promoData.cantidad_puntos_canjeo,
    titulo: promoData.Nombre_promo,
  };
}

async function canjearPromoRegular(idPromo, promoData, options = {}) {
  const { silentSuccess = false } = options;
  const nuevosPuntos = usuario_l.puntos_u - promoData.cantidad_puntos_canjeo;

  const { error: updateError } = await client
    .from('Clientes')
    .update({ Puntos: nuevosPuntos })
    .eq('Telef', usuario_l.tele_u);

  if (updateError) {
    await window.showError('Error al actualizar los puntos', 'Error');
    return { ok: false, error: updateError };
  }

  const codigoGenerado = generar_codigo();
  const { error: insertError } = await client
    .from('Codigos_promos_puntos')
    .insert([{ Telef: usuario_l.tele_u, codigo_canjeado: codigoGenerado, nom_promo: promoData.Nombre_promo }]);
  const { error: historialError } = await client
    .from('Historial_Puntos')
    .insert([{ Telef_cliente: usuario_l.tele_u, Cantidad_Puntos: -promoData.cantidad_puntos_canjeo, Monto_gastado: 0 }]);

  if (insertError || historialError) {
    await window.showError('Error al registrar el canjeo', 'Error');
    return { ok: false, error: insertError || historialError };
  }

  usuario_l.puntos_u = nuevosPuntos;
  localStorage.setItem('usuario_loggeado', JSON.stringify(usuario_l));
  sincronizarPuntosEnPagina();

  if (!silentSuccess) {
    await window.showSuccess('Promo canjeada exitosamente, revise el código en su perfil');
  }

  return {
    ok: true,
    promoId: idPromo,
    puntosActuales: usuario_l.puntos_u,
    puntosGastados: promoData.cantidad_puntos_canjeo,
    titulo: promoData.Nombre_promo,
  };
}

async function refrescarPuntosServidor() {
  if (!usuario_l?.tele_u) {
    return { ok: false };
  }

  const { data, error } = await client
    .from('Clientes')
    .select('Puntos')
    .eq('Telef', usuario_l.tele_u)
    .single();

  if (error) {
    const valor = 8;
    window.location.href = `/Templates/Template_informe/Informe.html?informe=${encodeURIComponent(error.message)}&valor=${encodeURIComponent(valor)}`;
    return { ok: false, error };
  }

  usuario_l.puntos_u = data.Puntos;
  localStorage.setItem('usuario_loggeado', JSON.stringify(usuario_l));
  sincronizarPuntosEnPagina();

  return { ok: true, puntosActuales: usuario_l.puntos_u };
}