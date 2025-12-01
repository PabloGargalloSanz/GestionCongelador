import pool from '../db/db.js';

//Obtener cajones segun id almacenamiento
export const getAllCajonesAlmacenamientoService = async (id_almacenamiento) => {
    const result = await pool.query(
        'SELECT * FROM cajones WHERE id_almacenamiento = $1',
        [id_almacenamiento]
    );

    return result.rows;
}

//Obtener cajon segun id 
export const getAllCajonAlmacenamientoService = async (id_almacenamiento, id_cajon) => {
    const result = await pool.query(
        'SELECT * FROM cajones WHERE id_almacenamiento = $1 AND id_cajon = $2',
        [id_almacenamiento, id_cajon]
    );

    return result.rows;
}

//Crear cajon por id almacenamiento
export const newCajonAlmacenamiento = async (data) => {
    const {id_almacenamiento, posicion, tamano} = data;

    const result = await pool.query(
        'INSERT INTO cajones (id_almacenamiento, posicion, tamano) VALUES ($1, $2, $3) RETURNING *',
        [id_almacenamiento, posicion, tamano]
    );
    return result.rows[0];
}

