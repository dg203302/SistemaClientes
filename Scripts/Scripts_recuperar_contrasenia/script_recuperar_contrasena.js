const supabaseUrl = 'https://qxbkfmvugutmggqwxhrb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4YmtmbXZ1Z3V0bWdncXd4aHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNTEzMDEsImV4cCI6MjA3MzgyNzMwMX0.Qsx0XpQaSgt2dKUaLs8GvMmH8Qt6Dp_TQM25a_WOa8E'
const { createClient } = supabase
const client = createClient(supabaseUrl, supabaseKey)
document.getElementById("recuperarForm").addEventListener("submit",async (e) =>{
    e.preventDefault();
    let tel = document.getElementById("telef").value;
    const { data, error } = await client
        .from('Clientes')
        .select('Telef')
        .eq('Telef', tel)
        .single();
    if (error){
        const valor = 4;
        window.location.href = `/Templates/Template_informe/Informe.html?informe=${encodeURIComponent(error.message)}&valor=${encodeURIComponent(valor)}`;
    }else {
        let codigo_gen = ''
        for (let i = 0; i < 4; i++) {
            codigo_gen += Math.floor(Math.random() * 10);
        }
        let codigo_recu = parseInt(codigo_gen,10)
        const{data, error} = await client
            .from('Codigos_recuperacion')
            .upsert({Telef:tel, codigo_rec: codigo_recu}, {onConflict: 'Telef'})
            .single();
        }
        if(error){
            const valor = 4;
            window.location.href = `/Templates/Template_informe/Informe.html?informe=${encodeURIComponent(error.message)}&valor=${encodeURIComponent(valor)}`;
        }else{
            sessionStorage.setItem("telefono_usuario_recu", tel)
            //aca poner el envio del mensaje con el codigo!
            window.location.href = "/Templates/Templates_recuperar_contrasenia/Preguntas_cambiar_contraseña.html"
        }
})
