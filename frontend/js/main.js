import { auth } from './auth.js';
import { loginRequest, getTiposAlimento, getAlmacenesByUsuarioDashboard, getAllAlimentosByUsuario, crearAlmacenAPI, patchAlmacenAPI, deleteAlmacenAPI } from './api.js';
import { app, loadTemplate, showToast, renderAlmacenes, renderBarraFiltros, renderTablaInventario, renderBarraAñadirAlimento, openModalAlmacen } from './ui.js';


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
            //datos iniciales
            almacenesGlobales = await getAlmacenesByUsuarioDashboard();
            renderAlmacenes(almacenesGlobales);

            // añadir almacen
            const btnAddAlmacen = document.getElementById('add-almacenamiento-btn');
            if (btnAddAlmacen) {
                btnAddAlmacen.addEventListener('click', async () => {
                    const resultado = await openModalAlmacen(); 

                    if (resultado && resultado.action === 'CREATE') {
                        const resAPI = await crearAlmacenAPI(resultado.data);

                        if (resAPI.ok) {
                            showToast("Almacén creado correctamente", "success");
                            document.querySelector('.nav-item[data-view="dashboard"]').click(); 
                        } else {
                            showToast(resAPI.error, "danger");
                        }
                    }
                });
            }

            // gestionar almacenes (Editar/Borrar)
            const botonesGestionar = document.querySelectorAll('.btn-gestionar-almacen');
            
            botonesGestionar.forEach(btn => {
                btn.addEventListener('click', async () => {
                    const idAlmacen = parseInt(btn.getAttribute('data-id'));
                    const almacenSeleccionado = almacenesGlobales.find(a => a.id_almacenamiento === idAlmacen);

                    const resultado = await openModalAlmacen(almacenSeleccionado);

                    if (resultado) {
                        let resAPI;
                        
                        if (resultado.action === 'EDIT') {
                            resAPI = await patchAlmacenAPI(resultado.data.id_almacenamiento, {
                                almacenamiento_nombre: resultado.data.almacenamiento_nombre,
                                localizacion: resultado.data.localizacion
                            });
                        } else if (resultado.action === 'DELETE') {
                            resAPI = await deleteAlmacenAPI(resultado.data.id_almacenamiento);
                        }

                        if (resAPI && resAPI.ok) {
                            showToast(resultado.action === 'EDIT' ? "Almacén actualizado" : "Almacén eliminado", "success");
                            document.querySelector('.nav-item[data-view="dashboard"]').click(); 
                        } else if (resAPI && !resAPI.ok) {
                            showToast(resAPI.error, "danger");
                        }
                    }
                });
            });

        } catch (error) {
            console.error("Fallo al cargar almacenes", error);
        }

    } else if (viewName === 'inventario') {
        loadTemplate('inventario-view', mainContent);
        const btnAddAlimento = document.getElementById('add-alimento-btn');
        try {
            const respuestaApi = await getAllAlimentosByUsuario();
            inventarioGlobal = Array.isArray(respuestaApi[0]) ? respuestaApi[0] : respuestaApi;
            
            if (!almacenesGlobales || almacenesGlobales.length === 0) {
                almacenesGlobales = await getAlmacenesByUsuarioDashboard();
            }

            renderTablaInventario(inventarioGlobal, almacenesGlobales);
            renderFiltros(); 

            if (window.filtroPendiente) {
                document.getElementById('filtro-inventario-btn')?.click();
            }

            if (btnAddAlimento) {
                btnAddAlimento.addEventListener('click', async () => {
                    const contenedorAñadir = document.getElementById('inventario-list-filter');
        
                    try {
                        const tipos = await getTiposAlimento() || [];

                        if (almacenesGlobales.length === 0) {
                            renderBarraAñadirAlimento(contenedorAñadir, tipos, almacenesGlobales);
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
   
    if (!btnFiltro || !contenedorFiltros) return; 

    btnFiltro.onclick = async () => {
        if (contenedorFiltros.children.length > 0) {
            contenedorFiltros.innerHTML = "";
            renderTablaInventario(inventarioGlobal, almacenesGlobales);
            return;
        }

        const tipos = await getTiposAlimento();
        
        const prefiltro = window.filtroPendiente || "";
        renderBarraFiltros(contenedorFiltros, tipos, almacenesGlobales, prefiltro);
        
        //borramos html cargado
        window.filtroPendiente = null;

        // filtro con almacen selecionado
        if (prefiltro !== "") {
            ejecutarFiltrado();
        }

        document.querySelectorAll('.filter-input').forEach(input => {
            input.addEventListener(input.tagName === 'SELECT' ? 'change' : 'input', ejecutarFiltrado);
        });

        // para cargado de cajones desde dashboard
        const selectAlmacen = document.getElementById('filter-almacenes');
        const selectCajon = document.getElementById('filter-cajon');
        
        if(selectAlmacen && selectCajon) {
            //cargamos cajones
            if (selectAlmacen.value !== "") {
                const alm = almacenesGlobales.find(a => a.almacenamiento_nombre === selectAlmacen.value);
                if (alm) {
                    selectCajon.disabled = false;
                    let opciones = '<option value="">Todos</option>';
                    for(let i=1; i <= alm.num_cajones; i++) opciones += `<option value="${i}">Cajón ${i}</option>`;
                    selectCajon.innerHTML = opciones;
                }
            }

            selectAlmacen.addEventListener('change', (e) => {
                const nombreAlm = e.target.value;
                if (!nombreAlm) {
                    selectCajon.disabled = true;
                    selectCajon.innerHTML = '<option value="">Cajón</option>';
                } else {
                    selectCajon.disabled = false;
                    const alm = almacenesGlobales.find(a => a.almacenamiento_nombre === nombreAlm);                    
                    let opciones = '<option value="">Todos</option>';
                    const n = alm?.num_cajones || 0;
                    for(let i=1; i <= n; i++) opciones += `<option value="${i}">Cajón ${i}</option>`;
                    selectCajon.innerHTML = opciones;
                }
                ejecutarFiltrado(); 
            });
        }

        document.getElementById('eliminar-filtros-btn')?.addEventListener('click', () => {
            contenedorFiltros.innerHTML = "";
            renderTablaInventario(inventarioGlobal, almacenesGlobales);
        });
    };
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

// redirigir a inventario
window.addEventListener('navegar-inventario', (e) => {
    window.filtroPendiente = e.detail.almacenNombre; 
    
    const btnInventario = document.querySelector('.nav-item[data-view="inventario"]');
    
    if (btnInventario) {
        btnInventario.click(); 
    } 
});

// Arrancar App
document.addEventListener('DOMContentLoaded', () => {
    if (auth.isLoggedIn()) {
        rendermenu();
    } else {
        renderLogin();
    }
});