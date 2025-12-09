import { Router } from 'express';

const router = Router();

// Definimos la ruta POST /login
router.post('/login', (req, res) => {
    const { email, pass } = req.body;
    
    // AQUÍ IRÍA TU LÓGICA DE BASE DE DATOS REAL
    // Para probar ahora mismo, usamos esto:
    console.log(`Intento de login: ${email}`);

    if (email === 'admin@test.com' && pass === '1234') {
        res.status(200).json({ 
            mensaje: 'Login correcto', 
            token: 'TOKEN_DE_PRUEBA_12345',
            id_usuario: 1 
        });
    } else {
        res.status(401).json({ error: 'Credenciales incorrectas' });
    }
});

export default router;