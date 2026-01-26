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