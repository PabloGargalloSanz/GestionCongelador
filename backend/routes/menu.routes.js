import {Router} from 'express';

import { generarMenuSemanas } from '../controllers/menu.controller.js';
import {verifyToken} from '../middlewares/jwt.middleware.js'

const router = Router();

router.post('/menu/generar', verifyToken, generarMenuSemanas);

export default router;