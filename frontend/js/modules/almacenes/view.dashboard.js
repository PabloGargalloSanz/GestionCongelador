import { getAlmacenesByUsuarioDashboard, crearAlmacenAPI, patchAlmacenAPI, deleteAlmacenAPI } from './api.almacenes.js';
import { loadTemplate, showToast } from '../../core/ui.js';
import { renderAlmacenes, openModalAlmacen } from './ui.almacenes.js';

export async function initDashboard(container) {
    loadTemplate('dashboard-view', container);

    try {
        const almacenes = await getAlmacenesByUsuarioDashboard();
        renderAlmacenes(almacenes);

        // añadir alamcenamiento
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

        //  botones (Editar/Borrar)
        const botonesGestionar = document.querySelectorAll('.btn-gestionar-almacen');
        botonesGestionar.forEach(btn => {
            btn.addEventListener('click', async () => {
                const idAlmacen = parseInt(btn.getAttribute('data-id'));
                const almacenSeleccionado = almacenes.find(a => a.id_almacenamiento === idAlmacen);

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

        return almacenes;

    } catch (error) {
        console.error("Fallo al cargar almacenes", error);
        showToast("Error al conectar con el servidor", "danger");
        return [];
    }
}