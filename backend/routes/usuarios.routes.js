import { Router } from 'express';

import { createUsuario } from '../controllers/usuarios.controller.js';

const router = Router();

router.post('/usuario',createUsuario);

export default router;