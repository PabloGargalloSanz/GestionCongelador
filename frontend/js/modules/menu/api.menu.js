import { apiFetch } from "../../core/api.js";

//obtener menu de la db
export async function obtenerMenuGuardadoAPI() {
    try {
        const response = await apiFetch('/menu', { method: 'GET' });
        if (!response.ok) return { ok: false };
        const data = await response.json();

        return { ok: true, data };

    } catch (error) {
        return { ok: false };
    }
}

// generar nuevo menu y actualizar
export async function generarMenuAPI(perfilMedico = 'estandar') {
    try {
        const response = await apiFetch('/menu/generar', {
            method: 'POST',
            body: JSON.stringify({ perfilMedico })
        });
        if (!response) return { ok: false, error: "Sesión expirada" };
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({})); 
            return { ok: false, error: errorData.error || "Error al generar" };
        }

        const data = await response.json();
        return { ok: true, data };

    } catch (error) {
        return { ok: false, error: "Error de conexión con el servidor" };
    }
}

export async function cambiarEstadoMenuAPI(idMenu, estado) {
    try {
        const response = await apiFetch(`/menu/${idMenu}/estado`, {
            method: 'PATCH',
            body: JSON.stringify({ estado })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return { ok: false, error: errorData.error || "Error al cambiar estado" };
        }

        const data = await response.json();
        return { ok: true, data };

    } catch (error) {
        return { ok: false, error: "Error de conexión" };
    }
}