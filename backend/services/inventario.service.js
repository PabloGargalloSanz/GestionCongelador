// services/inventario.service.js
import pool from '../db/db.js';
import { getIdAlimento, newAlimentoService } from './alimentos.service.js';
import { getIdCajon } from './cajones.service.js';

export const crearLoteAlimentoService = async (userId, loteData) => {
    const { 
        alimento_nombre, alimento_tipo, cantidad, unidad_medida, 
        alimento_tamano, id_almacenamiento, posicion_cajon, fecha_caducidad 
    } = loteData;

    // Pedimos un cliente dedicado para hacer la transacción de forma segura
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // PASO 1: Obtener el ID del alimento (usamos LET para poder reasignarlo)
        let idAlimento = await getIdAlimento(alimento_nombre);

        // Si es null (no existe en la DB), lo creamos
        if (!idAlimento) {
            const insertAlimento = await newAlimentoService({ 
                alimento_nombre, 
                alimento_tipo 
            });
            
            idAlimento = insertAlimento.id_alimento;
        } 

        // PASO 2: Obtener el id_cajon usando nuestra función limpia
        const idCajon = await getIdCajon(id_almacenamiento, posicion_cajon, userId);

        // Si es null, el cajón no existe o no es de ese usuario
        if (!idCajon) {
            throw new Error("CAJON_NO_ENCONTRADO"); 
        }

        // PASO 3: Ejecutar la función PL/pgSQL
        const insertLote = await client.query(
            `SELECT * FROM insertar_lote_cajon($1, $2, $3, $4, $5, $6)`,
            [idCajon, idAlimento, cantidad, unidad_medida, alimento_tamano, fecha_caducidad]
        );

        await client.query('COMMIT');
        
        // Devolvemos los datos recién creados
        return insertLote.rows[0]; 

    } catch (error) {
        await client.query('ROLLBACK');
        throw error; // Relanzamos el error para que lo atrape el controlador

    } finally {
        client.release(); // ¡Muy importante! Devolvemos la conexión al pool
    }
};