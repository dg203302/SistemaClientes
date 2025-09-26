import {hashing} from "../script_hash.js"
const supabaseUrl = 'https://qxbkfmvugutmggqwxhrb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4YmtmbXZ1Z3V0bWdncXd4aHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNTEzMDEsImV4cCI6MjA3MzgyNzMwMX0.Qsx0XpQaSgt2dKUaLs8GvMmH8Qt6Dp_TQM25a_WOa8E'
const { createClient } = supabase
const client = createClient(supabaseUrl, supabaseKey)
const form = document.getElementById('inicioform')
const mensaje = document.getElementById('mensaje')
form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const Telef = document.getElementById('telef').value
    const Contra_ingre = document.getElementById('contrasenia').value
    const hash_contra = hashing(Contra_ingre);
    const { data, error } = await client
    .from('Clientes')
    .select('Nombre, Telef, Contra, Puntos , Fecha_creacion')
    .eq('Telef', Telef)
    .single(); 
    if (error){
        const valor = 0;
    window.location.href = `/Templates/Template_informe/Informe.html?informe=${encodeURIComponent(error.message)}&valor=${encodeURIComponent(valor)}`;
    };
    const valid = data.Contra == hash_contra;
    if (!valid) {
        const valor = 1;
    window.location.href = `/Templates/Template_informe/Informe.html?informe=${encodeURIComponent("contraseña incorrecta")}&valor=${encodeURIComponent(valor)}`;
    }
    else{
        localStorage.setItem("usuario_loggeado", JSON.stringify({nombre_u:data.Nombre, tele_u:data.Telef, puntos_u:data.Puntos, f_creacion_u:data.Fecha_creacion}))
        //por ahora no voy a usar el telefono
        window.location.href = "/Templates/Templates_pagina_principal/Pagina_principal_inicio.html";
    }
})