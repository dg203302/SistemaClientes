const supabaseUrl = 'https://qxbkfmvugutmggqwxhrb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4YmtmbXZ1Z3V0bWdncXd4aHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNTEzMDEsImV4cCI6MjA3MzgyNzMwMX0.Qsx0XpQaSgt2dKUaLs8GvMmH8Qt6Dp_TQM25a_WOa8E'
const { createClient } = supabase
const client = createClient(supabaseUrl, supabaseKey)

console.log('script_contacto.js cargado'); // DEBUG

window.onload=async function(){
    console.log('window.onload ejecutado'); // DEBUG
    await cargarPyG();
    await cargarPoliticas();
}

async function cargarPyG(){
    // Si no necesitas cargar nada, puedes dejar la función vacía o eliminarla
    // Si quieres cargar otra cosa, pon aquí la consulta correcta
    // Ejemplo de consulta válida:
    // const {data, error} = await client
    //   .from("Avisos")
    //   .select("descripcion_aviso")
    //   .eq("titulo_aviso", "Politicas")
    //   .single();
    // console.log('Resultado consulta cargarPyG:', {data, error});
}

async function cargarPoliticas(){
    const {data, error} = await client
        .from("Avisos")
        .select("descripcion_aviso")
        .eq("titulo_aviso", "Politicas")
        .single();
    console.log('Resultado consulta politicas:', {data, error}); // DEBUG
    if (error || !data || !data.descripcion_aviso) {
        document.getElementById("politicas-list").innerHTML = '<li>No se pudieron cargar las políticas.</li>';
        return;
    }
    const politicas = data.descripcion_aviso.split(/\n|<br\s*\/?>/).map(p => p.trim()).filter(p => p);
    const ul = document.getElementById("politicas-list");
    ul.innerHTML = politicas.map(p => `<li>${p}</li>`).join("");
}