function generarmensaje(mensaje){
    switch (mensaje) {
        case 'duplicate key value violates unique constraint "Clientes_pkey"':
            return "Ya existe un usuario con ese mail registrado";
        case 'Cannot coerce the result to a single JSON object':
            return "no existe un usuario registrado a ese mail";
        case "contraseña incorrecta":
            return "Contraseña Incorrecta"
        default:
            return "Ocurrió un error inesperado.";
  }
}
window.onload = function(){
    const params = new URLSearchParams(window.location.search);
    const inform = params.get('informe');
    const valor = params.get("valor");
    let titulo_info = document.getElementById("titulo_informe");
    let texto_info = this.document.getElementById("texto_informe");
    let boton_info = document.getElementById("boton_info");
    if (boton_info) {
        if (valor === "0"){ //usuario invalido
            titulo_info.textContent="Registro Fallido"
            texto_info.textContent = generarmensaje(inform);
            boton_info.href = "Registrarse.html";
            boton_info.textContent= "Registrarse"
            let boton_s = document.getElementById("boton_sec")
            boton_s.href="iniciosesion.html"
            boton_s.textContent="Reintentar"
            boton_s.style.display = "flex";
            let contenedor = document.getElementsByClassName("informe");
            contenedor[0].classList.add("fracaso");
        }
        else if (valor === "1"){ //contraseña equivocada
            titulo_info.textContent="Registro Fallido"
            texto_info.textContent = generarmensaje(inform);
            boton_info.href = "iniciosesion.html"
            boton_info.textContent = "Reintentar"
            let boton_s = document.getElementById("boton_sec")
            boton_s.style.display = "flex";
            let contenedor = document.getElementsByClassName("informe")
            contenedor[0].classList.add("fracaso");
        }
        else if (valor === "2"){ //registro fallido
            titulo_info.textContent="Registro Fallido"
            texto_info.textContent = generarmensaje(inform);
            boton_info.href = "Registrarse.html"
            boton_info.textContent = "Reintentar"
            let contenedor = document.getElementsByClassName("informe")
            contenedor[0].classList.add("fracaso");
        }
        else if (valor === "3"){ //registro exitoso
            titulo_info.textContent="Registro Exitoso"
            boton_info.href = "iniciosesion.html";
            boton_info.textContent = "Continuar";
            let contenedor = document.getElementsByClassName("informe")
            contenedor[0].classList.add("exito");
        }
    }
}