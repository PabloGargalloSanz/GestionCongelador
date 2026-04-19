import { patchAlimentoAPI, deleteAlimentoAPI } from './api.js';

// selectores principales
export const app = document.getElementById('app');

// cargar templates
export function loadTemplate(templateId, container) {
    const template = document.getElementById(templateId);
    if (!template) return;
    const clone = template.content.cloneNode(true);
    container.innerHTML = "";
    container.appendChild(clone);
}

// popups //////////////////////////////////
export function showToast(message, level = 'info') {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    const activeLevel = level.toLowerCase();
    toast.className = `toast ${activeLevel}`;
    toast.innerText = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => {
            toast.remove();
        }, 500); 
    }, 4000); //  visible 4 segundos
}


//Llenar almacenes////////////////////
export function renderAlmacenes(almacenes) {
    const grid = document.getElementById('freezer-grid');
    
    grid.innerHTML="";
    if(!grid) {
        return;
    }

    almacenes.forEach(alm => {

        const card = document.createElement('div');
        card.className = 'card';
        card.style.cursor = 'pointer';
                    
        card.innerHTML = `
            <div class="almacen-contenedor">
                <div class="card-icon">
                    <img src="./img/nieve.png" alt="CopoDeNieve" class="copo">
                </div>
                <span class="almacen-localizacion">${alm.localizacion}</span>
            </div>
            <h3 class="almacen-nombre">${alm.almacenamiento_nombre}</h3>
            <p class="almacen-ocupacion">Ocupación actual</p>
            <div class="progress-container">
                <div class="progress-bar" 
                    style="width: ${alm.ocupacion}%; background-color: ${alm.ocupacion > 80 ? 'var(--accent)' : 'var(--primario)'};">
                </div>
            </div>
            <div class="status-row">
                <span style="color: ${alm.ocupacion > 80 ? 'var(--accent)' : 'var(--primario-oscuro)'}">${alm.ocupacion}% </span>
                <button class="btn-detail btn-gestionar-almacen" data-id="${alm.id_almacenamiento}">Gestionar →</button>
            </div>
        `;

        //listener para navegar a inventario filtrado por almacen
        card.addEventListener('click', (e) => {            
            if (!e.target.closest('.btn-gestionar-almacen')) {
                
                const event = new CustomEvent('navegar-inventario', { 
                    detail: { almacenNombre: alm.almacenamiento_nombre } 
                });
                window.dispatchEvent(event);
            }
        });

        grid.appendChild(card);
    });
}

//llenar tabla inventario
export function renderTablaInventario(alimentos, listaAlmacenes) {    
    const tableBody = document.getElementById('inventario-list');
    if (!tableBody) return;

    tableBody.innerHTML = ""; 

    if (alimentos.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="12" style="text-align:center;">No hay alimentos en el inventario</td>
            </tr>`;
        return;
    }

    alimentos.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.alimento}</td>
            <td>${item.tipo}</td>
            <td>${item.cantidad} ${item.unidad_medida}</td>
            <td>${item.ubicacion}</td>
            <td>${item.cajon_posicion || 'N/A'}</td>
            <td>${new Date(item.fecha_introduccion).toLocaleDateString()}</td>
            <td>${new Date(item.fecha_caducidad).toLocaleDateString()}</td>
            <td>
                <button  class="lapiz-btn editar-lote-btn" data-index="${index}">
                    <img src="./img/lapiz.png" alt="modificarAlimento" class="logoLapiz">
                </button>
            </td>
            <td><button class="lapiz-btn eliminar-lote-btn" data-index="${index}">
                <img src="./img/papelera.png" alt="eliminarAlimento" class="logoLapiz">
            </button></td>
        `;
        tableBody.appendChild(row);
    });
    const botonesEditar = document.querySelectorAll('.editar-lote-btn');

    botonesEditar.forEach((btn) => {
        btn.addEventListener('click', () => {
            // indice de boton
            const index = btn.getAttribute('data-index');
            const item = alimentos[index]; 
            const tr = btn.closest('tr'); 
            
            activarEdicionFila(tr, item, listaAlmacenes);
        });
    });

    // Eliminar lote
    const botonesEliminar = document.querySelectorAll('.eliminar-lote-btn');

    botonesEliminar.forEach((btn) => {
        btn.addEventListener('click', async () => {
            const index = btn.getAttribute('data-index');
            const item = alimentos[index]; 
            
            // Confirmacion antes de eliminar
            const confirmacion = await showConfirmModal(
                `¿Estás seguro de que deseas eliminar <strong>"${item.alimento}"</strong> con la cantidad <strong>${item.cantidad} ${item.unidad_medida}</strong> del inventario?`
            );

            if (confirmacion) {
                // desactivar boton 
                btn.disabled = true;
                btn.style.opacity = '0.5';

                // api
                const resultado = await deleteAlimentoAPI(item.id_lote);

                if (resultado.ok) {
                    showToast("Alimento eliminado correctamente", "success");
                    // refrescar
                    const btnInventario = document.querySelector('.nav-item[data-view="inventario"]');
                    if(btnInventario) btnInventario.click(); 
                } else {
                    showToast(resultado.error, "danger");
                    btn.disabled = false;
                    btn.style.opacity = '1';
                }
            }
        });
    });
}


