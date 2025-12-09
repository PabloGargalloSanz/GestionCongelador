import { Router } from 'express';

import recetasRoutes from './recetas.routes.js';
import alimentosRoutes from './alimentos.routes.js';
import almacenamientosRoutes from './almacenamientos.routes.js';
import cajonesRoutes from './cajones.routes.js';
import alimentosCajonRoutes from './alimentosCajon.routes.js';
import usuariosRoutes from './usuarios.routes.js';
import authRoutes from './auth.routes.js';

const router = Router();

router.use(recetasRoutes);
router.use(alimentosRoutes);
router.use(almacenamientosRoutes);
router.use(cajonesRoutes);
router.use(alimentosCajonRoutes);
router.use(usuariosRoutes);
router.use(authRoutes);

export default router;