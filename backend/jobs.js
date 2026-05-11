//rellenar con jobs
import cron from 'node-cron';
import { generarMenuIA, saveMenuService } from './services/menu.service.js';
import { getAllAlimentosUsuario } from './services/alimentos.service.js';



cron.schedule('0 6 * * 0', async () => {
    
    try {
        const usuarios = await getAllAlimentosUsuario();

        if (!usuarios || usuarios.length === 0) {
            
            return;
        }

        for (const usuario of usuarios) {
            try {
                console.log(`Procesando menú para el usuario: ${usuario.nombre}`);

                const nuevoMenu = await generarMenuIA(
                    usuario.inventarioStr
                );

                if (nuevoMenu) {
                    await saveMenuService(usuario.id, nuevoMenu);
                    console.log(`Menú guardado correctamente para ${usuario.nombre}`);
                }

            } catch (error) {
                console.error(`Fallo crítico al generar menú para ${usuario.nombre}:`, error.message);
                throw new Error("ERROR_MENU_GENERATION"); 
            }
        }

    } catch (error) {
        console.error('Error general en el proceso del Cron:', error.message);
        throw error; 
    }
}, {
    scheduled: true,
    timezone: "Europe/Madrid"
});