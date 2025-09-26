const supabaseUrl = 'https://qxbkfmvugutmggqwxhrb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4YmtmbXZ1Z3V0bWdncXd4aHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNTEzMDEsImV4cCI6MjA3MzgyNzMwMX0.Qsx0XpQaSgt2dKUaLs8GvMmH8Qt6Dp_TQM25a_WOa8E'
const { createClient } = supabase
const client = createClient(supabaseUrl, supabaseKey)
var codigo_BD = 0
var tele_recu = ''
window.onload = async () => {
    const tel = sessionStorage.getItem("telefono_usuario_recu");
    tele_recu=tel;
    const {data,error} = await client
    .from('Codigos_recuperacion')
    .select('codigo_rec')
    .eq('Telef',tel)
    .single()
    if (error){
        const valor = 5;
    window.location.href = `/Templates/Template_informe/Informe.html?informe=${encodeURIComponent(error.message)}&valor=${encodeURIComponent(valor)}`;
    }
    else{
        codigo_BD=data.codigo_rec;
    }
    
}
document.getElementById("ing_codigo_rec").addEventListener('submit', function(e){
    e.preventDefault();
    if (document.getElementById("codigo4").value === ''){
        alert("debe ingresar el codigo")
        return
    }
    let codi_ing = document.getElementById('codigo4').value;
    if (parseInt(codi_ing) == codigo_BD){
        console.log("los codigos coinciden \n codigo de la bd: "+codigo_BD+"\n codigo ingresado: "+ codi_ing)
        
    window.location.href = "/Templates/Templates_recuperar_contrasenia/actualizar_contra.html"
    }
    else{
        const valor = 5;
    window.location.href = `/Templates/Template_informe/Informe.html?informe=${encodeURIComponent("mal codigo")}&valor=${encodeURIComponent(valor)}`;
    }
})

document.getElementById("boton_reinv").addEventListener("click", async (e)=>{
    e.preventDefault()
    const { data, error } = await client
        .from('Clientes')
        .select('Telef')
        .eq('Telef', tele_recu)
        .single();
    if (error){
        const valor = 4;
    window.location.href = `/Templates/Template_informe/Informe.html?informe=${encodeURIComponent(error.message)}&valor=${encodeURIComponent(valor)}`;
    }else {
        let codigo_gen = ''
        for (let i = 0; i < 4; i++) {
            codigo_gen += Math.floor(Math.random() * 10);
        }
        var codigo_recu = parseInt(codigo_gen,10)
        const{data, error} = await client
            .from('Codigos_recuperacion')
            .upsert({Telef:tele_recu, codigo_rec: codigo_recu}, {onConflict: 'Telef'})
            .single();
        }
        if(error){
            const valor = 4;
            window.location.href = `/Templates/Template_informe/Informe.html?informe=${encodeURIComponent(error.message)}&valor=${encodeURIComponent(valor)}`;
        }else{
            alert("Codigo Reenviado")
            codigo_BD=codigo_recu;
        }
})