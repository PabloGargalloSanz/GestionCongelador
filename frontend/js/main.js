import { auth } from './auth.js';
import { loginRequest } from './api.js';
import { app, loadTemplate, showToast, renderAlmacenes } from './ui.js';

// navegar por las vistas

//Login//////////////////////////////
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
                // guardamso token
                auth.saveSession(data.token, email);
                                
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
    const logoutBtn = document.getElementById('logout-btn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            auth.clearSession();
            renderLogin();
        });
    }

    // Carga inicial de la sub-vista dashboard
    renderView('dashboard');
}

function renderView(viewName) {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;
    
    if (viewName === 'dashboard') {
        loadTemplate('dashboard-view', mainContent);
        renderAlmacenes();

    } else if (viewName === 'inventario') {
        loadTemplate('inventario-view', mainContent);
        renderFiltros(); // Llamamos a la función de los filtros
    }  else if (viewName === 'recetas') {
        loadTemplate('recetas-view', mainContent);
    }
}

function renderFiltros() {  
    const filtroBtn = document.getElementById('filtro-inventario-btn');
    if (!filtroBtn) return;

    filtroBtn.addEventListener('click', () => {
        const filtro = document.createElement('div');
        filtro.className = 'filtro-popup';
        filtro.innerHTML = `
            <select id="filtro-tipo">
                <option value="todos">Todos los tipos</option>
                <option value="carne">Carne</option>
                <option value="pescado">Pescado</option>
                <option value="vegetales">Vegetales</option>
                <option value="frutas">Frutas</option>
                <option value="lacteos">Lácteos</option>
                <option value="otros">Otros</option>
            </select>`;
        
        document.body.appendChild(filtro);

        // Cerrar al hacer clic fuera
        filtro.addEventListener('click', (e) => {
            if (e.target === filtro) {
                filtro.remove();
            }
        });
    });
}

// Arrancar App
document.addEventListener('DOMContentLoaded', () => {
    if (auth.isLoggedIn()) {
        rendermenu();
    } else {
        renderLogin();
    }
});