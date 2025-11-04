import pool from '../db/db.js';

export const getAllRecetas = async () => {
    const result = await pool.query('SELECT * FROM recetas');
    console.log(result.rows);
    return result.rows;
}

export const getOneReceta = async ( id ) => {
    const result = await pool.query(
        'SELECT * FROM recetas WHERE id_receta = $1',
    [id]
    );
    
    console.log(result.rows);
    return result.rows;
}

export const newRecetaService = async (data) => {
    // descomponer un json en variables
    const { receta_nombre, descripcion } = data;

    const result = await pool.query(
        'INSERT INTO recetas (receta_nombre, descripcion) VALUES ($1, $2) RETURNING *',
        [ receta_nombre, descripcion]
        
    );
    return result.rows[0];
}

export const updateRecetaService = async ( id, data ) => {
    const { receta_nombre, descripcion } = data;
    const result = await pool.query(
        'UPDATE recetas Set receta_nombre = $1, descripcion = $2 WHERE id_receta = $3 RETURNING *',
        [receta_nombre, descripcion, id]
    )
    if(result.rows.length ===0 ) {
        throw new Error('Receta no encontrada');
    }
    return result.rows[0];
}