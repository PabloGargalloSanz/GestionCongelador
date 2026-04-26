import { getConsumoPorTipoService } from '../services/estadisticas.service.js';

export const getEstadisticasConsumo = async (req, res, next) => {
    const userId = req.userId;
    // por url 7. por defecto 30 dias
    const dias = req.query.dias ? parseInt(req.query.dias) : 30; 

    try {
        const estadisticas = await getConsumoPorTipoService(userId, dias);
        
        req.action = 'GET_ESTADISTICAS_SUCCESS';
        res.status(200).json(estadisticas);

    } catch (error) {
        console.error("Error en getEstadisticasConsumo:", error);
        error.status = 500;
        error.action = 'GET_ESTADISTICAS_SERVER_ERROR';
        next(error);
    }
};