//Filtros inventario////////////////////
export function renderBarraFiltros(container, tipos, almacenes, almacenPreseleccionado = "") {
    container.innerHTML = `
        <td>
            <input type="text" id="filter-nombre" placeholder=" Buscar..." class="filter-input">
        </td>
        <td>
            <select id="filter-tipo" class="filter-input">
                <option value="">Todos</option>
                ${tipos.map(t => `<option value="${t.alimento_tipo}">${t.alimento_tipo}</option>`).join('')}
            </select>
        </td>
        <td></td>
        <td>
            <select id="filter-almacenes" class="filter-input">
                <option value="">Todos</option>
                ${almacenes.map(a => `
                    <option value="${a.almacenamiento_nombre}" ${a.almacenamiento_nombre === almacenPreseleccionado ? 'selected' : ''}>
                        ${a.almacenamiento_nombre}
                    </option>
                `).join('')}
            </select>
        </td>
        <td>
            <select id="filter-cajon" class="filter-input" disabled>
                <option value="" class="filter-input">Todos</option>
            </select>
        </td>
        <td>
            <select id="filter-fecha-introducido" class="filter-input">
                <option value="" class="filter-input"> </option>
                <option value="Ascendente" >Ascendente</option>
                <option value="Descendente" >Descendente</option>
            </select>
        </td>
        <td>
            <select id="filter-fecha-caducidad" class="filter-input">
                <option value="" class="filter-input"> </option>
                <option value="Ascendente" >Ascendente</option>
                <option value="Descendente" >Descendente</option>
            </select>
        </td>
        <td></td>
        <td><button id="eliminar-filtros-btn" class="lapiz-btn"><img src="./img/papelera.png" alt="eliminarFiltros" class="logoLapiz"></td>
    `;
}

