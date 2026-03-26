import {Router} from 'express';

import { createCajonAlmacenamiento, getCajonAlmacenamiento, getCajonesAlmacenamiento } from '../controllers/cajones.controller.js';
import {verifyToken} from '../middlewares/jwt.middleware.js'

const router = Router();


router.get('/cajones/:id', getCajonesAlmacenamiento);
router.get('/cajones', getCajonAlmacenamiento);
router.post('/cajones', createCajonAlmacenamiento);

export default router;