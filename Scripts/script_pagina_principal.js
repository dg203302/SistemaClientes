
// esto para la plantilla de pagina_principal_puntos
const supabaseUrl = 'https://qxbkfmvugutmggqwxhrb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4YmtmbXZ1Z3V0bWdncXd4aHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNTEzMDEsImV4cCI6MjA3MzgyNzMwMX0.Qsx0XpQaSgt2dKUaLs8GvMmH8Qt6Dp_TQM25a_WOa8E'
const { createClient } = supabase
const client = createClient(supabaseUrl, supabaseKey)

const usuario_l = JSON.parse(localStorage.getItem("usuario_loggeado"))

async function refrescarPuntos(){
    const { data, error } = await client
    .from("Clientes")
    .select("Puntos")
    .eq("Telef",usuario_l.tele_u)
    .single()
    if (error){
        const valor = 8
        window.location.href = `Informe.html?informe=${encodeURIComponent(error.message)}&valor=${encodeURIComponent(valor)}`;
    }
    else{
        let cant_puntos = document.getElementById("cant_puntos")
        usuario_l.puntos_u = data.Puntos;
        localStorage.setItem("usuario_loggeado", JSON.stringify(usuario_l))

        cant_puntos.textContent = "Tiene: "+ usuario_l.puntos_u +" Puntos"
    }
}

// esto para la plantilla de pagina_principal_puntos


function cerrarSesion(){
    localStorage.removeItem("usuario_loggeado")
    window.location.href = "/index.html"
}
window.onload=function(){
    let saludo = document.getElementById("Saludo")
    saludo.textContent = "Bienvenido: "+ usuario_l.nombre_u
    // esto para la plantilla de pagina_principal_puntos
    let cant_puntos = document.getElementById("cant_puntos")
    cant_puntos.textContent = "Tiene: "+ usuario_l.puntos_u +" Puntos"
}