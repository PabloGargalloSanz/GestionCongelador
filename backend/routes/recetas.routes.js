import { Router } from 'express';

import { getTodasRecetas, getRecetaById, createReceta, updateReceta } from '../controllers/recetas.controller.js';

const router = Router();

router.get('/recetas', getTodasRecetas);
router.get('/recetas/:id', getRecetaById);
router.post('/recetas',createReceta);
router.put('/recetas/:id', updateReceta);

//: es para parametros

export default router;