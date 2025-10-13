const supabaseUrl = 'https://qxbkfmvugutmggqwxhrb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4YmtmbXZ1Z3V0bWdncXd4aHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNTEzMDEsImV4cCI6MjA3MzgyNzMwMX0.Qsx0XpQaSgt2dKUaLs8GvMmH8Qt6Dp_TQM25a_WOa8E'
const { createClient } = supabase
const client = createClient(supabaseUrl, supabaseKey)
const usuario_l = JSON.parse(localStorage.getItem("usuario_loggeado"))

window.onload=function(){
    (() => {
        if (!usuario_l || !usuario_l.tele_u) return

        client
            .channel(`clientes-watch-${usuario_l.tele_u}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'Clientes',
                    filter: `Telef=eq.${usuario_l.tele_u}`
                },
                (payload) => {
                    const nuevoNombre = payload.new?.Nombre ?? payload.new?.nombre ?? payload.new?.nombre_u
                    const nuevosPuntos = payload.new?.Puntos

                    const cambioNombre = typeof nuevoNombre === 'string' && nuevoNombre !== usuario_l.nombre_u
                    const cambioPuntos = typeof nuevosPuntos !== 'undefined' && nuevosPuntos !== usuario_l.puntos_u

                    if (cambioNombre || cambioPuntos) {
                        try { localStorage.removeItem('usuario_loggeado') } catch (_) {}
                        const motivo = 'Se detectaron cambios en sus datos. Inicie sesión nuevamente.'
                        const valor = 1
                        window.location.replace(`/Templates/Template_informe/Informe.html?informe=${encodeURIComponent(motivo)}&valor=${encodeURIComponent(valor)}`)
                    }
                }
            )
            .subscribe()
    })()
    console.log(usuario_l.nombre_u, usuario_l.puntos_u, usuario_l.tele_u, usuario_l.f_creacion_u)
    let saludo = document.getElementById("nombre-usuario")
    saludo.textContent = usuario_l.nombre_u
    let cant_puntos = document.getElementById("cant_puntos")
    cant_puntos.textContent = "Tiene: "+ usuario_l.puntos_u +" Puntos"
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
        localStorage.setItem("usuario_loggeado", JSON.stringify(usuario_l))
        cant_puntos.textContent = "Tiene: "+ usuario_l.puntos_u +" Puntos"
    }
}

function initStreetView() {
    const ubicacion = { lat: -31.564160131917813, lng: -68.5079447539319 };
    const panorama = new google.maps.StreetViewPanorama(
    document.getElementById("street-view"),
    {
        position: ubicacion,
        pov: { heading: 34, pitch: 10 }, // orientación inicial
        zoom: 1
    });
}

async function agregarpuntos_prueba(){
    const { data, error } = await client
    .from("Clientes")
    .update({Puntos: usuario_l.puntos_u+1000})
    .eq("Telef",usuario_l.tele_u)
    .single()
    if(error){
        alert("error al agregar puntos")
    }
    else{
        alert("puntos agregados exitosamente, recarguelos")
        refrescarPuntos()
    }
}