window.onload = function(){
    if (localStorage.getItem("usuario_loggeado")){
        window.location.href = './Templates/Templates_pagina_principal/Pagina_principal_inicio.html';
    }
}