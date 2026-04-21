import { apiFetch } from "../../core/api.js";

//get almacenes usuario
export async function getAlmacenesByUsuarioDashboard() {
    const token = localStorage.getItem('auth_token');
    try {
        const response = await apiFetch('/almacenamientos/usuario', {
            method: 'GET',
            headers: {
                'X-accion': 'STORAGE_CONSULTING'
            }
        });
        return response.json();

    } catch (error) {
        console.error("Error al obtener almacenes: ", error);
        return [];
    }
}

// añadir nuevo almacenamiento
export async function crearAlmacenAPI(datosAlmacen) {
    try {
        const response = await apiFetch('/almacenamientos', {
            method: 'POST',
            body: JSON.stringify(datosAlmacen)
        });

        if (!response) return { ok: false, error: "Sesión expirada" };

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({})); 
            return { ok: false, error: errorData.error || errorData.mensaje || "Error al crear el almacén" };
        }
        
        const data = await response.json();
        return { ok: true, data };
        
    } catch (error) {
        console.error("Error en crearAlmacenAPI:", error);
        return { ok: false, error: "Error de conexión con el servidor" };
    }
}

// Actualizar almacenamiento
export async function patchAlmacenAPI(idAlmacen, datosActualizados) {
    try {
        const response = await apiFetch(`/almacenamientos/${idAlmacen}`, {
            method: 'PATCH',
            body: JSON.stringify(datosActualizados)
        });
        if (!response) return { ok: false, error: "Sesión expirada" };
        if (!response.ok) {
            const err = await response.json().catch(()=>({}));
            return { ok: false, error: err.error || "Error al actualizar" };
        }
        return { ok: true };
    } catch (error) {
        return { ok: false, error: "Error de conexión" };
    }
}

// Eliminar almacenamiento
export async function deleteAlmacenAPI(idAlmacen) {
    try {
        const response = await apiFetch(`/almacenamientos/${idAlmacen}`, {
            method: 'DELETE'
        });
        if (!response) return { ok: false, error: "Sesión expirada" };
        if (!response.ok) {
            const err = await response.json().catch(()=>({}));
            return { ok: false, error: err.error || "Error al eliminar" };
        }
        return { ok: true };
    } catch (error) {
        return { ok: false, error: "Error de conexión" };
    }
}