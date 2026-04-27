import pool from '../db/db.js';

//obtener perfil "medico"
export const getPerfilMedicoService = async (userId) => {
    try {
        const result = await pool.query(
            'SELECT perfil_medico FROM usuarios WHERE id_usuario = $1', 
            [userId]);

        return result.rows.length > 0 ? result.rows[0].perfil_medico : 'estandar';

    } catch (error) {

        throw error;
    }
};

//actualizar perfil medico
export const actualizarPerfilMedicoService = async (userId, nuevoPerfil) => {
    const result = await pool.query(
        'UPDATE usuarios SET perfil_medico = $1 WHERE id_usuario = $2 RETURNING perfil_medico',
        [nuevoPerfil, userId]
    );

    return result.rows[0];
};