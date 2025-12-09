import pool from '../db/db.js';

//Crear nuevo usuario
export const newUsuarioService = async (data) => {
    const { email, pass } = data;

    const result = await pool.query (
        'INSERT INTO usuarios ( email, pass) VALUES ($1, $2) RETURNING *',
        [ email, pass]

    );

    return result.rows[0];
}
