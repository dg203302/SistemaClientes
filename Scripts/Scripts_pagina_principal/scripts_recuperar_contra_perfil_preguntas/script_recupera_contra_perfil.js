import {hashing} from "/Scripts/script_hash.js"
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
                    alert("Contraseña actualizada correctamente")
                    window.location.href = "/Templates/Templates_pagina_principal/Perfil_usuario.html"
                }  
        }
    }
    else{
        alert("Las contraseñas deben coincidir!")
    }
})
