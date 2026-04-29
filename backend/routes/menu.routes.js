import {Router} from 'express';
import { generarMenuSemanas, obtenerMenuSemanas, cambiarEstadoMenu } from '../controllers/menu.controller.js';
import {verifyToken} from '../middlewares/jwt.middleware.js'

const router = Router();

router.post('/menu/generar', verifyToken, generarMenuSemanas);
router.get('/menu', verifyToken, obtenerMenuSemanas);
router.patch('/:idMenu/estado', verifyToken, cambiarEstadoMenu);

export default router;