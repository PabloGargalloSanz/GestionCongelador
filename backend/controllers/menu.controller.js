import { generarMenuIA } from '../services/menu.service.js';
import { getPerfilMedicoService } from '../services/usuarios.service.js';
import { getInventarioParaMenuService } from '../services/lotes.service.js';
import { getMenuGuardadoService, saveMenuService, updateEstadoMenuService } from '../services/menu.service.js';

//obtener menu guardado
export const obtenerMenuSemanas = async (req, res, next) => {
    const userId = req.userId;

    try {
        const menuGuardado = await getMenuGuardadoService(userId);

        if (!menuGuardado) {
            req.action = 'NO_MENU_DB'
            return res.status(404).json({ existeMenu: false });
        }

        req.action = 'GET_MENU_SUCCESS';
        res.status(200).json({
            existeMenu: true,
            id_menu: menuGuardado.id_menu,
            estado: menuGuardado.estado,
            fecha_inicio: menuGuardado.fecha_inicio,
            fecha_fin: menuGuardado.fecha_fin,
            ...menuGuardado.menu_json
        });

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
            req.action = 'EMPTY_INVENTARY'
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
        const infoDB = await saveMenuService(userId, respuestaFinal);

        req.action = 'GENERATE_MENU_SUCCESS';
        res.status(200).json({
            existeMenu: true,
            id_menu: infoDB.id_menu,
            estado: infoDB.estado, // borrador
            fecha_inicio: infoDB.fecha_inicio,
            fecha_fin: infoDB.fecha_fin,
            ...respuestaFinal
        });

    } catch (error) {
        error.status = 500;
        error.action = 'GENERATE_MENU_SERVER_ERROR';
        next(error);
    }
};

export const cambiarEstadoMenu = async (req, res, next) => {
    const userId = req.userId;
    const { idMenu } = req.params;
    const { estado } = req.body; // aceptado o rechazado

    try {
        const menuActualizado = await updateEstadoMenuService(idMenu, userId, estado);
        
        if (!menuActualizado) {
            req.action = 'MENU_NOT_FOUND'
            return res.status(404).json({ error: "Menú no encontrado o no autorizado." });
        }
        
        req.action = `MENU_STATE_CHANGE_${estado}`
        res.status(200).json({ mensaje: `Menú ${estado} con éxito`, data: menuActualizado });

    } catch (error) {
        next(error);
    }
};