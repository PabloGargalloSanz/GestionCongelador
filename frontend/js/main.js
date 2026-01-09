const vistaLogin = document.getElementById("login-page");
const vistaDashboard = document.getElementById("dashboard-page");
const formLogin = document.getElementById("login-form");
const btnLogout = document.getElementById("logout-btn");

// Comprobar si ya estamos logueados
/*
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (token) {
        mostrarDashboard();
    } else {
        mostrarLogin();
    }
});
*/

function mostrarLogin() {
    vistaDashboard.style.display = "none";
    vistaLogin.style.display = "flex";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
}

function mostrarDashboard() {
    vistaLogin.style.display = "none";
    vistaDashboard.style.display = "flex"; 
    cargarCajones();
}







//Login
/*
formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

////////////////////////////////////////////////////////////////
// Cambiar la URL a la correcta del backend cuando abra servidor
//////////////////////////////////////////////////////////////
        const response = await fetch("http://127.0.0.1/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, pass: password }) 
        });

        const data = await response.json();

        if (response.ok) {
            // guardar token
            localStorage.setItem("token", data.token); 
            mostrarDashboard();
        } else {
            alert(data.error || "Error al entrar");
        }
    } catch (error) {
        console.error(error);
        alert("Error de conexión");
    }
});
*/
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailValue = document.getElementById('email').value || 'test@test.com';
        
    mostrarDashboard();
});

// Logout
btnLogout.addEventListener("click", () => {
    localStorage.removeItem("token");
    mostrarLogin();
});

// cargar datos 
async function cargarCajones() {
    console.log("Cargando cajones del backend...");
}