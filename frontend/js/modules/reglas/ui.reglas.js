import { showConfirmModal } from '../../core/ui.js';

export function renderTablaReglas(reglas, inventarioActual, onEditRegla, onDeleteRegla) {
    const tableBody = document.getElementById('tabla-reglas-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    //txt sin reglas
    if (reglas.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">Aún no has definido ningún alimento imprescindible.</td>
            </tr>`;
        return;
    }

    reglas.forEach((regla) => {
        //calculo stock
        const nombreRegla = regla.producto.toLowerCase();
        
        const stockActual = inventarioActual.reduce((total, item) => {
            // normalizar nombre de alimenot
            const nombreItem = (item.alimento || item.alimento_nombre || "").toLowerCase();
            
            if (nombreItem === nombreRegla) {
                return total + item.cantidad;
            }
            return total;
        }, 0);

        // colores estado
        let colorClase = 'status-green';
        let textoEstado = '<span class="text-success font-bold">Stock ideal</span>';

        if (stockActual < regla.cantidad_minima) {
            //por debajo del minimo
            colorClase = 'status-red';
            textoEstado = `<span class="text-primary font-bold">Faltan ${regla.cantidad_minima - stockActual}</span>`;
            
        } else if (stockActual === regla.cantidad_minima || stockActual === regla.cantidad_minima + 1) {
            // limite o uno por encima del minimo
            colorClase = 'status-orange';
            textoEstado = `<span class="text-warning font-bold">Al límite</span>`;
        }

        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>
                <div class="alimento-nombre-cell">
                    <span class="status-dot ${colorClase}"></span>
                    <span class="font-bold">${regla.producto}</span>
                </div>
            </td>
            <td>Mínimo: ${regla.cantidad_minima} ${regla.unidad_medida}</td>
            <td>Tienes: ${stockActual} ${regla.unidad_medida}</td>
            <td>${textoEstado}</td>
            <td>
                <button class="lapiz-btn btn-edit-regla" data-id="${regla.id_alerta}" title="Editar regla">
                    <img src="./img/lapiz.png" alt="Editar" class="logoLapiz">
                </button>
                <button class="lapiz-btn btn-delete-regla" data-id="${regla.id_alerta}" title="Eliminar regla">
                    <img src="./img/papelera.png" alt="Eliminar" class="logoLapiz">
                </button>
            </td>
        `;
        tableBody.appendChild(tr);

        // ------------------ eventos

        // editar
        tr.querySelector('.btn-edit-regla').addEventListener('click', () => {
            onEditRegla(regla);
        });

        //eliminar
        tr.querySelector('.btn-delete-regla').addEventListener('click', async () => {
            const confirmacion = await showConfirmModal(`¿Seguro que quieres eliminar "${regla.producto}" de tus imprescindibles?`);
            if (confirmacion) {
                onDeleteRegla(regla.id_alerta);
            }
        });
    });
}