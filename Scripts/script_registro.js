import {hashing} from "./script_hash.js"
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
const form = document.getElementById('registroForm')
form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const Nombre = document.getElementById('nombre').value
    const Mail = document.getElementById('correo').value
    const Contra_ingresada = document.getElementById('contraseña').value
    if (verificar_contra(Contra_ingresada)){
        const Contra = hashing(Contra_ingresada);
        const { data, error } = await client
        .from('Clientes')
        .insert([{ Mail, Nombre, Contra }])
        if (error){
            const mensaje = error.message
            const valor = 2;
            window.location.href = `Informe.html?informe=${encodeURIComponent(mensaje)}&valor=${encodeURIComponent(valor)}`;
        }else{
            const mensaje = "Registro Exitoso!";
            const valor = 3;
            window.location.href = `Informe.html?informe=${encodeURIComponent(mensaje)}&valor=${encodeURIComponent(valor)}`;
        }
    }
})
