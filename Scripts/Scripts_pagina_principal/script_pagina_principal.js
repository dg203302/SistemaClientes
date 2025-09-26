const supabaseUrl = 'https://qxbkfmvugutmggqwxhrb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4YmtmbXZ1Z3V0bWdncXd4aHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNTEzMDEsImV4cCI6MjA3MzgyNzMwMX0.Qsx0XpQaSgt2dKUaLs8GvMmH8Qt6Dp_TQM25a_WOa8E'
const { createClient } = supabase
const client = createClient(supabaseUrl, supabaseKey)
const usuario_l = JSON.parse(localStorage.getItem("usuario_loggeado"))

window.onload=function(){
    console.log(usuario_l.nombre_u, usuario_l.puntos_u, usuario_l.tele_u, usuario_l.f_creacion_u)
    let saludo = document.getElementById("nombre-usuario")
    saludo.textContent = usuario_l.nombre_u
    let cant_puntos = document.getElementById("cant_puntos")
    cant_puntos.textContent = "Tiene: "+ usuario_l.puntos_u +" Puntos"
}

function cerrarSesion(){
    localStorage.removeItem("usuario_loggeado")
    window.location.href = "/index.html"
}

async function refrescarPuntos(){
    const { data, error } = await client
    .from("Clientes")
    .select("Puntos")
    .eq("Telef",usuario_l.tele_u)
    .single()
    if (error){
        const valor = 8
        window.location.href = `/Templates/Template_informe/Informe.html?informe=${encodeURIComponent(error.message)}&valor=${encodeURIComponent(valor)}`;
    }
    else{
        let cant_puntos = document.getElementById("cant_puntos")
        usuario_l.puntos_u = data.Puntos;
        localStorage.setItem("usuario_loggeado", usuario_l)
        cant_puntos.textContent = "Tiene: "+ usuario_l.puntos_u +" Puntos"
    }
}