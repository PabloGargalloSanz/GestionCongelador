// --- Datos de prueba ---
const almacenamientos = [
    { id: 1, nombre: 'Congelador Cocina', localizacion: 'Cocina', ocupacion: 95 },
    { id: 2, nombre: 'Arcón Garaje', localizacion: 'Garaje', ocupacion: 22 }
];

// selectores principales
const app = document.getElementById('app');

// cargar templates
function loadTemplate(templateId, container) {
    const template = document.getElementById(templateId);
    const clone = template.content.cloneNode(true);
    container.innerHTML = "";
    container.appendChild(clone);
}

// navegar por las vistas

function renderLogin() {
    loadTemplate('tpl-login', app);
    const loginForm = document.getElementById('login-form');

    //Login

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        localStorage.setItem('userEmail', email);

        try {

    ////////////////////////////////////////////////////////////////
    // Cambiar la URL a la correcta del backend cuando abra servidor
    //////////////////////////////////////////////////////////////
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, pass: password }) 
            });

            const data = await response.json();

        ///////////////////////////////////////////////////////////
            e.preventDefault();
            const entrar = true;

        ///////////////////////////////////////////////////////////
            //if (response.ok) { poner esto y quitar entrar y e.preventDefault

            if (entrar || response.ok) {
                // guardar token
                localStorage.setItem("token", data.token);                

                rendermenu();
            } else {
                alert(data.error || "Error al entrar");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        }
    });


}

//render menu
function rendermenu() {
    loadTemplate('tpl-menu', app);

    // Configurar Sidebar
    const navButtons = document.querySelectorAll('.nav-item[data-view]');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Manejo de clase active
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // Cambiar sub-vista
            renderView(btn.dataset.view);
        });
    });

    const savedEmail = localStorage.getItem('userEmail');
    const displayElement = document.getElementById('display-email');

    if(savedEmail){
        displayElement.innerText = savedEmail;
    } else {
        renderLogin();
    }
    

    // Logout
    document.getElementById('logout-btn').addEventListener('click', () => {
        sessionStorage.clear();
        localStorage.removeItem('userEmail');
        renderLogin();
    });

    // Carga inicial de la sub-vista dashboard
    renderView('dashboard');
}

function renderView(viewName) {
    const mainContent = document.getElementById('main-content');
    
    if (viewName === 'dashboard') {
        loadTemplate('dashboard-view', mainContent);
        renderAlmacenes();

    } else if (viewName === 'inventario') {
        loadTemplate('inventario-view', mainContent);
        // funcion rellenar tabla

    }  else if (viewName === 'recetas') {
        loadTemplate('recetas-view', mainContent);
        //funcion rellenar recetas
    }
}

// Componentes dinamicos 

//Llenar almacenes
function renderAlmacenes() {
    const grid = document.getElementById('freezer-grid');
    if (!grid) return;

    almacenamientos.forEach(alm => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="almacen-contenedor">
                <div class="card-icon"></div>
                <span class="almacen-localizacion">${alm.localizacion}</span>
            </div>
            <h3 class="almacen-nombre">${alm.nombre}</h3>
            <p class="almacen-ocupacion">Ocupación actual</p>
            <div class="progress-container">
                <div class="progress-bar" style="width: ${alm.ocupacion}% "></div>
            </div>
            <div class="status-row">
                <span style="color: ${alm.ocupacion > 80 ? 'var(--accent)' : 'var(--primario-oscuro)'}">${alm.ocupacion}% </span>
                <button class="btn-detail">Gestionar →</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Arrancar App
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem("token");
    if (token) {
        rendermenu();
    } else {
        renderLogin();
        
    }
})