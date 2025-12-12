const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware con límite aumentado para imágenes
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());
app.use(express.static('public'));

// Configuración de seguridad adicional
app.disable('x-powered-by');

// Conexión a MongoDB (sin opciones deprecadas)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/auth-app';

mongoose.connect(MONGODB_URI)
.then(() => {
    console.log('✅ Conectado exitosamente a MongoDB');
    console.log(`📊 Base de datos: ${mongoose.connection.name}`);
})
.catch(err => {
    console.error('❌ Error de conexión a MongoDB:', err.message);
    console.log('💡 Asegúrate de que MongoDB esté ejecutándose o configura MongoDB Atlas en el archivo .env');
});

// Modelo de Usuario Mejorado
const userSchema = new mongoose.Schema({
    nombreCompleto: {
        type: String,
        required: [true, 'El nombre completo es obligatorio'],
        trim: true,
        minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
        maxlength: [100, 'El nombre no puede exceder 100 caracteres']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Por favor ingresa un email válido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        minlength: [8, 'La contraseña debe tener al menos 8 caracteres']
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    },
    ultimoAcceso: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

// Modelo de Libro
const libroSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El usuario es obligatorio'],
        index: true
    },
    titulo: {
        type: String,
        required: [true, 'El título es obligatorio'],
        trim: true,
        maxlength: [200, 'El título no puede exceder 200 caracteres']
    },
    autor: {
        type: String,
        required: false,
        trim: true,
        maxlength: [100, 'El autor no puede exceder 100 caracteres'],
        default: ''
    },
    genero: {
        type: String,
        required: false,
        trim: true,
        default: 'Otro'
    },
    ano_publicacion: {
        type: Number,
        required: false,
        min: [1000, 'Año inválido'],
        max: [new Date().getFullYear(), 'El año no puede ser futuro']
    },
    valoracion: {
        type: Number,
        required: false,
        min: [1, 'La valoración mínima es 1'],
        max: [5, 'La valoración máxima es 5'],
        default: 3
    },
    comentario: {
        type: String,
        trim: true,
        maxlength: [1000, 'El comentario no puede exceder 1000 caracteres'],
        default: ''
    },
    foto: {
        type: String,
        default: null
    },
    resumen: {
        type: String,
        trim: true,
        maxlength: [2000, 'El resumen no puede exceder 2000 caracteres'],
        default: ''
    },
    fechaAgregado: {
        type: Date,
        default: Date.now
    },
    fechaModificado: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Índices para búsquedas y filtros
libroSchema.index({ userId: 1, titulo: 1 });
libroSchema.index({ userId: 1, genero: 1 });
libroSchema.index({ userId: 1, valoracion: -1 });

const Libro = mongoose.model('Libro', libroSchema);

// Middleware mejorado para verificar token JWT
const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(403).json({ 
            success: false,
            mensaje: 'Acceso denegado. Token no proporcionado' 
        });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto_super_seguro_cambiar_en_produccion');
        req.userId = decoded.id;
        req.userEmail = decoded.email;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false,
                mensaje: 'Token expirado. Por favor, inicia sesión nuevamente' 
            });
        }
        return res.status(401).json({ 
            success: false,
            mensaje: 'Token inválido' 
        });
    }
};

// Middleware para validar datos de entrada
const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const validarPassword = (password) => {
    // Mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
};

// RUTAS

