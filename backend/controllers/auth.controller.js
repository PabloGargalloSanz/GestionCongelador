import verificarCredenciales from '../services/auth.service.js';

const login = async (req, res) => {
  try {
    const { email, pass } = req.body;

    if (!email || !pass) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
    }

    const resultado = await verificarCredenciales(email, pass);

    if (resultado.exito) {
      return res.status(200).json({
        success: true,
        message: 'Login correcto',
        data: resultado.usuario
      });
    } else {
      return res.status(401).json({ 
        success: false,
        message: resultado.mensaje 
      });
    }

  } catch (error) {
    console.error('[AuthController Error]', error);
    return res.status(500).json({ 
      message: 'Error en el servidor', 
      error: error.message 
    });
  }
};

export default  login ;
