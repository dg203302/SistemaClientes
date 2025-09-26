import { encriptar} from "../encriptado.js"
const supabaseUrl = 'https://qxbkfmvugutmggqwxhrb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4YmtmbXZ1Z3V0bWdncXd4aHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNTEzMDEsImV4cCI6MjA3MzgyNzMwMX0.Qsx0XpQaSgt2dKUaLs8GvMmH8Qt6Dp_TQM25a_WOa8E'
const { createClient } = supabase
const client = createClient(supabaseUrl, supabaseKey)
var Resp_1_bd = ''
var Resp_2_bd = ''
var Resp_3_bd = ''
var tele_recu = sessionStorage.getItem("telefono_usuario_recu");
window.onload = async () => {
    const {data,error} = await client
    .from('Clientes')
    .select('Resp_1, Resp_2, Resp_3')
    .eq('Telef',tele_recu)
    .single()
    if (error){
        const valor = 5;
        window.location.href = `/Templates/Template_informe/Informe.html?informe=${encodeURIComponent(error.message)}&valor=${encodeURIComponent(valor)}`;
    }
    else{
        Resp_1_bd=data.Resp_1
        Resp_2_bd=data.Resp_2
        Resp_3_bd=data.Resp_3
    }
}

document.getElementById("Preguntas_seg").addEventListener('submit', function(e){
    e.preventDefault();
    if (document.getElementById("Pregunta_1").value === ''){
        alert("debe ingresar la respuesta a la primer pregunta!")
        return
    }
    else if (document.getElementById("Pregunta_2").value === ''){
        alert("debe ingresar la respuesta a la segunda pregunta!")
        return
    }
    else if (document.getElementById("Pregunta_3").value === ''){
        alert("debe ingresar la respuesta a la tercer pregunta!")
        return
    }
    else if ((document.getElementById("Pregunta_1").value === '')&&(document.getElementById("Pregunta_2").value === '')&&(document.getElementById("Pregunta_3").value === '')){
        alert("debe responder las preguntas!")
        return
    }

    if ((encriptar(document.getElementById("Pregunta_1").value)===(Resp_1_bd))&&(encriptar(document.getElementById("Pregunta_2").value)===(Resp_2_bd))&&(encriptar(document.getElementById("Pregunta_3").value)===(Resp_3_bd))){
        console.log("los codigos coinciden")
        window.location.href = "/Templates/Templates_recuperar_contrasenia/actualizar_contra.html"
    }
    else{
        const valor = 5;
        window.location.href = `/Templates/Template_informe/Informe.html?informe=${encodeURIComponent("mal codigo")}&valor=${encodeURIComponent(valor)}`;
    }
})