// Ruta principal - Servir login.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Registro de usuario mejorado
app.post('/api/register', async (req, res) => {
    try {
        const { nombreCompleto, email, password } = req.body;
        
        // Validación de campos obligatorios
        if (!nombreCompleto || !email || !password) {
            return res.status(400).json({ 
                success: false,
                mensaje: 'Todos los campos son obligatorios',
                campos: {
                    nombreCompleto: !nombreCompleto ? 'El nombre completo es requerido' : null,
                    email: !email ? 'El email es requerido' : null,
                    password: !password ? 'La contraseña es requerida' : null
                }
            });
        }
        
        // Validar longitud del nombre
        if (nombreCompleto.trim().length < 3) {
            return res.status(400).json({ 
                success: false,
                mensaje: 'El nombre completo debe tener al menos 3 caracteres' 
            });
        }
        
        // Validar formato de email
        if (!validarEmail(email)) {
            return res.status(400).json({ 
                success: false,
                mensaje: 'Formato de email inválido' 
            });
        }
        
        // Validar requisitos de contraseña
        if (!validarPassword(password)) {
            return res.status(400).json({ 
                success: false,
                mensaje: 'La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula y un número' 
            });
        }
        
        // Verificar si el usuario ya existe
        const usuarioExistente = await User.findOne({ email: email.toLowerCase() });
        if (usuarioExistente) {
            return res.status(409).json({ 
                success: false,
                mensaje: 'Este email ya está registrado. Por favor, inicia sesión o usa otro email' 
            });
        }
        
        // Cifrar contraseña con bcrypt (10 rounds de salt)
        const salt = await bcrypt.genSalt(10);
        const passwordCifrada = await bcrypt.hash(password, salt);
        
        // Crear nuevo usuario
        const nuevoUsuario = new User({
            nombreCompleto: nombreCompleto.trim(),
            email: email.toLowerCase(),
            password: passwordCifrada
        });
        
        await nuevoUsuario.save();
        
        console.log(`✅ Nuevo usuario registrado: ${email}`);
        
        res.status(201).json({ 
            success: true,
            mensaje: 'Usuario registrado exitosamente. Ahora puedes iniciar sesión',
            usuario: {
                nombreCompleto: nuevoUsuario.nombreCompleto,
                email: nuevoUsuario.email
            }
        });
    } catch (error) {
        console.error('❌ Error en registro:', error);
        
        // Manejar errores de validación de Mongoose
        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                success: false,
                mensaje: 'Error de validación',
                errores 
            });
        }
        
        res.status(500).json({ 
            success: false,
            mensaje: 'Error en el servidor. Por favor, intenta nuevamente' 
        });
    }
});

// Login mejorado
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validación de campos obligatorios
        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                mensaje: 'Email y contraseña son obligatorios',
                campos: {
                    email: !email ? 'El email es requerido' : null,
                    password: !password ? 'La contraseña es requerida' : null
                }
            });
        }
        
        // 🔑 ACCESO ESPECIAL ADMIN
        if (email.toLowerCase() === 'admin' && password === '1234') {
            
            // Generar token especial para admin
            const adminToken = jwt.sign(
                { 
                    id: 'admin-special',
                    email: 'admin',
                    nombreCompleto: 'Administrador',
                    isAdmin: true
                },
                process.env.JWT_SECRET || 'secreto_super_seguro_cambiar_en_produccion',
                { expiresIn: '24h' } // Admin tiene sesión de 24 horas
            );
            
            console.log('👑 Acceso de administrador');
            
            return res.json({
                success: true,
                mensaje: 'Login exitoso como administrador',
                token: adminToken,
                usuario: {
                    id: 'admin-special',
                    nombreCompleto: '👑 Administrador',
                    email: 'admin',
                    isAdmin: true,
                    fechaCreacion: new Date()
                }
            });
        }
        
        // Validar formato de email para usuarios normales
        if (!validarEmail(email)) {
            return res.status(400).json({ 
                success: false,
                mensaje: 'Formato de email inválido' 
            });
        }
        
        // Buscar usuario por email
        const usuario = await User.findOne({ email: email.toLowerCase() });
        if (!usuario) {
            return res.status(401).json({ 
                success: false,
                mensaje: 'Email o contraseña incorrectos' 
            });
        }
        
        // Verificar contraseña con bcrypt
        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) {
            return res.status(401).json({ 
                success: false,
                mensaje: 'Email o contraseña incorrectos' 
            });
        }
        
        // Actualizar último acceso
        usuario.ultimoAcceso = new Date();
        await usuario.save();
        
        // Generar token JWT (expira en 30 minutos)
        const token = jwt.sign(
            { 
                id: usuario._id, 
                email: usuario.email,
                nombreCompleto: usuario.nombreCompleto
            },
            process.env.JWT_SECRET || 'secreto_super_seguro_cambiar_en_produccion',
            { expiresIn: '30m' }
        );
        
        console.log(`✅ Usuario autenticado: ${email}`);
        
        res.json({
            success: true,
            mensaje: 'Login exitoso',
            token,
            usuario: {
                id: usuario._id,
                nombreCompleto: usuario.nombreCompleto,
                email: usuario.email,
                fechaCreacion: usuario.fechaCreacion
            }
        });
    } catch (error) {
        console.error('❌ Error en login:', error);
        res.status(500).json({ 
            success: false,
            mensaje: 'Error en el servidor. Por favor, intenta nuevamente' 
        });
    }
});

