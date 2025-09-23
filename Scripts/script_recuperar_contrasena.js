const supabaseUrl = 'https://qxbkfmvugutmggqwxhrb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4YmtmbXZ1Z3V0bWdncXd4aHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNTEzMDEsImV4cCI6MjA3MzgyNzMwMX0.Qsx0XpQaSgt2dKUaLs8GvMmH8Qt6Dp_TQM25a_WOa8E'
const { createClient } = supabase
const client = createClient(supabaseUrl, supabaseKey)
document.getElementById("recuperarForm").addEventListener("submit",async (e) =>{
    e.preventDefault();
    let correo = document.getElementById("correo").value;
    const { data, error } = await client
        .from('Clientes')
        .select('Mail')
        .eq('Mail', correo)
        .single();
    if (error){
        const valor = 4;
        window.location.href = `Informe.html?informe=${encodeURIComponent(error.message)}&valor=${encodeURIComponent(valor)}`;
    }else {
        let codigo_gen = ''
        for (let i = 0; i < 4; i++) {
            codigo_gen += Math.floor(Math.random() * 10);
        }
        let codigo_recu = parseInt(codigo_gen,10)
        const{data, error} = await client
            .from('Codigos_recuperacion')
            .upsert({Mail:correo, codigo_rec: codigo_recu}, {onConflict: 'Mail'})
            .single();
        }
        if(error){
            const valor = 4;
            window.location.href = `Informe.html?informe=${encodeURIComponent(error.message)}&valor=${encodeURIComponent(valor)}`;
        }else{
            window.location.href = `ingresar_codigo_rec.html?email=${encodeURIComponent(correo)}`
            //aca poner el envio del mail con el codigo!
        }
})
