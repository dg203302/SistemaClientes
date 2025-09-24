window.onload = function(){
    if (localStorage.getItem("usuario_loggeado")){
        window.location.href='./Templates/pagina_principal.html'
    }
    else{
        return null
    }
}