// Ruta protegida - Obtener perfil del usuario
app.get('/api/profile', verificarToken, async (req, res) => {
    try {
        // Verificar si es el admin especial
        if (req.userId === 'admin-special') {
            return res.json({ 
                success: true,
                usuario: {
                    id: 'admin-special',
                    nombreCompleto: 'Administrador',
                    email: 'admin',
                    fechaCreacion: new Date(),
                    ultimoAcceso: new Date(),
                    isAdmin: true
                }
            });
        }

        const usuario = await User.findById(req.userId).select('-password');
        
        if (!usuario) {
            return res.status(404).json({ 
                success: false,
                mensaje: 'Usuario no encontrado' 
            });
        }
        
        res.json({ 
            success: true,
            usuario: {
                id: usuario._id,
                nombreCompleto: usuario.nombreCompleto,
                email: usuario.email,
                fechaCreacion: usuario.fechaCreacion,
                ultimoAcceso: usuario.ultimoAcceso
            }
        });
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({ 
            success: false,
            mensaje: 'Error al obtener datos del usuario' 
        });
    }
});

// Alias para obtener usuario
app.get('/api/usuario', verificarToken, async (req, res) => {
    try {
        // Verificar si es el admin especial
        if (req.userId === 'admin-special') {
            return res.json({ 
                success: true,
                usuario: {
                    id: 'admin-special',
                    nombreCompleto: 'Administrador',
                    email: 'admin',
                    fechaCreacion: new Date(),
                    ultimoAcceso: new Date(),
                    isAdmin: true
                }
            });
        }

        const usuario = await User.findById(req.userId).select('-password');
        
        if (!usuario) {
            return res.status(404).json({ 
                success: false,
                mensaje: 'Usuario no encontrado' 
            });
        }
        
        res.json({ 
            success: true,
            usuario: {
                id: usuario._id,
                nombreCompleto: usuario.nombreCompleto,
                email: usuario.email,
                fechaCreacion: usuario.fechaCreacion,
                ultimoAcceso: usuario.ultimoAcceso
            }
        });
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({ 
            success: false,
            mensaje: 'Error al obtener datos del usuario' 
        });
    }
});

// Ruta protegida - Dashboard (página principal)
app.get('/api/dashboard', verificarToken, async (req, res) => {
    try {
        const usuario = await User.findById(req.userId).select('-password');
        
        if (!usuario) {
            return res.status(404).json({ 
                success: false,
                mensaje: 'Usuario no encontrado' 
            });
        }
        
        res.json({ 
            success: true,
            mensaje: `Bienvenido/a, ${usuario.nombreCompleto}`,
            usuario: {
                nombreCompleto: usuario.nombreCompleto,
                email: usuario.email,
                miembroDesde: usuario.fechaCreacion,
                ultimoAcceso: usuario.ultimoAcceso
            }
        });
    } catch (error) {
        console.error('Error en dashboard:', error);
        res.status(500).json({ 
            success: false,
            mensaje: 'Error al obtener datos del dashboard' 
        });
    }
});

// Logout (invalidación del token en el cliente)
app.post('/api/logout', verificarToken, (req, res) => {
    console.log(`🔒 Usuario cerró sesión: ${req.userEmail}`);
    res.json({ 
        success: true,
        mensaje: 'Sesión cerrada exitosamente' 
    });
});

// Ruta para verificar si el token es válido
app.get('/api/verify-token', verificarToken, (req, res) => {
    res.json({ 
        success: true,
        mensaje: 'Token válido',
        userId: req.userId
    });
});

// RUTA DE PRUEBA: Ver todos los usuarios (SIN CONTRASEÑAS)
app.get('/api/admin/users', async (req, res) => {
    try {
        const usuarios = await User.find().select('-password').sort({ fechaCreacion: -1 });
        res.json({
            success: true,
            total: usuarios.length,
            usuarios: usuarios
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            mensaje: 'Error al obtener usuarios' 
        });
    }
});

