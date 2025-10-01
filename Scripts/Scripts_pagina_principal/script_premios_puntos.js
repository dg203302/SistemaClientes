const supabaseUrl = 'https://qxbkfmvugutmggqwxhrb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4YmtmbXZ1Z3V0bWdncXd4aHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNTEzMDEsImV4cCI6MjA3MzgyNzMwMX0.Qsx0XpQaSgt2dKUaLs8GvMmH8Qt6Dp_TQM25a_WOa8E'
const { createClient } = supabase
const client = createClient(supabaseUrl, supabaseKey)
const usuario_l = JSON.parse(localStorage.getItem("usuario_loggeado"))

window.onload = async function () {
  let cantidad_puntos = document.getElementById("puntos-usuario");
  cantidad_puntos.textContent = usuario_l.puntos_u;
  const { data, error } = await client
    .from("Promos_puntos")
    .select("*");

  if (error) {
    console.error(error);
    alert("Error al cargar las promociones");
    return;
  }

  let contenedor_promos = document.getElementById("Conten_promos");
  data.forEach(element => {
    contenedor_promos.appendChild(crearPromoCard(element));
  });
};

function crearPromoCard(promo) {
  // Crear el contenedor principal
  const article = document.createElement("article");
  article.classList.add("promo-card");

  // Media
  const media = document.createElement("div");
  media.classList.add("promo-media");
  media.setAttribute("aria-hidden", "true");
  media.textContent = promo.emoji_promo;

  // Body
  const body = document.createElement("div");
  body.classList.add("promo-body");

  const titulo = document.createElement("h2");
  titulo.classList.add("promo-title");
  titulo.textContent = promo.Nombre_promo;

  const desc = document.createElement("p");
  desc.classList.add("promo-desc");
  desc.textContent = promo.descripcion_promo;

  const meta = document.createElement("ul");
  meta.classList.add("promo-meta");

  const puntosLi = document.createElement("li");
  puntosLi.innerHTML = `<span class="meta-label">Puntos necesarios:</span> 
                        <strong class="meta-value">${promo.cantidad_puntos_canjeo}</strong>`;

  const validezLi = document.createElement("li");
  validezLi.innerHTML = `<span class="meta-label">Validez:</span> 
                         <span class="meta-value">${promo.validez}</span>`;

  meta.appendChild(puntosLi);
  meta.appendChild(validezLi);

  const terms = document.createElement("details");
  terms.classList.add("promo-terms");

  const summary = document.createElement("summary");
  summary.textContent = "Términos y condiciones";

  const termsP = document.createElement("p");
  // Texto fijo 👇
  termsP.textContent = "Válido un canje por usuario. Sujeto a disponibilidad. No acumulable con otras promociones.";

  terms.appendChild(summary);
  terms.appendChild(termsP);
  body.appendChild(titulo);
  body.appendChild(desc);
  body.appendChild(meta);
  body.appendChild(terms);

  // Acciones
  const actions = document.createElement("div");
  actions.classList.add("promo-actions");

  const btn = document.createElement("button");
  btn.classList.add("btn-canjear");
  btn.type = "button";
  btn.setAttribute("aria-label", `Canjear ${promo.Nombre_promo}`);
  btn.textContent = "Canjear";

  actions.appendChild(btn);

  // Ensamblar todo
  article.appendChild(media);
  article.appendChild(body);
  article.appendChild(actions);

  return article;
}