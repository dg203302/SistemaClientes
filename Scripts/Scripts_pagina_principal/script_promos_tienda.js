const supabaseUrl = 'https://qxbkfmvugutmggqwxhrb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4YmtmbXZ1Z3V0bWdncXd4aHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNTEzMDEsImV4cCI6MjA3MzgyNzMwMX0.Qsx0XpQaSgt2dKUaLs8GvMmH8Qt6Dp_TQM25a_WOa8E'
const { createClient } = supabase
const client = createClient(supabaseUrl, supabaseKey)

window.onload = async function () {
    let contador=0
    const { data, error } = await client
        .from("Ofertas")
        .select("*");

    if (error) {
        console.error(error);
        alert("Error al cargar las promociones");
        return;
    }

    let contenedor_promos = document.getElementById("conten-ofertas");
    data.forEach(element => {
        contenedor_promos.appendChild(crearPromoTCard(element));
        contador+=1;
    });
    let of_act = document.getElementById("ofertas-activas");
    of_act.textContent=contador
};
function crearPromoTCard(oferta) {
  // Contenedor principal
  const article = document.createElement("article");
  article.classList.add("oferta-card");

  // Media
  const media = document.createElement("div");
  media.classList.add("oferta-media");
  media.setAttribute("aria-hidden", "true");
  media.textContent = oferta.emoji_ofertas;

  // Body
  const body = document.createElement("div");
  body.classList.add("oferta-body");

  // Head: título + badge
  const head = document.createElement("div");
  head.classList.add("oferta-head");

  const titulo = document.createElement("h2");
  titulo.classList.add("oferta-title");
  titulo.textContent = oferta.nombre;

  const badge = document.createElement("span");
  badge.classList.add("badge");
  badge.textContent = oferta.campo_flotante;

  head.appendChild(titulo);
  head.appendChild(badge);

  // Descripción
  const desc = document.createElement("p");
  desc.classList.add("oferta-desc");
  desc.textContent = oferta.desripcion;

  // Meta
  const meta = document.createElement("ul");
  meta.classList.add("oferta-meta");

  const vigenciaLi = document.createElement("li");
  vigenciaLi.innerHTML = `<span class="meta-label">Vigencia:</span> <span class="meta-value">${oferta.vigencia}</span>`;

  meta.appendChild(vigenciaLi);

  // Términos
  const terms = document.createElement("details");
  terms.classList.add("oferta-terms");

  const summary = document.createElement("summary");
  summary.textContent = "Términos y condiciones";

  const termsP = document.createElement("p");
  termsP.textContent ="No acumulable con otras promos. Hasta agotar stock.";

  terms.appendChild(summary);
  terms.appendChild(termsP);

  // Ensamblar body
  body.appendChild(head);
  body.appendChild(desc);
  body.appendChild(meta);
  body.appendChild(terms);

  // Ensamblar artículo
  article.appendChild(media);
  article.appendChild(body);

  return article;
}
