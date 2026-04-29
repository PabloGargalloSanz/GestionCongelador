import { loadTemplate, showToast } from '../../core/ui.js';
import { generarMenuAPI, obtenerMenuGuardadoAPI } from './api.menu.js';
import { renderMenu } from './ui.menu.js';

export async function initMenu(container) {
    loadTemplate('menu-view', container);

    const btnGenerar = document.getElementById('btn-generar-menu');
    const loadingDiv = document.getElementById('loading-menu');
    const gridContainer = document.getElementById('menu-grid-container');
    const loadingText = loadingDiv.querySelector('h3');

    //obtener datos db
    btnGenerar.disabled = true;
    loadingText.textContent = "Buscando menú guardado...";
    loadingDiv.classList.remove('hidden');

    const resDB = await obtenerMenuGuardadoAPI();
    
    loadingDiv.classList.add('hidden');
    btnGenerar.disabled = false;

    if (resDB.ok && resDB.data && resDB.data.menu) {
        
        //randerizar menu
        renderMenu(resDB.data);
        btnGenerar.innerHTML = "Regenerar Menú";
    } else {
        
        gridContainer.innerHTML = '<p class="text-center w-100" class="no_menu">Aún no tienes un menú para esta semana. Haz clic en "Generar Menú" para crear uno.</p>';
        btnGenerar.innerHTML = " Generar Menú";
    }

    //----------
    //generar o regenerar menu

    if (btnGenerar) {
        btnGenerar.addEventListener('click', async () => {
            
            btnGenerar.disabled = true;
            loadingText.textContent = "Analizando inventario con IA...";
            loadingDiv.classList.remove('hidden');
            gridContainer.innerHTML = ''; 
            document.getElementById('lista-compra-container').classList.add('hidden');
            document.getElementById('alerta-domingo-previo').classList.add('hidden');

            const resAPI = await generarMenuAPI('estandar');

            loadingDiv.classList.add('hidden');
            btnGenerar.disabled = false;

            if (resAPI.ok && resAPI.data.menu) {
                showToast("Menú diseñado y guardado con éxito", "success");
                renderMenu(resAPI.data);

                btnGenerar.innerHTML = "Regenerar Menú";
            } else {
                showToast(resAPI.error || "La IA tardó demasiado. Inténtalo de nuevo.", "danger");

                // si falla mostramos anterior
                if (resDB.ok && resDB.data) renderMenu(resDB.data);
            }
        });
    }
}