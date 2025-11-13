import {getAllAlmacenamientoUsuario, newAlmacenamientoService} from '../services/almacenamientos.service.js';

//Obtener almacenamiento por usuario
export const getTodosAlmacenamientosByIdUsuario = (req, res) => {
    const idUsuario = req.params.idUsuario;

    getAllAlmacenamientoUsuario(idUsuario)
        .then((almacenamientos) => {
            res.status(200).send(almacenamientos);
        })
        .catch((error) => {
            res.status(400).send({error: error.message});
        });
}

//Crear almacenamiento
export const createAlmacenamiento = (req, res) => {
    const data = req.body;

    if(data.almacenamiento_nombre) {
        newAlmacenamientoService(data)
            .then((newAlmacenamiento) => {
                res.status(200).send(newAlmacenamiento);
            })
            .catch((error) => {
                res.status(400).send({error: error.message});
            });
    } else {
        res.status(400).send({ error: 'Faltan datos obligatorios'});
    }
}