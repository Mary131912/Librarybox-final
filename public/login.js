// Configuración de la API
const API_URL = 'http://localhost:3000/api';

// Referencias a elementos del DOM
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('togglePassword');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const mensajeDiv = document.getElementById('mensaje');
const loginBtn = document.getElementById('loginBtn');
const btnText = loginBtn.querySelector('.btn-text');
const btnLoader = loginBtn.querySelector('.btn-loader');

// Verificar si hay un mensaje de la sesión anterior
window.addEventListener('DOMContentLoaded', () => {
    const loginMessage = localStorage.getItem('loginMessage');
    if (loginMessage) {
        mostrarMensaje(loginMessage, 'error');
        localStorage.removeItem('loginMessage');
    }
    
    // Si ya está autenticado, redirigir a home
    const token = localStorage.getItem('token');
    if (token) {
        verificarTokenYRedirigir();
    }
});

// Función para verificar token y redirigir
async function verificarTokenYRedirigir() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/verify-token`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            window.location.href = 'dashboard-new.html';
        }
    } catch (error) {
        // Si hay error, el usuario debe loguearse
        localStorage.clear();
    }
}

// Toggle para mostrar/ocultar contraseña
togglePasswordBtn.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    togglePasswordBtn.textContent = type === 'password' ? '👁️' : '🙈';
});

// Función para validar email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Función para mostrar mensaje
function mostrarMensaje(texto, tipo) {
    mensajeDiv.textContent = texto;
    mensajeDiv.className = `mensaje ${tipo}`;
    mensajeDiv.style.display = 'block';
    
    // Auto-ocultar mensajes de éxito después de 5 segundos
    if (tipo === 'exito') {
        setTimeout(() => {
            mensajeDiv.style.display = 'none';
        }, 5000);
    }
}

// Función para limpiar errores
function limpiarErrores() {
    emailError.textContent = '';
    passwordError.textContent = '';
    emailInput.classList.remove('invalid', 'valid');
    passwordInput.classList.remove('invalid', 'valid');
}

// Función para establecer estado de carga
function setLoading(loading) {
    if (loading) {
        loginBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
    } else {
        loginBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
}

// Validación en tiempo real del email
emailInput.addEventListener('blur', () => {
    const email = emailInput.value.trim();
    
    if (!email) {
        emailError.textContent = 'El correo electrónico es obligatorio';
        emailInput.classList.add('invalid');
        emailInput.classList.remove('valid');
    } else if (email.toLowerCase() !== 'admin' && !validarEmail(email)) {
        emailError.textContent = 'Formato de email inválido';
        emailInput.classList.add('invalid');
        emailInput.classList.remove('valid');
    } else {
        emailError.textContent = '';
        emailInput.classList.remove('invalid');
        emailInput.classList.add('valid');
    }
});

// Validación en tiempo real de la contraseña
passwordInput.addEventListener('blur', () => {
    const password = passwordInput.value;
    
    if (!password) {
        passwordError.textContent = 'La contraseña es obligatoria';
        passwordInput.classList.add('invalid');
        passwordInput.classList.remove('valid');
    } else {
        passwordError.textContent = '';
        passwordInput.classList.remove('invalid');
        passwordInput.classList.add('valid');
    }
});

// Limpiar errores cuando el usuario empieza a escribir
emailInput.addEventListener('input', () => {
    if (emailError.textContent) {
        emailError.textContent = '';
        emailInput.classList.remove('invalid');
    }
    mensajeDiv.style.display = 'none';
});

passwordInput.addEventListener('input', () => {
    if (passwordError.textContent) {
        passwordError.textContent = '';
        passwordInput.classList.remove('invalid');
    }
    mensajeDiv.style.display = 'none';
});

// Manejo del formulario de login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    limpiarErrores();
    mensajeDiv.style.display = 'none';
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Validación del frontend
    let isValid = true;
    
    if (!email) {
        emailError.textContent = 'El correo electrónico es obligatorio';
        emailInput.classList.add('invalid');
        isValid = false;
    } else if (email.toLowerCase() !== 'admin' && !validarEmail(email)) {
        emailError.textContent = 'Formato de email inválido';
        emailInput.classList.add('invalid');
        isValid = false;
    }
    
    if (!password) {
        passwordError.textContent = 'La contraseña es obligatoria';
        passwordInput.classList.add('invalid');
        isValid = false;
    }
    
    if (!isValid) {
        return;
    }
    
    // Activar estado de carga
    setLoading(true);
    
    // Enviar datos al servidor
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            console.log('✅ Login exitoso, guardando datos...');
            
            // Guardar token y datos de usuario en localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
            
            // Establecer tiempo de expiración de sesión (30 minutos)
            const tiempoExpiracion = new Date().getTime() + (30 * 60 * 1000);
            localStorage.setItem('tokenExpiracion', tiempoExpiracion);
            
            console.log('✅ Token guardado:', data.token.substring(0, 20) + '...');
            console.log('✅ Expiración guardada:', new Date(tiempoExpiracion).toLocaleString());
            
            mostrarMensaje('✓ ¡Login exitoso! Redirigiendo...', 'exito');
            
            // Redirigir al nuevo dashboard
            setTimeout(() => {
                console.log('🔄 Redirigiendo a dashboard-new.html...');
                window.location.href = 'dashboard-new.html';
            }, 1000);
        } else {
            // Marcar campos como inválidos con errores específicos
            const mensajeError = data.mensaje || 'Error al iniciar sesión';
            
            // Si el error menciona email/correo, marcar el campo de email
            if (mensajeError.toLowerCase().includes('email') || 
                mensajeError.toLowerCase().includes('correo') ||
                mensajeError.toLowerCase().includes('usuario no encontrado')) {
                emailInput.classList.add('invalid');
                emailError.textContent = '❌ Email no encontrado';
            }
            
            // Si el error menciona contraseña, marcar el campo de contraseña
            if (mensajeError.toLowerCase().includes('contraseña') || 
                mensajeError.toLowerCase().includes('password') ||
                mensajeError.toLowerCase().includes('incorrecta') ||
                mensajeError.toLowerCase().includes('incorrectos')) {
                passwordInput.classList.add('invalid');
                passwordError.textContent = '❌ Contraseña incorrecta';
            }
            
            // Si el mensaje es genérico, marcar ambos campos
            if (!mensajeError.toLowerCase().includes('email') && 
                !mensajeError.toLowerCase().includes('contraseña') &&
                !mensajeError.toLowerCase().includes('correo')) {
                emailInput.classList.add('invalid');
                passwordInput.classList.add('invalid');
                emailError.textContent = '❌ Credenciales incorrectas';
                passwordError.textContent = '❌ Credenciales incorrectas';
            }
            
            mostrarMensaje('❌ ' + mensajeError, 'error');
            setLoading(false);
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('⚠️ Error de conexión con el servidor. Verifica que el servidor esté ejecutándose.', 'error');
        setLoading(false);
    }
});

// Detectar Enter en los campos
emailInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        passwordInput.focus();
    }
});

passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        loginForm.dispatchEvent(new Event('submit'));
    }
});
