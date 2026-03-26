// services/inventario.service.js
import pool from '../db/db.js';
import { getIdAlimento, newAlimentoService } from './alimentos.service.js';
import { getIdCajon } from './cajones.service.js';

export const crearLoteAlimentoService = async (userId, loteData) => {
    const { 
        alimento_nombre, alimento_tipo, cantidad, unidad_medida, 
        alimento_tamano, id_almacenamiento, posicion_cajon, fecha_caducidad 
    } = loteData;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        //obtencion id alimento
        let idAlimento = await getIdAlimento(alimento_nombre);

        // si no exist se crea
        if (!idAlimento) {
            const insertAlimento = await newAlimentoService({ 
                alimento_nombre, 
                alimento_tipo 
            });
            
            idAlimento = insertAlimento.id_alimento;
        } 

        //obtencion id cajon
        const idCajon = await getIdCajon(id_almacenamiento, posicion_cajon, userId);

        if (!idCajon) {
            throw new Error("CAJON_NO_ENCONTRADO"); 
        }

        // ejecucion triger db
        const insertLote = await client.query(
            `SELECT * FROM insertar_lote_cajon($1, $2, $3, $4, $5, $6)`,
            [idCajon, idAlimento, cantidad, unidad_medida, alimento_tamano, fecha_caducidad]
        );

        await client.query('COMMIT');
        
        return insertLote.rows[0]; 

    } catch (error) {
        await client.query('ROLLBACK');
        throw error; 

    } finally {
        client.release(); // se devuelve la conexión al pool
    }
};