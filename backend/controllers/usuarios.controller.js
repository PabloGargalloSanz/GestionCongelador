import { actualizarPerfilMedicoService } from '../services/usuarios.service.js';

export const cambiarPerfil = async (req, res, next) => {
    const userId = req.userId;
    const { perfil_medico } = req.body;

    try {
        await actualizarPerfilMedicoService(userId, perfil_medico);
        req.action = 'UPDATE_HEALTH_PROFILE_SUCCESS';
        res.status(200).json({ mensaje: "Perfil médico actualizado con éxito" });
        
    } catch (error) {
        error.status = 500;
        error.action = 'UPDATE_HEALTH_PROFILE_ERROR';
        next(error);
    }
};