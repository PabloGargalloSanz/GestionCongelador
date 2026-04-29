export function renderMenu(datosIA) {
    const grid = document.getElementById('menu-grid-container');
    const alertaDomingo = document.getElementById('alerta-domingo-previo');
    const containerLista = document.getElementById('lista-compra-container');
    const ulLista = document.getElementById('lista-compra-ul');
    
    grid.innerHTML = ""; 
    
    //descongelar domingo
    if (datosIA.descongelar_domingo_previo) {
        alertaDomingo.innerHTML = ` Domingo</strong> Saca del congelador: <strong>${datosIA.descongelar_domingo_previo}</strong> para el lunes.`;
        alertaDomingo.classList.remove('hidden');

    } else {
        alertaDomingo.classList.add('hidden');
    }

    const dias = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];

    dias.forEach(dia => {
        const info = datosIA.menu[dia];
        if (!info) return;

        let alertaHTML = '';
        if (info.descongelar_hoy && info.descongelar_hoy !== "") {
            alertaHTML = `
                <div class="menu-alert-box">
                    Descongelar hoy:

                    <strong>${info.descongelar_hoy}</strong>
                </div>
            `;
        }

        const card = document.createElement('div');
        card.className = 'menu-day-card';
        
        card.innerHTML = `
            <div class="menu-day-header">
                ${dia}
            </div>
            <div class="menu-day-body">
                <div>
                    <span class="menu-meal-label">Comida</span>
                    <p class="menu-meal-text">${info.comida}</p>
                </div>
                <div>
                    <span class="menu-meal-label">Cena</span>
                    <p class="menu-meal-text">${info.cena_ligera}</p>
                </div>
            </div>
            ${alertaHTML}
        `;
        
        grid.appendChild(card);
    });

    // randerizar lista de la compra
    if (datosIA.lista_compra_sugerida && datosIA.lista_compra_sugerida.length > 0) {
        ulLista.innerHTML = datosIA.lista_compra_sugerida.map(item => `<li>${item}</li>`).join('');
        containerLista.classList.remove('hidden');
    } else {
        containerLista.classList.add('hidden');
    }
}