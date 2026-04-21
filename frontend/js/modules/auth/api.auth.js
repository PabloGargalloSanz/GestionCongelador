import { CONFIG } from '../../core/config.js';

//login
export async function loginRequest(email, password) {
    const response = await fetch(`${CONFIG.API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    return response;
}
