// Configuración de la API
const API_URL = 'http://localhost:3000/api';

// Referencias a elementos del DOM
const logoutBtn = document.getElementById('logoutBtn');
const bibliotecaBtn = document.getElementById('bibliotecaBtn');
const welcomeMessage = document.getElementById('welcomeMessage');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const memberSince = document.getElementById('memberSince');
const lastAccess = document.getElementById('lastAccess');
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
        redirigirALogin('⚠️ Sesión no encontrada. Por favor, inicia sesión.');
        return false;
    }
    
    const tiempoActual = new Date().getTime();
    
    if (tiempoActual > parseInt(sessionExpiry)) {
        localStorage.clear();
        redirigirALogin('⏱️ Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
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

// Función para formatear fecha
function formatearFecha(fecha) {
    const opciones = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
}

// Función para obtener datos del usuario del backend
async function cargarDatosUsuario() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        redirigirALogin('⚠️ Debes iniciar sesión para acceder a esta página');
        return;
    }
    
    if (!verificarExpiracionSesion()) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/dashboard`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            
            if (data.success) {
                const usuario = data.usuario;
                
                // Mostrar datos del usuario
                welcomeMessage.textContent = `¡Hola, ${usuario.nombreCompleto.split(' ')[0]}!`;
                userName.textContent = usuario.nombreCompleto;
                userEmail.textContent = usuario.email;
                memberSince.textContent = formatearFecha(usuario.miembroDesde);
                lastAccess.textContent = formatearFecha(usuario.ultimoAcceso);
            }
        } else {
            if (response.status === 401 || response.status === 403) {
                localStorage.clear();
                redirigirALogin('🔒 Sesión inválida o expirada. Por favor, inicia sesión nuevamente.');
            } else {
                mostrarMensaje('⚠️ Error al cargar los datos del usuario', 'error');
            }
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('⚠️ Error de conexión con el servidor', 'error');
    }
}

// Función para ir a la biblioteca
function irABiblioteca() {
    window.location.href = 'biblioteca.html';
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
    
    // Limpiar localStorage
    localStorage.clear();
    
    // Redireccionar al login con mensaje
    localStorage.setItem('loginMessage', '✓ Sesión cerrada correctamente');
    window.location.href = 'login.html';
}

// Event listener para el botón de logout
logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        cerrarSesion();
    }
});

// Verificar sesión cada 60 segundos
setInterval(() => {
    if (!verificarExpiracionSesion()) {
        // Si la sesión expiró, se redirigirá automáticamente
    }
}, 60000);

// Actualizar tiempo de expiración en cada interacción del usuario
function renovarSesion() {
    if (verificarExpiracionSesion()) {
        const nuevoTiempoExpiracion = new Date().getTime() + (30 * 60 * 1000);
        localStorage.setItem('sessionExpiry', nuevoTiempoExpiracion);
    }
}

// Eventos para renovar sesión con actividad del usuario
document.addEventListener('click', renovarSesion);
document.addEventListener('keypress', renovarSesion);
document.addEventListener('mousemove', (() => {
    let timeout;
    return () => {
        clearTimeout(timeout);
        timeout = setTimeout(renovarSesion, 1000); // Renovar máximo cada segundo
    };
})());

// Cargar datos del usuario al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticación
    const token = localStorage.getItem('token');
    if (!token) {
        redirigirALogin('⚠️ Debes iniciar sesión para acceder a esta página');
        return;
    }
    
    // Eventos
    bibliotecaBtn.addEventListener('click', irABiblioteca);
    
    // Cargar datos
    cargarDatosUsuario();
});

// Prevenir acceso sin autenticación
window.addEventListener('load', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        redirigirALogin('⚠️ Acceso denegado. Inicia sesión primero.');
    }
});
