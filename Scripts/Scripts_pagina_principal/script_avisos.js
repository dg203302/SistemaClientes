const supabaseUrl = 'https://qxbkfmvugutmggqwxhrb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4YmtmbXZ1Z3V0bWdncXd4aHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNTEzMDEsImV4cCI6MjA3MzgyNzMwMX0.Qsx0XpQaSgt2dKUaLs8GvMmH8Qt6Dp_TQM25a_WOa8E'
const { createClient } = supabase
const client = createClient(supabaseUrl, supabaseKey)

window.onload = async function () {
    let contador=0
    const { data, error } = await client
        .from("Avisos")
        .select("*");

    if (error) {
        console.error(error);
        alert("Error al cargar las promociones");
        return;
    }

    let contenedor_promos = document.getElementById("contenedor_msgs");
    data.forEach(element => {
        contenedor_promos.appendChild(crearmgsCard(element));
        contador+=1;
    });
    let of_act = document.getElementById("contador_msg");
    of_act.textContent=contador
};

function crearmgsCard(notice) {
  // Contenedor principal
  const li = document.createElement("li");
  li.classList.add("notice");
  if (notice.tipo) li.classList.add(notice.titulo_flotante);

  // Categoría / etiqueta
  const cat = document.createElement("span");
  cat.classList.add("cat");
  if (notice.tipo){cat.classList.add(notice.titulo_flotante)};
  cat.textContent = notice.titulo_flotante;

  // Contenido
  const content = document.createElement("div");
  content.classList.add("notice-content");

  const titulo = document.createElement("h3");
  titulo.textContent = notice.titulo_aviso;

  const desc = document.createElement("p");
  desc.innerHTML = notice.descripcion_aviso; // puede incluir <time> en el texto

  // Meta
  const meta = document.createElement("div");
  meta.classList.add("meta");

  const publicado = document.createElement("time");
  publicado.setAttribute("datetime", formatear_fecha(notice.Publicado));
  publicado.textContent = `Publicado: ${formatear_fecha(notice.Publicado)}`;

  const valido = document.createElement("span");
  valido.textContent = `Válido: ${notice.vigencia}`;

  meta.appendChild(publicado);
  meta.appendChild(valido);

  // Ensamblar contenido
  content.appendChild(titulo);
  content.appendChild(desc);
  content.appendChild(meta);

  // Ensamblar li
  li.appendChild(cat);
  li.appendChild(content);

  return li;
}
function formatear_fecha(fecha_ing){
    const fechaISO = fecha_ing;
    const fecha = new Date(fechaISO);
    // Ejemplo: dd/mm/yyyy hh:mm
    const dia = fecha.getDate().toString().padStart(2, "0");
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0"); // los meses empiezan en 0
    const anio = fecha.getFullYear();
    const hora = fecha.getHours().toString().padStart(2, "0");
    const min = fecha.getMinutes().toString().padStart(2, "0");

    return `${dia}/${mes}/${anio} ${hora}:${min}`;
}