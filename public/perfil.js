// Verificar sesión al cargar
window.addEventListener('DOMContentLoaded', () => {
    verificarSesion();
    cargarDatosUsuario();
    configurarEventos();
});

// Verificar sesión
function verificarSesion() {
    const token = localStorage.getItem('token');
    const expiracion = localStorage.getItem('tokenExpiracion');
    
    if (!token || !expiracion) {
        console.log('No hay token o expiración, redirigiendo a login');
        window.location.href = 'login.html';
        return false;
    }
    
    if (new Date().getTime() > parseInt(expiracion)) {
        console.log('Token expirado, redirigiendo a login');
        localStorage.clear();
        window.location.href = 'login.html';
        return false;
    }
    
    return true;
}

// Configurar eventos
function configurarEventos() {
    // Botones de navegación
    document.getElementById('btnBiblioteca').addEventListener('click', () => {
        window.location.href = 'biblioteca.html';
    });
    
    document.getElementById('btnInicio').addEventListener('click', () => {
        window.location.href = 'dashboard-new.html';
    });
    
    document.getElementById('btnCerrarSesion').addEventListener('click', cerrarSesion);
    
    // Formulario de cambio de contraseña
    document.getElementById('formCambiarPassword').addEventListener('submit', cambiarPassword);
    
    // Toggle de contraseñas
    configurarTogglePassword('toggleActual', 'passwordActual');
    configurarTogglePassword('toggleNueva', 'passwordNueva');
    configurarTogglePassword('toggleConfirmar', 'passwordConfirmar');
}

// Cargar datos del usuario
async function cargarDatosUsuario() {
    try {
        const response = await fetch('http://localhost:3000/api/profile', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                localStorage.clear();
                window.location.href = 'login.html';
                return;
            }
            throw new Error('Error al cargar datos');
        }
        
        const data = await response.json();
        
        document.getElementById('nombreCompleto').textContent = data.usuario.nombreCompleto;
        document.getElementById('email').textContent = data.usuario.email;
        document.getElementById('fechaCreacion').textContent = formatearFecha(data.usuario.fechaCreacion);
        document.getElementById('ultimoAcceso').textContent = formatearFecha(data.usuario.ultimoAcceso);
        
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('Error al cargar información del usuario', 'error', 'mensajePassword');
    }
}

// Cambiar contraseña
async function cambiarPassword(e) {
    e.preventDefault();
    
    const passwordActual = document.getElementById('passwordActual').value;
    const passwordNueva = document.getElementById('passwordNueva').value;
    const passwordConfirmar = document.getElementById('passwordConfirmar').value;
    
    // Validar que la nueva contraseña cumpla con los requisitos
    if (!validarPassword(passwordNueva)) {
        mostrarMensaje('La nueva contraseña no cumple con los requisitos de seguridad', 'error', 'mensajePassword');
        return;
    }
    
    // Validar que las contraseñas nuevas coincidan
    if (passwordNueva !== passwordConfirmar) {
        mostrarMensaje('Las contraseñas nuevas no coinciden', 'error', 'mensajePassword');
        return;
    }
    
    try {
        const response = await fetch('http://localhost:3000/api/profile/password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                passwordActual,
                passwordNueva
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            mostrarMensaje('Contraseña actualizada exitosamente', 'success', 'mensajePassword');
            document.getElementById('formCambiarPassword').reset();
            
            // Redirigir al login después de 2 segundos
            setTimeout(() => {
                localStorage.clear();
                window.location.href = 'login.html';
            }, 2000);
        } else {
            mostrarMensaje(data.mensaje, 'error', 'mensajePassword');
        }
        
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('Error al cambiar la contraseña', 'error', 'mensajePassword');
    }
}

// Validar contraseña
function validarPassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
}

// Configurar toggle de contraseña
function configurarTogglePassword(toggleId, inputId) {
    const toggleBtn = document.getElementById(toggleId);
    const input = document.getElementById(inputId);
    
    toggleBtn.addEventListener('click', () => {
        const tipo = input.type === 'password' ? 'text' : 'password';
        input.type = tipo;
        toggleBtn.querySelector('.toggle-icon').textContent = tipo === 'password' ? '👁️' : '🙈';
    });
}

// Formatear fecha
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

// Cerrar sesión
function cerrarSesion() {
    localStorage.clear();
    window.location.href = 'login.html';
}

// Mostrar mensajes
function mostrarMensaje(texto, tipo, contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    contenedor.textContent = texto;
    contenedor.className = `mensaje mensaje-${tipo}`;
    contenedor.style.display = 'block';
    
    // Auto-ocultar mensaje después de 5 segundos
    setTimeout(() => {
        contenedor.style.display = 'none';
    }, 5000);
}
