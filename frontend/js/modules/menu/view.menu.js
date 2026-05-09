import { loadTemplate, showToast } from '../../core/ui.js';
import { generarMenuAPI, obtenerMenuGuardadoAPI, cambiarEstadoMenuAPI } from './api.menu.js';
import { renderMenu } from './ui.menu.js';

export async function initMenu(container) {
    loadTemplate('menu-view', container);

    const btnGenerar = document.getElementById('btn-generar-menu');
    const loadingDiv = document.getElementById('loading-menu');
    const gridContainer = document.getElementById('menu-grid-container');
    const loadingText = loadingDiv.querySelector('h3');
    
    const accionesContainer = document.getElementById('menu-acciones-container');
    const btnAceptar = document.getElementById('btn-aceptar-menu');
    const btnRechazar = document.getElementById('btn-rechazar-menu');
    
    let currentMenuId = null; 

    // gestion de botones
    const actualizarBotones = (datosDB) => {
        currentMenuId = datosDB.id_menu;
        
        if (datosDB.estado === 'borrador') {
            // borrador - botoens de aceptar o cancelar
            accionesContainer.classList.remove('hidden');
            btnGenerar.classList.add('hidden');

            btnRechazar.classList.remove('hidden');
            btnAceptar.classList.remove('hidden');

        } else {
            // aceptado - no botoens
            accionesContainer.classList.add('hidden');
            btnGenerar.classList.remove('hidden');
            btnGenerar.innerHTML = " Regenerar Menú";
            btnRechazar.classList.add('hidden');
            btnAceptar.classList.add('hidden');
        }
    };

    // obtener menu al entrar
    btnGenerar.disabled = true;
    loadingText.textContent = "Buscando menú guardado...";
    loadingDiv.classList.remove('hidden');

    const resDB = await obtenerMenuGuardadoAPI();
    
    loadingDiv.classList.add('hidden');
    btnGenerar.disabled = false;

    if (resDB.ok && resDB.data && resDB.data.menu) {
        renderMenu(resDB.data);
        actualizarBotones(resDB.data);
        
    } else {
        gridContainer.innerHTML = `
            <div class="menu-empty-state">
                Aún no tienes un menú para esta semana.<br><br>
                Haz clic en el botón <strong>"Generar Menú"</strong> para crear uno.
            </div>
        `;
        btnGenerar.innerHTML = "Generar Menú";
    }

    //crear / recargar
    const generarNuevoMenu = async () => {
        btnGenerar.disabled = true;
        btnRechazar.disabled = true;
        loadingText.textContent = "Analizando inventario con IA...";
        loadingDiv.classList.remove('hidden');
        gridContainer.innerHTML = ''; 
        document.getElementById('lista-compra-container').classList.add('hidden');
        document.getElementById('alerta-domingo-previo').classList.add('hidden');
        accionesContainer.classList.add('hidden');

        const resAPI = await generarMenuAPI('estandar');

        loadingDiv.classList.add('hidden');
        btnGenerar.disabled = false;
        btnRechazar.disabled = false;

        if (resAPI.ok && resAPI.data.menu) {
            showToast("Menú diseñado con éxito", "success");
            renderMenu(resAPI.data);
            actualizarBotones(resAPI.data);
            
        } else {
            showToast(resAPI.error || "La IA tardó demasiado. Inténtalo de nuevo.", "danger");
        }
    };

    if (btnGenerar) btnGenerar.addEventListener('click', generarNuevoMenu);

    // aceptar o rechazar menu
    if (btnAceptar) {
        btnAceptar.addEventListener('click', async () => {
            if (!currentMenuId) return;
            const res = await cambiarEstadoMenuAPI(currentMenuId, 'aceptado');
            if (res.ok) {
                showToast("¡Menú guardado y aceptado!", "success");
                accionesContainer.classList.add('hidden');
                btnGenerar.classList.remove('hidden');
                btnGenerar.innerHTML = "Regenerar Menú";
            } else {
                showToast(res.error, "danger");
            }
        });
    }

    if (btnRechazar) {
        btnRechazar.addEventListener('click', async () => {
            if (!currentMenuId) return;
            
            await cambiarEstadoMenuAPI(currentMenuId, 'rechazado');
            
            // crear nuevo
            showToast("Menú rechazado. Generando nueva propuesta...", "info");
            btnRechazar.classList.add('hidden');
            btnAceptar.classList.add('hidden');
            generarNuevoMenu(); 
        
        });
    }
}