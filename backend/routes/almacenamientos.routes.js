import {Router} from 'express';

import {getTodosAlmacenamientosByIdUsuario, createAlmacenamiento } from '../controllers/almacenamientos.controller.js';

const router = Router();

router.get('/almacenamientos/:idUsuario', getTodosAlmacenamientosByIdUsuario);
router.post('/almacenamientos', createAlmacenamiento);
//router.put('/almacenamientos', updateAlmacenamiento);

export default router;