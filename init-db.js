// Script de inicialización de base de datos para LibraryBox
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Definir el schema del usuario (igual que en server.js)
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

async function initDatabase() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/auth-app';
        
        console.log('🔄 Conectando a MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Conectado a MongoDB');
        
        // Verificar si ya existe algún usuario
        const usuarioExistente = await User.countDocuments();
        
        if (usuarioExistente > 0) {
            console.log(`ℹ️  Ya existen ${usuarioExistente} usuarios en la base de datos`);
            console.log('✅ Base de datos inicializada correctamente');
            process.exit(0);
        }
        
        console.log('📝 Base de datos vacía. Creando usuario demo...');
        
        // Crear usuario demo
        const salt = await bcrypt.genSalt(10);
        const passwordCifrada = await bcrypt.hash('Demo1234', salt);
        
        const usuarioDemo = new User({
            nombreCompleto: 'Usuario Demo',
            email: 'demo@librarybox.com',
            password: passwordCifrada
        });
        
        await usuarioDemo.save();
        
        console.log('✅ Usuario demo creado:');
        console.log('   Email: demo@librarybox.com');
        console.log('   Contraseña: Demo1234');
        console.log('');
        console.log('ℹ️  También puedes usar el admin:');
        console.log('   Email: admin');
        console.log('   Contraseña: 1234');
        console.log('');
        console.log('✅ Base de datos inicializada correctamente');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error al inicializar la base de datos:', error.message);
        process.exit(1);
    }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
    initDatabase();
}

module.exports = { initDatabase };
