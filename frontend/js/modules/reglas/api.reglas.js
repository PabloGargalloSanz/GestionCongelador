import { apiFetch } from "../../core/api.js";

//obtener regla por usuario
export async function getReglasAPI() {
    try {
        const response = await apiFetch('/reglas', {
            method: 'GET',
            headers: {
                'X-accion': 'RULES_CONSULTING'
            }
        });
        
        return response.json();

    } catch (error) {
        console.error("Error al obtener las reglas de stock: ", error);
        return [];
    }
}

// añadir regla
export async function crearReglaAPI(datosRegla) {
    try {
        const response = await apiFetch('/reglas', {
            method: 'POST',
            headers: {
                'X-accion': 'RULE_CREATION'
            },
            body: JSON.stringify(datosRegla)
        });

        if (!response) return { ok: false, error: "Sesión expirada" };

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({})); 
            return { ok: false, error: errorData.error || errorData.mensaje || "Error al crear la regla" };
        }
        
        const data = await response.json();
        return { ok: true, data };
        
    } catch (error) {
        console.error("Error en crearReglaAPI:", error);
        return { ok: false, error: "Error de conexión con el servidor" };
    }
}

// actualizar regla de stock 
export async function updateReglaAPI(idRegla, datosActualizados) {
    try {
        const response = await apiFetch(`/reglas/${idRegla}`, {
            method: 'PUT',
            headers: {
                'X-accion': 'RULE_UPDATE'
            },
            body: JSON.stringify(datosActualizados)
        });

        if (!response) return { ok: false, error: "Sesión expirada" };

        if (!response.ok) {
            const err = await response.json().catch(()=>({}));
            return { ok: false, error: err.error || "Error al actualizar la regla" };
        }

        return { ok: true };
    } catch (error) {
        console.error("Error en updateReglaAPI:", error);
        return { ok: false, error: "Error de conexión" };
    }
}

//eliminar regla de stock
export async function deleteReglaAPI(idRegla) {
    try {
        const response = await apiFetch(`/reglas/${idRegla}`, {
            method: 'DELETE',
            headers: {
                'X-accion': 'RULE_DELETION'
            }
        });

        if (!response) return { ok: false, error: "Sesión expirada" };

        if (!response.ok) {
            const err = await response.json().catch(()=>({}));
            return { ok: false, error: err.error || "Error al eliminar la regla" };
        }

        return { ok: true };

    } catch (error) {
        console.error("Error en deleteReglaAPI:", error);
        return { ok: false, error: "Error de conexión" };
    }
}