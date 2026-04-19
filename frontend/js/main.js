import { auth } from './auth.js';
import { loginRequest } from './core/api.js';
import { app, loadTemplate, showToast } from './core/ui.js';
import { initDashboard } from './modules/almacenes/view.dashboard.js';
import { initInventario } from './modules/inventario/view.inventario.js';

// comprobar token
window.addEventListener('unauthorized-access', () => {
    showToast("Su sesión ha expirado. Por favor, inicie sesión de nuevo.", "danger");
    renderLogin(); 
});

// Login
function renderLogin() {
    loadTemplate('tpl-login', app);

    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('username').value;
        const password = document.getElementById('password').value; 

        try {
            const response = await loginRequest(email, password);
            const data = await response.json();

            if (response.ok) {
                auth.saveSession(data.token, email);
                rendermenu();
            } else {
                showToast(data.error || "Acceso denegado", 'danger');
            }
        } catch (error) {
            showToast("Error de conexión con el servidor de autenticación", 'danger');
        }
    });
}

// render menu
function rendermenu() {
    const savedEmail = auth.getUserEmail();
    if(!savedEmail){
        renderLogin();
        return;
    } 
    
    loadTemplate('tpl-menu', app);

    const displayElement = document.getElementById('display-email');
    if(displayElement){
        displayElement.innerText = savedEmail;
    }

    // navegacion
    const navButtons = document.querySelectorAll('.nav-item[data-view]');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderView(btn.dataset.view);
        });
    });

    // logout
    const logoutBtn = document.getElementById('logout-btn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            auth.clearSession();
            renderLogin();
        });
    }

    renderView('dashboard');
}

// cargar vistas
async function renderView(viewName) {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;
    
    if (viewName === 'dashboard') {
        await initDashboard(mainContent);

    } else if (viewName === 'inventario') {
        await initInventario(mainContent);

    } else if (viewName === 'recetas') {
        loadTemplate('recetas-view', mainContent);
    }
}

// saltos entre vistas
window.addEventListener('navegar-inventario', (e) => {
    window.filtroPendiente = e.detail.almacenNombre; 
    const btnInventario = document.querySelector('.nav-item[data-view="inventario"]');
    if (btnInventario) btnInventario.click(); 
});

// arrancar app
document.addEventListener('DOMContentLoaded', () => {
    if (auth.isLoggedIn()) {
        rendermenu();
    } else {
        renderLogin();
    }
});