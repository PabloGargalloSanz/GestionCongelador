import { auth } from './auth.js';
import { loginRequest, getTiposAlimento, getAlmacenesByUsuarioDashboard, getAllAlimentosByUsuario } from './api.js';
import { app, loadTemplate, showToast, renderAlmacenes, renderBarraFiltros, renderTablaInventario } from './ui.js';


///variables globales
let inventarioGlobal = [];
let almacenesGlobales = [];

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
            almacenesGlobales = await getAlmacenesByUsuarioDashboard();
            renderAlmacenes(almacenesGlobales);

        } catch (error) {
            console.error("Fallo al cargar almacenes", error);
        }

    } else if (viewName === 'inventario') {
        loadTemplate('inventario-view', mainContent);
        try {
            const respuestaApi = await getAllAlimentosByUsuario();
            inventarioGlobal = Array.isArray(respuestaApi[0]) ? respuestaApi[0] : respuestaApi;
            
            renderTablaInventario(inventarioGlobal);
            renderFiltros();

        } catch (error) {
            console.error("Fallo al cargar el inventario:", error);
        }

    }  else if (viewName === 'recetas') {
        loadTemplate('recetas-view', mainContent);
    }
}

///Tabla inventario

function renderFiltros() {  
    const btnFiltro = document.getElementById('filtro-inventario-btn');
    const contenedorFiltros = document.getElementById('filtros-contenedor');

    btnFiltro.addEventListener('click', async () => {
        if (contenedorFiltros.innerHTML !== "") {
            contenedorFiltros.innerHTML = "";
            return;
        }

        const tipos = await getTiposAlimento();
        
        renderBarraFiltros(contenedorFiltros, tipos, almacenesGlobales);

        document.querySelectorAll('.filter-input').forEach(input => {
            const evento = input.tagName === 'SELECT' ? 'change' : 'input';
            input.addEventListener(evento, ejecutarFiltrado);
        });
        
        document.getElementById('filter-fecha-introducido').addEventListener('change', () => {
            document.getElementById('filter-fecha-caducidad').value = "";
        });
        document.getElementById('filter-fecha-caducidad').addEventListener('change', () => {
            document.getElementById('filter-fecha-introducido').value = "";
        });
    });
}

function ejecutarFiltrado() {
    const filtros = {
        nombre: document.getElementById('filter-nombre').value.toLowerCase(),
        tipo: document.getElementById('filter-tipo').value,
        almacen: document.getElementById('filter-almacenes').value,
        ordenIntro: document.getElementById('filter-fecha-introducido').value,
        ordenCaducidad: document.getElementById('filter-fecha-caducidad').value
    };

    // filtro de datos
    let datosFiltrados = inventarioGlobal.filter(item => {
        const coincideNombre = (item.alimento || "").toLowerCase().includes(filtros.nombre);
        const coincideTipo = filtros.tipo === "" || item.tipo === filtros.tipo;
        const coincideAlmacen = filtros.almacen === "" || (item.ubicacion && item.ubicacion.includes(filtros.almacen));

        return coincideNombre && coincideTipo && coincideAlmacen;
    });

    // ordenacion unica
    const criterio = filtros.ordenIntro ? 'fecha_introduccion' : (filtros.ordenCaducidad ? 'fecha_caducidad' : null);
    const direccion = filtros.ordenIntro || filtros.ordenCaducidad;

    if (criterio && direccion) {
        datosFiltrados.sort((a, b) => {
            
            const dateA = new Date(a[criterio]).getTime();
            const dateB = new Date(b[criterio]).getTime();

            // gestion fechas vacias
            if (isNaN(dateA)) return 1;
            if (isNaN(dateB)) return -1;

            return direccion === "Ascendente" ? dateA - dateB : dateB - dateA;
        });
    }

    renderTablaInventario(datosFiltrados); 
}

// Arrancar App
document.addEventListener('DOMContentLoaded', () => {
    if (auth.isLoggedIn()) {
        rendermenu();
    } else {
        renderLogin();
    }
});