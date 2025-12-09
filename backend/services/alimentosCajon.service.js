import pool from '../db/db.js'

//Obtener alimentos  y cantidad del cajon
export const getAllAlimentosCajonService = async (id_cajon) => {
    const result = await pool.query(
        
        `SELECT l.id_alimento, SUM(l.cantidad) AS cantidad_total 
        FROM cajon_lotes cl 
        JOIN lotes l ON cl.id_lote = l.id_lote 
        WHERE cl.id_cajon = $1 
        GROUP BY l.id_alimento` ,
        [id_cajon]
    );
    return result.rows;
}

//Obtener todos los detalles de lote
export const getAllAlimentosDetallesService = async (id_cajon, id_alimento) =>{
    const result = await pool.query(
        `SELECT cl.id_lote, l.cantidad, l.unidad_medida, l.fecha_caducidad, cl.fecha_introducido
        FROM cajon_lotes cl
        JOIN lotes l ON cl.id_lote = l.id_lote
        WHERE cl.id_cajon = $1  AND l.id_alimento = $2 
        ORDER BY l.fecha_caducidad ASC` ,
        [id_cajon, id_alimento]
    );
    return result.rows;
}

//Añadir alimento a lotes y el lote en cajon_lotes
export const newAlimentoCajonService = async (data) => {
    const {id_cajon, id_alimento, cantidad, unidad_medida, alimento_tamano, fecha_caducidad} = data;

    const result = await pool.query (
        'SELECT * FROM insertar_lote_cajon($1, $2, $3, $4, $5, $6)',
        [id_cajon, id_alimento, cantidad, unidad_medida, alimento_tamano, fecha_caducidad]
    );
    return result.rows[0];
}


export const modifyAlimentoCajonService = async (id_alimento) => {
}

