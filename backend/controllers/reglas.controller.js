import { getReglasUsuarioService, newReglaService, updateReglaService, deleteReglaService } from "../services/reglas.service.js";

//obtener reglas usuario
export const getReglasByUsuario = (req, res) => {
    const userId = req.userId;

    getReglasUsuarioService(userId)
        .then((reglas) => {
            res.status(200).send(reglas);
        })
        .catch((error) => {
            res.status(500).json({ error: "Error al obtener las alertas de stock" });
        });
};

//nueva regla
export const createRegla = (req, res) => {
    const userId = req.userId;
    const data = req.body;

    if (data.producto && data.cantidad_minima) {
        newReglaService(userId, data)
            .then((newRegla) => {
                res.status(201).send(newRegla);
            })
            .catch((error) => {
                res.status(400).send({ error: error.message });
            });
    } else {
        res.status(400).send({ error: 'Faltan datos obligatorios' });
    }
};

// actualiza regla
export const updateRegla = (req, res) => {
    const id_alerta = req.params.id; 
    const userId = req.userId;
    const data = req.body;

    updateReglaService(id_alerta, userId, data)
        .then((updatedRegla) => {
            res.status(200).send(updatedRegla);
        })
        .catch((error) => {
            res.status(400).send({ error: error.message });
        });
};

// eliminar regla
export const deleteRegla = (req, res) => {
    const id_alerta = req.params.id;
    const userId = req.userId;

    deleteReglaService(id_alerta, userId)
        .then((deletedRegla) => {
            res.status(200).send({ message: "Alerta eliminada correctamente", deletedRegla });
        })
        .catch((error) => {
            res.status(400).send({ error: error.message });
        });
};