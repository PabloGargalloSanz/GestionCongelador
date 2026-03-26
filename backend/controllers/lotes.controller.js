import { crearLoteAlimentoService } from '../services/lotes.service.js';

export const anadirAlimento = async (req, res) => {
    try {
        const userId = req.userId;
        const { 
            alimento_nombre, alimento_tipo, cantidad, 
            id_almacenamiento, posicion_cajon, fecha_caducidad, alimento_tamano 
        } = req.body;

        // validación e insercion errores
        if (!alimento_nombre || !alimento_tipo || !cantidad || !id_almacenamiento || !posicion_cajon || !fecha_caducidad || !alimento_tamano) {
            req.action = 'REGISTER_INVENTARY_FAIL_VALIDATION'; 
            return res.status(400).json({ 
                error: "Todos los campos son obligatorios para registrar un alimento." 
            });
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
            error.action = 'CAJON_NO_ENCONTRADO';
            return res.status(404).json({ 
                error: "El cajón especificado no existe o no te pertenece." 
            });
        }

        // Capturamos el error del trigger de PostgreSQL
        if (error.message.includes('El cajón no tiene espacio suficiente')) {
            error.action = 'CAJON_SIN_ESPACIO';
            return res.status(400).json({ 
                error: "No hay espacio suficiente en el cajón seleccionado." 
            });
        }
        
        error.action = 'SERVER_ERROR';
        res.status(500).json({ 
            error: "Error interno del servidor al guardar el lote." 
        });
    }
};