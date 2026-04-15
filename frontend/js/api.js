import { auth } from './auth.js';

//variables grobales
const API_BASE_URL = 'http://localhost:80/api';

//
async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem('auth_token');
    
    // headers defecto
    const defaultHeaders = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    // union opciones 
    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        if (response.status === 401) {
            auth.handleExpiredSession(); 
            return null; 
        }

        return response;
    } catch (error) {
        console.error("Error en la comunicación API:", error);
        throw error;
    }
}

//login
export async function loginRequest(email, password) {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    return response;
}

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