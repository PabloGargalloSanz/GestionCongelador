
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
                <div class="card-icon"></div>
                <span class="almacen-localizacion">${alm.localizacion}</span>
            </div>
            <h3 class="almacen-nombre">${alm.almacenamiento_nombre}</h3>
            <p class="almacen-ocupacion">Ocupación actual</p>
            <div class="progress-container">
                <div class="progress-bar" style="width: ${alm.ocupacion}% "></div>
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
                <td colspan="6" style="text-align:center;">No hay alimentos en el inventario</td>
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
            <td>${new Date(item.fecha_introduccion).toLocaleDateString()}</td>
            <td>${new Date(item.fecha_caducidad).toLocaleDateString()}</td>
        `;
        tableBody.appendChild(row);
    });
}


//Filtros inventario////////////////////
export function renderBarraFiltros(container, tipos) {
    container.innerHTML = `
        <div class="filter-row-container">
            <div class="filter-grid">
                <div class="filter-col">
                    <input type="text" id="filter-nombre" placeholder=" Buscar..." class="filter-input">
                </div>
                <div class="filter-col">
                    <select id="filter-tipo" class="filter-input">
                        <option value="">Todos</option>
                        ${tipos.map(t => `<option value="${t.alimento_tipo}">${t.alimento_tipo}</option>`).join('')}
                    </select>
                </div>
                <div class="filter-col"></div>
                <div class="filter-col"></div>
                <div class="filter-col">
                    <select id="filter-fecha-introducido" class="filter-input">
                        <option value="" class="filter-input"> </option>
                        <option value="Ascendente" >Ascendente</option>
                        <option value="Descendente" >Descendente</option>
                    </select>
                    </div>
                    <div class="filter-col">
                    <select id="filter-fecha-caducidad" class="filter-input">
                        <option value="" class="filter-input"> </option>
                        <option value="Ascendente" >Ascendente</option>
                        <option value="Descendente" >Descendente</option>
                    </select>
                </div>
            </div>
        </div>
    `;
}