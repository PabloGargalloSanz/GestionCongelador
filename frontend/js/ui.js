
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
                <button class="btn-detail">Gestionar →</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

//llenar tabla inventario

export function renderTablaInventario(alimentos) {    
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

    alimentos.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.alimento}</td>
            <td>${item.tipo}</td>
            <td>${item.cantidad}</td>
            <td>${item.ubicacion}</td>
            <td>${item.cajon_posicion || 'N/A'}</td>
            <td>${new Date(item.fecha_introduccion).toLocaleDateString()}</td>
            <td>${new Date(item.fecha_caducidad).toLocaleDateString()}</td>
            <td><button class="lapiz-btn"><img src="./img/lapiz.png" alt="modificarAlimento" class="logoLapiz"></button></td>
            <td><button class="lapiz-btn"><img src="./img/papelera.png" alt="eliminarAlimento" class="logoLapiz"></button></td>
        `;
        tableBody.appendChild(row);
    });
}


//Filtros inventario////////////////////
export function renderBarraFiltros(container, tipos, almacenes) {
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
                <option value="" class="filter-input">Todos</option>
                ${almacenes.map(a => `<option value="${a.localizacion}">${a.localizacion}</option>`).join('')}
            </select>
        </td>
        <td>
            <select id="filter-cajon" class="filter-input" disabled>
                <option value="" class="filter-input">Todos</option>
                ${almacenes.map(a => `<option value="${a.localizacion}">${a.localizacion}</option>`).join('')}
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


//Añadir alimento////////////////////
export function renderBarraAñadirAlimento(container, tipos = [], almacenes = []) {
    const filaAñadir = document.createElement('tr');
    const hoy = new Date().toISOString().split('T')[0]; 
    
    filaAñadir.innerHTML = `
        <td>
            <input type="text" id="alimento-nombre" placeholder=" Nombre" class="filter-input">
        </td>
        <td>
            <select id="alimento-tipo" class="filter-input">
                <option value="">Tipo...</option>
                ${tipos.map(t => `<option value="${t.alimento_tipo}">${t.alimento_tipo}</option>`).join('')}
            </select>
        </td>
        
        <td>
            <div class="cantidad-alimento"">
                <input type="number" id="alimento-cantidad" placeholder="Cant." class="filter-input" >
                <select id="alimento-unidad" class="filter-input" >
                    <option value="ud">Ud</option>  
                    <option value="g">g</option>
                    <option value="kg">Kg</option>
                    <option value="l">L</option>
                </select>
                <select id="alimento-tamano" class="filter-input">
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                </select>
            </div>
        </td>
        
        <td>
            <select id="alimento-almacenes" class="filter-input">
                <option value="">Ubicación...</option>
                ${almacenes.map(a => `<option value="${a.localizacion}">${a.localizacion}</option>`).join('')}
            </select>
        </td>
        <td>
            <select id="alimento-cajon" class="filter-input" disabled>
                <option value="">Cajón...</option>
            </select>
        </td>
        <td>
            <input type="date" id="add-fecha-introducido" class="filter-input" value="${hoy}" readonly style="pointer-events: none; background-color: #f0f0f0;">
        </td>
        <td>
            <input type="date" id="add-fecha-caducidad" class="filter-input">
        </td>
        <td><button id="guardar-alimento-btn" class="lapiz-btn">Guardar</button></td>
        <td><button id="eliminar-filtros-btn" class="lapiz-btn"><img src="./img/papelera.png" alt="eliminarFiltros" class="logoLapiz"></td>
    `;

    container.innerHTML = "";
    container.appendChild(filaAñadir);

    // --- LÓGICA DE CAJONES (Sin Cambios) ---
    const selectAlmacen = document.getElementById('alimento-almacenes');
    const selectCajon = document.getElementById('alimento-cajon');

    selectAlmacen.addEventListener('change', (e) => {
        // OJO AQUÍ: Tu value en el HTML es "localizacion" (texto), 
        // pero aquí estabas usando parseInt(e.target.value) que daría NaN.
        // Lo he corregido para que busque por localización:
        const locSeleccionada = e.target.value; 
        const almacen = almacenes.find(a => a.localizacion === locSeleccionada);
        
        if (almacen && almacen.total_cajones) {
            selectCajon.disabled = false;
            let opciones = '<option value="">Cajón...</option>';
            for (let i = 1; i <= almacen.total_cajones; i++) {
                opciones += `<option value="${i}">${i}</option>`;
            }
            selectCajon.innerHTML = opciones;
        } else {
            selectCajon.disabled = true;
            selectCajon.innerHTML = '<option value="">Cajón...</option>';
        }
    });

    // Añadimos el listener para el botón Cancelar que acabamos de meter
    document.getElementById('cancelar-añadir-btn').addEventListener('click', () => {
        container.innerHTML = ""; // Simplemente vacía el contenedor
    });
}