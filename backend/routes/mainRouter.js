import { Router } from 'express';
import recetasRoutes from './recetas.routes.js';
import alimentosRoutes from './alimentos.routes.js';
import almacenamientosRoutes from './almacenamientos.routes.js';

const router = Router();

router.use(recetasRoutes);
router.use(alimentosRoutes);
router.use(almacenamientosRoutes);

export default router;