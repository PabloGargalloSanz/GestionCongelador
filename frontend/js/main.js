import { auth } from './auth.js';
import { loginRequest, getTiposAlimento, getAlmacenesByUsuarioDashboard, getAllAlimentosByUsuario } from './api.js';
import { app, loadTemplate, showToast, renderAlmacenes, renderBarraFiltros, renderTablaInventario } from './ui.js';

// comprobar si token expira
window.addEventListener('unauthorized-access', () => {
    showToast("Su sesión ha expirado. Por favor, inicie sesión de nuevo.", "danger");
    renderLogin(); 
});


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

async function renderView(viewName) {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;
    
    if (viewName === 'dashboard') {
        loadTemplate('dashboard-view', mainContent);
        try {
            const almacenes = await getAlmacenesByUsuarioDashboard();
            renderAlmacenes(almacenes);

        } catch (error) {
            console.error("Fallo al cargar almacenes", error);
        }

    } else if (viewName === 'inventario') {
        loadTemplate('inventario-view', mainContent);
        try {
            const alimentos = await getAllAlimentosByUsuario();
            renderTablaInventario(alimentos);
            renderFiltros(); 

        } catch (error) {
            console.error("Fallo al cargar el inventario:", error);
        }

    }  else if (viewName === 'recetas') {
        loadTemplate('recetas-view', mainContent);
    }
}

function renderFiltros() {  
    const btnFiltro = document.getElementById('filtro-inventario-btn');
        const contenedorFiltros = document.getElementById('filtros-contenedor');

        btnFiltro.addEventListener('click', async () => {
            if (contenedorFiltros.innerHTML !== "") {
                contenedorFiltros.innerHTML = "";
                return;
            }

            const tipos = await getTiposAlimento();
            renderBarraFiltros(contenedorFiltros, tipos);

            document.querySelectorAll('.filter-input').forEach(input => {
                input.addEventListener('input', ejecutarFiltrado);
            });
        });
}

function ejecutarFiltrado() {
    const filtros = {
        nombre: document.getElementById('filter-nombre').value.toLowerCase(),
        tipo: document.getElementById('filter-tipo').value,
        fechaIn: document.getElementById('filter-fecha-in').value,
        fechaOut: document.getElementById('filter-fecha-out').value
    };

    console.log("Filtrando por:", filtros);
    //funcion limpiar tabla segun filtros

}



// Arrancar App
document.addEventListener('DOMContentLoaded', () => {
    if (auth.isLoggedIn()) {
        rendermenu();
    } else {
        renderLogin();
    }
});