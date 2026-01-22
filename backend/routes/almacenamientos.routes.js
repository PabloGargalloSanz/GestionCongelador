import {Router} from 'express';

import {getTodosAlmacenamientosByIdUsuario, createAlmacenamiento, updateAlmacenamiento } from '../controllers/almacenamientos.controller.js';
import { verifyToken } from '../middlewares/jwt.middleware.js'

const router = Router();

router.get('/almacenamientos/usuario', verifyToken , getTodosAlmacenamientosByIdUsuario);
router.post('/almacenamientos', createAlmacenamiento);
router.put('/almacenamientos/:idUsuario', updateAlmacenamiento);

export default router;