//Añadir alimento-lote////////////////////
// ui.js - Nueva función para el Modal de Añadir Alimento
export function openModalAñadirAlimento(tipos, almacenes) {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        
        // Fecha actual para validaciones o por defecto
        const hoy = new Date().toISOString().split('T')[0];

        overlay.innerHTML = `
            <div class="modal-card" style="max-width: 500px;">
                <div class="modal-header">
                    <h3 class="modal-title" style="margin-bottom: 0;">Añadir Nuevo Alimento</h3>
                    <button id="btn-cerrar-x-alim" class="btn-cerrar-x" title="Cerrar">&times;</button>
                </div>
                
                <div class="modal-form-container">
                    <label class="form-label modal-label">Nombre del alimento:</label>
                    <input type="text" id="add-nombre" class="filter-input modal-input" placeholder="Ej: Pechuga de pollo">
                    
                    <label class="form-label modal-label">Tipo de alimento:</label>
                    <select id="add-tipo" class="filter-input modal-input">
                        <option value="">Selecciona una categoría...</option>
                        ${tipos.map(t => `<option value="${t.alimento_tipo}">${t.alimento_tipo}</option>`).join('')}
                    </select>

                    <div style="display: flex; gap: 15px; margin-bottom: 15px;">
                        <div style="flex: 1;">
                            <label class="form-label modal-label">Cantidad:</label>
                            <div style="display: flex; gap: 5px;">
                                <input type="number" id="add-cantidad" class="filter-input" placeholder="0" min="1" style="width: 60%;">
                                <select id="add-unidad" class="filter-input" style="width: 40%;">
                                    <option value="ud">Ud</option>  
                                    <option value="g">g</option>
                                    <option value="kg">Kg</option>
                                    <option value="l">L</option>
                                </select>
                            </div>
                        </div>
                        <div style="flex: 1;">
                            <label class="form-label modal-label">Tamaño aprox:</label>
                            <select id="add-tamano" class="filter-input">
                                <option value="XS">XS - Muy Pequeño</option>
                                <option value="S">S - Pequeño</option>
                                <option value="M" selected>M - Estándar</option>
                                <option value="L">L - Grande</option>
                                <option value="XL">XL - Extra Grande</option>
                            </select>
                        </div>
                    </div>

                    <div style="display: flex; gap: 15px; margin-bottom: 15px;">
                        <div style="flex: 1;">
                            <label class="form-label modal-label">Ubicación:</label>
                            <select id="add-almacen" class="filter-input">
                                <option value="">Selecciona almacén...</option>
                                ${almacenes.map(a => `<option value="${a.id_almacenamiento}">${a.almacenamiento_nombre}</option>`).join('')}
                            </select>
                        </div>
                        <div style="flex: 1;">
                            <label class="form-label modal-label">Cajón:</label>
                            <select id="add-cajon" class="filter-input" disabled>
                                <option value="">Cajón...</option>
                            </select>
                        </div>
                    </div>

                    <label class="form-label modal-label">Fecha de Caducidad:</label>
                    <input type="date" id="add-caducidad" class="filter-input modal-input" min="${hoy}">
                </div>

                <div class="modal-botones justify-center" style="margin-top: 25px;">
                    <button id="btn-guardar-alim-modal" class="btn-guardar-almacen" style="width: 100%;">Guardar en Inventario</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // 1. Lógica para cerrar en la X
        overlay.querySelector('#btn-cerrar-x-alim').addEventListener('click', () => {
            overlay.remove();
            resolve(null);
        });

        // 2. Lógica de Almacén -> Cajones
        const selectAlmacen = overlay.querySelector('#add-almacen');
        const selectCajon = overlay.querySelector('#add-cajon');

        selectAlmacen.addEventListener('change', (e) => {
            const idSeleccionado = parseInt(e.target.value); 
            const almacen = almacenes.find(a => a.id_almacenamiento === idSeleccionado);
            const numCajones = almacen ? (almacen.total_cajones || almacen.num_cajones) : 0;
            
            if (almacen && numCajones) {
                selectCajon.disabled = false;
                let opciones = '<option value="">Cajón...</option>';
                for (let i = 1; i <= numCajones; i++) {
                    opciones += `<option value="${i}">Cajón ${i}</option>`;
                }
                selectCajon.innerHTML = opciones;
            } else {
                selectCajon.disabled = true;
                selectCajon.innerHTML = '<option value="">Cajón...</option>';
            }
        });

        // 3. Lógica de Guardar
        const btnGuardar = overlay.querySelector('#btn-guardar-alim-modal');
        btnGuardar.addEventListener('click', () => {
            const nombre = overlay.querySelector('#add-nombre').value.trim();
            const tipo = overlay.querySelector('#add-tipo').value;
            const cantidad = parseInt(overlay.querySelector('#add-cantidad').value);
            const unidad = overlay.querySelector('#add-unidad').value;
            const tamano = overlay.querySelector('#add-tamano').value; 
            const idAlmacenamiento = overlay.querySelector('#add-almacen').value;
            const cajonPosicion = overlay.querySelector('#add-cajon').value;
            const fechaCaducidad = overlay.querySelector('#add-caducidad').value;

            // Validación
            if (!nombre || !tipo || isNaN(cantidad) || cantidad <= 0 || !idAlmacenamiento || !cajonPosicion || !fechaCaducidad) {
                showToast("Por favor, rellena todos los campos obligatorios", "warning");
                return;
            }

            // Conversión de tamaño
            const equivalenciasTamano = { 'XS': 5, 'S': 10, 'M': 20, 'L': 30, 'XL': 40 };
            const volumenTamano = equivalenciasTamano[tamano.toUpperCase()] || 20;

            const nuevoLote = {
                alimento_nombre: nombre,
                alimento_tipo: tipo,
                cantidad: cantidad,
                unidad_medida: unidad,
                alimento_tamano: volumenTamano, 
                id_almacenamiento: parseInt(idAlmacenamiento),
                posicion_cajon: parseInt(cajonPosicion),
                fecha_caducidad: fechaCaducidad
            };

            // Cambiamos texto del botón para feedback visual
            btnGuardar.disabled = true;
            btnGuardar.innerText = "Guardando...";

            overlay.remove();
            resolve(nuevoLote); // Devolvemos el objeto al main.js
        });
    });
}

//Modificar alimento-lote
export function activarEdicionFila(tr, item, almacenes) {
    // Se guarda html por si se pulsa cancelar
    const htmlOriginal = tr.innerHTML;

    //quitar horas de la fecha
    const fIntroduccion = item.fecha_introduccion ? new Date(item.fecha_introduccion).toLocaleDateString() : 'N/A';
    const fCaducidad = item.fecha_caducidad ? new Date(item.fecha_caducidad).toLocaleDateString() : 'N/A';

    // cambio contenido por inputs
    tr.innerHTML = `
        <td>${item.alimento_nombre || item.alimento}</td>
        <td>${item.alimento_tipo || item.tipo}</td>
        <td>
            <div class="cantidad-alimento">
                <input type="number" id="edit-cantidad-${item.id_lote}" 
                       value="${item.cantidad}" class="filter-input cantidad-alimento-input">
                ${item.unidad_medida}
            </div>
        </td>
        <td>
            <select id="edit-almacen-${item.id_lote}" class="filter-input input-tabla">
                ${almacenes.map(a => `
                    <option value="${a.id_almacenamiento}" ${a.id_almacenamiento === item.id_almacenamiento ? 'selected' : ''}>
                        ${a.almacenamiento_nombre}
                    </option>`).join('')}
            </select>
        </td>
        <td>
            <select id="edit-cajon-${item.id_lote}" class="filter-input">
                <option value="">Cargando...</option>
            </select>
        </td>
        <td >${fIntroduccion}</td>
        <td >${fCaducidad}</td>
        <td>
            <button class="lapiz-btn guardar-lote-btn" id="btn-save-${item.id_lote}" title="Guardar cambios">Guardar</button>
        </td>
        <td>
            <button class="lapiz-btn" id="btn-cancel-${item.id_lote}" title="Cancelar"><img src="./img/papelera.png" alt="eliminarFiltros" class="logoLapiz"></button>
        </td>
    `;

    const selectAlmacen = tr.querySelector(`#edit-almacen-${item.id_lote}`);
    const selectCajon = tr.querySelector(`#edit-cajon-${item.id_lote}`);

    const actualizarCajones = (idAlmacenSeleccionado, posicionActual) => {
        const almacen = almacenes.find(a => a.id_almacenamiento === parseInt(idAlmacenSeleccionado));
        const numCajones = almacen ? (almacen.total_cajones || almacen.num_cajones) : 0;
        
        let opciones = '';
        for (let i = 1; i <= numCajones; i++) {
            opciones += `<option value="${i}" ${i === posicionActual ? 'selected' : ''}>Cajón ${i}</option>`;
        }
        selectCajon.innerHTML = opciones;
    };

    // carga n cajon con la que ya estaba
    actualizarCajones(item.id_almacenamiento, item.cajon_posicion);

    // cambio almacen
    selectAlmacen.addEventListener('change', (e) => actualizarCajones(e.target.value, 1));

    // se restaura el HTML original
    tr.querySelector(`#btn-cancel-${item.id_lote}`).addEventListener('click', () => {
        tr.innerHTML = htmlOriginal;
    });

    // guardado
    const btnSave = tr.querySelector(`#btn-save-${item.id_lote}`);
    
    btnSave.addEventListener('click', async () => {
        const nuevaCantidad = parseInt(tr.querySelector(`#edit-cantidad-${item.id_lote}`).value);
        const nuevoAlmacen = parseInt(selectAlmacen.value);
        const nuevoCajon = parseInt(selectCajon.value);

        // validacion no sea valor inferior a 0
        if (isNaN(nuevaCantidad) || nuevaCantidad <= 0) {
            showToast("La cantidad debe ser mayor a 0", "warning");
            return;
        }
        
        // validacion no sea valor superior al actual
        if (nuevaCantidad > item.cantidad) {
            showToast(`Solo puedes restar cantidad (máximo ${item.cantidad}). Para añadir más, crea un registro nuevo.`, "warning");
            return;
        }

        //desactivar boton mientras se procesa
        const textoOriginal = btnSave.innerText;
        btnSave.disabled = true;

        const resultado = await patchAlimentoAPI(item.id_lote, {
            cantidad: nuevaCantidad,
            id_almacenamiento: nuevoAlmacen,
            posicion_cajon: nuevoCajon
        });

        if (resultado.ok) {
            showToast("Alimento modificado correctamente", "success");
            
            // recarga vista
            const btnInventario = document.querySelector('.nav-item[data-view="inventario"]');
            if(btnInventario) btnInventario.click(); 

        } else {
            showToast(resultado.error, "danger");
            btnSave.disabled = false;
            btnSave.innerText = textoOriginal;
        }
    });
}

