import {Router} from 'express';

import { createCajonAlmacenamiento, getCajonAlmacenamiento, getCajonesAlmacenamiento } from '../controllers/cajones.controller.js';

const router = Router();

router.get('/cajones', getCajonesAlmacenamiento);
router.get('/cajones', getCajonAlmacenamiento);
router.post('/cajones', createCajonAlmacenamiento);

export default router;