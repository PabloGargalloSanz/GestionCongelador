import { apiFetch } from "../../core/api.js";

// obtener datos agrupados por tipo para grafico
export async function getEstadisticasAPI(dias = 30) {
    try {
        const response = await apiFetch(`/estadisticas?dias=${dias}`, {
            method: 'GET',
            headers: {
                'X-accion': 'STATS_CONSULTING'
            }
        });
        
        return response.json();

    } catch (error) {
        console.error("Error al obtener estadísticas: ", error);
        return [];
    }
}

// obtener comparativa anual
export async function getComparativaAnualAPI() {
    try {
        const response = await apiFetch('/estadisticas/comparativa', {
            method: 'GET',
            headers: { 'X-accion': 'STATS_COMPARISON_CONSULTING' }
        });
        return response.json();
    } catch (error) {
        console.error("Error al obtener comparativa: ", error);
        return [];
    }
}