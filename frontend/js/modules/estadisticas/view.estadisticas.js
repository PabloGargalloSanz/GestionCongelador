import { loadTemplate, showToast } from '../../core/ui.js';
import { getEstadisticasAPI, getComparativaAnualAPI } from './api.estadisticas.js';

let doughnutChart = null;
let barChart = null;

export async function renderEstadisticas(appContainer) {
    loadTemplate('estadisticas-view', appContainer);

    const filtroDias = document.getElementById('filtro-dias');
    const canvasDoughnut = document.getElementById('graficoConsumo');
    const canvasBar = document.getElementById('graficoComparativo');

    // grafico circular
    const renderResumen = async (dias) => {
        const datos = await getEstadisticasAPI(dias);
        
        if (doughnutChart) doughnutChart.destroy();
        if (datos.length === 0) return;

        doughnutChart = new Chart(canvasDoughnut, {
            type: 'doughnut',
            data: {
                labels: datos.map(item => `${item.tipo} (${item.unidad_medida})`),
                datasets: [{
                    data: datos.map(item => parseInt(item.total_consumido)),
                    backgroundColor: ['#DB5757', '#024fa2', '#49B253', '#f97316', '#8b5cf6'],
                    borderWidth: 2
                }]
            },
            options: { 
                responsive: true,
                plugins: { legend: { position: 'bottom' } }
            }
        });
    };

    // grafico de barras
    const renderComparativa = async () => {
        const datos = await getComparativaAnualAPI();
        
        if (barChart) barChart.destroy();
        if (datos.length === 0) return;

        //agrupamos por tipo y año
        const tipos = [...new Set(datos.map(item => item.tipo))];
        const anioActual = new Date().getFullYear();
        const anioPasado = anioActual - 1;

        const datasetPasado = tipos.map(t => {
            const registro = datos.find(d => d.tipo === t && parseInt(d.anio) === anioPasado);
            return registro ? parseInt(registro.total_consumido) : 0;
        });

        const datasetActual = tipos.map(t => {
            const registro = datos.find(d => d.tipo === t && parseInt(d.anio) === anioActual);
            return registro ? parseInt(registro.total_consumido) : 0;
        });

        barChart = new Chart(canvasBar, {
            type: 'bar',
            data: {
                labels: tipos,
                datasets: [
                    {
                        label: `Mes actual (${anioPasado})`,
                        data: datasetPasado,
                        backgroundColor: '#94a3b8',
                        borderRadius: 5
                    },
                    {
                        label: `Mes actual (${anioActual})`,
                        data: datasetActual,
                        backgroundColor: '#024fa2',
                        borderRadius: 5
                    }
                ]
            },
            options: {
                responsive: true,
                scales: { y: { beginAtZero: true } },
                plugins: { legend: { position: 'top' } }
            }
        });
    };

    filtroDias.addEventListener('change', (e) => renderResumen(e.target.value));

    //lanzadas en paralelo para aumentar velocidad
    await Promise.all([
        renderResumen(filtroDias.value),
        renderComparativa()
    ]);
}