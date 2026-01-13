// --- Datos de prueba ---
const almacenamientos = [
    { id: 1, nombre: 'Congelador Cocina', localizacion: 'Cocina', ocupacion: 65 },
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
/*
//Si no funciona conexion db
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailValue = document.getElementById('email').value || 'test@test.com';
        
        rendermenu();
    });   
     */
    //Login

    loginForm.addEventListener("submit", async (e) => {
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

    // Logout
    document.getElementById('logout-btn').addEventListener('click', () => {
        sessionStorage.clear();
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
                <span class="almacen-localizacion">${alm.localizacion}</span>
            </div>
            <h3>${alm.nombre}</h3>
            <div class="progress-container">
                <div class="progress-bar" style="width: ${alm.ocupacion}%"></div>
            </div>
            <div class="status-row">
                <span>${alm.ocupacion}% lleno</span>
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