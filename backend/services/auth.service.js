import pool from '../db/db.js';

const verificarCredenciales = async (email, pass) => {
  const query = 'SELECT * FROM usuarios WHERE email = $1'; 
  
  try {
    const resultado = await pool.query(query, [email]);

    const usuarioEncontrado = resultado.rows ? resultado.rows[0] : resultado[0];

    if (!usuarioEncontrado) {
      return { exito: false, mensaje: 'Usuario o contraseña erroneo' };
    }

    if (usuarioEncontrado.pass === pass) {
      return { exito: true, usuario: usuarioEncontrado };
    } else {
      return { exito: false, mensaje: 'Usuario o contraseña erroneo' };
    }

  } catch (error) {
    console.error("Error de base de datos:", error);
  }
};

export default verificarCredenciales ;
