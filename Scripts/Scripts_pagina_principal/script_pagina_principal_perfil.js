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
}