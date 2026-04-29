import pool from '../db/db.js';

//obtener menu
export const getMenuGuardadoService = async (userId) => {
    const query = `
        SELECT id_menu, menu_json, estado, fecha_inicio, fecha_fin 
        FROM menus_usuario 
        WHERE id_usuario = $1 
        ORDER BY fecha_generacion DESC 
        LIMIT 1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

// guardar menu (borrador)
export const saveMenuService = async (userId, menuJson) => {
    const query = `
        INSERT INTO menus_usuario (id_usuario, menu_json, fecha_inicio, fecha_fin, estado)
        VALUES ($1, $2, CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days', 'borrador')
        RETURNING id_menu, estado, fecha_inicio, fecha_fin
    `;
    const result = await pool.query(query, [userId, menuJson]);
    return result.rows[0]; 
};

// aceptar o rechazar el menu
export const updateEstadoMenuService = async (idMenu, userId, nuevoEstado) => {
    const query = `
        UPDATE menus_usuario 
        SET estado = $1 
        WHERE id_menu = $2 AND id_usuario = $3
        RETURNING id_menu, estado
    `;
    const result = await pool.query(query, [nuevoEstado, idMenu, userId]);
    return result.rows[0];
};

//generar menui
export const generarMenuIA = async (inventarioStr, perfilMedico = 'estandar', intento = 1) => {
    // pausar ejecucion en caso de datos no validos
    const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const MAX_INTENTOS = 3;
    const TIEMPO_ESPERA = 5 * 60 * 1000; // 5min
    const REGLAS_MEDICAS = {
        estandar: "Dieta mediterránea. Alterna carnes y pescados, priorizando verduras, legumbres y cereales integrales.",
        diabetico: "CRÍTICO: Evita azúcares y harinas refinadas. Prioriza proteínas magras, verduras fibrosas y carbohidratos complejos.",
        hipertenso: "CRÍTICO: Limita sodio. Prohibida la sal añadida. Limita la carne roja y prioriza pescados y verduras."
    };

    try {
        const reglaAplicar = REGLAS_MEDICAS[perfilMedico] || REGLAS_MEDICAS.estandar;

        // nutricion
        const promptMenu = `
            Eres un nutricionista sensato y realista. Genera un menú semanal usando el inventario proporcionado.
            INVENTARIO: ${inventarioStr}
            REGLA MÉDICA: ${reglaAplicar}
            
            REGLAS:
            1. CENAS LIGERAS: Usa solo ensaladas, tortillas, cremas o platos suaves.
            2. NO MEZCLES: Carne y pescado nunca el mismo día.
            3. SIN PARÉNTESIS: Escribe el nombre del plato de forma natural. 
            4. VARIEDAD Y SENTIDO COMÚN: No repitas el mismo alimento más de dos veces por semana. Diseña recetas reales y comunes (evita mezclas raras como gambas con pera o palabras inventadas).
            5. LISTA DE LA COMPRA INTELIGENTE: Añade a la lista SOLO cosas de despensa (arroz, pasta, pan) o frescos (lechuga, tomate, huevos). ESTÁ PROHIBIDO añadir a la lista de la compra los alimentos que ya están en el INVENTARIO.
            6. CLAVES EXACTAS: Escribe los días EXACTAMENTE como en el ejemplo, SIN TILDES en las claves ("miercoles", "sabado").

            Devuelve SOLO este JSON:
            {
              "menu": {
                "lunes": { "comida": "...", "cena_ligera": "..." },
                "martes": { "comida": "...", "cena_ligera": "..." },
                "miercoles": { "comida": "...", "cena_ligera": "..." },
                "jueves": { "comida": "...", "cena_ligera": "..." },
                "viernes": { "comida": "...", "cena_ligera": "..." },
                "sabado": { "comida": "...", "cena_ligera": "..." },
                "domingo": { "comida": "...", "cena_ligera": "..." }
              },
              "lista_compra_sugerida": ["..."]
            }
        `;

        const resMenu = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: 'llama3.1', prompt: promptMenu, stream: false, format: 'json', keep_alive: "1m" })
        });

        const dataMenu = await resMenu.json();
        const menuGenerado = JSON.parse(dataMenu.response.replace(/```json/g, '').replace(/```/g, '').trim());

        // validacion de estructura
        if (!menuGenerado || !menuGenerado.menu) {
            throw new Error("El modelo generó un JSON inválido o sin la propiedad 'menu'.");
        }

        // extrae los alimentos a descongelar
        const resumenMenuTexto = Object.entries(menuGenerado.menu)
            .map(([dia, platos]) => `${dia}: ${platos.comida} y ${platos.cena_ligera}`)
            .join('\n');

        const promptIngredientes = `
            Lee el siguiente menú:
            ${resumenMenuTexto}

            TAREA:
            Para cada día, dime cuál es el ingrediente PRINCIPAL del congelador que se usa ESE MISMO DÍA. 
            Si un día es vegetariano o no usa congelado, escribe "Nada".
            Devuelve SOLO el nombre del ingrediente.

            Formato JSON estrictamente plano:
            {
                "lunes": "Ingrediente usado el lunes",
                "martes": "Ingrediente usado el martes",
                "miercoles": "Ingrediente usado el miércoles",
                "jueves": "Ingrediente usado el jueves",
                "viernes": "Ingrediente usado el viernes",
                "sabado": "Ingrediente usado el sábado",
                "domingo": "Ingrediente usado el domingo"
            }
        `;

        const resIngr = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: 'llama3.1', prompt: promptIngredientes, stream: false, format: 'json', keep_alive: "1m" })
        });

        const dataIngr = await resIngr.json();
        const ingredientesExtraidos = JSON.parse(dataIngr.response.replace(/```json/g, '').replace(/```/g, '').trim());

        // union de datos con instrucciones de descongelar
        const diasSemana = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
        
        const ingredienteLunes = ingredientesExtraidos["lunes"];
        menuGenerado.descongelar_domingo_previo = (typeof ingredienteLunes === 'string' && ingredienteLunes !== 'Nada') ? ingredienteLunes : "";

        // descongelar hoy para cada dia
        diasSemana.forEach((dia, index) => {
            if (menuGenerado.menu[dia]) {
                if (index < diasSemana.length - 1) {
                    const diaSiguiente = diasSemana[index + 1];
                    const ingredienteManana = ingredientesExtraidos[diaSiguiente];
                    menuGenerado.menu[dia].descongelar_hoy = (typeof ingredienteManana === 'string' && ingredienteManana !== 'Nada') ? ingredienteManana : "";

                } else {
                    menuGenerado.menu[dia].descongelar_hoy = "";
                }
            }
        });

        //debuj
        console.log("Menú generado");
        return menuGenerado;

    } catch (error) {
        console.error(`Error en intento ${intento}:`, error.message);

        if (intento < MAX_INTENTOS) {
            await esperar(TIEMPO_ESPERA);

            return generarMenuIA(inventarioStr, perfilMedico, intento + 1); // reintento recursivo
        } else {
            return;
        }
    }
};

