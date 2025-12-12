const vistaLogin = document.getElementById('vista-login');
const vistaDashboard = document.getElementById('vista-dashboard');
const formLogin = document.getElementById('form-login');
const btnLogout = document.getElementById('btn-logout');

// Comprobar si ya estamos logueados
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        mostrarDashboard();
    }
});

//Login
formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
////////////////////////////////////////////////////////////////
// Cambiar la URL a la correcta del backend cuando abra servidor
//////////////////////////////////////////////////////////////
        const response = await fetch('http://127.0.0.1/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, pass: password }) 
        });

        const data = await response.json();

        if (response.ok) {
            // guardar token
            localStorage.setItem('token', data.token); 
            mostrarDashboard();
        } else {
            alert(data.error || 'Error al entrar');
        }
    } catch (error) {
        console.error(error);
        alert('Error de conexión');
    }
});

//Cambio de Vista
function mostrarDashboard() {
    vistaLogin.classList.add('hidden');      
    vistaDashboard.classList.remove('hidden'); 
    cargarCajones(); 
}

function cerrarSesion() {
    localStorage.removeItem('token'); // Borrar token
    vistaDashboard.classList.add('hidden');
    vistaLogin.classList.remove('hidden');
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
}

btnLogout.addEventListener('click', cerrarSesion);

// cargar datos 
async function cargarCajones() {
    console.log("Cargando cajones del backend...");
}