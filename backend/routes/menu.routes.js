import {Router} from 'express';
import { generarMenuSemanas, obtenerMenuSemanas } from '../controllers/menu.controller.js';
import {verifyToken} from '../middlewares/jwt.middleware.js'

const router = Router();

router.post('/menu/generar', verifyToken, generarMenuSemanas);
router.get('/menu', verifyToken, obtenerMenuSemanas);

export default router;