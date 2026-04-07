import { hashing } from "../script_hash.js"

function verificar_contra(contra) {
    if (contra.length < 4) {
        window.showError('La Contraseña debe tener como mínimo 4 caracteres', 'Validación');
        return false
    }
    else if (contra.length > 10) {
        window.showError('La contraseña no puede superar los 10 caracteres', 'Validación');
        return false
    }
    else if (!(/\d/.test(contra))) {
        window.showError('La contraseña debe contener por lo menos un número', 'Validación');
        return false
    }
    else if (!(/[-_:;!@#$%^&*]/.test(contra))) {
        window.showError('La contraseña debe tener por lo menos un caracter especial: - _ : ; ! @ # $ % ^ & * ', 'Validación')
        return false
    }
    else {
        return true
    }
}

document.getElementById("form_actualizar").addEventListener("submit", async (e) => {
    e.preventDefault();
    const tel = sessionStorage.getItem("telefono_usuario_recu")
    const contra_nue = document.getElementById("nueva_contra").value;
    const contra_rep = document.getElementById("repetir_contra").value;

    if (contra_nue !== contra_rep) {
        window.showError('Las contraseñas deben coincidir!', 'Validación')
        return;
    }

    if (!verificar_contra(contra_nue)) return;

    const nue_contra_hash = hashing(contra_nue);

    let respuesta;
    try {
        respuesta = await fetch('/api/actualizar-contrasena', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Telef: tel, nuevaContraHash: nue_contra_hash }),
        });
    } catch {
        const valor = 6;
        window.location.href = `/Templates/Template_informe/Informe.html?informe=${encodeURIComponent('Error de red')}&valor=${encodeURIComponent(valor)}`;
        return;
    }

    const result = await respuesta.json();

    if (!respuesta.ok || result.error) {
        const valor = 6;
        window.location.href = `/Templates/Template_informe/Informe.html?informe=${encodeURIComponent(result.error || 'Error desconocido')}&valor=${encodeURIComponent(valor)}`;
    } else {
        sessionStorage.clear();
        const valor = 7;
        const mensaje = "Contraseña actualizada";
        window.location.href = `/Templates/Template_informe/Informe.html?informe=${encodeURIComponent(mensaje)}&valor=${encodeURIComponent(valor)}`;
    }
})