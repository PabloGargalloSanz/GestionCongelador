import pool from '../db/db.js';

//Obtener almacenamiento por usuario
export const getAllAlmacenamientoUsuario = async (id_usuario) => {
    const query = `
        SELECT 
        alm.id_almacenamiento,
        alm.almacenamiento_nombre,
        alm.localizacion,
        (SELECT MAX(posicion) FROM cajones WHERE id_almacenamiento = alm.id_almacenamiento) AS num_cajones,
        COALESCE(
            ROUND(
                (
                    -- suma tamaño de alimentos en almacenamiento
                    SELECT SUM(l.alimento_tamano)::NUMERIC 
                    FROM cajones c
                    JOIN cajon_lotes cl ON c.id_cajon = cl.id_cajon
                    JOIN lotes l ON cl.id_lote = l.id_lote
                    WHERE c.id_almacenamiento = alm.id_almacenamiento
                ) / 
                -- calculo %
                NULLIF(
                    (SELECT SUM(tamano) FROM cajones WHERE id_almacenamiento = alm.id_almacenamiento), 
                    0
                ) * 100, 
                0 -- redondeo
            ), 
            0
        ) AS ocupacion
    FROM almacenamientos alm
    WHERE alm.id_usuario = $1;
    `
    try {
        const result = await pool.query (
            query, [id_usuario]      
        );
        return result.rows;
        
    } catch (error) {
        console.error("Error en la consulta de inventario:", error);
    }
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
        throw new Error('Almacenamiento no encontrado');
    }
    return result.rows[0];
}