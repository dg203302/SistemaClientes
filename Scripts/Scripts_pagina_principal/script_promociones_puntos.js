// Módulo de canje de puntos para Promociones_puntos.html
// Fuente de puntos: localStorage (puede reemplazarse por Supabase)

const STORAGE_KEYS = {
  USER: 'usuario_loggeado', // JSON con datos de usuario
  POINTS: 'puntos_usuario', // número entero
  REDEMPTIONS: 'canjes_usuario' // array de canjes
};

function getUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getPoints() {
  const raw = localStorage.getItem(STORAGE_KEYS.POINTS);
  const n = parseInt(raw, 10);
  return Number.isFinite(n) ? n : 0;
}

function setPoints(value) {
  localStorage.setItem(STORAGE_KEYS.POINTS, String(Math.max(0, value|0)));
}

function getRedemptions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REDEMPTIONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setRedemptions(list) {
  localStorage.setItem(STORAGE_KEYS.REDEMPTIONS, JSON.stringify(list));
}

// Genera un código de canje legible: prefijo + fecha + random
function generateRedeemCode(prefix = 'CANJE') {
  const ts = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${ts}-${rand}`;
}

// Lee puntos requeridos desde la tarjeta
function extractRequiredPoints(card) {
  // 1) Intentar vía data-attribute: data-puntos o data-required-points
  const ds = card.dataset || {};
  const dsVals = [ds.puntos, ds.requiredPoints, ds.required, ds.cost, ds.costo];
  for (const v of dsVals) {
    const n = parseInt(v, 10);
    if (Number.isFinite(n)) return n;
  }
  // 2) Buscar en .promo-meta el item que diga "Puntos necesarios:" y extraer el número
  const metaItems = card.querySelectorAll('.promo-meta li');
  for (const li of metaItems) {
    const text = li.textContent?.toLowerCase() || '';
    if (text.includes('puntos necesarios') || text.includes('puntos')) {
      const match = (text.match(/(\d{1,6})/) || [])[1];
      if (match) return parseInt(match, 10);
    }
  }
  // 3) Buscar elementos con clase auxiliar
  const alt = card.querySelector('[data-required], .required-points, [data-puntos]');
  if (alt) {
    const match = (alt.textContent?.match(/(\d{1,6})/) || [])[1] || alt.getAttribute('data-required') || alt.getAttribute('data-puntos');
    const n = parseInt(match, 10);
    if (Number.isFinite(n)) return n;
  }
  return NaN;
}

function updatePointsUI() {
  const pointsEl = document.getElementById('puntos-usuario');
  if (pointsEl) pointsEl.textContent = String(getPoints());
}

function notify(type, message) {
  // Simple feedback: alert; se puede reemplazar por toasts bonitos
  // type: 'success' | 'error' | 'info'
  alert(message);
}

function handleRedeem(btn) {
  const card = btn.closest('.promo-card');
  if (!card) return;

  const title = card.querySelector('.promo-title')?.textContent?.trim() || 'Promoción';
  const required = extractRequiredPoints(card);
  if (!Number.isFinite(required)) {
    notify('error', 'No se pudieron leer los puntos requeridos de la promoción.');
    return;
  }

  const current = getPoints();
  if (current < required) {
    notify('error', 'No tienes los puntos suficientes para canjear esta promoción.');
    return;
  }

  // Confirmación simple
  const ok = confirm(`¿Canjear "${title}" por ${required} puntos?`);
  if (!ok) return;

  // Descontar puntos
  const updated = current - required;
  setPoints(updated);
  updatePointsUI();

  // Generar código y guardar canje
  const code = generateRedeemCode('PROMO');
  const user = getUser();
  const canjes = getRedemptions();
  canjes.push({
    code,
    title,
    requiredPoints: required,
    redeemedAt: new Date().toISOString(),
    userId: user?.id || null
  });
  setRedemptions(canjes);

  notify('success', `Listo. Tu código de canje es: ${code}\nGuárdalo para presentarlo en el negocio.`);
}

function attachRedeemHandlers() {
  // Delegación: soporta tarjetas agregadas dinámicamente
  document.addEventListener('click', (ev) => {
    const btn = ev.target.closest?.('.promo-card .btn-canjear');
    if (!btn) return;
    ev.preventDefault();
    handleRedeem(btn);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  // Inicializa puntos en UI; si no existen, opcionalmente setear un valor demo:
  if (!localStorage.getItem(STORAGE_KEYS.POINTS)) setPoints(0);
  updatePointsUI();
  attachRedeemHandlers();
});
