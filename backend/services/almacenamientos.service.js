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

//Actualizar almacenamiento (nombre)
export const updateAlmacenamientoService = async (id_almacenamiento, data) => {
    const { almacenamiento_nombre} = data;
    const result = await pool.query(
        'UPDATE almacenamientos SET almacenamiento_nombre = $1 WHERE id_almacenamiento = $2 RETURNING *',
        [almacenamiento_nombre, id_almacenamiento]
    )
    if(result.rows.length ===0 ) {
        throw new Error('Receta no encontrada');
    }
    return result.rows[0];
}