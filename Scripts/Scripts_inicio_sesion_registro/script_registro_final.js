import { encriptar } from "../encriptado.js"

document.getElementById('Preguntas_seg').addEventListener("submit", async (e) => {
    e.preventDefault()
    const r1 = document.getElementById("Pregunta_1").value
    const r2 = document.getElementById("Pregunta_2").value
    const r3 = document.getElementById("Pregunta_3").value

    let respuesta;
    try {
        respuesta = await fetch('/api/registrar-cliente', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Telef: sessionStorage.getItem("Tele_nuevo_usuario"),
                Nombre: sessionStorage.getItem("Nombre_nuevo_usuario"),
                Contra: sessionStorage.getItem("Contra_nuevo_usuario"),
                Resp_1: encriptar(r1),
                Resp_2: encriptar(r2),
                Resp_3: encriptar(r3),
            }),
        });
    } catch {
        const valor = 2;
        const mensaje = 'Error de red al registrar';
        window.location.href = `/Templates/Template_informe/Informe.html?informe=${encodeURIComponent(mensaje)}&valor=${encodeURIComponent(valor)}`;
        return;
    }

    const result = await respuesta.json();

    if (!respuesta.ok || result.error) {
        const valor = 2;
        const mensaje = result.error || 'Error desconocido';
        window.location.href = `/Templates/Template_informe/Informe.html?informe=${encodeURIComponent(mensaje)}&valor=${encodeURIComponent(valor)}`;
    } else {
        sessionStorage.clear();
        const mensaje = "Registro Exitoso!";
        const valor = 3;
        window.location.href = `/Templates/Template_informe/Informe.html?informe=${encodeURIComponent(mensaje)}&valor=${encodeURIComponent(valor)}`;
    }
})










