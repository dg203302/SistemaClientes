import { encriptar,desencriptar} from "/Scripts/encriptado.js"
const supabaseUrl = 'https://qxbkfmvugutmggqwxhrb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4YmtmbXZ1Z3V0bWdncXd4aHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNTEzMDEsImV4cCI6MjA3MzgyNzMwMX0.Qsx0XpQaSgt2dKUaLs8GvMmH8Qt6Dp_TQM25a_WOa8E'
const { createClient } = supabase
const client = createClient(supabaseUrl, supabaseKey)
const usuario_l = JSON.parse(localStorage.getItem("usuario_loggeado"))

window.onload = async function() {
    let input1 = document.getElementById("Pregunta_1")
    let input2 = document.getElementById("Pregunta_2")
    let input3 = document.getElementById("Pregunta_3")
    const {data,error} = await client
    .from("Clientes")
    .select("Resp_1, Resp_2, Resp_3")
    .eq("Telef",usuario_l.tele_u)
    .single()
    if(error){
        const mensaje = error.message
        const valor = 2;
        window.location.href = `/Templates/Template_informe/Informe.html?informe=${encodeURIComponent(mensaje)}&valor=${encodeURIComponent(valor)}`;
    }
    else{
        input1.placeholder = "Respuesta Previa: "+desencriptar(data.Resp_1)
        input2.placeholder = "Respuesta Previa: "+desencriptar(data.Resp_2)
        input3.placeholder = "Respuesta Previa: "+desencriptar(data.Resp_3)
    }
}

document.getElementById('Preguntas_seg').addEventListener("submit", async(e)=>{
    e.preventDefault()
    let r1 = document.getElementById("Pregunta_1").value
    let r2 = document.getElementById("Pregunta_2").value
    let r3 = document.getElementById("Pregunta_3").value
    const { data, error } = await client
            .from('Clientes')
            .update({Resp_1: encriptar(r1), Resp_2: encriptar(r2), Resp_3: encriptar(r3)})
            .eq("Telef", usuario_l.tele_u)
            if (error){
                const mensaje = error.message
                const valor = 2;
                window.location.href = `/Templates/Template_informe/Informe.html?informe=${encodeURIComponent(mensaje)}&valor=${encodeURIComponent(valor)}`;
            }else{
                await window.showSuccess('Respuestas de seguridad actualizadas correctamente!')
                window.location.href = "/Templates/Templates_pagina_principal/Perfil_usuario.html";
            }
})





console.log(usuario_l.nombre_u, usuario_l.puntos_u, usuario_l.tele_u, usuario_l.f_creacion_u)