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


//Login//////////////////////////////
function renderLogin() {
    loadTemplate('tpl-login', app);

    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('username').value;
        const tokenInput = document.getElementById('password').value; 

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: tokenInput })
            });

            const data = await response.json();

            if (response.ok) {
                // guardamso token
                localStorage.setItem('auth_token', data.token);
                localStorage.setItem('userEmail', email);
                                
                //loginScreen.classList.add('hidden');
                //mainApp.classList.remove('hidden');
                
                // Iniciamos el menu
                rendermenu();

            } else {
                showToast(data.error || "Acceso denegado", 'danger');
            }
        } catch (error) {
            showToast("Error de conexión con el servidor de autenticación", 'danger');
        }
    });

}

//render menu
function rendermenu() {
    const savedEmail = localStorage.getItem('userEmail');
    if(!savedEmail){
        renderLogin();
        return;
    } 
    
    loadTemplate('tpl-menu', app);

    const displayElement = document.getElementById('display-email');
    if(displayElement){
        displayElement.innerText = savedEmail;
    }

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
        localStorage.removeItem('userEmail');
        localStorage.removeItem('auth_token');
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

// popups //////////////////////////////////
function showToast(message, level = 'info') {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    
    const activeLevel = level.toLowerCase();
    toast.className = `toast ${activeLevel}`;
    toast.innerText = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        
        setTimeout(() => {
            toast.remove();
        }, 500); 
    }, 4000); //  visible 4 segundos
}