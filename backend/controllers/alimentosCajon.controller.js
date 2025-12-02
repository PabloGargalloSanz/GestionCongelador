import {} from '../services/alimentosCajon.controller.js';

//Obtener alimentos por cajon
export const getAllAlimentosCajon = (req,res) => {
    const id_cajon = req.body.id_cajon;

    getAllAlimentosCajonService(id_cajon)
        .then((alimentos) => {
            res.status(200).send(alimentos);
        })
        .catch((error) => {
            res.status(400).send({error: error.mesage});
        });
}

//Obtner cantidad alimento
export const getCantidadAlimento = (req,res) => {
    const id_alimento = req.body.id_alimento;

    getCantidadAlimento(id_alimento)
        .then((cantidad) => {
            res.status(200).send(cantidad);
        })
        .catch((error) => {
            res.status(400).send({error: error.mesage});
        });
}

// Añadir alimento
export const createAlimentoCajon = (req,res) => {
    const data = req.body;
    const id_cajon = req.body.id_cajon;

    if(data.id_alimento){
        createAlimentoCajonService(data, id_cajon)
            .then((alimento) => {
                res.status(201).send(alimento);
            })
            .catch((error) => {
                res.status(400).send({error: error.mesage});
            });
    } else {
        res.status(400).send({error: 'Faltan datos obligatorios'});
    }
}

//Modificar cantidad
export const modifyAlimentoCajon = (req,res) => {
    const id_cajon = req.body.id_cajon;
    const id_alimento = req.body.id_alimento;
    const cantidad = req.body.cantidad;

    if(id_alimento){
        modifyAlimentoCajonService(id_alimento, cantidad, id_cajon)
            .then((alimento) =>{
                res.status(200).send(alimento);
            })
            .catch((error) =>{
                res.status(400).send({error: error.mesage});
            });
    } else{
        res.status(400).send({error: 'Faltan datos obligatorios'});
    }
}