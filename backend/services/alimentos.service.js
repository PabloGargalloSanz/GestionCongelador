import pool from '../db/db.js';

//Obtener todos los alimentos
export const getAllAlimentos = async () => {
    const result = await pool.query('SELECT * FROM alimentos');
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
export const updateAlimentoService = async (data) => {
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