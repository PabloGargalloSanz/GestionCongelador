// reglas medicas para diferentes perfiles
const REGLAS_MEDICAS = {
    estandar: "Sigue una dieta mediterránea equilibrada. Alterna carnes y pescados, priorizando el consumo de verduras.",
    diabetico: "CRÍTICO: Evita azúcares y procesados. Prioriza proteínas magras y verduras fibrosas.",
    hipertenso: "CRÍTICO: Limita sodio y grasas saturadas. Limita la carne roja a 1 vez por semana."
};

//RESPALDO TEMPORAL
///////////
////////////
const MENU_RESPALDO = {
    "lunes": { "comida": "Merluza al horno con guisantes", "cena": "Tortilla francesa" },
    "martes": { "comida": "Filetes de ternera con puré", "cena": "Sopa de verduras" },
    "miercoles": { "comida": "Lentejas estofadas", "cena": "Pechuga a la plancha" },
    "jueves": { "comida": "Guiso de pescado", "cena": "Ensalada con atún" },
    "viernes": { "comida": "Pollo asado", "cena": "Crema de calabacín" },
    "sabado": { "comida": "Paella mixta", "cena": "Revuelto de ajetes" },
    "domingo": { "comida": "Carne asada", "cena": "Ensalada ligera" }
};

export const generarMenuIA = async (inventarioStr, perfilMedico = 'estandar') => {
    try {
        const reglaAplicar = REGLAS_MEDICAS[perfilMedico] || REGLAS_MEDICAS.estandar;
        
        const prompt = `
            Actúa como un nutricionista experto. 
            Inventario ordenado por caducidad:
            ${inventarioStr}
            
            Regla de salud: ${reglaAplicar}
            
            INSTRUCCIÓN CRÍTICA:
            Devuelve ÚNICAMENTE un JSON válido para 7 días de la semana con esta estructura:
            {"lunes": {"comida": "...", "cena": "..."}, 
            "martes": {"comida": "...", "cena": "..."}
            ...}
        `;

        //ollama en local
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'phi3',
                prompt: prompt,
                stream: false,
                format: 'json',
                keep_alive: "3m" //sesion activa 3 min
            })
        });

        if (!response.ok) {
            throw new Error(`Error de Ollama: ${response.statusText}`);
        }

        const data = await response.json();
        return JSON.parse(data.response);

    } catch (error) {
        //debuj temporal
        /////////////////////////////////////////////
        console.error("Fallo en la IA Local. Activando menú de respaldo.", error.message);
        return MENU_RESPALDO;
    }
};