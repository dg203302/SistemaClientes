import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'https://qxbkfmvugutmggqwxhrb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4YmtmbXZ1Z3V0bWdncXd4aHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNTEzMDEsImV4cCI6MjA3MzgyNzMwMX0.Qsx0XpQaSgt2dKUaLs8GvMmH8Qt6Dp_TQM25a_WOa8E';
const client = createClient(supabaseUrl, supabaseKey);

// Obtener datos del usuario logueado
const usuario_l = JSON.parse(localStorage.getItem("usuario_loggeado")) || {
  nombre_u: "Usuario",
  puntos_u: 0,
  tele_u: ""
};

// Función para refrescar puntos desde Supabase
export async function refrescarPuntos() {
  try {
    const { data, error } = await client
      .from("Clientes")
      .select("Puntos")
      .eq("Telef", usuario_l.tele_u)
      .single();

    if (error) throw error;

    usuario_l.puntos_u = data.Puntos;
    localStorage.setItem("usuario_loggeado", JSON.stringify(usuario_l));
    document.getElementById("cant_puntos").textContent = `Tiene: ${usuario_l.puntos_u} Puntos`;
  } catch (err) {
    console.error("Error al obtener puntos:", err.message);
    window.location.href = `Informe.html?informe=${encodeURIComponent(err.message)}&valor=8`;
  }
}

// Función para cerrar sesión
export function cerrarSesion() {
  localStorage.removeItem("usuario_loggeado");
  window.location.href = "/index.html";
}

// Inicializar valores al cargar la página
window.onload = function() {
  document.getElementById("Saludo").textContent = `Bienvenido: ${usuario_l.nombre_u}`;
  document.getElementById("cant_puntos").textContent = `Tiene: ${usuario_l.puntos_u} Puntos`;

  // Perfil
  document.getElementById("perfil-nombre").textContent = usuario_l.nombre_u;
  document.getElementById("perfil-telefono").textContent = usuario_l.tele_u;
  document.getElementById("perfil-fecha").textContent = usuario_l.fecha_registro || "01/01/2025";

  // Inicializar mapa de Google Maps (puedes cambiar coordenadas)
  const mapDiv = document.getElementById("map");
  if (mapDiv) {
    const lat = -34.6037;
    const lng = -58.3816;
    const map = new google.maps.Map(mapDiv, {
      center: { lat, lng },
      zoom: 15
    });
    new google.maps.Marker({ position: { lat, lng }, map: map });
  }
};
