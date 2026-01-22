// --- Datos de prueba ---
export const almacenamientos = [
    { id: 1, nombre: 'Congelador Cocina', localizacion: 'Cocina', ocupacion: 95 },
    { id: 2, nombre: 'Arcón Garaje', localizacion: 'Garaje', ocupacion: 22 }
];

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

// Componentes dinamicos 

//Llenar almacenes
export function renderAlmacenes() {
    const grid = document.getElementById('freezer-grid');
    if (!grid) return;

    almacenamientos.forEach(alm => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="almacen-contenedor">
                <div class="card-icon"></div>
                <span class="almacen-localizacion">${alm.localizacion}</span>
            </div>
            <h3 class="almacen-nombre">${alm.nombre}</h3>
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