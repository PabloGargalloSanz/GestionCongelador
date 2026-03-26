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


//Obtener id de cajon
export const getIdCajon = async (id_almacenamiento, posicion, userId) => {
    const result = await pool.query(
        `SELECT c.id_cajon 
         FROM cajones c
         JOIN almacenamientos a ON c.id_almacenamiento = a.id_almacenamiento
         WHERE c.id_almacenamiento = $1 AND c.posicion = $2 AND a.id_usuario = $3`,
        [id_almacenamiento, posicion, userId]
    );
    return result.rows.length > 0 ? result.rows[0].id_cajon : null;
}
