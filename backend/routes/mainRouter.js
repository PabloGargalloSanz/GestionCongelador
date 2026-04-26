import { Router } from 'express';

import recetasRoutes from './recetas.routes.js';
import alimentosRoutes from './alimentos.routes.js';
import almacenamientosRoutes from './almacenamientos.routes.js';
import cajonesRoutes from './cajones.routes.js';
import alimentosCajonRoutes from './alimentosCajon.routes.js';
import authRoutes from './auth.routes.js';
import lotes from './lotes.routes.js'
import reglas from './reglas.routes.js'
import estadisticas from './estadisticas.routes.js'

const router = Router();

router.use(recetasRoutes);
router.use(alimentosRoutes);
router.use(almacenamientosRoutes);
router.use(cajonesRoutes);
router.use(alimentosCajonRoutes);
router.use(authRoutes);
router.use(lotes);
router.use(reglas);
router.use(estadisticas);

export default router;