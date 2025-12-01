import {getAllCajonesAlmacenamientoService, getAllCajonAlmacenamientoService, newCajonAlmacenamiento} from '../services/cajones.service.js';

//Obtener cajones por usuario y almacenamiento
export const getCajonesAlmacenamiento = (req, res) => {
    const idAlmacenamiento = req.params.idAlamcenamiento;
    
    getAllCajonesAlmacenamientoService(idAlmacenamiento)
        .then((cajones) =>{
            res.status(200).send(cajones);
        })
        .catch((error) => {
            res.status(400).send({error: error.message});
        });
}

//Obtener cajon por usuario y almacenamiento
export const getCajonAlmacenamiento = (req, res) => {
    const id_almacenamiento = req.body.id_almacenamiento;
    const id_cajon = req.body.id_cajon;

    getAllCajonAlmacenamientoService(id_almacenamiento, id_cajon)
        .then((cajones) =>{
            res.status(200).send(cajones);
        })
        .catch((error) => {
            res.status(400).send({error: error.message});
        });
}

//Crear cajon almacenamiento
export const createCajonAlmacenamiento = (req,res) => {
    const data = req.body;

    if(data.id_almacenamiento){
        newCajonAlmacenamiento(data)
            .then((newCajon) => {
                res.status(201).send(newCajon);
            })
            .catch((error) => {
                res.status(400).send({error: error.message});
            })
        }else {
            res.status(400).send({error: 'Faltan datos obligatorios'});
    }
}
