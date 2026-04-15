import {Router} from 'express';

import {getTodosAlmacenamientosByIdUsuario, createAlmacenamiento, updateAlmacenamiento, deleteAlmacen } from '../controllers/almacenamientos.controller.js';
import { verifyToken } from '../middlewares/jwt.middleware.js'

const router = Router();

router.get('/almacenamientos/usuario', verifyToken , getTodosAlmacenamientosByIdUsuario);
router.post('/almacenamientos', verifyToken, createAlmacenamiento);
router.patch('/almacenamientos/:id', verifyToken, updateAlmacenamiento);
router.delete('/almacenamientos/:id', verifyToken, deleteAlmacen);

export default router;