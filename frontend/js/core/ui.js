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
