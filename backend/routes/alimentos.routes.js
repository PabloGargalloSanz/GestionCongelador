import {Router} from 'express';

import { getTodosAlimentos, getAlimentosByTipo, createAlimento, updateAlimento } from '../controllers/alimentos.controller.js';

const router = Router();

router.get('/alimentos', getTodosAlimentos);
router.get('/alimentos/:alimento_tipo', getAlimentosByTipo);
router.post('/alimentos', createAlimento);
router.put('/alimentos', updateAlimento);

export default router;