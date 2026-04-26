import { Router } from 'express';
import { verifyToken } from '../middlewares/jwt.middleware.js';
import {getReglasByUsuario, createRegla, updateRegla, deleteRegla } from '../controllers/reglas.controller.js';

const router = Router();

router.get('/reglas', verifyToken, getReglasByUsuario);
router.post('/reglas', verifyToken, createRegla);
router.put('/reglas/:id', verifyToken, updateRegla);
router.delete('/reglas/:id', verifyToken, deleteRegla);

export default router;