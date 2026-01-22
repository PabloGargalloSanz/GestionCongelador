import pool from '../db/db.js';

//Obtener todos los alimentos
export const getAllAlimentos = async () => {
    const result = await pool.query('SELECT * FROM alimentos');
    console.log(result.rows);
    return result.rows;

}

//Obtener todos los alimentos del usuario
export const getAllAlimentosUsuario = async (userId) => {

    const query = `
        SELECT 
            a.alimento_nombre AS alimento,
            a.alimento_tipo AS tipo,
            l.cantidad || ' ' || l.unidad_medida AS cantidad,
            alm.almacenamiento_nombre || ' (' || alm.localizacion || ') - Cajón ' || c.posicion AS ubicacion,
            cl.fecha_introducido AS fecha_introduccion,
            l.fecha_caducidad
        FROM usuarios u
        JOIN almacenamientos alm ON u.id_usuario = alm.id_usuario
        JOIN cajones c ON alm.id_almacenamiento = c.id_almacenamiento
        JOIN cajon_lotes cl ON c.id_cajon = cl.id_cajon
        JOIN lotes l ON cl.id_lote = l.id_lote
        JOIN alimentos a ON l.id_alimento = a.id_alimento
        WHERE u.id_usuario = $1;
    `
    try {
        const result = await pool.query (
            query, [userId]      
        );
        return result.rows;

    } catch (error) {
        console.error("Error en la consulta de inventario:", error);
    }
}

//Obtener todos los tipos de alimentos
export const getAllAlimentosTipoService = async () => {
    const result = await pool.query('SELECT DISTINCT alimento_tipo FROM alimentos');
    console.log(result.rows);
    return result.rows;

}

//Obtener un tipo de alimento
export const getAlimentoTipo = async (tipo) => {
    const result = await pool.query(
        'SELECT * FROM alimentos WHERE alimento_tipo = $1',
        [tipo]
    );
    
    console.log(result.rows);
    return result.rows;
}

//Crear nuevo producto
export const newAlimentoService = async (data) => {
    const { alimento_nombre, alimento_tipo} = data;

    const result = await pool.query (
        'INSERT INTO alimentos ( alimento_nombre, alimento_tipo) VALUES ($1, $2) RETURNING *',
        [ alimento_nombre, alimento_tipo]

    );

    return result.rows[0];
}

//Actualizar un alimento
export const updateAlimentoService = async (id_alimento, data) => {
    const { alimento_nombre, alimento_tipo} = data;

    const result = await pool.query(
        'UPDATE alimentos SET alimento_nombre = $1, alimento_tipo = $2 WHERE id_alimento =$3 RETURNING *',
        [alimento_nombre, alimento_tipo, id_alimento]
    )
    if(result.rows.length ===0 ) {
        throw new Error('Alimento no encontrado');
    }

    return result.rows[0];
}