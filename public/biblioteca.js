// Variables globales
let libros = [];
let libroEditando = null;
let libroEliminar = null;

// Verificar sesión al cargar
window.addEventListener('DOMContentLoaded', () => {
    verificarSesion();
    cargarLibros();
    configurarEventos();
    
    // Abrir modal si viene desde el botón agregar del dashboard
    if (localStorage.getItem('abrirModalAgregar') === 'true') {
        localStorage.removeItem('abrirModalAgregar');
        setTimeout(() => abrirModalNuevo(), 500);
    }
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
    // Botones del header
    document.getElementById('btnAgregarLibro').addEventListener('click', abrirModalNuevo);
    document.getElementById('btnInicio').addEventListener('click', () => {
        window.location.href = 'dashboard-new.html';
    });
    document.getElementById('btnPerfil').addEventListener('click', () => {
        window.location.href = 'perfil.html';
    });
    document.getElementById('btnCerrarSesion').addEventListener('click', cerrarSesion);
    
    // Modal libro
    document.getElementById('btnCerrarModal').addEventListener('click', cerrarModal);
    document.getElementById('formLibro').addEventListener('submit', guardarLibro);
    
    // Modal eliminar
    document.getElementById('btnCerrarEliminar').addEventListener('click', cerrarModalEliminar);
    document.getElementById('btnCancelarEliminar').addEventListener('click', cerrarModalEliminar);
    document.getElementById('btnConfirmarEliminar').addEventListener('click', confirmarEliminar);
    
    // Filtros y búsqueda
    document.getElementById('inputBuscar').addEventListener('input', aplicarFiltros);
    document.getElementById('filtroGenero').addEventListener('change', aplicarFiltros);
    document.getElementById('ordenarPor').addEventListener('change', aplicarFiltros);
    
    // Cerrar modales al hacer click fuera
    document.getElementById('modalLibro').addEventListener('click', (e) => {
        if (e.target.id === 'modalLibro') cerrarModal();
    });
    
    document.getElementById('modalEliminar').addEventListener('click', (e) => {
        if (e.target.id === 'modalEliminar') cerrarModalEliminar();
    });
}

// Cargar libros desde el servidor
async function cargarLibros() {
    try {
        const genero = document.getElementById('filtroGenero').value;
        const ordenar = document.getElementById('ordenarPor').value;
        const buscar = document.getElementById('inputBuscar').value;
        
        const params = new URLSearchParams();
        if (genero !== 'todos') params.append('genero', genero);
        if (ordenar) params.append('ordenar', ordenar);
        if (buscar) params.append('buscar', buscar);
        
        const response = await fetch(`http://localhost:3000/api/libros?${params}`, {
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
            throw new Error('Error al cargar libros');
        }
        
        const data = await response.json();
        libros = data.libros;
        
        mostrarLibros();
        actualizarEstadisticas();
        
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('Error al cargar la biblioteca', 'error', 'librosContainer');
    }
}

// Mostrar libros en la interfaz
function mostrarLibros() {
    const container = document.getElementById('librosContainer');
    
    if (libros.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📚</div>
                <h3>Tu biblioteca está vacía</h3>
                <p>Comienza agregando tu primer libro</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '<div class="libros-grid"></div>';
    const grid = container.querySelector('.libros-grid');
    
    libros.forEach(libro => {
        const card = crearTarjetaLibro(libro);
        grid.appendChild(card);
    });
}

// Crear tarjeta de libro
function crearTarjetaLibro(libro) {
    const card = document.createElement('div');
    card.className = 'libro-card';
    
    const estrellas = '⭐'.repeat(libro.valoracion);
    
    card.innerHTML = `
        <h3 class="libro-titulo">${escapeHtml(libro.titulo)}</h3>
        <p class="libro-autor">por ${escapeHtml(libro.autor)}</p>
        
        <div class="libro-info">
            <div class="libro-info-item">
                <span class="libro-info-label">Género:</span>
                <span class="libro-genero">${libro.genero}</span>
            </div>
            <div class="libro-info-item">
                <span class="libro-info-label">Año:</span>
                <span class="libro-info-value">${libro.ano_publicacion}</span>
            </div>
            <div class="libro-info-item">
                <span class="libro-info-label">Valoración:</span>
                <span class="libro-valoracion">${estrellas} (${libro.valoracion}/5)</span>
            </div>
        </div>
        
        ${libro.comentario ? `
            <div class="libro-comentario">
                <strong>Comentario:</strong><br>
                ${escapeHtml(libro.comentario)}
            </div>
        ` : ''}
        
        <div class="libro-acciones">
            <button class="btn-small btn-editar" onclick="editarLibro('${libro._id}')">
                ✏️ Editar
            </button>
            <button class="btn-small btn-eliminar" onclick="abrirModalEliminar('${libro._id}')">
                🗑️ Eliminar
            </button>
        </div>
    `;
    
    return card;
}

// Actualizar estadísticas
async function actualizarEstadisticas() {
    try {
        const response = await fetch('http://localhost:3000/api/libros/stats/general', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            document.getElementById('totalLibros').textContent = data.stats.totalLibros;
            
            if (data.stats.librosPorGenero.length > 0) {
                document.getElementById('generoFavorito').textContent = data.stats.librosPorGenero[0]._id;
            } else {
                document.getElementById('generoFavorito').textContent = '-';
            }
        }
    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
    }
}

// Abrir modal para nuevo libro
function abrirModalNuevo() {
    libroEditando = null;
    document.getElementById('modalTitulo').textContent = 'Agregar Libro';
    document.getElementById('formLibro').reset();
    document.getElementById('btnGuardarLibro').textContent = 'Guardar Libro';
    ocultarMensaje('mensajeForm');
    
    // Establecer año actual por defecto
    document.getElementById('inputAno').value = new Date().getFullYear();
    
    document.getElementById('modalLibro').classList.add('active');
}

// Editar libro
function editarLibro(id) {
    const libro = libros.find(l => l._id === id);
    if (!libro) return;
    
    libroEditando = id;
    
    document.getElementById('modalTitulo').textContent = 'Editar Libro';
    document.getElementById('inputTitulo').value = libro.titulo;
    document.getElementById('inputAutor').value = libro.autor;
    document.getElementById('inputGenero').value = libro.genero;
    document.getElementById('inputAno').value = libro.ano_publicacion;
    document.getElementById('inputValoracion').value = libro.valoracion;
    document.getElementById('inputComentario').value = libro.comentario || '';
    document.getElementById('btnGuardarLibro').textContent = 'Actualizar Libro';
    ocultarMensaje('mensajeForm');
    
    document.getElementById('modalLibro').classList.add('active');
}

// Guardar libro (crear o actualizar)
async function guardarLibro(e) {
    e.preventDefault();
    
    const titulo = document.getElementById('inputTitulo').value.trim();
    const autor = document.getElementById('inputAutor').value.trim();
    const genero = document.getElementById('inputGenero').value;
    const ano_publicacion = parseInt(document.getElementById('inputAno').value);
    const valoracion = parseInt(document.getElementById('inputValoracion').value);
    const comentario = document.getElementById('inputComentario').value.trim();
    
    if (!titulo || !autor || !genero || !ano_publicacion || !valoracion) {
        mostrarMensaje('Por favor completa todos los campos obligatorios', 'error', 'mensajeForm');
        return;
    }
    
    const datos = {
        titulo,
        autor,
        genero,
        ano_publicacion,
        valoracion,
        comentario
    };
    
    try {
        const url = libroEditando 
            ? `http://localhost:3000/api/libros/${libroEditando}`
            : 'http://localhost:3000/api/libros';
        
        const method = libroEditando ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(datos)
        });
        
        const data = await response.json();
        
        if (data.success) {
            mostrarMensaje(data.mensaje, 'success', 'mensajeForm');
            setTimeout(() => {
                cerrarModal();
                cargarLibros();
            }, 1500);
        } else {
            mostrarMensaje(data.mensaje, 'error', 'mensajeForm');
        }
        
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('Error al guardar el libro', 'error', 'mensajeForm');
    }
}

// Abrir modal de eliminación
function abrirModalEliminar(id) {
    const libro = libros.find(l => l._id === id);
    if (!libro) return;
    
    libroEliminar = id;
    document.getElementById('libroEliminarNombre').textContent = `"${libro.titulo}" por ${libro.autor}`;
    document.getElementById('modalEliminar').classList.add('active');
}

// Confirmar eliminación
async function confirmarEliminar() {
    if (!libroEliminar) return;
    
    try {
        const response = await fetch(`http://localhost:3000/api/libros/${libroEliminar}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            cerrarModalEliminar();
            cargarLibros();
        } else {
            alert(data.mensaje);
        }
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el libro');
    }
}

// Cerrar modales
function cerrarModal() {
    document.getElementById('modalLibro').classList.remove('active');
    document.getElementById('formLibro').reset();
    libroEditando = null;
}

function cerrarModalEliminar() {
    document.getElementById('modalEliminar').classList.remove('active');
    libroEliminar = null;
}

// Aplicar filtros
function aplicarFiltros() {
    cargarLibros();
}

// Cerrar sesión
function cerrarSesion() {
    localStorage.clear();
    window.location.href = 'login.html';
}

// Función para escapar HTML (prevenir XSS)
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Mostrar mensajes
function mostrarMensaje(texto, tipo, contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    contenedor.textContent = texto;
    contenedor.className = `mensaje mensaje-${tipo}`;
    contenedor.style.display = 'block';
}

function ocultarMensaje(contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    contenedor.style.display = 'none';
}
