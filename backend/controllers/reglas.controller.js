import { getReglasUsuarioService, newReglaService, updateReglaService, deleteReglaService } from "../services/reglas.service.js";

//obtener reglas usuario
export const getReglasByUsuario = async (req, res, next) => {
    const userId = req.userId;

    try {
        const reglas = await getReglasUsuarioService(userId);
        
        req.action = 'GET_REGLAS_SUCCESS';
        res.status(200).json(reglas);

    } catch (error) {
        console.error("Error al obtener las alertas de stock:", error);
        error.status = 500;
        error.action = 'GET_REGLAS_SERVER_ERROR';
        next(error);
    }
};

// nueva regla
export const createRegla = async (req, res, next) => {
    const userId = req.userId;
    const data = req.body;

    try {
        if (!data.producto || !data.cantidad_minima) {
            const err = new Error("Faltan datos obligatorios");
            err.status = 400;
            err.action = 'CREATE_REGLA_FAIL_VALIDATION';
            return next(err);
        }

        const newRegla = await newReglaService(userId, data);

        req.action = 'CREATE_REGLA_SUCCESS';
        res.status(201).json({
            mensaje: "Regla creada correctamente",
            regla: newRegla
        });

    } catch (error) {
        console.error("Error al crear regla:", error);
        error.status = error.status || 400; 
        error.action = 'CREATE_REGLA_SERVER_ERROR';
        next(error);
    }
};

// actualizar regla
export const updateRegla = async (req, res, next) => {
    const id_alerta = req.params.id; 
    const userId = req.userId;
    const data = req.body;

    try {
        const updatedRegla = await updateReglaService(id_alerta, userId, data);

        req.action = 'UPDATE_REGLA_SUCCESS';
        res.status(200).json({
            mensaje: "Regla actualizada correctamente",
            regla: updatedRegla
        });

    } catch (error) {
        console.error("Error al actualizar regla:", error);
        error.status = error.status || 400; 
        error.action = 'UPDATE_REGLA_SERVER_ERROR';
        next(error);
    }
};

// eliminar regla
export const deleteRegla = async (req, res, next) => {
    const id_alerta = req.params.id;
    const userId = req.userId;

    try {
        const deletedRegla = await deleteReglaService(id_alerta, userId);

        req.action = 'DELETE_REGLA_SUCCESS';
        res.status(200).json({ 
            mensaje: "Alerta eliminada correctamente", 
            deletedRegla 
        });

    } catch (error) {
        console.error("Error al eliminar regla:", error);
        error.status = error.status || 400;
        error.action = 'DELETE_REGLA_SERVER_ERROR';
        next(error);
    }
};