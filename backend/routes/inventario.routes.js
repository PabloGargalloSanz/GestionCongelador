import {Router} from 'express';

import { anadirAlimento } from '../controllers/inventario.controller.js';
import {verifyToken} from '../middlewares/jwt.middleware.js'

const router = Router();

router.post('/inventario', verifyToken, anadirAlimento);

export default router;