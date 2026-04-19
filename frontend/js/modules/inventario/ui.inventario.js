import { showToast, showConfirmModal } from '../../core/ui.js';

//llenar tabla inventario
export function renderTablaInventario(alimentos, listaAlmacenes, onEditLote, onEliminarLote) {    
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
            const index = btn.getAttribute('data-index');
            const item = alimentos[index]; 
            const tr = btn.closest('tr'); 
            
            activarEdicionFila(tr, item, listaAlmacenes, onEditLote);
        });
    });

    const botonesEliminar = document.querySelectorAll('.eliminar-lote-btn');
    botonesEliminar.forEach((btn) => {
        btn.addEventListener('click', async () => {
            const index = btn.getAttribute('data-index');
            const item = alimentos[index]; 
            
            const confirmacion = await showConfirmModal(
                `¿Estás seguro de que deseas eliminar <strong>"${item.alimento}"</strong> con la cantidad <strong>${item.cantidad} ${item.unidad_medida}</strong> del inventario?`
            );

            if (confirmacion) {
                btn.disabled = true;
                btn.style.opacity = '0.5';

                const exito = await onEliminarLote(item.id_lote);

                if (!exito) {
                    btn.disabled = false;
                    btn.style.opacity = '1';
                }
            }
        });
    });
}

//  Añadimos onEditLote como parámetro
export function activarEdicionFila(tr, item, almacenes, onEditLote) {
    const htmlOriginal = tr.innerHTML;
    const fIntroduccion = item.fecha_introduccion ? new Date(item.fecha_introduccion).toLocaleDateString() : 'N/A';
    const fCaducidad = item.fecha_caducidad ? new Date(item.fecha_caducidad).toLocaleDateString() : 'N/A';

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

    actualizarCajones(item.id_almacenamiento, item.cajon_posicion);
    selectAlmacen.addEventListener('change', (e) => actualizarCajones(e.target.value, 1));

    tr.querySelector(`#btn-cancel-${item.id_lote}`).addEventListener('click', () => {
        tr.innerHTML = htmlOriginal;
    });

    const btnSave = tr.querySelector(`#btn-save-${item.id_lote}`);
    
    btnSave.addEventListener('click', async () => {
        const nuevaCantidad = parseInt(tr.querySelector(`#edit-cantidad-${item.id_lote}`).value);
        const nuevoAlmacen = parseInt(selectAlmacen.value);
        const nuevoCajon = parseInt(selectCajon.value);

        if (isNaN(nuevaCantidad) || nuevaCantidad <= 0) {
            showToast("La cantidad debe ser mayor a 0", "warning");
            return;
        }
        
        if (nuevaCantidad > item.cantidad) {
            showToast(`Solo puedes restar cantidad (máximo ${item.cantidad}). Para añadir más, crea un registro nuevo.`, "warning");
            return;
        }

        const textoOriginal = btnSave.innerText;
        btnSave.disabled = true;

        const exito = await onEditLote(item.id_lote, {
            cantidad: nuevaCantidad,
            id_almacenamiento: nuevoAlmacen,
            posicion_cajon: nuevoCajon
        });

        if (!exito) {
            btnSave.disabled = false;
            btnSave.innerText = textoOriginal;
        }
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

        //cerrar en la X
        overlay.querySelector('#btn-cerrar-x-alim').addEventListener('click', () => {
            overlay.remove();
            resolve(null);
        });

        // cargar cajones según almacén seleccionado
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

        //Guardar
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

            // validacion
            if (!nombre || !tipo || isNaN(cantidad) || cantidad <= 0 || !idAlmacenamiento || !cajonPosicion || !fechaCaducidad) {
                showToast("Por favor, rellena todos los campos obligatorios", "warning");
                return;
            }

            // canversion de tamaño
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

            btnGuardar.disabled = true;
            btnGuardar.innerText = "Guardando...";

            overlay.remove();
            resolve(nuevoLote); 
        });
    });
}

