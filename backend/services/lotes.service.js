// services/inventario.service.js
import pool from '../db/db.js';
import { getIdAlimento, newAlimentoService } from './alimentos.service.js';
import { getIdCajon } from './cajones.service.js';

//crear nuevo lote
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

// modificar lote
export const patchLoteService = async (userId, idLote, datos) => {
    const { cantidad, id_almacenamiento, posicion_cajon } = datos;
    const client = await pool.connect();

    try {
        const resLote = await client.query(
            'SELECT cantidad, alimento_tamano FROM lotes WHERE id_lote = $1',
            [idLote]
        );

        if (resLote.rows.length === 0) {
            throw new Error("LOTE_NO_ENCONTRADO");
        }

        const loteActual = resLote.rows[0];
        
        // calculo del tamaño
        const tamanoUnitario = loteActual.alimento_tamano / loteActual.cantidad;
        
        //espacio que ocupara
        const nuevoTamanoTotal = Math.round(tamanoUnitario * cantidad);

        // funcion db de actualizar lote
        const resultado = await client.query(
            `SELECT * FROM actualizar_lote_cajon($1, $2, $3, $4, $5, $6)`,
            [idLote, cantidad, id_almacenamiento, posicion_cajon, nuevoTamanoTotal, userId]
        );

        return resultado.rows[0];

    } catch (error) {
        throw error; 
    } finally {
        client.release(); 
    }
};

// Eliminar lote
export const deleteLoteService = async (idLote) => {
    const client = await pool.connect();

    try {
        const resultado = await client.query(
            'DELETE FROM lotes WHERE id_lote = $1 RETURNING *',
            [idLote]
        );

        if (resultado.rowCount === 0) {
            throw new Error("LOTE_NO_ENCONTRADO");
        }

        return resultado.rows[0];
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
};