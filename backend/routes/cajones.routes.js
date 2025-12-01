import {Router} from 'express';

import { createCajonAlmacenamiento, getCajonesAlmacenamiento } from '../controllers/cajones.controller.js';

const router = Router();

router.get('/cajones', getCajonesAlmacenamiento);
router.post('/cajones', createCajonAlmacenamiento);

export default router;