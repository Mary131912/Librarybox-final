// Configuración de la API
const API_URL = 'http://localhost:3000/api';

// Referencias a elementos del DOM
const registerForm = document.getElementById('registerForm');
const nombreCompletoInput = document.getElementById('nombreCompleto');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const togglePasswordBtn = document.getElementById('togglePassword');
const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');
const nombreError = document.getElementById('nombreError');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const confirmPasswordError = document.getElementById('confirmPasswordError');
const mensajeDiv = document.getElementById('mensaje');
const registerBtn = document.getElementById('registerBtn');
const btnText = registerBtn.querySelector('.btn-text');
const btnLoader = registerBtn.querySelector('.btn-loader');

// Referencias a requisitos de contraseña
const reqLength = document.getElementById('req-length');
const reqUppercase = document.getElementById('req-uppercase');
const reqLowercase = document.getElementById('req-lowercase');
const reqNumber = document.getElementById('req-number');

// Toggle para mostrar/ocultar contraseñas
togglePasswordBtn.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    togglePasswordBtn.textContent = type === 'password' ? '👁️' : '🙈';
});

toggleConfirmPasswordBtn.addEventListener('click', () => {
    const type = confirmPasswordInput.type === 'password' ? 'text' : 'password';
    confirmPasswordInput.type = type;
    toggleConfirmPasswordBtn.textContent = type === 'password' ? '👁️' : '🙈';
});

// Función para validar email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Función para validar contraseña completa
function validarPassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
}

// Función para actualizar requisitos de contraseña visualmente
function actualizarRequisitos(password) {
    // Mínimo 8 caracteres
    if (password.length >= 8) {
        reqLength.classList.add('valid');
        reqLength.textContent = '✓ Mínimo 8 caracteres';
    } else {
        reqLength.classList.remove('valid');
        reqLength.textContent = '✗ Mínimo 8 caracteres';
    }
    
    // Una mayúscula
    if (/[A-Z]/.test(password)) {
        reqUppercase.classList.add('valid');
        reqUppercase.textContent = '✓ Una letra mayúscula';
    } else {
        reqUppercase.classList.remove('valid');
        reqUppercase.textContent = '✗ Una letra mayúscula';
    }
    
    // Una minúscula
    if (/[a-z]/.test(password)) {
        reqLowercase.classList.add('valid');
        reqLowercase.textContent = '✓ Una letra minúscula';
    } else {
        reqLowercase.classList.remove('valid');
        reqLowercase.textContent = '✗ Una letra minúscula';
    }
    
    // Un número
    if (/\d/.test(password)) {
        reqNumber.classList.add('valid');
        reqNumber.textContent = '✓ Un número';
    } else {
        reqNumber.classList.remove('valid');
        reqNumber.textContent = '✗ Un número';
    }
}

// Función para mostrar mensaje
function mostrarMensaje(texto, tipo) {
    mensajeDiv.textContent = texto;
    mensajeDiv.className = `mensaje ${tipo}`;
    mensajeDiv.style.display = 'block';
    
    // Scroll al mensaje
    mensajeDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Función para limpiar errores
function limpiarErrores() {
    nombreError.textContent = '';
    emailError.textContent = '';
    passwordError.textContent = '';
    confirmPasswordError.textContent = '';
    nombreCompletoInput.classList.remove('invalid', 'valid');
    emailInput.classList.remove('invalid', 'valid');
    passwordInput.classList.remove('invalid', 'valid');
    confirmPasswordInput.classList.remove('invalid', 'valid');
}

// Función para establecer estado de carga
function setLoading(loading) {
    if (loading) {
        registerBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
    } else {
        registerBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
}

// Validación en tiempo real del nombre
nombreCompletoInput.addEventListener('blur', () => {
    const nombre = nombreCompletoInput.value.trim();
    
    if (!nombre) {
        nombreError.textContent = 'El nombre completo es obligatorio';
        nombreCompletoInput.classList.add('invalid');
        nombreCompletoInput.classList.remove('valid');
    } else if (nombre.length < 3) {
        nombreError.textContent = 'El nombre debe tener al menos 3 caracteres';
        nombreCompletoInput.classList.add('invalid');
        nombreCompletoInput.classList.remove('valid');
    } else {
        nombreError.textContent = '';
        nombreCompletoInput.classList.remove('invalid');
        nombreCompletoInput.classList.add('valid');
    }
});

// Validación en tiempo real del email
emailInput.addEventListener('blur', () => {
    const email = emailInput.value.trim();
    
    if (!email) {
        emailError.textContent = 'El correo electrónico es obligatorio';
        emailInput.classList.add('invalid');
        emailInput.classList.remove('valid');
    } else if (!validarEmail(email)) {
        emailError.textContent = 'Formato de email inválido';
        emailInput.classList.add('invalid');
        emailInput.classList.remove('valid');
    } else {
        emailError.textContent = '';
        emailInput.classList.remove('invalid');
        emailInput.classList.add('valid');
    }
});

// Actualizar requisitos mientras se escribe la contraseña
passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    actualizarRequisitos(password);
    
    if (passwordError.textContent) {
        passwordError.textContent = '';
        passwordInput.classList.remove('invalid');
    }
    
    // Validar confirmación si ya tiene contenido
    if (confirmPasswordInput.value) {
        validarConfirmacion();
    }
});

