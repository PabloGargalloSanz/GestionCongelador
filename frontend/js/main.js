// js/main.js

import { auth } from './auth.js';
import { app, loadTemplate, showToast } from './core/ui.js';

// Importamos las vistas
import { renderLogin } from './modules/auth/view.auth.js';
import { initDashboard } from './modules/almacenes/view.dashboard.js';
import { initInventario } from './modules/inventario/view.inventario.js';

// Comprobar si token expira
window.addEventListener('unauthorized-access', () => {
    showToast("Su sesión ha expirado. Por favor, inicie sesión de nuevo.", "danger");
    renderLogin(rendermenu); 
});

// Render Menu (Dashboard layout)
function rendermenu() {
    const savedEmail = auth.getUserEmail();
    if(!savedEmail){
        renderLogin(rendermenu); 
        return;
    } 
    
    loadTemplate('tpl-menu', app);

    const displayElement = document.getElementById('display-email');
    if(displayElement){
        displayElement.innerText = savedEmail;
    }

    const navButtons = document.querySelectorAll('.nav-item[data-view]');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderView(btn.dataset.view);
        });
    });

    const logoutBtn = document.getElementById('logout-btn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            auth.clearSession();
            renderLogin(rendermenu);
        });
    }

    renderView('dashboard'); // Carga inicial
}

// Enrutador Principal
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

// Escuchador global para saltos entre vistas
window.addEventListener('navegar-inventario', (e) => {
    window.filtroPendiente = e.detail.almacenNombre; 
    const btnInventario = document.querySelector('.nav-item[data-view="inventario"]');
    if (btnInventario) btnInventario.click(); 
});

// Arrancar App
document.addEventListener('DOMContentLoaded', () => {
    if (auth.isLoggedIn()) {
        rendermenu();
    } else {
        renderLogin(rendermenu); 
    }
});