import pool from '../db/db.js';

//Obtener almacenamiento por usuario
export const getAllAlmacenamientoUsuario = async (id_usuario) => {
    const result = await pool.query(
        'SELECT * FROM almacenamientos WHERE id_usuario = $1',
        [id_usuario]
    );

    console.log(result.rows);
    return result.rows;
}

//Crear nuevo almacenamiento
export const newAlmacenamientoService = async (data) => {
    const { id_usuario, almacenamiento_nombre, localizacion} = data;

    const result = await pool.query(
        'INSERT INTO almacenamientos (id_usuario, almacenamiento_nombre, localizacion) VALUES ($1, $2, $3) RETURNING *',
        [id_usuario, almacenamiento_nombre, localizacion]
    );
    return result.rows[0];
}