// ==================== RUTAS DE GESTIÓN DE LIBROS ====================

// Obtener todos los libros del usuario (con filtros y ordenamiento)
app.get('/api/libros', verificarToken, async (req, res) => {
    try {
        const { genero, ordenar, buscar } = req.query;
        
        // Construir filtro
        // Si es admin, mostrar todos los libros; si no, solo los del usuario
        let filtro = {};
        if (req.userId !== 'admin-special') {
            filtro.userId = req.userId;
        }
        
        // Filtrar por género
        if (genero && genero !== 'todos') {
            filtro.genero = genero;
        }
        
        // Búsqueda por título, autor o género
        if (buscar) {
            filtro.$or = [
                { titulo: { $regex: buscar, $options: 'i' } },
                { autor: { $regex: buscar, $options: 'i' } },
                { genero: { $regex: buscar, $options: 'i' } }
            ];
        }
        
        // Construir ordenamiento
        let orden = {};
        switch (ordenar) {
            case 'titulo':
                orden = { titulo: 1 };
                break;
            case 'autor':
                orden = { autor: 1 };
                break;
            case 'ano':
                orden = { ano_publicacion: -1 };
                break;
            case 'valoracion':
                orden = { valoracion: -1 };
                break;
            default:
                orden = { fechaAgregado: -1 };
        }
        
        const libros = await Libro.find(filtro).sort(orden);
        
        res.json({
            success: true,
            total: libros.length,
            libros: libros
        });
    } catch (error) {
        console.error('Error al obtener libros:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener los libros'
        });
    }
});

// Obtener un libro específico
app.get('/api/libros/:id', verificarToken, async (req, res) => {
    try {
        const libro = await Libro.findOne({
            _id: req.params.id,
            userId: req.userId
        });
        
        if (!libro) {
            return res.status(404).json({
                success: false,
                mensaje: 'Libro no encontrado'
            });
        }
        
        res.json({
            success: true,
            libro: libro
        });
    } catch (error) {
        console.error('Error al obtener libro:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener el libro'
        });
    }
});

// Agregar un nuevo libro
app.post('/api/libros', verificarToken, async (req, res) => {
    try {
        const { titulo, autor, genero, ano_publicacion, valoracion, comentario, foto, resumen } = req.body;
        
        // Validaciones - solo título es obligatorio
        if (!titulo || titulo.trim() === '') {
            return res.status(400).json({
                success: false,
                mensaje: 'El título es obligatorio'
            });
        }
        
        // Validar año si está presente
        if (ano_publicacion) {
            const anoActual = new Date().getFullYear();
            if (ano_publicacion < 1000 || ano_publicacion > anoActual) {
                return res.status(400).json({
                    success: false,
                    mensaje: `El año debe estar entre 1000 y ${anoActual}`
                });
            }
        }
        
        // Validar valoración si está presente
        if (valoracion && (valoracion < 1 || valoracion > 5)) {
            return res.status(400).json({
                success: false,
                mensaje: 'La valoración debe estar entre 1 y 5'
            });
        }
        
        // Crear nuevo libro
        const nuevoLibro = new Libro({
            userId: req.userId,
            titulo: titulo.trim(),
            autor: autor ? autor.trim() : '',
            genero: genero || 'Otro',
            ano_publicacion: ano_publicacion || null,
            valoracion: valoracion || 3,
            comentario: comentario ? comentario.trim() : '',
            foto: foto || null,
            resumen: resumen ? resumen.trim() : ''
        });
        
        await nuevoLibro.save();
        
        console.log(`✅ Libro agregado: "${titulo}" por ${req.userEmail}`);
        
        res.status(201).json({
            success: true,
            mensaje: 'Libro agregado exitosamente',
            libro: nuevoLibro
        });
    } catch (error) {
        console.error('Error al agregar libro:', error);
        
        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                mensaje: 'Error de validación',
                errores
            });
        }
        
        res.status(500).json({
            success: false,
            mensaje: 'Error al agregar el libro'
        });
    }
});

