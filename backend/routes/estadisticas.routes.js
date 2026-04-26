import { Router } from 'express';
import { verifyToken } from '../middlewares/jwt.middleware.js';
import { getEstadisticasConsumo } from '../controllers/estadisticas.controller.js';

const router = Router();

//obtener el consumo. 
// /api/estadisticas (30 dias) /api/estadisticas?dias=7 (7 dias)
router.get('/estadisticas', verifyToken, getEstadisticasConsumo);

export default router;