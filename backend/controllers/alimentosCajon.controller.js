import {getAllAlimentosCajonService, getCantidadAlimentoService, newAlimentoCajonService, deleteAlimentoCajonService  } from '../services/alimentosCajon.service.js';

//Obtener alimentos por cajon
export const getAllAlimentosCajon = (req,res) => {
    const id_cajon = req.body.id_cajon;

    getAllAlimentosCajonService(id_cajon)
        .then((alimentos) => {
            res.status(200).send(alimentos);
        })
        .catch((error) => {
            res.status(400).send({error: error.message});
        });
}

//Obtner cantidad alimento
export const getCantidadAlimento = (req,res) => {
    const id_alimento = req.body.id_alimento;

    getCantidadAlimentoService(id_alimento)
        .then((cantidad) => {
            res.status(200).send(cantidad);
        })
        .catch((error) => {
            res.status(400).send({error: error.message});
        });
}

// Añadir alimento
export const createAlimentoCajon = (req,res) => {
    const data = req.body;

    if(data.id_alimento){
        newAlimentoCajonService(data)
            .then((alimento) => {
                res.status(201).send(alimento);
            })
            .catch((error) => {
                res.status(400).send({error: error.message});
            });
    } else {
        res.status(400).send({error: 'Faltan datos obligatorios'});
    }
}

//Eliminar lote
export const deleteAlimentoCajon = (req,res) => {
    const id_lote = req.body.id_lote;

    if(id_lote){
        deleteAlimentoCajonService(id_lote)
            .then((alimento) =>{
                res.status(200).send(alimento);
            })
            .catch((error) =>{
                res.status(400).send({error: error.message});
            });
    } else{
        res.status(400).send({error: 'Faltan datos obligatorios'});
    }
}