import pool from '../db/db.js';

const newLog = async (data) => {
    const {fecha_log, hora_log, metodo, ip, direccion} = data;

    const result = await pool.query(
        'INSERT INTO logs (fecha_log, hora_log, metodo, ip, direccion) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [fecha_log, hora_log, metodo, ip, direccion]
    );
    return result.rows[0];
}

export default newLog;