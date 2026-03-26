import { auth } from './auth.js';
import { loginRequest, getTiposAlimento, getAlmacenesByUsuarioDashboard, getAllAlimentosByUsuario} from './api.js';
import { app, loadTemplate, showToast, renderAlmacenes, renderBarraFiltros, renderTablaInventario, renderBarraAñadirAlimento } from './ui.js';


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
        const btnAddAlimento = document.getElementById('add-alimento-btn');
        try {
            const respuestaApi = await getAllAlimentosByUsuario();
            inventarioGlobal = Array.isArray(respuestaApi[0]) ? respuestaApi[0] : respuestaApi;
            
            renderTablaInventario(inventarioGlobal);
            renderFiltros();

            if (btnAddAlimento) {
                btnAddAlimento.addEventListener('click', async () => {
                    const contenedorAñadir = document.getElementById('inventario-list-filter');
        
                    try {
                        const tipos = await getTiposAlimento() || [];

                        if (almacenesGlobales.length === 0) {
                            almacenesGlobales = await getAlmacenesByUsuarioDashboard();
                        }

                        renderBarraAñadirAlimento(contenedorAñadir, tipos, almacenesGlobales);
                        
                    } catch (error) {
                        showToast("Error al preparar el formulario de añadir", "danger");
                        console.error(error);
                    }
                });
            }

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
    const contenedorFiltros = document.getElementById('inventario-list-filter');
   
    if (!btnFiltro) return; 

    btnFiltro.addEventListener('click', async () => {
        if (contenedorFiltros.innerHTML !== "") {
            contenedorFiltros.innerHTML = "";
            return;
        }

        const tipos = await getTiposAlimento();
        renderBarraFiltros(contenedorFiltros, tipos, almacenesGlobales);

        // Volvemos a añadir el listener al cajón específicamente
        const selectCajon = document.getElementById('filter-cajon');
        if(selectCajon) {
            selectCajon.addEventListener('change', ejecutarFiltrado);
        }

        document.querySelectorAll('.filter-input').forEach(input => {
            const evento = input.tagName === 'SELECT' ? 'change' : 'input';
            input.addEventListener(evento, ejecutarFiltrado);
        });

        // Lógica de borrar filtros
        const btnEliminar = document.getElementById('eliminar-filtros-btn');
        if (btnEliminar) {
            btnEliminar.addEventListener('click', () => {
                document.querySelectorAll('.filter-input').forEach(input => {
                    input.value = "";
                });
                if(selectCajon) selectCajon.disabled = true;
                renderTablaInventario(inventarioGlobal);
            });
        }

        // Lógica de Almacén -> Cajón
        const selectAlmacen = document.getElementById('filter-almacenes');
        if(selectAlmacen) {
            selectAlmacen.addEventListener('change', (e) => {
                const almacenSeleccionado = e.target.value;
                if (almacenSeleccionado === "") {
                    selectCajon.disabled = true;
                    selectCajon.innerHTML = '<option value="">Cajón</option>';
                } else {
                    selectCajon.disabled = false;
                    const almacenData = almacenesGlobales.find(a => a.localizacion === almacenSeleccionado);
                    let opciones = '<option value="">Todos</option>';
                    if(almacenData && almacenData.num_cajones) {
                        for(let i=1; i <= almacenData.num_cajones; i++) {
                            opciones += `<option value="${i}">Cajón ${i}</option>`;
                        }
                    }
                    selectCajon.innerHTML = opciones;
                }
                ejecutarFiltrado(); 
            });
        }
    });
}

//Filtrado inventario
function ejecutarFiltrado() {
    const filtros = {
        nombre: document.getElementById('filter-nombre')?.value.toLowerCase() || "",
        tipo: document.getElementById('filter-tipo')?.value || "",
        almacen: document.getElementById('filter-almacenes')?.value || "",
        cajon: document.getElementById('filter-cajon')?.value || "", 
        ordenIntro: document.getElementById('filter-fecha-introducido')?.value || "",
        ordenCaducidad: document.getElementById('filter-fecha-caducidad')?.value || ""
    };

    let datosFiltrados = inventarioGlobal.filter(item => {
        const coincideNombre = (item.alimento || "").toLowerCase().includes(filtros.nombre);
        const coincideTipo = filtros.tipo === "" || item.tipo === filtros.tipo;
        const coincideAlmacen = filtros.almacen === "" || (item.ubicacion && item.ubicacion.includes(filtros.almacen));
        const coincideCajon = filtros.cajon === "" || String(item.cajon_posicion) === filtros.cajon;

        return coincideNombre && coincideTipo && coincideAlmacen && coincideCajon;
    });

    const criterio = filtros.ordenIntro ? 'fecha_introduccion' : (filtros.ordenCaducidad ? 'fecha_caducidad' : null);
    const direccion = filtros.ordenIntro || filtros.ordenCaducidad;

    if (criterio && direccion) {
        datosFiltrados.sort((a, b) => {
            const dateA = new Date(a[criterio]).getTime();
            const dateB = new Date(b[criterio]).getTime();
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