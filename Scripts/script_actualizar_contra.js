import {hashing} from "./script_hash.js"
const supabaseUrl = 'https://qxbkfmvugutmggqwxhrb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4YmtmbXZ1Z3V0bWdncXd4aHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNTEzMDEsImV4cCI6MjA3MzgyNzMwMX0.Qsx0XpQaSgt2dKUaLs8GvMmH8Qt6Dp_TQM25a_WOa8E'
const { createClient } = supabase
const client = createClient(supabaseUrl, supabaseKey)
document.getElementById("form_actualizar").addEventListener("submit", async (e) =>{
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);
    const mail = params.get('email');
    let contra_nue = document.getElementById("nueva_contra").value;
    const nue_contra_hash = hashing(contra_nue);
    const { error } =  await client
    .from('Clientes')
    .update({Contra: nue_contra_hash})
    .eq('Mail',mail)
    .single();
    if (error){
        const valor = 6;
        window.location.href = `Informe.html?informe=${encodeURIComponent(error.message)}&valor=${encodeURIComponent(valor)}`;
    }
    else{
        const valor = 7;
        window.location.href = `Informe.html?informe=${encodeURIComponent("exito")}&valor=${encodeURIComponent(valor)}`;
    }
})