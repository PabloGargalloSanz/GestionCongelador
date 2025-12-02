import {Router} from 'express';

import { createAlimentoCajon, getAllAlimentosCajon, getCantidadAlimento, modifyAlimentoCajon } from '../controllers/alimentoscajon.controller.js';

const router = Router();

router.get('/alimentosCajon', getAllAlimentosCajon);
router.get('/alimentosCajon', getCantidadAlimento);
router.post('/alimentosCajon', createAlimentoCajon);
router.patch('/alimentosCajon', modifyAlimentoCajon);

export default router;