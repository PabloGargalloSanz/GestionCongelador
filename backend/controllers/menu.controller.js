import { generarMenuIA } from '../services/menu.service.js';
import { getPerfilMedicoService } from '../services/usuarios.service.js';
import { getInventarioParaMenuService } from '../services/lotes.service.js';

export const generarMenuSemanas = async (req, res, next) => {
    const userId = req.userId;

    try {
        // perfil medico
        const perfilMedico = await getPerfilMedicoService(userId);

        // inventario ordenado
        const lotes = await getInventarioParaMenuService(userId);

        // formatear datos para la IA
        if (lotes.length === 0) {
            return res.status(400).json({ mensaje: "No hay alimentos en el inventario para generar un menú." });
        }

        const inventarioStr = lotes.map(lote => {
            const fechaCad = new Date(lote.fecha_caducidad).toLocaleDateString('es-ES');
            return `- ${lote.cantidad} ${lote.unidad_medida} de ${lote.alimento_nombre} (Tipo: ${lote.alimento_tipo}) - Caduca el: ${fechaCad}`;
        }).join('\n');

        // ia
        const menuGenerado = await generarMenuIA(inventarioStr, perfilMedico);

        // devolver menu
        req.action = 'GENERATE_MENU_SUCCESS';
        res.status(200).json({
            mensaje: "Menú generado con éxito",
            perfilAplicado: perfilMedico,
            menu: menuGenerado
        });

    } catch (error) {
        error.status = 500;
        error.action = 'GENERATE_MENU_SERVER_ERROR';
        next(error);
    }
};