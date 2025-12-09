// 1. Referencias al DOM
const vistaLogin = document.getElementById('vista-login');
const vistaDashboard = document.getElementById('vista-dashboard');
const formLogin = document.getElementById('form-login');
const btnLogout = document.getElementById('btn-logout');

// 2. Comprobar si ya estamos logueados al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        mostrarDashboard();
    }
});

// 3. Lógica de Login
formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Petición a tu Backend
        const response = await fetch('http://127.0.0.1:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, pass: password }) 
        });

        const data = await response.json();

        if (response.ok) {
            // GUARDAR EL TOKEN (Importante para mantener sesión)
            localStorage.setItem('token', data.token); // O data.id_usuario
            mostrarDashboard();
        } else {
            alert(data.error || 'Error al entrar');
        }
    } catch (error) {
        console.error(error);
        alert('Error de conexión');
    }
});

// 4. Funciones de Cambio de Vista
function mostrarDashboard() {
    vistaLogin.classList.add('hidden');      // Ocultar Login
    vistaDashboard.classList.remove('hidden'); // Mostrar Dashboard
    cargarCajones(); // Llamar a la función que pide los datos al backend
}

function cerrarSesion() {
    localStorage.removeItem('token'); // Borrar token
    vistaDashboard.classList.add('hidden');
    vistaLogin.classList.remove('hidden');
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
}

btnLogout.addEventListener('click', cerrarSesion);

// 5. Función para cargar datos (ejemplo)
async function cargarCajones() {
    console.log("Cargando cajones del backend...");
    // Aquí harías el fetch a /api/cajones usando el token si es necesario
}