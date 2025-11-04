import { Router } from 'express';
import recetasRoutes from './recetas.routes.js';

const router = Router();

router.use(recetasRoutes);

export default router;