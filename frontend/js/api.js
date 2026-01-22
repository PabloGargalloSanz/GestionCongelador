//variables grobales
const API_BASE_URL = '/api';

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
        const response = await fetch(`${API_BASE_URL}/almacenamientos/usuario`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json',
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
        const response = await fetch(`${API_BASE_URL}/alimentos/usuario`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json',
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
        const response = await fetch(`${API_BASE_URL}/alimentos/tipos_unicos_alimento`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json(); 

    } catch (error) {
        console.error("Error al obtener tipos:", error);
        return [];
    }
}