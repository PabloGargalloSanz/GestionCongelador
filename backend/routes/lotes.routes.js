import {Router} from 'express';

import { anadirAlimento } from '../controllers/lotes.controller.js';
import {verifyToken} from '../middlewares/jwt.middleware.js'

const router = Router();

router.post('/lotes', verifyToken, anadirAlimento);

export default router;