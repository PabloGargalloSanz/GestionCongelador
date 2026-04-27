import { Router } from 'express';
import { verifyToken } from '../middlewares/jwt.middleware.js';
import { getEstadisticasConsumo, getComparativaAnual } from '../controllers/estadisticas.controller.js';

const router = Router();

//obtener el consumo. 
// /api/estadisticas (30 dias) /api/estadisticas?dias=7 (7 dias)
router.get('/estadisticas', verifyToken, getEstadisticasConsumo);
router.get('/estadisticas/comparativa', verifyToken, getComparativaAnual);

export default router;