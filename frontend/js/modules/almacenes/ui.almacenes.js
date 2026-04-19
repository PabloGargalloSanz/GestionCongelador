import { showToast, showConfirmModal } from '../../core/ui.js';

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