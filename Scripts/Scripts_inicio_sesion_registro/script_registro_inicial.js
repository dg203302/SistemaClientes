import {hashing} from "../script_hash.js"
function verificar_contra(contra){
    if (contra.length < 4){
        window.showError('La Contraseña debe tener como mínimo 4 caracteres', 'Validación');
        return false
    }
    else if (contra.length > 10){
        window.showError('La contraseña no puede superar los 10 caracteres', 'Validación');
        return false
    }
    else if (!(/\d/.test(contra))){
        window.showError('La contraseña debe contener por lo menos un número', 'Validación');
        return false
    }
    else if (!(/[-_:;!@#$%^&*]/.test(contra))){
        window.showError('La contraseña debe tener por lo menos un caracter especial: - _ : ; ! @ # $ % ^ & * ', 'Validación');
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
        sessionStorage.setItem("Nombre_nuevo_usuario",Nombre)
        sessionStorage.setItem("Tele_nuevo_usuario",Telef)
        sessionStorage.setItem("Contra_nuevo_usuario",Contra)
        window.location.href = "/Templates/Templates_inicio_sesion_registro/Preguntas_registro.html"
    }
})
