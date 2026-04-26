import pool from '../db/db.js';

// Registrar un alimento consumido
export const registrarConsumoService = async (userId, nombre, tipo, cantidad, unidad) => {
    try {
        const query = `
            INSERT INTO historial_consumo (id_usuario, alimento_nombre, tipo, cantidad, unidad_medida)
            VALUES ($1, $2, $3, $4, $5) RETURNING *;
        `;
        const result = await pool.query(query, [userId, nombre, tipo, cantidad, unidad]);
        return result.rows[0];
    } catch (error) {
        console.error("Error al registrar el consumo en el historial:", error);
    }
};