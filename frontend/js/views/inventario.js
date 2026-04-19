import { getAllAlimentosByUsuario, getAlmacenesByUsuarioDashboard, getTiposAlimento, guardarNuevoAlimentoAPI, patchAlimentoAPI, deleteAlimentoAPI } from '../api.js';
import { loadTemplate, showToast, renderTablaInventario, openModalAñadirAlimento, renderBarraFiltros } from '../ui.js';

let inventarioLocal = [];
let almacenesLocales = [];

export async function initInventario(container) {
    loadTemplate('inventario-view', container);
    
    try {
        const respuestaApi = await getAllAlimentosByUsuario();
        inventarioLocal = Array.isArray(respuestaApi[0]) ? respuestaApi[0] : respuestaApi;
        almacenesLocales = await getAlmacenesByUsuarioDashboard();

        renderTablaInventario(inventarioLocal, almacenesLocales, handleEditarLote, handleEliminarLote);
        
        // filtros
        configurarFiltros();

        // filtro pendiente?
        if (window.filtroPendiente) {
            document.getElementById('filtro-inventario-btn')?.click();
        }

        //añadir alimento
        const btnAddAlimento = document.getElementById('add-alimento-btn');
        if (btnAddAlimento) {
            btnAddAlimento.addEventListener('click', handleAñadirAlimento);
        }

    } catch (error) {
        console.error("Fallo al cargar el inventario:", error);
        showToast("Error al cargar los datos del inventario", "danger");
    }
}

// añadir alimento
async function handleAñadirAlimento() {
    try {
        const tipos = await getTiposAlimento() || [];
        const nuevoLote = await openModalAñadirAlimento(tipos, almacenesLocales);

        if (nuevoLote) {
            const resultado = await guardarNuevoAlimentoAPI(nuevoLote); 
            if (resultado.ok) {
                showToast("Alimento añadido correctamente", "success");
                document.querySelector('.nav-item[data-view="inventario"]')?.click(); 
            } else {
                showToast(resultado.error, "danger");
            }
        }
    } catch (error) {
        showToast("Error al abrir el formulario", "danger");
        console.error(error);
    }
}

// editar/borrar
async function handleEliminarLote(id_lote) {
    const resultado = await deleteAlimentoAPI(id_lote);
    if (resultado.ok) {
        showToast("Alimento eliminado correctamente", "success");
        document.querySelector('.nav-item[data-view="inventario"]')?.click(); 
        return true;
    } else {
        showToast(resultado.error, "danger");
        return false;
    }
}

async function handleEditarLote(id_lote, data) {
    const resultado = await patchAlimentoAPI(id_lote, data);
    if (resultado.ok) {
        showToast("Alimento modificado correctamente", "success");
        document.querySelector('.nav-item[data-view="inventario"]')?.click(); 
        return true;
    } else {
        showToast(resultado.error, "danger");
        return false;
    }
}

//filtros
function configurarFiltros() {  
    const btnFiltro = document.getElementById('filtro-inventario-btn');
    const contenedorFiltros = document.getElementById('inventario-list-filter');
   
    if (!btnFiltro || !contenedorFiltros) return; 

    btnFiltro.onclick = async () => {
        if (contenedorFiltros.children.length > 0) {
            contenedorFiltros.innerHTML = "";
            renderTablaInventario(inventarioLocal, almacenesLocales, handleEditarLote, handleEliminarLote);
            return;
        }

        const tipos = await getTiposAlimento();
        const prefiltro = window.filtroPendiente || "";
        
        renderBarraFiltros(contenedorFiltros, tipos, almacenesLocales, prefiltro);
        window.filtroPendiente = null;

        // filtro desde dashboard?
        if (prefiltro !== "") {
            ejecutarFiltrado();
        }

        //listeners para inputs
        document.querySelectorAll('.filter-input').forEach(input => {
            input.addEventListener(input.tagName === 'SELECT' ? 'change' : 'input', ejecutarFiltrado);
        });

        // almacen - cajon
        const selectAlmacen = document.getElementById('filter-almacenes');
        const selectCajon = document.getElementById('filter-cajon');
        
        if(selectAlmacen && selectCajon) {
            if (selectAlmacen.value !== "") {
                const alm = almacenesLocales.find(a => a.almacenamiento_nombre === selectAlmacen.value);
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
                    const alm = almacenesLocales.find(a => a.almacenamiento_nombre === nombreAlm);                    
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
            renderTablaInventario(inventarioLocal, almacenesLocales, handleEditarLote, handleEliminarLote);
        });
    };
}

function ejecutarFiltrado() {
    const filtros = {
        nombre: document.getElementById('filter-nombre')?.value.toLowerCase() || "",
        tipo: document.getElementById('filter-tipo')?.value || "",
        almacen: document.getElementById('filter-almacenes')?.value || "",
        cajon: document.getElementById('filter-cajon')?.value || "", 
        ordenIntro: document.getElementById('filter-fecha-introducido')?.value || "",
        ordenCaducidad: document.getElementById('filter-fecha-caducidad')?.value || ""
    };

    let datosFiltrados = inventarioLocal.filter(item => {
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

    renderTablaInventario(datosFiltrados, almacenesLocales, handleEditarLote, handleEliminarLote);
}