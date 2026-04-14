import { crearLoteAlimentoService, patchLoteService, deleteLoteService } from '../services/lotes.service.js';

//añadir lote/alimento
export const anadirAlimento = async (req, res, next) => {
    const userId = req.userId;
    const { 
        alimento_nombre, alimento_tipo, cantidad, 
        id_almacenamiento, posicion_cajon, fecha_caducidad, alimento_tamano 
    } = req.body;

    try {

        // validación e insercion errores
        if (!alimento_nombre || !alimento_tipo || !cantidad || !id_almacenamiento || !posicion_cajon || !fecha_caducidad || !alimento_tamano) {
            const err = new Error("Datos incompletos para crear lote");
            err.status = 400;
            err.action = 'REGISTER_INVENTARY_FAIL_VALIDATION';    
            return next(err); 
        }
        const loteData = req.body;

        const nuevoLote = await crearLoteAlimentoService(userId, loteData);

        req.action = 'REGISTER_INVENTARY_SUCCESS';
        res.status(201).json({ 
            mensaje: "Alimento guardado con éxito", 
            lote: nuevoLote 
        });

    } catch (error) {
        console.error("Error en anadirAlimento (Controlador):", error);
        
        // error de cajon no encontrado
        if (error.message === "CAJON_NO_ENCONTRADO") {
            error.status = 404;
            error.action = 'CAJON_NO_ENCONTRADO';
        }

        // Capturamos el error del trigger de PostgreSQL
        if (error.message.includes('El cajón no tiene espacio suficiente')) {
            error.action = 'CAJON_SIN_ESPACIO';
            error.status = 400;
        }else{
            error.status = 500;
            error.action = 'CREATE_LOTE_SERVER_ERROR';
        }
        
        next(error);
    }
};

//modificar lote/alimento
export const modificacionAlimento = async(req, res, next) =>{
    const userId = req.userId;
    const id = req.params.id;
    const {cantidad, id_almacenamiento, posicion_cajon} = req.body;

    try{
        if(!cantidad || !id_almacenamiento || !posicion_cajon){
            const err = new Error("Datos  incompletos para actualizar lote");
            err.status = 400;
            err.action = 'PATCH_INVENTARY_FAIL';    
            return next(err); 
        }

        const loteEditado = await patchLoteService(userId, id, { 
            cantidad, id_almacenamiento, posicion_cajon 
        });

        req.action = 'PATCH_INVENTARY_SUCCESS'; 
        res.status(200).json({
            mensaje: "Inventario actualizado correctamente",
            lote: loteEditado
        });

    }catch (error) {
        if (error.message.includes('Espacio insuficiente')) {
            error.status = 400;
            error.action = 'PATCH_INVENTARY_NO_SPACE';

        } else if (error.message === "LOTE_NO_ENCONTRADO") {
            error.status = 404;
            error.action = 'PATCH_INVENTARY_NOT_FOUND';

        } else {
            error.status = 500;
            error.action = 'PATCH_INVENTARY_SERVER_ERROR';
        }

        next(error);
    }
}

//eliminar lote/alimento
export const eliminarAlimento = async (req, res, next) => {
    const id = req.params.id;

    try {
        await deleteLoteService(id);

        req.action = 'DELETE_INVENTARY_SUCCESS'; 
        res.status(200).json({ mensaje: "Lote eliminado correctamente" });

    } catch (error) {
        if (error.message === "LOTE_NO_ENCONTRADO") {
            error.status = 404;
            error.action = 'DELETE_INVENTARY_NOT_FOUND';
        } else {
            error.status = 500;
            error.action = 'DELETE_INVENTARY_SERVER_ERROR';
        }
        next(error);
    }
};