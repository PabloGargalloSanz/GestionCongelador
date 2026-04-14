import {getAllAlmacenamientoUsuario, newAlmacenamientoService, updateAlmacenamientoService} from '../services/almacenamientos.service.js';

//Obtener almacenamiento por usuario
export const getTodosAlmacenamientosByIdUsuario = (req, res) => {
    const idUsuario = req.userId;

    getAllAlmacenamientoUsuario(idUsuario)
        .then((almacenamientos) => {
            res.status(200).send(almacenamientos);
        })
        .catch((error) => {
            res.status(400).send({error: error.message});
        });
}

//Crear almacenamiento
export const createAlmacenamiento = async (req, res, next) => {
    const userId = req.userId;
    const { almacenamiento_nombre, localizacion, num_cajones } = req.body;

    try {
        if (!almacenamiento_nombre || !localizacion || !num_cajones) {
            const err = new Error("Faltan datos para crear el almacén");
            err.status = 400;
            err.action = 'CREATE_ALMACEN_FAIL_VALIDATION';
            return next(err);
        }

        const nuevoAlmacen = await newAlmacenamientoService(userId, req.body);

        req.action = 'CREATE_ALMACEN_SUCCESS';
        res.status(201).json({ 
            mensaje: "Almacenamiento creado correctamente", 
            almacen: nuevoAlmacen 
        });

    } catch (error) {
        console.error("Error al crear almacén:", error);
        error.status = 500;
        error.action = 'CREATE_ALMACEN_SERVER_ERROR';
        next(error);
    }
};

//Actualizar almacenamiento
export const updateAlmacenamiento = (req, res) => {
    const data = req.body;
    const id_almacenamiento = req.body.id_almacenamiento;

    if(data.almacenamiento_nombre) {
        updateAlmacenamientoService(id_almacenamiento, data)
        .then((updatedAlmacenamiento) => {
            res.status(200).send(updatedAlmacenamiento);
        })
        .catch((error) => {
            res.status(400).send({error: error.message});
        });
    }else {
        res.status(400).send({error: 'Faltan datos obligatorios'});
    }
}