//popups eliminar lote
export function showConfirmModal(mensaje) {
    return new Promise((resolve) => {
        
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        
        overlay.innerHTML = `
            <div class="modal-card">
                <h3 class="modal-title"> Confirmar eliminación</h3>
                <p class="modal-text">${mensaje}</p>
                <div class="modal-botones">
                    <button id="modal-cancel-btn" class="btn-cancelar-modal">Cancelar</button>
                    <button id="modal-confirm-btn" class="btn-eliminar-modal">Eliminar Lote</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);

        // logica botones
        const btnCancel = overlay.querySelector('#modal-cancel-btn');
        const btnConfirm = overlay.querySelector('#modal-confirm-btn');

        // Si cancela, borramos el HTML y devolvemos false
        btnCancel.addEventListener('click', () => {
            overlay.remove();
            resolve(false);
        });

        // Si confirma, borramos el HTML y devolvemos true
        btnConfirm.addEventListener('click', () => {
            overlay.remove();
            resolve(true);
        });
    });
}

// gestionar almacenes
export function openModalAlmacen(almacenExistente = null) {
    return new Promise((resolve) => {
        const isEdit = almacenExistente !== null;
        
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        
        const nombreVal = isEdit ? almacenExistente.almacenamiento_nombre : '';
        const localizacionVal = isEdit ? almacenExistente.localizacion : '';
        const cajonesVal = isEdit ? (almacenExistente.num_cajones || 1) : 1; 

        overlay.innerHTML = `
            <div class="modal-card">
                
                <div class="modal-header">
                    <h3 id="modal-title-almacen" class="modal-title" style="margin-bottom: 0;">
                        ${isEdit ? 'Editar Almacenamiento' : ' Nuevo Almacenamiento'}
                    </h3>
                    <button id="btn-cerrar-x" class="btn-cerrar-x" title="Cerrar">&times;</button>
                </div>
                
                <div class="modal-form-container">
                    <label class="form-label modal-label">Nombre del almacén:</label>
                    <input type="text" id="modal-alm-nombre" class="filter-input modal-input" placeholder="Ej: Nevera Principal" value="${nombreVal}">
                    
                    <label class="form-label modal-label">Ubicación:</label>
                    <input type="text" id="modal-alm-loc" class="filter-input modal-input" placeholder="Ej: Cocina" value="${localizacionVal}">
                    
                    <label class="form-label modal-label">Número de cajones:</label>
                    <input type="number" id="modal-alm-cajones" class="filter-input modal-input" min="1" max="10" value="${cajonesVal}" ${isEdit ? 'disabled title="Para cambiar cajones, crea un almacén nuevo"' : ''}>
                    
                    <div id="cajones-capacidades-container"></div>
                </div>

                <div class="modal-botones ${isEdit ? 'justify-between' : 'justify-center'}">
                    ${isEdit ? `<button id="btn-eliminar-alm" class="btn-eliminar-modal"> Eliminar</button>` : ''}
                    
                    <div class="modal-botones-derecha">
                        <button id="btn-guardar-alm" class="btn-guardar-almacen">${isEdit ? 'Guardar Cambios' : 'Crear'}</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const inputNumCajones = overlay.querySelector('#modal-alm-cajones');
        const containerCapacidades = overlay.querySelector('#cajones-capacidades-container');

        const renderInputsCajones = () => {
            if (isEdit) return; 
            const num = parseInt(inputNumCajones.value) || 0;
            
            // guia tamaños
            let html = `
                <div class="capacidad-header">
                    <label class="form-label modal-label capacidad-label">Tamaño por cajón:</label>
                    <div class="info-icon-container">
                        i
                        <span class="tooltip-text">
                            <strong>Guía de Tamaños:</strong><br><br>
                            <strong>XS:</strong> Cajón pequeño (Hielos)<br>
                            <strong>S:</strong> Cajón estándar reducido<br>
                            <strong>M:</strong> Cajón estándar<br>
                            <strong>L:</strong> Cajón grande<br>
                            <strong>XL:</strong> Cajón extra grande
                        </span>
                    </div>
                </div>
                <div class="capacidad-lista">
            `;
            
            // opciones capacidad
            for (let i = 1; i <= num; i++) {
                html += `
                    <div class="capacidad-fila">
                        <span class="capacidad-texto">Cajón ${i}:</span>
                        <select class="filter-input modal-input input-capacidad-cajon capacidad-select" data-posicion="${i}">
                            <option value="XS">XS - Muy Pequeño</option>
                            <option value="S">S - Pequeño</option>
                            <option value="M" selected>M - Estándar</option>
                            <option value="L">L - Grande</option>
                            <option value="XL">XL - Extra Grande</option>
                        </select>
                    </div>
                `;
            }
            html += '</div>';
            containerCapacidades.innerHTML = html;
        };

        // si se añaden mas cajones
        if (!isEdit) {
            inputNumCajones.addEventListener('input', renderInputsCajones);
            renderInputsCajones();
        }
        
        // botones

        overlay.querySelector('#btn-cerrar-x').addEventListener('click', () => {
            overlay.remove();
            resolve(null);
        });

        //Cancelar
        overlay.querySelector('#btn-cancelar-alm').addEventListener('click', () => {
            overlay.remove();
            resolve(null);
        });

        // Guardar / Crear
        overlay.querySelector('#btn-guardar-alm').addEventListener('click', () => {
            const nombre = overlay.querySelector('#modal-alm-nombre').value.trim();
            const localizacion = overlay.querySelector('#modal-alm-loc').value.trim();
            const num_cajones = parseInt(overlay.querySelector('#modal-alm-cajones').value);

            let capacidades = [];
            if (!isEdit) {
                const valoresCapacidad = { 'XS': 250, 'S': 500, 'M': 1000, 'L': 2000, 'XL': 4000 };
                
                const inputsCapacidad = overlay.querySelectorAll('.input-capacidad-cajon');
                inputsCapacidad.forEach(input => {
                    const letraSeleccionada = input.value;
                    capacidades.push(valoresCapacidad[letraSeleccionada] || 1000); 
                });
            }

            if (!nombre || !localizacion || isNaN(num_cajones) || num_cajones <= 0) {
                alert("Por favor, rellena todos los campos correctamente.");
                return;
            }

            overlay.remove();
            resolve({
                action: isEdit ? 'EDIT' : 'CREATE',
                data: {
                    id_almacenamiento: isEdit ? almacenExistente.id_almacenamiento : null,
                    almacenamiento_nombre: nombre,
                    localizacion: localizacion,
                    num_cajones: num_cajones,
                    capacidades_cajones: capacidades 
                }
            });
        });

        // Eliminar
        if (isEdit) {
            overlay.querySelector('#btn-eliminar-alm').addEventListener('click', async () => {
                
                const seguro = await showConfirmModal(
                    `¿Estás seguro de eliminar el almacén <strong>${nombreVal}</strong> localizado en <strong>${localizacionVal}</strong>?<br><br>
                    <strong> Atención: Perderás todos los alimentos que estén dentro.</strong>`
                );

                if (seguro) {
                    overlay.remove();
                    resolve({
                        action: 'DELETE',
                        data: { id_almacenamiento: almacenExistente.id_almacenamiento }
                    });
                }
            });
        }
    });
}