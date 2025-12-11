// Este archivo mantiene compatibilidad con dashboard.html
// Para la nueva versión, usa home.html y home.js

// Configuración de la API
const API_URL = 'http://localhost:3000/api';

// Referencias a elementos del DOM
const logoutBtn = document.getElementById('logoutBtn');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const mensajeDiv = document.getElementById('mensaje');

// Función para mostrar mensaje
function mostrarMensaje(texto, tipo) {
    mensajeDiv.textContent = texto;
    mensajeDiv.className = `mensaje ${tipo}`;
    mensajeDiv.style.display = 'block';
}

// Función para verificar si la sesión ha expirado
function verificarExpiracionSesion() {
    const sessionExpiry = localStorage.getItem('sessionExpiry');
    
    if (!sessionExpiry) {
        redirigirALogin('Sesión no encontrada');
        return false;
    }
    
    const tiempoActual = new Date().getTime();
    
    if (tiempoActual > parseInt(sessionExpiry)) {
        localStorage.clear();
        redirigirALogin('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        return false;
    }
    
    return true;
}

// Función para redireccionar al login
function redirigirALogin(mensaje) {
    if (mensaje) {
        localStorage.setItem('loginMessage', mensaje);
    }
    window.location.href = 'login.html';
}

// Función para obtener datos del usuario
async function cargarDatosUsuario() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        redirigirALogin('Debes iniciar sesión');
        return;
    }
    
    if (!verificarExpiracionSesion()) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            
            if (data.success) {
                userName.textContent = data.usuario.nombreCompleto;
                userEmail.textContent = data.usuario.email;
            }
        } else {
            if (response.status === 401 || response.status === 403) {
                localStorage.clear();
                redirigirALogin('Token inválido o expirado. Por favor, inicia sesión nuevamente.');
            } else {
                mostrarMensaje('Error al cargar los datos del usuario', 'error');
            }
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('Error de conexión con el servidor', 'error');
    }
}

// Función para cerrar sesión
async function cerrarSesion() {
    const token = localStorage.getItem('token');
    
    try {
        await fetch(`${API_URL}/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
    
    localStorage.clear();
    redirigirALogin('Sesión cerrada correctamente');
}

// Event listener para el botón de logout
logoutBtn.addEventListener('click', cerrarSesion);

// Verificar sesión cada 60 segundos
setInterval(() => {
    verificarExpiracionSesion();
}, 60000);

// Actualizar tiempo de expiración en cada interacción del usuario
document.addEventListener('click', () => {
    if (verificarExpiracionSesion()) {
        const nuevoTiempoExpiracion = new Date().getTime() + (30 * 60 * 1000);
        localStorage.setItem('sessionExpiry', nuevoTiempoExpiracion);
    }
});

document.addEventListener('keypress', () => {
    if (verificarExpiracionSesion()) {
        const nuevoTiempoExpiracion = new Date().getTime() + (30 * 60 * 1000);
        localStorage.setItem('sessionExpiry', nuevoTiempoExpiracion);
    }
});

// Cargar datos del usuario al cargar la página
window.addEventListener('DOMContentLoaded', cargarDatosUsuario);
