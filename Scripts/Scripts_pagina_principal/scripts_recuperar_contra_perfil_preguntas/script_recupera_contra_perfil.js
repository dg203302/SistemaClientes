import { hashing } from "/Scripts/script_hash.js"

function verificar_contra(contra) {
    const len = contra.length

    if (len <= 4) {
        window.showError('La contraseña debe tener más de 4 caracteres (mínimo 5).', 'Validación')
        return false
    }

    if (len >= 15) {
        window.showError('La contraseña debe tener menos de 15 caracteres (máximo 14).', 'Validación')
        return false
    }

    return true
}

const usuario_l = JSON.parse(localStorage.getItem("usuario_loggeado"))

document.getElementById("form_actualizar").addEventListener("submit", async (e) => {
    e.preventDefault();
    const contra_nue = document.getElementById("nueva_contra").value;
    const contra_rep = document.getElementById("repetir_contra").value;

    if (contra_nue !== contra_rep) {
        await window.showError('Las contraseñas deben coincidir!', 'Validación')
        return;
    }

    if (!verificar_contra(contra_nue)) return;

    const nue_contra_hash = hashing(contra_nue);

    let respuesta;
    try {
        respuesta = await fetch('/api/actualizar-contrasena', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Telef: usuario_l.tele_u, nuevaContraHash: nue_contra_hash }),
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
        await window.showSuccess('Contraseña actualizada correctamente')
        window.location.href = "/Templates/Templates_pagina_principal/Perfil_usuario.html"
    }
})

