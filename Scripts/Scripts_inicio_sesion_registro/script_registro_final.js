import { encriptar} from "../encriptado.js"
const supabaseUrl = 'https://qxbkfmvugutmggqwxhrb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4YmtmbXZ1Z3V0bWdncXd4aHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNTEzMDEsImV4cCI6MjA3MzgyNzMwMX0.Qsx0XpQaSgt2dKUaLs8GvMmH8Qt6Dp_TQM25a_WOa8E'
const { createClient } = supabase
const client = createClient(supabaseUrl, supabaseKey)
document.getElementById('Preguntas_seg').addEventListener("submit", async(e)=>{
    let r1 = document.getElementById("Pregunta_1").value
    let r2 = document.getElementById("Pregunta_2").value
    let r3 = document.getElementById("Pregunta_3").value
    const { data, error } = await client
            .from('Clientes')
            .insert([{ Telef: sessionStorage.getItem("Tele_nuevo_usuario"), Nombre: sessionStorage.getItem("Tele_nuevo_usuario"), Contra: sessionStorage.getItem("Contra_nuevo_usuario"), Resp_1: encriptar(r1), Resp_2: encriptar(r2), Resp_3: encriptar(r3)}])
            if (error){
                const mensaje = error.message
                const valor = 2;
                window.location.href = `/Templates/Template_informe/Informe.html?informe=${encodeURIComponent(mensaje)}&valor=${encodeURIComponent(valor)}`;
            }else{
                const mensaje = "Registro Exitoso!";
                const valor = 3;
                window.location.href = `/Templates/Template_informe/Informe.html?informe=${encodeURIComponent(mensaje)}&valor=${encodeURIComponent(valor)}`;
            }
})










