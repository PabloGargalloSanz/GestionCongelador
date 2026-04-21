import { app, loadTemplate, showToast } from '../../core/ui.js';
import { loginRequest } from './api.auth.js';
import { auth } from '../../auth.js';

// Login
export function renderLogin(onLoginSuccess) {
    loadTemplate('tpl-login', app);

    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('username').value;
        const password = document.getElementById('password').value; 

        try {
            const response = await loginRequest(email, password);
            const data = await response.json();

            if (response.ok) {
                auth.saveSession(data.token, email);
                onLoginSuccess();
            } else {
                showToast(data.error || "Acceso denegado", 'danger');
            }
        } catch (error) {
            showToast("Error de conexión con el servidor de autenticación", 'danger');
        }
    });
}
