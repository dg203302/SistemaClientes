const supabaseUrl = 'https://qxbkfmvugutmggqwxhrb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4YmtmbXZ1Z3V0bWdncXd4aHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNTEzMDEsImV4cCI6MjA3MzgyNzMwMX0.Qsx0XpQaSgt2dKUaLs8GvMmH8Qt6Dp_TQM25a_WOa8E'
const { createClient } = supabase
const client = createClient(supabaseUrl, supabaseKey)

window.onload = function(){
    if (localStorage.getItem("usuario_loggeado")){
        window.location.href = './Templates/Templates_pagina_principal/Pagina_principal_inicio.html';
    }
}
async function iniciar_invitado(){
    const {data, error} = await client
    .from('Clientes')
    .select('Nombre, Telef, Contra, Puntos , Fecha_creacion')
    .eq('Telef', '46792747')
    .single();
    localStorage.setItem("usuario_loggeado", JSON.stringify({nombre_u:data.Nombre, tele_u:data.Telef, puntos_u:data.Puntos, f_creacion_u:data.Fecha_creacion}))
    window.location.href = './Templates/Templates_pagina_principal/Pagina_principal_inicio.html';
}

window.iniciar_invitado = iniciar_invitado;