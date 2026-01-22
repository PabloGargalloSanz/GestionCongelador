// inicio sesion y gestion auth

export const auth = {
    // guardar token y email
    saveSession(token, email) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('userEmail', email);
    },

    // cerrar sesion
    clearSession() {
        sessionStorage.clear();
        localStorage.removeItem('userEmail');
        localStorage.removeItem('auth_token');
    },

    // obtener token y email
    isLoggedIn() {
        return localStorage.getItem("auth_token") !== null;
    },

    getUserEmail() {
        return localStorage.getItem('userEmail');
    }
};