import {Router} from 'express';

import { anadirAlimento, modificacionAlimento } from '../controllers/lotes.controller.js';
import {verifyToken} from '../middlewares/jwt.middleware.js'

const router = Router();

router.post('/lotes', verifyToken, anadirAlimento);
router.patch('/lotes/:id', verifyToken, modificacionAlimento);

export default router;