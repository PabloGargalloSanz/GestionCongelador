import {newUsuarioService } from "../services/usuarios.service.js";

//Crear usuario

////////// Falta aplicar hash a la contraseña //////////
export const createUsuario = (req, res) => {
    const data = req.body;

    if(data.alimento_nombre) {
        newUsuarioService(data)
            .then((newUsuario) => {
                res.status(201).send(newUsuario);
            })
            .catch((error) => {
                res.status(400).send({ error: error.message });
            });    

    } else {
        res.status(400).send({ error: 'Faltan datos obligatorios' });
    }
}
