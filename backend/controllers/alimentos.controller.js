import {getAllAlimentos, getAlimentoTipo, newAlimentoService, updateAlimentoService } from "../services/alimentos.service.js";


//Obtener todos los alimentos
export const getTodosAlimentos = (req, res) => {
    getAllAlimentos()
        .then((alimentos) => {
            res.send(alimentos);
        });
}

//Obtner alimentos por tipo

export const getAlimentosByTipo = (req, res) => {
    const tipo = req.params.alimento_tipo;
    getAlimentoTipo(tipo)
        .then((alimentos) => {
            res.status(200).send(alimentos);
        })
        .catch((error) => {
            res.status(400).send({ error: error.message});
        });
}



//Crear alimento
export const createAlimento = (req, res) => {
    const data = req.body;

    if(data.alimento_nombre) {
        newAlimentoService(data)
            .then((newAlimento) => {
                res.status(201).send(newAlimento);
            })
            .catch((error) => {
                res.status(400).send({ error: error.message });
            });    

    } else {
        res.status(400).send({ error: 'Faltan datos obligatorios' });
    }
}

//Actualizar alimento
export const updateAlimento = ( req, res) => {
    const id = req.body.id_alimento;
    const data = req.body;

    updateAlimentoService(id, data)
        .then((updatedAlimento) => {
            res.status(200).send(updatedAlimento);
        })
        .catch((error) => {
            res.status(400).send({ error: error.message});
        });
}