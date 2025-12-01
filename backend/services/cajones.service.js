import pool from '../db/db.js';

//Obtener cajones segun id almacenamiento
export const getAllCajonesAlmacenamientoService = async (id_almacenamiento) => {
    const result = await pool.query(
        'SELECT * FROM cajones WHERE id_almacenamiento = $1',
        [id_almacenamiento]
    );

    return result.rows;
}

