// Verificar sesión al cargar
window.addEventListener('DOMContentLoaded', () => {
    console.log('📱 Dashboard cargado, verificando sesión...');
    
    if (!verificarSesion()) {
        console.log('❌ Sesión inválida, no se cargará el dashboard');
        return;
    }
    
    console.log('✅ Sesión válida, cargando dashboard...');
    cargarDatosUsuario();
    cargarEstadisticas();
    mostrarFechaActual();
    configurarEventos();
});

// Verificar sesión
function verificarSesion() {
    const token = localStorage.getItem('token');
    const expiracion = localStorage.getItem('tokenExpiracion');
    
    if (!token || !expiracion) {
        console.log('No hay token o expiración');
        window.location.href = 'login.html';
        return false;
    }
    
    if (new Date().getTime() > parseInt(expiracion)) {
        console.log('Token expirado');
        localStorage.clear();
        window.location.href = 'login.html';
        return false;
    }
    
    return true;
}

// Configurar eventos
function configurarEventos() {
    document.getElementById('btnCerrarSesion').addEventListener('click', cerrarSesion);
}

// Mostrar fecha actual
function mostrarFechaActual() {
    const opciones = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const fecha = new Date().toLocaleDateString('es-ES', opciones);
    document.getElementById('currentDate').textContent = fecha;
}

// Cargar datos del usuario
async function cargarDatosUsuario() {
    console.log('👤 Cargando datos del usuario...');
    try {
        const response = await fetch('http://localhost:3000/api/profile', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        console.log('📡 Respuesta del servidor:', response.status);
        
        if (!response.ok) {
            if (response.status === 401) {
                console.log('❌ No autorizado, limpiando sesión');
                localStorage.clear();
                window.location.href = 'login.html';
                return;
            }
            throw new Error('Error al cargar datos');
        }
        
        const data = await response.json();
        const usuario = data.usuario;
        
        console.log('✅ Usuario cargado:', usuario.nombreCompleto);
        
        // Verificar si es administrador
        const esAdmin = usuario.isAdmin || usuario.id === 'admin-special';
        const nombreMostrar = esAdmin ? 'Administrador' : usuario.nombreCompleto;
        const emailMostrar = esAdmin ? 'admin' : usuario.email;
        const saludo = esAdmin ? 'Administrador' : usuario.nombreCompleto.split(' ')[0];
        
        // Actualizar información del usuario
        document.getElementById('userName').textContent = nombreMostrar;
        document.getElementById('userEmail').textContent = emailMostrar;
        document.getElementById('welcomeMessage').textContent = `¡Hola, ${saludo}! 👋`;
        
        // Actualizar avatar con inicial
        const inicial = esAdmin ? '👑' : usuario.nombreCompleto.charAt(0).toUpperCase();
        document.getElementById('userAvatar').textContent = inicial;
        
    } catch (error) {
        console.error('Error:', error);
    }
}

// Cargar estadísticas
async function cargarEstadisticas() {
    try {
        // Cargar libros
        const responseLibros = await fetch('http://localhost:3000/api/libros', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (responseLibros.ok) {
            const dataLibros = await responseLibros.json();
            const libros = dataLibros.libros;
            
            // Total de libros
            document.getElementById('totalLibros').textContent = libros.length;
            
            // Géneros únicos
            const generosUnicos = [...new Set(libros.map(libro => libro.genero))];
            document.getElementById('generosFavoritos').textContent = generosUnicos.length;
            
            // Promedio de valoración
            if (libros.length > 0) {
                const promedio = libros.reduce((sum, libro) => sum + libro.valoracion, 0) / libros.length;
                document.getElementById('promedioValoracion').textContent = promedio.toFixed(1);
            }
        }
        
        // Cargar estadísticas generales
        const responseStats = await fetch('http://localhost:3000/api/libros/stats/general', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (responseStats.ok) {
            const dataStats = await responseStats.json();
            // Aquí puedes agregar más estadísticas si lo deseas
        }
        
    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
    }
}

// Navegación
function irABiblioteca() {
    window.location.href = 'biblioteca-new.html';
}

function irAAgregarLibro() {
    // Redirigir a biblioteca con parámetro para abrir modal
    localStorage.setItem('abrirModalAgregar', 'true');
    window.location.href = 'biblioteca-new.html';
}

function irAPerfil() {
    window.location.href = 'perfil.html';
}

// Cerrar sesión
async function cerrarSesion() {
    const token = localStorage.getItem('token');
    
    try {
        await fetch('http://localhost:3000/api/logout', {
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
    window.location.href = 'login.html';
}
