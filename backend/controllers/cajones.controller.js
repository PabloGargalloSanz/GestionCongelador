import {} from '../services/cajones.js';

//Obtener cajones por usuario y almacenamiento
export const getCajonesAlmacenamiento = (req, res) => {
    const idAlmacenamiento = req.body.idAlamcenamiento;
    const idCajon = req.boyd.idCajon;

    getAllCajonesAlmacenamientoService(idAlmacenamiento, idCajon)
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

    if(data.idAlamcenamiento){
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
