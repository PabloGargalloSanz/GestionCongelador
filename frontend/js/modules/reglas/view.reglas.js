import { loadTemplate, showToast } from '../../core/ui.js';
import { getReglasAPI, crearReglaAPI, updateReglaAPI, deleteReglaAPI } from './api.reglas.js';
import { getAllAlimentosByUsuario } from '../inventario/api.inventario.js'; 
import { renderTablaReglas } from './ui.reglas.js';

export async function renderReglas(appContainer) {
    // carga plantilla html
    loadTemplate('reglas-view', appContainer);

    // variable para ver si creamos o editamos
    let editandoId = null;

    // Referencias a los inputs del formulario
    const inputNombre = document.getElementById('regla-nombre');
    const inputCantidad = document.getElementById('regla-cantidad');
    const inputUnidad = document.getElementById('regla-unidad');
    const btnSubmit = document.getElementById('btn-add-regla');

    try {
        // cargar /recargar tabla
        const actualizarVista = async () => {
            const [reglas, inventario] = await Promise.all([
                getReglasAPI(),
                getAllAlimentosByUsuario() 
            ]);
            
            renderTablaReglas(reglas, inventario, manejarEdicion, manejarEliminacion);
        };

        // editar regla
        const manejarEdicion = (regla) => {
            //rellena el form con los datos de la regla seleccionada
            inputNombre.value = regla.producto;
            inputCantidad.value = regla.cantidad_minima;
            inputUnidad.value = regla.unidad_medida.toLowerCase();
            
            editandoId = regla.id_alerta;
            
            // cambio btn
            btnSubmit.innerText = "Guardar Cambios";
            inputNombre.focus();
        };

        //eliminar
        const manejarEliminacion = async (idRegla) => {
            const response = await deleteReglaAPI(idRegla);
            if (response.ok) {
                showToast("Regla eliminada correctamente", "success");
                actualizarVista(); // recarga tabla
            } else {
                showToast(response.error, "danger");
            }
        };

        // listener para crear o actualiar
        btnSubmit.addEventListener('click', async () => {
            const producto = inputNombre.value.trim();
            const cantidad = parseInt(inputCantidad.value);
            const unidad = inputUnidad.value;

            if (!producto || isNaN(cantidad) || cantidad <= 0) {
                showToast("Por favor, rellena el producto y una cantidad válida", "warning");
                return;
            }

            //btn desactivado
            btnSubmit.disabled = true;
            
            const datos = { producto, cantidad_minima: cantidad, unidad };
            let response;

            if (editandoId) {
                //actualizar
                response = await updateReglaAPI(editandoId, datos);
            } else {
                // crear
                response = await crearReglaAPI(datos);
            }

            if (response.ok) {
                showToast(editandoId ? "Regla actualizada" : "Regla de stock añadida", "success");
                
                // reset form
                inputNombre.value = '';
                inputCantidad.value = '';
                editandoId = null;
                btnSubmit.innerText = "Añadir Regla";
               
                actualizarVista();
            } else {
                showToast(response.error, "danger");
            }
            
            // activar btn
            btnSubmit.disabled = false;
        });

        await actualizarVista();

    } catch (error) {
        console.error("Error general en la vista de reglas:", error);
        showToast("Error al cargar los datos del inventario", "danger");
    }
}