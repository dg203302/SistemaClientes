const supabaseUrl = 'https://qxbkfmvugutmggqwxhrb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4YmtmbXZ1Z3V0bWdncXd4aHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNTEzMDEsImV4cCI6MjA3MzgyNzMwMX0.Qsx0XpQaSgt2dKUaLs8GvMmH8Qt6Dp_TQM25a_WOa8E'
const { createClient } = supabase
const client = createClient(supabaseUrl, supabaseKey)
var codigo_BD = 0
var mail_recu = ''
window.onload = async () => {
    const params = new URLSearchParams(window.location.search);
    const mail = params.get('email');
    mail_recu=mail;
    const {data,error} = await client
    .from('Codigos_recuperacion')
    .select('codigo_rec')
    .eq('Mail',mail)
    .single()
    if (error){
        const valor = 5;
        window.location.href = `Informe.html?informe=${encodeURIComponent(error.message)}&valor=${encodeURIComponent(valor)}`;
    }
    else{
        codigo_BD=data.codigo_rec;
    }
}
document.getElementById("ing_codigo_rec").addEventListener('submit', function(e){
    e.preventDefault();
    let codi_ing = document.getElementById('codigo4').value;
    if (parseInt(codi_ing) == codigo_BD){
        console.log("los codigos coinciden \n codigo de la bd: "+codigo_BD+"\n codigo ingresado: "+ codi_ing)
        
        window.location.href = `actualizar_contra.html?email=${encodeURIComponent(mail_recu)}`
    }
    else{
        const valor = 5;
        window.location.href = `Informe.html?informe=${encodeURIComponent("mal codigo")}&valor=${encodeURIComponent(valor)}`;
    }
})