import { getAllRecetas, getOneReceta, newRecetaService, updateRecetaService } from '../services/recetas.service.js';

//Obtener todas las recetas
export const getTodasRecetas = (req, res) => {
    getAllRecetas()
        .then((recetas) => {
            res.send(recetas);
        });
    
}

//Obtener receta por id
export const getRecetaById = (req, res) => {
    const id = req.params.id; 
    
    getOneReceta(id) 
        .then((receta) => {
            res.status(200).send(receta);
        })
        .catch((error) => {
            
            res.status(404).send({ error: error.message });
        });
}

//Crear receta
export const createReceta = (req, res) => {
    const data = req.body;

    if(data.receta_nombre) {
        newRecetaService(data)
            .then((newReceta) => {
                res.status(201).send(newReceta);
            })
            .catch((error) => {
                res.status(400).send({ error: error.message });
            });    
    } else {
        res.status(400).send({ error: 'Faltan datos obligatorios' });
    }
}

//Actualizar receta
export const updateReceta = ( req, res) => {
    const id = req.params.id;
    const data = req.body;

    updateRecetaService(id, data)
        .then((updatedReceta) => {
            res.status(200).send(updatedReceta);
        })
        .catch((error) => {
            res.status(400).send({ error: error.message});
        });
}