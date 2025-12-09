import {Router} from 'express';

import { createAlimentoCajon, getAllAlimentosCajon, getCantidadAlimento, deleteAlimentoCajon } from '../controllers/alimentoscajon.controller.js';

const router = Router();

router.get('/alimentosCajon', getAllAlimentosCajon);
router.get('/alimentosCajon', getCantidadAlimento);
router.post('/alimentosCajon', createAlimentoCajon);
router.delete('/alimentosCajon', deleteAlimentoCajon);

export default router;