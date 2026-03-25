import { crearLoteAlimentoService } from '../services/inventario.service.js';

export const anadirAlimento = async (req, res) => {
    try {
        const userId = req.userId; // Asumiendo que tu middleware de auth lo pone aquí
        const loteData = req.body;

        // Delegamos TODA la lógica al servicio
        const nuevoLote = await crearLoteAlimentoService(userId, loteData);

        // Si todo va bien, respondemos con éxito
        res.status(201).json({ 
            mensaje: "Alimento guardado con éxito", 
            lote: nuevoLote 
        });

    } catch (error) {
        console.error("Error en anadirAlimento (Controlador):", error);
        
        // El controlador traduce los errores del servicio a respuestas HTTP

        if (error.message === "CAJON_NO_ENCONTRADO") {
            return res.status(404).json({ 
                error: "El cajón especificado no existe o no te pertenece." 
            });
        }

        // Capturamos el error del trigger de PostgreSQL
        if (error.message.includes('El cajón no tiene espacio suficiente')) {
            return res.status(400).json({ 
                error: "No hay espacio suficiente en el cajón seleccionado." 
            });
        }
        
        // Error genérico por defecto
        res.status(500).json({ 
            error: "Error interno del servidor al guardar el lote." 
        });
    }
};