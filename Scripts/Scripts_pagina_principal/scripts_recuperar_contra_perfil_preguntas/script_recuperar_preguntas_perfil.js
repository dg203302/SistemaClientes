import { encriptar, desencriptar } from "/Scripts/encriptado.js"

const supabaseUrl = 'https://qxbkfmvugutmggqwxhrb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4YmtmbXZ1Z3V0bWdncXd4aHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNTEzMDEsImV4cCI6MjA3MzgyNzMwMX0.Qsx0XpQaSgt2dKUaLs8GvMmH8Qt6Dp_TQM25a_WOa8E'
const { createClient } = supabase
const client = createClient(supabaseUrl, supabaseKey)
const usuario_l = JSON.parse(localStorage.getItem("usuario_loggeado"))

// Cargar respuestas actuales para mostrar como placeholder (solo lectura → se queda en frontend)
window.onload = async function () {
    const input1 = document.getElementById("Pregunta_1")
    const input2 = document.getElementById("Pregunta_2")
    const input3 = document.getElementById("Pregunta_3")
    const { data, error } = await client
        .from("Clientes")
        .select("Resp_1, Resp_2, Resp_3")
        .eq("Telef", usuario_l.tele_u)
        .single()
    if (error) {
        const mensaje = error.message
        const valor = 2;
        window.location.href = `/Templates/Template_informe/Informe.html?informe=${encodeURIComponent(mensaje)}&valor=${encodeURIComponent(valor)}`;
    } else {
        input1.placeholder = "Respuesta Previa: " + desencriptar(data.Resp_1)
        input2.placeholder = "Respuesta Previa: " + desencriptar(data.Resp_2)
        input3.placeholder = "Respuesta Previa: " + desencriptar(data.Resp_3)
    }
}

// Actualizar preguntas → escritura → edge function
document.getElementById('Preguntas_seg').addEventListener("submit", async (e) => {
    e.preventDefault()
    const r1 = document.getElementById("Pregunta_1").value
    const r2 = document.getElementById("Pregunta_2").value
    const r3 = document.getElementById("Pregunta_3").value

    let respuesta;
    try {
        respuesta = await fetch('/api/actualizar-preguntas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Telef: usuario_l.tele_u,
                Resp_1: encriptar(r1),
                Resp_2: encriptar(r2),
                Resp_3: encriptar(r3),
            }),
        });
    } catch {
        const mensaje = 'Error de red al actualizar preguntas'
        const valor = 2;
        window.location.href = `/Templates/Template_informe/Informe.html?informe=${encodeURIComponent(mensaje)}&valor=${encodeURIComponent(valor)}`;
        return;
    }

    const result = await respuesta.json();

    if (!respuesta.ok || result.error) {
        const mensaje = result.error || 'Error desconocido'
        const valor = 2;
        window.location.href = `/Templates/Template_informe/Informe.html?informe=${encodeURIComponent(mensaje)}&valor=${encodeURIComponent(valor)}`;
    } else {
        await window.showSuccess('Respuestas de seguridad actualizadas correctamente!')
        window.location.href = "/Templates/Templates_pagina_principal/Perfil_usuario.html";
    }
})

console.log(usuario_l.nombre_u, usuario_l.puntos_u, usuario_l.tele_u, usuario_l.f_creacion_u)