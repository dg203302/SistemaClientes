import {hashing} from "/Scripts/script_hash.js"
function verificar_contra(contra){
    const len = contra.length

    // Reglas pedidas: más de 4 y menos de 15 caracteres (5..14)
    if (len <= 4){
        window.showError('La contraseña debe tener más de 4 caracteres (mínimo 5).', 'Validación')
        return false
    }

    if (len >= 15){
        window.showError('La contraseña debe tener menos de 15 caracteres (máximo 14).', 'Validación')
        return false
    }

    return true
}

const supabaseUrl = 'https://qxbkfmvugutmggqwxhrb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4YmtmbXZ1Z3V0bWdncXd4aHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNTEzMDEsImV4cCI6MjA3MzgyNzMwMX0.Qsx0XpQaSgt2dKUaLs8GvMmH8Qt6Dp_TQM25a_WOa8E'
const { createClient } = supabase
const client = createClient(supabaseUrl, supabaseKey)
const usuario_l = JSON.parse(localStorage.getItem("usuario_loggeado"))

document.getElementById("form_actualizar").addEventListener("submit", async (e) =>{
    e.preventDefault();
    let contra_nue = document.getElementById("nueva_contra").value;
    let contra_rep = document.getElementById("repetir_contra").value;
    if (contra_nue == contra_rep){
        if (verificar_contra(contra_nue)){
            const nue_contra_hash = hashing(contra_nue);
            const { error } =  await client
            .from('Clientes')
            .update({Contra: nue_contra_hash})
            .eq('Telef',usuario_l.tele_u)
            .single();
                if (error){
                    const valor = 6;
                    window.location.href = `/Templates/Template_informe/Informe.html?informe=${encodeURIComponent(error.message)}&valor=${encodeURIComponent(valor)}`;
                }
                else{
                    await window.showSuccess('Contraseña actualizada correctamente')
                    window.location.href = "/Templates/Templates_pagina_principal/Perfil_usuario.html"
                }  
        }
    }
    else{
        await window.showError('Las contraseñas deben coincidir!', 'Validación')
    }
})
