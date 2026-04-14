import {Router} from 'express';

import {getTodosAlmacenamientosByIdUsuario, createAlmacenamiento, updateAlmacenamiento } from '../controllers/almacenamientos.controller.js';
import { verifyToken } from '../middlewares/jwt.middleware.js'

const router = Router();

router.get('/almacenamientos/usuario', verifyToken , getTodosAlmacenamientosByIdUsuario);
router.post('/almacenamientos', verifyToken, createAlmacenamiento);
router.put('/almacenamientos/:idUsuario', verifyToken, updateAlmacenamiento);

export default router;