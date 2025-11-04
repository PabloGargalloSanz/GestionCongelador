import { Router } from 'express';

import { getReceta, createReceta, updateReceta } from '../controllers/recetas.controller.js';

const router = Router();

router.get('/recetas', getReceta);
router.post('/recetas',createReceta);
router.put('/recetas/:id', updateReceta);

//: es para parametros

export default router;