const supabaseUrl = 'https://qxbkfmvugutmggqwxhrb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4YmtmbXZ1Z3V0bWdncXd4aHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNTEzMDEsImV4cCI6MjA3MzgyNzMwMX0.Qsx0XpQaSgt2dKUaLs8GvMmH8Qt6Dp_TQM25a_WOa8E'
const { createClient } = supabase
const client = createClient(supabaseUrl, supabaseKey)
const form = document.getElementById('registroForm')
const mensaje = document.getElementById('mensaje')
if (verificar_contrasenia){
    form.addEventListener('submit', async (e) => {
        e.preventDefault()
        const Nombre = document.getElementById('nombre').value
        const Mail = document.getElementById('correo').value
        const Contra = document.getElementById('contraseña').value
        const { data, error } = await client
        .from('Clientes')
        .insert([{ Mail, Nombre, Contra }])
        if (error) {
        console.error('Error al registrar:', error.message)
        mensaje.innerText = '❌ Error al registrar: ' + error.message
        } else {
        console.log('Cliente registrado correctamente:', data)
        mensaje.innerText = '✅ Cliente registrado correctamente'
        form.reset()
        }
    })
}
else{
    
}