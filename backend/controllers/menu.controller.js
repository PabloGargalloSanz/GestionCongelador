import { generarMenuIA } from '../services/menu.service.js';
import { getPerfilMedicoService } from '../services/usuarios.service.js';
import { getInventarioParaMenuService } from '../services/lotes.service.js';
import { getMenuGuardadoService, saveMenuService } from '../services/menu.service.js'; 

//obtener menu guardado
export const obtenerMenuSemanas = async (req, res, next) => {
    const userId = req.userId;

    try {
        const menuGuardado = await getMenuGuardadoService(userId);

        if (!menuGuardado) {
            return res.status(404).json({ mensaje: "No hay menú guardado para este usuario." });
        }

        req.action = 'GET_MENU_SUCCESS';
        res.status(200).json(menuGuardado);

    } catch (error) {
        error.status = 500;
        error.action = 'GET_MENU_SERVER_ERROR';
        next(error);
    }
};

// generar y guardar menu
export const generarMenuSemanas = async (req, res, next) => {
    const userId = req.userId;

    try {
        const perfilMedico = await getPerfilMedicoService(userId);
        const lotes = await getInventarioParaMenuService(userId);

        if (lotes.length === 0) {
            return res.status(400).json({ mensaje: "No hay alimentos en el inventario para generar un menú." });
        }

        const inventarioAgrupado = lotes.reduce((acc, lote) => {
            const tipo = lote.alimento_tipo.toUpperCase(); 
            if (!acc[tipo]) acc[tipo] = [];
            const fechaCad = new Date(lote.fecha_caducidad).toLocaleDateString('es-ES');
            acc[tipo].push(`- ${lote.cantidad} ${lote.unidad_medida} de ${lote.alimento_nombre} (Caduca: ${fechaCad})`);
            return acc;
        }, {});

        const inventarioStr = Object.entries(inventarioAgrupado)
            .map(([tipo, items]) => `== SECCIÓN ${tipo} ==\n${items.join('\n')}`)
            .join('\n\n');

        const menuGenerado = await generarMenuIA(inventarioStr, perfilMedico);

        //json respuesta
        const respuestaFinal = {
            mensaje: "Menú generado con éxito",
            perfilAplicado: perfilMedico,
            ...menuGenerado
        };

        //guardar menu
        await saveMenuService(userId, respuestaFinal);

        req.action = 'GENERATE_MENU_SUCCESS';
        res.status(200).json(respuestaFinal);

    } catch (error) {
        error.status = 500;
        error.action = 'GENERATE_MENU_SERVER_ERROR';
        next(error);
    }
};