// Validación de contraseña al perder el foco
passwordInput.addEventListener('blur', () => {
    const password = passwordInput.value;
    
    if (!password) {
        passwordError.textContent = 'La contraseña es obligatoria';
        passwordInput.classList.add('invalid');
        passwordInput.classList.remove('valid');
    } else if (!validarPassword(password)) {
        passwordError.textContent = 'La contraseña no cumple con los requisitos';
        passwordInput.classList.add('invalid');
        passwordInput.classList.remove('valid');
    } else {
        passwordError.textContent = '';
        passwordInput.classList.remove('invalid');
        passwordInput.classList.add('valid');
    }
});

// Función para validar confirmación de contraseña
function validarConfirmacion() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    if (!confirmPassword) {
        confirmPasswordError.textContent = 'Debes confirmar tu contraseña';
        confirmPasswordInput.classList.add('invalid');
        confirmPasswordInput.classList.remove('valid');
        return false;
    } else if (password !== confirmPassword) {
        confirmPasswordError.textContent = 'Las contraseñas no coinciden';
        confirmPasswordInput.classList.add('invalid');
        confirmPasswordInput.classList.remove('valid');
        return false;
    } else {
        confirmPasswordError.textContent = '';
        confirmPasswordInput.classList.remove('invalid');
        confirmPasswordInput.classList.add('valid');
        return true;
    }
}

// Validación en tiempo real de confirmación de contraseña
confirmPasswordInput.addEventListener('input', () => {
    validarConfirmacion();
});

confirmPasswordInput.addEventListener('blur', () => {
    validarConfirmacion();
});

// Limpiar errores cuando el usuario empieza a escribir
nombreCompletoInput.addEventListener('input', () => {
    if (nombreError.textContent) {
        nombreError.textContent = '';
        nombreCompletoInput.classList.remove('invalid');
    }
    mensajeDiv.style.display = 'none';
});

emailInput.addEventListener('input', () => {
    if (emailError.textContent) {
        emailError.textContent = '';
        emailInput.classList.remove('invalid');
    }
    mensajeDiv.style.display = 'none';
});

// Manejo del formulario de registro
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    limpiarErrores();
    mensajeDiv.style.display = 'none';
    
    const nombreCompleto = nombreCompletoInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    // Validación del frontend
    let isValid = true;
    
    if (!nombreCompleto) {
        nombreError.textContent = 'El nombre completo es obligatorio';
        nombreCompletoInput.classList.add('invalid');
        isValid = false;
    } else if (nombreCompleto.length < 3) {
        nombreError.textContent = 'El nombre debe tener al menos 3 caracteres';
        nombreCompletoInput.classList.add('invalid');
        isValid = false;
    }
    
    if (!email) {
        emailError.textContent = 'El correo electrónico es obligatorio';
        emailInput.classList.add('invalid');
        isValid = false;
    } else if (!validarEmail(email)) {
        emailError.textContent = 'Formato de email inválido';
        emailInput.classList.add('invalid');
        isValid = false;
    }
    
    if (!password) {
        passwordError.textContent = 'La contraseña es obligatoria';
        passwordInput.classList.add('invalid');
        isValid = false;
    } else if (!validarPassword(password)) {
        passwordError.textContent = 'La contraseña debe cumplir con todos los requisitos';
        passwordInput.classList.add('invalid');
        isValid = false;
    }
    
    if (!confirmPassword) {
        confirmPasswordError.textContent = 'Debes confirmar tu contraseña';
        confirmPasswordInput.classList.add('invalid');
        isValid = false;
    } else if (password !== confirmPassword) {
        confirmPasswordError.textContent = 'Las contraseñas no coinciden';
        confirmPasswordInput.classList.add('invalid');
        isValid = false;
    }
    
    if (!isValid) {
        mostrarMensaje('⚠️ Por favor corrige los errores antes de continuar', 'error');
        return;
    }
    
    // Activar estado de carga
    setLoading(true);
    
    // Enviar datos al servidor
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombreCompleto, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            mostrarMensaje('✓ ¡Registro exitoso! Redirigiendo al login...', 'exito');
            
            // Limpiar formulario
            registerForm.reset();
            actualizarRequisitos('');
            
            // Redirigir al login después de 2 segundos
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            mostrarMensaje(data.mensaje || 'Error al registrar usuario', 'error');
            setLoading(false);
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('⚠️ Error de conexión con el servidor. Verifica que el servidor esté ejecutándose.', 'error');
        setLoading(false);
    }
});