// Editar un libro existente
app.put('/api/libros/:id', verificarToken, async (req, res) => {
    try {
        const { titulo, autor, genero, ano_publicacion, valoracion, comentario } = req.body;
        
        // Buscar libro
        const libro = await Libro.findOne({
            _id: req.params.id,
            userId: req.userId
        });
        
        if (!libro) {
            return res.status(404).json({
                success: false,
                mensaje: 'Libro no encontrado'
            });
        }
        
        // Validaciones
        if (ano_publicacion) {
            const anoActual = new Date().getFullYear();
            if (ano_publicacion < 1000 || ano_publicacion > anoActual) {
                return res.status(400).json({
                    success: false,
                    mensaje: `El año debe estar entre 1000 y ${anoActual}`
                });
            }
        }
        
        if (valoracion && (valoracion < 1 || valoracion > 5)) {
            return res.status(400).json({
                success: false,
                mensaje: 'La valoración debe estar entre 1 y 5'
            });
        }
        
        // Actualizar campos
        if (titulo) libro.titulo = titulo.trim();
        if (autor) libro.autor = autor.trim();
        if (genero) libro.genero = genero;
        if (ano_publicacion) libro.ano_publicacion = ano_publicacion;
        if (valoracion) libro.valoracion = valoracion;
        if (comentario !== undefined) libro.comentario = comentario.trim();
        libro.fechaModificado = new Date();
        
        await libro.save();
        
        console.log(`📝 Libro editado: "${libro.titulo}" por ${req.userEmail}`);
        
        res.json({
            success: true,
            mensaje: 'Libro actualizado exitosamente',
            libro: libro
        });
    } catch (error) {
        console.error('Error al editar libro:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al actualizar el libro'
        });
    }
});

// Eliminar un libro
app.delete('/api/libros/:id', verificarToken, async (req, res) => {
    try {
        const libro = await Libro.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });
        
        if (!libro) {
            return res.status(404).json({
                success: false,
                mensaje: 'Libro no encontrado'
            });
        }
        
        console.log(`🗑️ Libro eliminado: "${libro.titulo}" por ${req.userEmail}`);
        
        res.json({
            success: true,
            mensaje: 'Libro eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar libro:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al eliminar el libro'
        });
    }
});

// Obtener estadísticas de la biblioteca
app.get('/api/libros/stats/general', verificarToken, async (req, res) => {
    try {
        // Filtro: admin ve todos, usuarios normales solo sus libros
        const filtro = req.userId === 'admin-special' ? {} : { userId: req.userId };
        const filtroObjectId = req.userId === 'admin-special' 
            ? {} 
            : { userId: new mongoose.Types.ObjectId(req.userId) };
        
        const totalLibros = await Libro.countDocuments(filtro);
        
        const librosMejorValorados = await Libro.find(filtro)
            .sort({ valoracion: -1, titulo: 1 })
            .limit(5);
        
        const librosPorGenero = await Libro.aggregate([
            { $match: filtroObjectId },
            { $group: { _id: '$genero', cantidad: { $sum: 1 } } },
            { $sort: { cantidad: -1 } }
        ]);
        
        res.json({
            success: true,
            stats: {
                totalLibros,
                librosMejorValorados,
                librosPorGenero
            }
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener estadísticas'
        });
    }
});

// Cambiar contraseña del usuario
app.put('/api/profile/password', verificarToken, async (req, res) => {
    try {
        const { passwordActual, passwordNueva } = req.body;
        
        if (!passwordActual || !passwordNueva) {
            return res.status(400).json({
                success: false,
                mensaje: 'Debes proporcionar la contraseña actual y la nueva'
            });
        }
        
        // Validar nueva contraseña
        if (!validarPassword(passwordNueva)) {
            return res.status(400).json({
                success: false,
                mensaje: 'La nueva contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula y un número'
            });
        }
        
        // Buscar usuario
        const usuario = await User.findById(req.userId);
        
        // Verificar contraseña actual
        const passwordValida = await bcrypt.compare(passwordActual, usuario.password);
        if (!passwordValida) {
            return res.status(401).json({
                success: false,
                mensaje: 'La contraseña actual es incorrecta'
            });
        }
        
        // Cifrar nueva contraseña
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(passwordNueva, salt);
        await usuario.save();
        
        console.log(`🔐 Contraseña cambiada: ${req.userEmail}`);
        
        res.json({
            success: true,
            mensaje: 'Contraseña actualizada exitosamente'
        });
    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al cambiar la contraseña'
        });
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
