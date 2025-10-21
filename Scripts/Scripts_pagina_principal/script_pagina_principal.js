const supabaseUrl = 'https://qxbkfmvugutmggqwxhrb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4YmtmbXZ1Z3V0bWdncXd4aHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNTEzMDEsImV4cCI6MjA3MzgyNzMwMX0.Qsx0XpQaSgt2dKUaLs8GvMmH8Qt6Dp_TQM25a_WOa8E'
const { createClient } = supabase
const client = createClient(supabaseUrl, supabaseKey)
const usuario_l = JSON.parse(localStorage.getItem("usuario_loggeado"))

window.onload=async function(){
    await actualizar_datos();
    await cargarHorarios();
    initStreetView();
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

async function actualizar_datos(){
    const { data, error } = await client
    .from("Clientes")
    .select("*")
    .eq("Telef",usuario_l.tele_u)
    .single()
    if (error){
        const valor = 8
        window.location.href = `/Templates/Template_informe/Informe.html?informe=${encodeURIComponent(error.message)}&valor=${encodeURIComponent(valor)}`;
    }
    else{
        usuario_l.nombre_u = data.Nombre;
        usuario_l.puntos_u = data.Puntos;
        usuario_l.tele_u = data.Telef;
        usuario_l.f_creacion_u = data.Fecha_creacion;
        localStorage.setItem("usuario_loggeado", JSON.stringify(usuario_l));
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

async function cargarHorarios() {
    try {
        // Primero intentamos con diferentes variaciones del nombre de columna
        let data, error;
        
        // Intento 1: con "id" (minúscula)
        ({ data, error } = await client
            .from("Avisos")
            .select("descripcion_aviso")
            .eq("titulo_aviso", "Horarios_Main")
            .single());

        if (error) {
            console.error("Error al cargar horarios:", error);
            mostrarHorariosDefecto();
            return;
        }

        if (!data || !data.descripcion_aviso) {
            console.warn("No se encontró la descripción de horarios");
            mostrarHorariosDefecto();
            return;
        }

        let descripcion = data.descripcion_aviso;
        console.log("Descripción original:", descripcion); // Debug
        
        // Remover el prefijo "Horarios de atención" si existe
        descripcion = descripcion.replace(/^Horarios de atención\s*/i, '').trim();
        console.log("Después de remover prefijo:", descripcion); // Debug
        
        // Separar por el carácter "|"
        const lineas = descripcion.split('|').map(linea => linea.trim()).filter(linea => linea);
        console.log("Líneas separadas:", lineas); // Debug
        
        const contenedor = document.getElementById("horarios-container");
        
        if (!contenedor) {
            console.error("No se encontró el contenedor 'horarios-container'");
            return;
        }
        
        contenedor.innerHTML = ''; // Limpiar contenido previo
        
        lineas.forEach(linea => {
            // Buscar el primer número para separar día de horario
            // Formato: "Lunes  8:00 – 20:00" o "Domingo  Cerrado"
            const match = linea.match(/^([A-Za-záéíóúÁÉÍÓÚ]+)\s+(.+)$/);
            
            if (match) {
                const dia = match[1].trim();
                const horario = match[2].trim();
                
                console.log(`Día: ${dia}, Horario: ${horario}`); // Debug
                
                const div = document.createElement("div");
                div.className = "row";
                
                // Si contiene "cerrado" agregar clase especial
                if (horario.toLowerCase().includes('cerrado')) {
                    div.classList.add('cerrado');
                }
                
                div.innerHTML = `<span>${dia}</span><span>${horario}</span>`;
                contenedor.appendChild(div);
            }
        });
        
        console.log("Horarios cargados exitosamente"); // Debug
        
    } catch (err) {
        console.error("Error en cargarHorarios:", err);
        mostrarHorariosDefecto();
    }
}

function mostrarHorariosDefecto() {
    const contenedor = document.getElementById("horarios-container");
    contenedor.innerHTML = `
        <div class="row"><span>Lunes</span><span>8:00 – 20:00</span></div>
        <div class="row"><span>Martes</span><span>8:00 – 20:00</span></div>
        <div class="row"><span>Miércoles</span><span>8:00 – 20:00</span></div>
        <div class="row"><span>Jueves</span><span>8:00 – 20:00</span></div>
        <div class="row"><span>Viernes</span><span>8:00 – 20:00</span></div>
        <div class="row"><span>Sábado</span><span>9:00 – 14:00</span></div>
        <div class="row cerrado"><span>Domingo</span><span>Cerrado</span></div>
    `;
}