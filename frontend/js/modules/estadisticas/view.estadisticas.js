import { loadTemplate, showToast } from '../../core/ui.js';
import { getEstadisticasAPI } from './api.estadisticas.js';

let chartInstancia = null; 

export async function renderEstadisticas(appContainer) {
    loadTemplate('estadisticas-view', appContainer);

    const filtroDias = document.getElementById('filtro-dias');
    const ctx = document.getElementById('graficoConsumo');

    if (!ctx) return;

    //crear grafico
    const actualizarGrafico = async (dias) => {
        const datos = await getEstadisticasAPI(dias);

        // eliminar grafico anterior
        if (chartInstancia) {
            chartInstancia.destroy();
        }

        if (datos.length === 0) {
            showToast("No hay registros de consumo en este periodo", "info");
            return;
        }

        //datos de db
        const etiquetas = datos.map(item => `${item.tipo} (${item.unidad_medida})`);
        const cantidades = datos.map(item => parseInt(item.total_consumido));

        //grafico
        chartInstancia = new Chart(ctx, {
            type: 'doughnut', 
            data: {
                labels: etiquetas,
                datasets: [{
                    data: cantidades,

                    backgroundColor: [
                        '#DB5757',
                        '#024fa2',
                        '#49B253',
                        '#f97316',
                        '#8b5cf6',
                        '#eab308'  
                    ],
                    borderWidth: 2,
                    hoverOffset: 10 
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { padding: 20, font: { family: 'Inter', size: 14 } }
                    }
                }
            }
        });
    };

    // filtro dias
    filtroDias.addEventListener('change', (e) => {
        actualizarGrafico(e.target.value);
    });

    // defecto 30 dias
    await actualizarGrafico(30);
}