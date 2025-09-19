const supabaseUrl = 'https://qxbkfmvugutmggqwxhrb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4YmtmbXZ1Z3V0bWdncXd4aHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNTEzMDEsImV4cCI6MjA3MzgyNzMwMX0.Qsx0XpQaSgt2dKUaLs8GvMmH8Qt6Dp_TQM25a_WOa8E'
const supabase = supabase.createClient(supabaseUrl, supabaseKey)
const form = document.querySelector('form')
form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const nombre = document.getElementById('nombre').value
    const correo = document.getElementById('correo').value
    const contrasenia = document.getElementById('contraseña').value
    print(nombre+"\n"+correo+"\n"+contrasenia)
    const { data, error } = await supabase
        .from('Clientes')
        .insert([
            { nombre, correo, contrasenia }
        ])
    if (error) {
        print('Error al registrar: ' + error.message)
    } else {
        print('Cliente registrado correctamente')
    }
})