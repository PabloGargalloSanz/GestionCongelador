import pool from '../db/db.js'

//Obtener alimentos cajon
export const getAllAlimentosCajonService = async (id_cajon) => {
    const result = await pool.query(
        //cambiar a id alimentos en lotes por cajon
        'SELECT * FROM cajon_alimentos WHERE id_cajon = $1',
        [id_cajon]
    );
    return result.rows;
}

//obtener cantidad alimento cajon
export const getCantidadAlimentoService = async (id_alimento) => {
    const result = await pool.query(
        //Crear una view par ser mas facil y rapido
        'SELECT * FROM cajon_alimentos WHERE id_alimento = $1',
        [id_alimento]
    );
    return result.rows;
}

//Añadir alimento
export const newAlimentoCajonService = async (data) => {
    const { id_cajon, id_alimento, cantidad, unidad_medida} = data;

    

}


export const modifyAlimentoCajonService = async (id_alimento) => {
}

