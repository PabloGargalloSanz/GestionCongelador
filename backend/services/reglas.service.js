import pool from '../db/db.js';

//obtener reglas de usuario
export const getReglasUsuarioService = async (userId) => {
    const result = await pool.query(
        'SELECT * FROM alertas_stock WHERE id_usuario = $1 ORDER BY id_alerta ASC',
        [userId]
    );
    return result.rows;
};

// crear nueva regla
export const newReglaService = async (userId, data) => {
    const { producto, cantidad_minima, unidad } = data;

    const result = await pool.query(
        'INSERT INTO alertas_stock (id_usuario, producto, cantidad_minima, unidad_medida) VALUES ($1, $2, $3, $4) RETURNING *',
        [userId, producto, cantidad_minima, unidad]
    );

    return result.rows[0];
};

// actualizar regla
export const updateReglaService = async (id_alerta, userId, data) => {
    const { producto, cantidad_minima, unidad } = data;

    const result = await pool.query(
        'UPDATE alertas_stock SET producto = $1, cantidad_minima = $2, unidad_medida = $3 WHERE id_alerta = $4 AND id_usuario = $5 RETURNING *',
        [producto, cantidad_minima, unidad, id_alerta, userId]
    );

    if (result.rows.length === 0) {
        throw new Error('Alerta no encontrada o no autorizada');
    }

    return result.rows[0];
};

//eliminar regla
export const deleteReglaService = async (id_alerta, userId) => {
    const result = await pool.query(
        'DELETE FROM alertas_stock WHERE id_alerta = $1 AND id_usuario = $2 RETURNING *',
        [id_alerta, userId]
    );

    if (result.rows.length === 0) {
        throw new Error('Alerta no encontrada o no autorizada');
    }

    return result.rows[0];
};