window.onload=function(){
    let informacion = document.getElementById("prueba")
    const mail = sessionStorage.getItem('mail_usuario');
    const nombre = this.sessionStorage.getItem('nombre_usuario')
    const puntos = this.sessionStorage.getItem('puntos_usuario')
    informacion.textContent = "sesion iniciada "+"   "+mail+"   "+nombre+"   "+puntos
}