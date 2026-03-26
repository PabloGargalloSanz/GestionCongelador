import {Router} from 'express';

import { createAlimentoCajon, getAllAlimentosCajon, getCantidadAlimento, deleteAlimentoCajon } from '../controllers/alimentosCajon.controller.js';
import {verifyToken} from '../middlewares/jwt.middleware.js'

const router = Router();


router.get('/alimentosCajon', getAllAlimentosCajon);
router.get('/alimentosCajon', getCantidadAlimento);
router.post('/alimentosCajon', createAlimentoCajon);
router.delete('/alimentosCajon', deleteAlimentoCajon);

export default router;