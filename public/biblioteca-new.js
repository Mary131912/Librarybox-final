// Variables globales
let libros = [];
let libroEditando = null;

// Colores para las portadas
const coverColors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)'
];

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
        window.location.href = 'login.html';
        return false;
    }
    
    if (new Date().getTime() > parseInt(expiracion)) {
        localStorage.clear();
        window.location.href = 'login.html';
        return false;
    }
    
    return true;
}

// Configurar eventos
function configurarEventos() {
    document.getElementById('btnAgregarLibro').addEventListener('click', abrirModalNuevo);
    document.getElementById('btnCerrarSesion').addEventListener('click', cerrarSesion);
    document.getElementById('btnCerrarModal').addEventListener('click', cerrarModal);
    document.getElementById('formLibro').addEventListener('submit', guardarLibro);
    
    // Cerrar modal al hacer click fuera
    document.getElementById('modalLibro').addEventListener('click', (e) => {
        if (e.target.id === 'modalLibro') cerrarModal();
    });
}

// Cargar libros desde el servidor
async function cargarLibros() {
    try {
        const response = await fetch('http://localhost:3000/api/libros', {
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
        actualizarCurrentlyReading();
        actualizarGoals();
        
    } catch (error) {
        console.error('Error:', error);
    }
}

// Mostrar libros en la interfaz
function mostrarLibros() {
    const container = document.getElementById('librosGrid');
    const countElement = document.getElementById('booksCount');
    
    countElement.textContent = `${libros.length} Libro${libros.length !== 1 ? 's' : ''}`;
    
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
    
    container.innerHTML = '';
    
    libros.forEach((libro, index) => {
        const card = crearTarjetaLibro(libro, index);
        container.appendChild(card);
    });
}

// Crear tarjeta de libro
function crearTarjetaLibro(libro, index) {
    const card = document.createElement('div');
    card.className = 'libro-card';
    card.onclick = () => editarLibro(libro._id);
    
    const colorIndex = index % coverColors.length;
    const coverColor = coverColors[colorIndex];
    
    // Determinar si hay foto
    const tieneImagen = libro.foto && libro.foto.trim() !== '';
    
    if (tieneImagen) {
        card.innerHTML = `
            <div class="libro-cover" style="background: url('${libro.foto}') center/cover, ${coverColor}; position: relative;">
                <img src="${libro.foto}" 
                     style="width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0; border-radius: 10px;" 
                     onerror="this.style.display='none'; this.parentElement.style.background='${coverColor}'; this.parentElement.innerHTML='<div class=\\'libro-cover-content\\'><div class=\\'libro-cover-title\\'>${truncateText(libro.titulo, 30).replace(/'/g, "\\'")}}</div><div class=\\'libro-cover-author\\'>by ${truncateText(libro.autor, 25).replace(/'/g, "\\'")}}</div></div>';">
            </div>
            <div class="libro-info">
                <div class="libro-titulo">${escapeHtml(libro.titulo)}</div>
                <div class="libro-autor">${escapeHtml(libro.autor)}</div>
            </div>
        `;
    } else {
        card.innerHTML = `
            <div class="libro-cover" style="background: ${coverColor}">
                <div class="libro-cover-content">
                    <div class="libro-cover-title">${truncateText(libro.titulo, 30)}</div>
                    <div class="libro-cover-author">by ${truncateText(libro.autor, 25)}</div>
                </div>
            </div>
            <div class="libro-info">
                <div class="libro-titulo">${escapeHtml(libro.titulo)}</div>
                <div class="libro-autor">${escapeHtml(libro.autor)}</div>
            </div>
        `;
    }
    
    return card;
}

// Actualizar "Currently Reading"
function actualizarCurrentlyReading() {
    const container = document.getElementById('currentlyReading');
    
    // Obtener libros con mejor valoración o los más recientes
    const readingBooks = libros
        .sort((a, b) => b.valoracion - a.valoracion || new Date(b.fechaAgregado) - new Date(a.fechaAgregado))
        .slice(0, 2);
    
    if (readingBooks.length === 0) {
        container.innerHTML = '<p style="color: #8b92a7; font-size: 0.85rem;">No hay libros en lectura</p>';
        return;
    }
    
    container.innerHTML = '';
    
    readingBooks.forEach((libro, index) => {
        const progress = libro.valoracion * 20; // Simular progreso basado en valoración
        const circumference = 2 * Math.PI * 31.25; // radio 31.25
        const offset = circumference - (progress / 100) * circumference;
        
        const colorIndex = libros.indexOf(libro) % coverColors.length;
        const coverColor = coverColors[colorIndex];
        const tieneImagen = libro.foto && libro.foto.trim() !== '';
        
        const card = document.createElement('div');
        card.className = 'reading-card';
        card.onclick = () => editarLibro(libro._id);
        
        const coverStyle = tieneImagen 
            ? `background: url('${libro.foto}') center/cover, ${coverColor}; background-size: cover;`
            : `background: ${coverColor}`;
        
        const coverContent = tieneImagen
            ? `<img src="${libro.foto}" style="width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0; border-radius: 12px;" onerror="this.style.display='none';">`
            : `<div class="reading-cover-content">
                    <div class="reading-cover-title">${truncateText(libro.titulo, 25)}</div>
                    <div class="reading-cover-author">by ${truncateText(libro.autor, 20)}</div>
                </div>`;
        
        card.innerHTML = `
            <div class="reading-cover" style="${coverStyle}; position: relative;">
                ${coverContent}
                <div class="progress-overlay">
                    <div class="progress-circle">
                        <svg width="70" height="70" class="progress-ring">
                            <circle class="progress-ring-circle" cx="35" cy="35" r="31.25"></circle>
                            <circle class="progress-ring-circle-fill" cx="35" cy="35" r="31.25" 
                                    style="stroke-dashoffset: ${offset}"></circle>
                        </svg>
                        <div class="progress-value">${progress}%</div>
                    </div>
                </div>
            </div>
            <div class="reading-info">
                <h4>${escapeHtml(libro.titulo)}</h4>
                <p>${escapeHtml(libro.autor)}</p>
                <p class="reading-progress-label">${'⭐'.repeat(libro.valoracion)}</p>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// Actualizar metas de lectura
function actualizarGoals() {
    const totalLibros = libros.length;
    const meta = 50;
    const porcentaje = Math.min((totalLibros / meta) * 100, 100);
    
    document.getElementById('goalNumber').textContent = `${totalLibros}/${meta}`;
    document.getElementById('goalProgressBar').style.width = `${porcentaje}%`;
    
    let goalText = 'Keep reading!';
    if (porcentaje >= 100) {
        goalText = '🎉 ¡Meta alcanzada!';
    } else if (porcentaje >= 75) {
        goalText = '¡Casi lo logras!';
    } else if (porcentaje >= 50) {
        goalText = '¡Vas por buen camino!';
    }
    
    document.getElementById('goalText').textContent = goalText;
}

// Abrir modal para nuevo libro
function abrirModalNuevo() {
    libroEditando = null;
    document.getElementById('modalTitulo').textContent = 'Agregar Libro';
    document.getElementById('formLibro').reset();
    document.getElementById('btnGuardarLibro').textContent = 'Guardar Libro';
    ocultarMensaje('mensajeForm');
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
    
    const datos = { titulo, autor, genero, ano_publicacion, valoracion, comentario };
    
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

// Cerrar modal
function cerrarModal() {
    document.getElementById('modalLibro').classList.remove('active');
    document.getElementById('formLibro').reset();
    libroEditando = null;
}

// Cerrar sesión
function cerrarSesion() {
    localStorage.clear();
    window.location.href = 'login.html';
}

// Utilidades
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

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
