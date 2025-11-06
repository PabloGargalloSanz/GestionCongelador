import { Router } from 'express';
import recetasRoutes from './recetas.routes.js';
import alimentosRoutes from './alimentos.routes.js';

const router = Router();

router.use(recetasRoutes);
router.use(alimentosRoutes);

export default router;