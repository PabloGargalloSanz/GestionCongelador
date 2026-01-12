const vistaLogin = document.getElementById("login-page");
const vistaDashboard = document.getElementById("dashboard-page");
const formLogin = document.getElementById("login-form");
const btnLogout = document.getElementById("logout-btn");
const emailDashboard = document.getElementById("display-email");

// Comprobar si ya estamos logueados

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (token) {
        mostrarDashboard();
    } else {
        mostrarLogin();
    }
});





/*
//Login

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

////////////////////////////////////////////////////////////////
// Codigo antiguo de login sin backend
//////////////////////////////////////////////////////////////

const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailValue = document.getElementById('email').value || 'test@test.com';
        
    mostrarDashboard();
});
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////

function mostrarLogin() {
    vistaDashboard.style.display = "none";
    vistaLogin.style.display = "flex";
    //emailDashboard.textContent = emailValue;
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
}


function mostrarDashboard() {
    vistaLogin.style.display = "none";
    vistaDashboard.style.display = "flex"; 
    cargarCajones();
    renderAlmacenes();
}

//////////////////////////////////////////////////////////////
/*datos prueba*/
//////////////////////////////////////////////////////////////

const almacenamientos = [
    { id: 1, nombre: 'Congelador Cocina', localizacion: 'Cocina', ocupacion: 65 },
    { id: 2, nombre: 'Arcón Garaje', localizacion: 'Garaje', ocupacion: 22 },
    { id: 3, nombre: 'Nevera Pasillo', localizacion: 'Pasillo', ocupacion: 85 }
];

const inventario = [
    { id: 101, nombre: 'Hamburguesas Vaca', tipo: 'Carne', cantidad: '4 uds', lugar: 'Cajón 1' },
    { id: 102, nombre: 'Guisantes congelados', tipo: 'Verdura', cantidad: '1 kg', lugar: 'Cajón 2' },
    { id: 103, nombre: 'Filetes de Pavo', tipo: 'Carne', cantidad: '500 g', lugar: 'Cajón 1' }
];
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////        

// Logout
btnLogout.addEventListener("click", () => {
    localStorage.removeItem("token");
    mostrarLogin();
});

// cargar datos 
async function cargarCajones() {
    console.log("Cargando cajones del backend...");
}

// randerizar almacenes
function renderAlmacenes() {
            const grid = document.getElementById('freezer-grid');
            grid.innerHTML = ''; // Limpiar

            almacenamientos.forEach(alm => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <div class="almacen-contenedor">
                        <div class="card-icon"></div>
                        <span class="almacen-localizacion">
                            ${alm.localizacion.toUpperCase()}
                        </span>
                    </div>
                    <h3 class="almacen-nombre">${alm.nombre}</h3>
                    <p class="almacen-ocupacion">Ocupación actual</p>
                    <div class="progress-container">
                        <div class="progress-bar" style="width: ${alm.ocupacion}%"></div>
                    </div>
                    <div class="status-row">
                        <span style="color: ${alm.ocupacion > 80 ? '#ef4444' : '#024fa2'}">${alm.ocupacion}% lleno</span>
                        <button class="btn-detail">Gestionar →</button>
                    </div>
                `;
                grid.appendChild(card);
            });
        }