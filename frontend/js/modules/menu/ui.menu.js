export function renderMenu(datosIA) {
    const grid = document.getElementById('menu-grid-container');
    const alertaDia = document.getElementById('alerta-dia-previo');
    const containerLista = document.getElementById('lista-compra-container');
    const ulLista = document.getElementById('lista-compra-ul');
    
    grid.innerHTML = ""; 
    
    const dias = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
    const diasJS = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];

    const hoyIndex = new Date().getDay();
    const diaActualStr = diasJS[hoyIndex];
    const diaSiguienteStr = diasJS[(hoyIndex + 1) % dias.length];

    //descongelar dia
    let ingrediente = null;

    if (diaActualStr === "domingo") {
        ingrediente = datosIA.descongelar_domingo_previo;
    } else {
        ingrediente = datosIA.menu[diaActualStr]?.descongelar_hoy;
    }

    if (ingrediente && ingrediente !== "Nada" && ingrediente !== "") {
        alertaDia.innerHTML = `<strong>Hoy ${diaActualStr}:</strong> Saca del congelador <strong>${ingrediente}</strong> para mañana.`;
        alertaDia.classList.remove('hidden');
    } else {
        alertaDia.innerHTML = `<strong>Hoy ${diaActualStr}:</strong> No necesitas descongelar nada para mañana.`;
        alertaDia.classList.remove('hidden');
    }


    dias.forEach(dia => {
        const info = datosIA.menu[dia];
        if (!info) return;


        const card = document.createElement('div');
        card.className = 'menu-day-card';
        
        card.innerHTML = `
            <div class="menu-day-header">
                ${dia}
            </div>
            <div class="menu-day-body">
                <div class="menu-meal-block">
                    <span class="menu-meal-label">Comida</span>
                    <p class="menu-meal-text">${info.comida}</p>
                </div>
                <div class="menu-meal-block">
                    <span class="menu-meal-label">Cena</span>
                    <p class="menu-meal-text">${info.cena_ligera}</p>
                </div>
            </div>
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