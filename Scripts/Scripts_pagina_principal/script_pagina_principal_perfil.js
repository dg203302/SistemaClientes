const supabaseUrl = 'https://qxbkfmvugutmggqwxhrb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4YmtmbXZ1Z3V0bWdncXd4aHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNTEzMDEsImV4cCI6MjA3MzgyNzMwMX0.Qsx0XpQaSgt2dKUaLs8GvMmH8Qt6Dp_TQM25a_WOa8E'
const { createClient } = supabase
const client = createClient(supabaseUrl, supabaseKey)
const usuario_l = JSON.parse(localStorage.getItem("usuario_loggeado"))

function corregir_fecha(fecha_iso){
    const fecha_fixed = fecha_iso.slice(0, 23) + "Z";
    const fecha = new Date(fecha_fixed);
    const opciones = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
    };
    return new Intl.DateTimeFormat("es-AR", opciones).format(fecha)
}

window.onload = function (){
    let nombre_perfil = document.getElementById("perfil-nombre")
    let tele_perfil = document.getElementById("perfil-tele")
    let puntos_perfil = document.getElementById("perfil-puntos")
    let miembro_desde = document.getElementById("perfil-desde")
    
    nombre_perfil.textContent =  usuario_l.nombre_u
    tele_perfil.textContent = usuario_l.tele_u
    puntos_perfil.textContent = usuario_l.puntos_u
    miembro_desde.textContent = corregir_fecha(usuario_l.f_creacion_u)

    cargar_codigos();
}
async function cargar_codigos(){
    const {data, error} = await client
    .from("Codigos_promos_puntos")
    .select("codigo_canjeado, nom_promo, fecha_creac, Canjeado")
    .eq("Telef", usuario_l.tele_u)
    if (error){
    await window.showError('Error al acceder las promociones', 'Error')
    }
    else if (!data || data.length === 0) {
      const cardUltimo = document.getElementsByClassName("card ultimo-canje");
      if (cardUltimo[0]) cardUltimo[0].style.display = "none";

      const contenedor_padre = document.getElementById("codigos_canjds");
      if (contenedor_padre) {
        const txt = document.createElement("p");
        txt.textContent = "sin codigos canjeados";
        contenedor_padre.appendChild(txt);
      }
    }
    else{
        let contenedor_padre = document.getElementById("codigos_canjds");
        data.reverse();
        for (const element of data) {
            const card = await generar_Codigos(element); // esperar que se genere
            contenedor_padre.appendChild(card);
            }
    }
}

async function generar_Codigos(datos_codigo){
    const article = document.createElement("article");
    article.classList.add("codigo-card");

    // Body
    const body = document.createElement("div");
    body.classList.add("codigo-body");

    // Head: título
    const head = document.createElement("div");
    head.classList.add("codigo-head");

    const titulo = document.createElement("h2");
    titulo.classList.add("codigo-title");
    const promo = datos_codigo.nom_promo;
    titulo.textContent = promo ? promo : "Promo desconocida";

    head.appendChild(titulo);

    // Descripción
    const desc = document.createElement("p");
    desc.classList.add("codigo-canjeado");
    desc.textContent = "  codido canjeado: "+datos_codigo.codigo_canjeado;

    // Meta
    const meta = document.createElement("ul");
    meta.classList.add("codigo-meta");

    const creacionLi = document.createElement("li");
    creacionLi.innerHTML = `<span class="meta-label">Canjeado:</span> <span class="meta-value">${corregir_fecha(datos_codigo.fecha_creac)}</span>`;
    
    const CanjeoLi = document.createElement("li");
    if(datos_codigo.Canjeado != 0){
      CanjeoLi.innerHTML = `<span class="meta-label">Codigo Validado</span>`;
    }
    else{
      CanjeoLi.innerHTML = `<span class="meta-label">Codigo sin validar</span>`;
    }

    meta.appendChild(creacionLi);
    meta.appendChild(CanjeoLi);
    // Ensamblar body
    body.appendChild(head);
    body.appendChild(desc);
    body.appendChild(meta);

    // Ensamblar artículo
    article.appendChild(body);

    return article;

}
async function obtener_nombre_promo(id) {
  const { data, error } = await client
    .from("Promos_puntos")
    .select("Nombre_promo")
    .eq("id_promo", id)
    .single();

  if (error) {
    console.error("Error al recuperar el nombre del código canjeado:", error.message);
    return null;
  }

  return data; // { Nombre_promo: "..." }
}

// ...existing code...

// Sección: Último código canjeado (solo promo + código desde BD)
document.addEventListener('DOMContentLoaded', async () => {
  const promoEl = document.getElementById('ultimo-canje-promo'); // ahora existe en el HTML
  const codeEl = document.getElementById('ultimo-canje-code') || document.getElementById('ultimo-codigo-valor');
  if (!codeEl) return;
  try {
    const { data, error } = await client
      .from('Codigos_promos_puntos')
      .select(`
        codigo_canjeado,
        nom_promo
      `)
      .eq('Telef', usuario_l.tele_u)
      .eq("Canjeado", 0)
      .order('fecha_creac', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    let nombrePromo = data.nom_promo ?? '';
    if (promoEl) promoEl.textContent = nombrePromo || 'Sin códigos canjeados aún';
    codeEl.textContent = data?.codigo_canjeado || (codeEl.style.display = 'none');
  } catch (e) {
    if (promoEl) promoEl.textContent = '—';
    codeEl.style.display = 'none';
    codeEl.title = 'Sin códigos canjeados aún';
    console.error(e);
  }
});