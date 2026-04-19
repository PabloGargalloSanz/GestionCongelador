import { apiFetch } from "../../core/api.js";

//get todos alimentos de usuario
export async function getAllAlimentosByUsuario(){
    const token = localStorage.getItem('auth_token');
    try{
        const response = await apiFetch('/alimentos/usuario', {
            method: 'GET',
            headers: {
                'X-accion': 'INVENTORY_CONSULTING'
            }
        });
        
        return response.json();

    } catch (error) {
        console.error("Error al obtener tipos:", error);
        return [];
    }

}

//get tipos de alimentos
export async function getTiposAlimento() {
    const token = localStorage.getItem('auth_token');
    try {
        const response = await apiFetch('/alimentos/tipos_unicos_alimento', {
            headers: { 
                'X-accion': 'FOOD_TYPES_CONSULTING'
            }
        });
        return response.json(); 

    } catch (error) {
        console.error("Error al obtener tipos:", error);
        return [];
    }
}

// post nuevo alimento lotes
export async function guardarNuevoAlimentoAPI(loteData) {
    try {
        const response = await apiFetch('/lotes', {
            method: 'POST',
            body: JSON.stringify(loteData)
        });
        if (!response) return { ok: false, error: "Sesión expirada" };

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({})); 
            return { ok: false, error: errorData.error || "Error al guardar el alimento" };
        }
        
        const data = await response.json();
        return { ok: true, data };
        
    } catch (error) {
        console.error("Error en guardarNuevoAlimentoAPI:", error);
        return { ok: false, error: "Error de conexión con el servidor" };
    }
}

//actualizar alimento lotes
export async function patchAlimentoAPI(idLote, datosActualizados) {
    try {
        const response = await apiFetch(`/lotes/${idLote}`, {
            method: 'PATCH',
            body: JSON.stringify(datosActualizados)
        });

        if (!response) return { ok: false, error: "Sesión expirada" };

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({})); 
            return { ok: false, error: errorData.error || errorData.mensaje || "Error al actualizar el lote" };
        }
        
        const data = await response.json();
        return { ok: true, data };
        
    } catch (error) {
        console.error("Error en patchAlimentoAPI:", error);
        return { ok: false, error: "Error de conexión con el servidor" };
    }
}

// Eliminar alimento lote
export async function deleteAlimentoAPI(idLote) {
    try {
        const response = await apiFetch(`/lotes/${idLote}`, {
            method: 'DELETE'
        });

        if (!response) return { ok: false, error: "Sesión expirada" };

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({})); 
            return { ok: false, error: errorData.error || errorData.mensaje || "Error al eliminar el lote" };
        }
        
        return { ok: true };
        
    } catch (error) {
        console.error("Error en deleteAlimentoAPI:", error);
        return { ok: false, error: "Error de conexión con el servidor" };
    }
}
