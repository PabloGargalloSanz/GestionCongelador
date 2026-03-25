import {Router} from 'express';

import { getTodosAlimentos, getAlimentosByTipo, createAlimento, updateAlimento, getAllAlimentosTipo, getTodosAlimentosByUsuario } from '../controllers/alimentos.controller.js';
import {verifyToken} from '../middlewares/jwt.middleware.js'

const router = Router();

router.get('/alimentos', getTodosAlimentos);
router.get('/alimentos/usuario', getTodosAlimentosByUsuario);
router.get('/alimentos/tipos_unicos_alimento', getAllAlimentosTipo);
router.get('/alimentos/tipo_alimento', getAlimentosByTipo);
router.post('/alimentos', createAlimento);
router.put('/alimentos', updateAlimento);

export default router;