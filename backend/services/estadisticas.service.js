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

// consumo por tipo
export const getConsumoPorTipoService = async (userId, dias) => {
    try {
        const query = `
            SELECT 
                tipo, 
                SUM(cantidad) as total_consumido,
                unidad_medida
            FROM historial_consumo
            WHERE id_usuario = $1 
              AND fecha_consumo >= NOW() - INTERVAL '1 day' * $2
            GROUP BY tipo, unidad_medida
            ORDER BY total_consumido DESC;
        `;
        
        const result = await pool.query(query, [userId, dias]);
        return result.rows;
    } catch (error) {
        throw error;
    }
};