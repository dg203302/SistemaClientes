import {hashing} from "../script_hash.js"
function verificar_contra(contra){
    if (contra.length < 4){
        alert("La Contraseña debe tener como minimo 4 caracteres");
        return false
    }
    else if (contra.length > 10){
        alert("La contraseña no puede superar los 10 caracteres");
        return false
    }
    else if (!(/\d/.test(contra))){
        alert("La contraseña debe contener por lo menos un numero");
        return false
    }
    else if (!(/[-_:;!@#$%^&*]/.test(contra))){
        alert("La contraseña debe tener por lo menos un caracter especial: - _ : ; ! @ # $ % ^ & * ")
        return false
    }
    else{
        return true
    }
}
document.getElementById('registroForm').addEventListener('submit', async (e) => {
    e.preventDefault()
    const Nombre = document.getElementById('nombre').value
    const Telef = document.getElementById('telef').value
    const Contra_ingresada = document.getElementById('contraseña').value
    if (verificar_contra(Contra_ingresada)){
        const Contra = hashing(Contra_ingresada);
        sessionStorage.setItem("Nombre_nuevo_usuario",JSON.stringify(Nombre))
        sessionStorage.setItem("Tele_nuevo_usuario",JSON.stringify(Telef))
        sessionStorage.setItem("Contra_nuevo_usuario",JSON.stringify(Contra))
        window.location.href = "/Templates/Templates_inicio_sesion_registro/Preguntas_registro.html"
    }
})
