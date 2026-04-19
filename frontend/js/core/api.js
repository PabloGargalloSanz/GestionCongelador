import { auth } from '../auth.js';
import { CONFIG } from './config.js';

//
export async function apiFetch(endpoint, options = {}) {
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
        const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, config);

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
