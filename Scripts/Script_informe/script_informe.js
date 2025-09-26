function generarmensaje(mensaje){
    switch (mensaje) {
        case 'duplicate key value violates unique constraint "Clientes_pkey"':
            return "Ya existe un usuario con ese telefono registrado";
        case 'Cannot coerce the result to a single JSON object':
            return "no existe un usuario registrado a ese telefono";
        case "contraseña incorrecta":
            return "Contraseña Incorrecta"
        case "mal codigo":
            return "Codigo de recuperacion erroneo"
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
    let icono = document.getElementById("icono-status");
    if (boton_info) {
        if (valor === "0"){ //usuario invalido
            titulo_info.textContent="Registro Fallido"
            icono.className = "fa-solid fa-circle-xmark";
            texto_info.textContent = generarmensaje(inform);
            boton_info.href = "/Templates_inicio_sesion_registro/Registrarse.html";
            boton_info.textContent= "Registrarse"
            let boton_s = document.getElementById("boton_sec")
            boton_s.href="/Templates_inicio_sesion_registro/iniciosesion.html"
            boton_s.textContent="Reintentar"
            boton_s.style.display = "flex";
            let contenedor = document.getElementsByClassName("informe");
            contenedor[0].classList.add("fracaso");
            console.log(inform)
        }
        else if (valor === "1"){ //contraseña equivocada
            titulo_info.textContent="Registro Fallido"
            icono.className = "fa-solid fa-circle-xmark";
            texto_info.textContent = generarmensaje(inform);
            boton_info.href = "/Templates_inicio_sesion_registro/iniciosesion.html"
            boton_info.textContent = "Reintentar"
            let boton_s = document.getElementById("boton_sec")
            boton_s.style.display = "flex";
            let contenedor = document.getElementsByClassName("informe")
            contenedor[0].classList.add("fracaso");
            console.log(inform)
        }
        else if (valor === "2"){ //registro fallido
            titulo_info.textContent="Registro Fallido"
            icono.className = "fa-solid fa-circle-xmark";
            texto_info.textContent = generarmensaje(inform);
            boton_info.href = "/Templates_inicio_sesion_registro/Registrarse.html"
            boton_info.textContent = "Reintentar"
            let contenedor = document.getElementsByClassName("informe")
            contenedor[0].classList.add("fracaso");
            console.log(inform)
        }
        else if (valor === "3"){ //registro exitoso
            titulo_info.textContent="Registro Exitoso"
            icono.className = "fa-solid fa-circle-check";
            boton_info.href = "/Templates/Templates_inicio_sesion_registro/iniciosesion.html";
            boton_info.textContent = "Continuar";
            let contenedor = document.getElementsByClassName("informe")
            contenedor[0].classList.add("exito");
        }
        else if (valor === "4"){ //recuperar contra fallido
            titulo_info.textContent="Recuperacion de contraseña fallido"
            texto_info.textContent = generarmensaje(inform);
            boton_info.href = "/Templates_recuperar_contrasenia/recuperar_contra.html";
            boton_info.textContent= "Regresar"
            let contenedor = document.getElementsByClassName("informe");
            contenedor[0].classList.add("fracaso");
            console.log(inform)
        }
        else if (valor === "5"){ //validar codigo recuperacion fallido
            titulo_info.textContent="Validacion de codigo fallida"
            texto_info.textContent = generarmensaje(inform);
            boton_info.href = "/Templates_recuperar_contrasenia/recuperar_contra.html";
            boton_info.textContent= "Regresar a Recuperar Contraseña"
            let contenedor = document.getElementsByClassName("informe");
            contenedor[0].classList.add("fracaso");
            console.log(inform)
        }
        else if (valor === "6"){
            titulo_info.textContent="Cambio de contraseña fallido"
            texto_info.textContent = generarmensaje(inform);
            boton_info.href = "/Templates_recuperar_contrasenia/recuperar_contra.html";
            boton_info.textContent= "Regresar a Recuperar Contraseña"
            let contenedor = document.getElementsByClassName("informe");
            contenedor[0].classList.add("fracaso");
            console.log(inform)
        }
        else if (valor === "7"){ //recuperacion de contraseña exitoso
            titulo_info.textContent="Contraseña Recuperada Exitosamente"
            boton_info.href = "/Templates_inicio_sesion_registro/iniciosesion.html";
            boton_info.textContent = "Continuar";
            let contenedor = document.getElementsByClassName("informe")
            contenedor[0].classList.add("exito");
        }
        else if (valor === "8"){ //fallo en la recuperacion de puntos
            titulo_info.textContent="Fallo en la recuperacion de puntos"
            boton_info.href = "/Templates_pagina_principal/Pagina_principal_inicio.html";
            boton_info.textContent = "Continuar";
            let contenedor = document.getElementsByClassName("informe")
            contenedor[0].classList.add("exito");
        }
    }
}