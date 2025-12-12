# 📚 LibraryBox - Sistema de Gestión de Biblioteca Personal

Sistema web profesional de gestión de biblioteca personal con **Node.js**, **Express**, **MongoDB Atlas** y **JWT**. Incluye autenticación completa, gestión de libros con fotos, estadísticas de lectura y diseño moderno minimalista.

![LibraryBox](https://img.shields.io/badge/version-1.0.0-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🐳 Inicio Rápido con Docker

```bash
docker run -d -p 3000:3000 \
  -e MONGODB_URI="tu_connection_string_de_mongodb" \
  -e JWT_SECRET="tu_secreto_jwt" \
  --name librarybox \
  mary1913/librarybox:latest
```

📖 **[Guía completa de instalación con Docker →](COMO_USAR_DOCKER.md)**

**Acceso admin:** Usuario: `admin` | Contraseña: `1234`

## ✨ Características Principales

### 🎯 Funcionalidades Implementadas

- ✅ **Sistema de Autenticación Completo**
  - Registro de usuarios con validación de email
  - Login seguro con JWT (tokens de 30 minutos / admin 24 horas)
  - Acceso especial de administrador (admin/1234)
  - Cambio de contraseña
  - Cifrado con bcrypt (10 rounds)
  - Protección de rutas con middleware
  - Validación visual de campos (rojo para errores)

- ✅ **Gestión de Biblioteca Personal**
  - Agregar libros con foto (base64, hasta 50MB)
  - Solo título obligatorio, resto opcional
  - Campos: título, autor, género, año, valoración (1-5), resumen, foto
  - Editar y eliminar libros
  - Búsqueda y filtrado
  - Vista de tarjetas con portadas
  - Fallback a gradientes si no hay imagen

- ✅ **Estadísticas de Lectura**
  - Total de libros en colección
  - Valoración promedio
  - Géneros y autores únicos
  - Top 5 libros mejor valorados
  - Géneros más leídos
  - Autores favoritos
  - Visualización de datos en tiempo real

- ✅ **Perfil de Usuario**
  - Información personal
  - Fecha de registro
  - Cambio de contraseña seguro
  - Historial de última sesión
  - Avatar con inicial o corona (admin)

- ✅ **Diseño Moderno Minimalista**
  - Tema oscuro con gradientes neón (Cyan, Rosa, Púrpura)
  - Glassmorphism y efectos visuales
  - Animaciones suaves (shake en errores)
  - Diseño responsive (móvil y desktop)
  - Iconos descriptivos
  - Logo fuera del contenedor de autenticación

- ✅ **Base de Datos MongoDB Atlas**
  - Esquemas Mongoose optimizados
  - Índices para búsquedas rápidas
  - Validaciones a nivel de esquema
  - Timestamps automáticos

- ✅ **Seguridad**
  - Contraseñas cifradas con bcrypt
  - Tokens JWT firmados con expiración
  - Variables de entorno para datos sensibles
  - Validación frontend y backend
  - Protección contra inyecciones
  - Payload limit de 50MB para imágenes

- ✅ **Dockerización Completa**
  - Dockerfile optimizado con Node.js 18 Alpine
  - Docker Compose para orquestación
  - Soporte MongoDB Atlas
  - Variables de entorno configurables
  - Documentación completa de despliegue
  - Helper script de PowerShell incluido

## 🚀 Inicio Rápido

### Opción 1: Con Docker (Recomendado) 🐳

**Prerrequisitos:**
- Docker Desktop instalado ([Descargar](https://www.docker.com/products/docker-desktop))
- Cuenta MongoDB Atlas (gratis)

**Pasos:**

1. **Clonar el repositorio:**
```bash
git clone https://github.com/TU-USUARIO/librarybox.git
cd librarybox
```

2. **Configurar variables de entorno:**
```bash
copy .env.docker.example .env
# Edita .env con tus credenciales de MongoDB Atlas
```

3. **Iniciar con Docker Compose:**
```bash
docker-compose up -d
```

O usando el helper de PowerShell:
```powershell
.\docker-helper.ps1 start
```

4. **Acceder a la aplicación:**
```
http://localhost:3000/login.html
```

**Credenciales de Admin:**
- Usuario: `admin`
- Contraseña: `1234`

**Ver documentación completa:** [DOCKER_DEPLOY.md](DOCKER_DEPLOY.md) | [Inicio Rápido](DOCKER_QUICKSTART.md)

---

### Opción 2: Sin Docker (Tradicional) 💻

**Prerrequisitos:**
- **Node.js** (v14 o superior) - [Descargar](https://nodejs.org/)
- **MongoDB Atlas** (gratis) - Ver instrucciones abajo

**Pasos:**

1. **Instalar dependencias:**

```bash
cd auth-app
npm install
```

2. **Configurar MongoDB Atlas:**

   a. Regístrate en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
   
   b. Crea un cluster gratuito (M0)
   
   c. Configura acceso:
      - Database Access: Crea usuario (ej: `admin` / `Password123`)
      - Network Access: Añade tu IP o `0.0.0.0/0`
   
   d. Obtén connection string (Connect → Connect your application)
   
   e. Crea archivo `.env`:

```env
MONGODB_URI=mongodb+srv://admin:Password123@cluster0.xxxxx.mongodb.net/auth-app?retryWrites=true&w=majority
JWT_SECRET=tu_secreto_super_seguro_cambiar_en_produccion
PORT=3000
```

3. **Iniciar el servidor:**

```bash
npm start
```

4. **Abrir en el navegador:**

```
http://localhost:3000/login.html
```

## 📁 Estructura del Proyecto

```
auth-app/
│
├── public/                      # Frontend
│   ├── login.html              # Página de login con tema LIBRIFY
│   ├── register.html           # Página de registro
│   ├── dashboard-new.html      # Dashboard principal
│   ├── biblioteca-new.html     # Vista de biblioteca
│   ├── agregar-libro.html      # Formulario para agregar libros
│   ├── estadisticas.html       # Estadísticas de lectura
│   ├── perfil-new.html         # Perfil de usuario
│   ├── styles-new.css          # Estilos Neon Dark
│   └── [otros archivos JS]    # Lógica de cada página
│
├── server.js                   # Servidor Express y API
├── package.json                # Dependencias del proyecto
├── Dockerfile                  # Configuración de Docker
├── docker-compose.yml          # Orquestación de contenedores
├── .dockerignore              # Archivos excluidos de Docker
├── .env                       # Variables de entorno (no subir a Git)
├── .env.docker.example        # Ejemplo de variables para Docker
├── .gitignore                 # Archivos ignorados por Git
├── README.md                  # Este archivo
├── DOCKER_SETUP.md            # Guía completa de Docker
├── MONGODB_SETUP.md           # Guía de configuración MongoDB
├── GUIA_USUARIO.md            # Manual de usuario
└── CHECKLIST_REQUERIMIENTOS.md # Análisis de requerimientos
```

## 🔐 Requisitos de Seguridad

### Contraseñas

Las contraseñas deben cumplir:

- ✅ Mínimo 8 caracteres
- ✅ Al menos una letra mayúscula (A-Z)
- ✅ Al menos una letra minúscula (a-z)
- ✅ Al menos un número (0-9)

**Ejemplos válidos:** `Password123`, `MiClave2024`, `Segura99`

### Tokens JWT

- Expiración: 30 minutos
- Renovación automática con actividad
- Almacenamiento en localStorage
- Verificación en cada solicitud protegida

## 🌐 API Endpoints

### Autenticación

#### POST `/api/register`
Registra un nuevo usuario.

**Body:**
```json
{
  "nombreCompleto": "Juan Pérez García",
  "email": "juan@ejemplo.com",
  "password": "Password123"
}
```

**Response exitoso:**
```json
{
  "success": true,
  "mensaje": "Usuario registrado exitosamente",
  "usuario": {
    "nombreCompleto": "Juan Pérez García",
    "email": "juan@ejemplo.com"
  }
}
```

#### POST `/api/login`
Inicia sesión y devuelve un token JWT.

**Body:**
```json
{
  "email": "juan@ejemplo.com",
  "password": "Password123"
}
```

**Response exitoso:**
```json
{
  "success": true,
  "mensaje": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "abc123",
    "nombreCompleto": "Juan Pérez García",
    "email": "juan@ejemplo.com"
  }
}
```

### Rutas Protegidas (Requieren JWT)

#### GET `/api/profile`
Obtiene el perfil del usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

#### GET `/api/dashboard`
Obtiene datos del dashboard del usuario.

**Headers:**
```
Authorization: Bearer <token>
```

#### POST `/api/logout`
Cierra la sesión del usuario.

**Headers:**
```
Authorization: Bearer <token>
```

#### GET `/api/verify-token`
Verifica si un token es válido.

**Headers:**
```
Authorization: Bearer <token>
```

## 📱 Páginas de la Aplicación

### 1. Login (`/` o `/login.html`)
- Formulario de inicio de sesión
- Validación de email y contraseña
- Botón para mostrar/ocultar contraseña
- Link a registro
- Redirige a home.html al autenticarse

### 2. Registro (`/register.html`)
- Formulario de registro completo
- Validación en tiempo real de requisitos
- Confirmación de contraseña
- Indicadores visuales de fortaleza
- Redirige a login tras registro exitoso

### 3. Home (`/home.html`)
- Página principal protegida
- Mensaje de bienvenida personalizado
- Información detallada del usuario
- Indicador de sesión activa
- Botón de cerrar sesión

### 4. Dashboard (`/dashboard.html`)
- Panel alternativo protegido
- Vista simplificada de datos
- Compatible con versiones anteriores

## 🎨 Características de Diseño

- **Gradientes Modernos:** Fondo con degradado púrpura-azul
- **Animaciones Suaves:** Transiciones y efectos visuales
- **Responsive:** Adaptado para móvil, tablet y desktop
- **Iconos:** Emojis para mejor UX
- **Estados Visuales:**
  - Loading spinners durante peticiones
  - Campos con validación en tiempo real
  - Mensajes de éxito/error con animaciones
  - Hover effects en botones

## 🔄 Flujo de la Aplicación

1. Usuario visita `/login.html` o `/`
2. Si no tiene cuenta, va a `/register.html`
3. Completa el formulario con validación en tiempo real
4. Sistema valida en frontend y backend
5. Contraseña se cifra con bcrypt antes de guardarse
6. Usuario regresa a login
7. Ingresa credenciales
8. Sistema genera JWT válido por 30 minutos
9. Token se guarda en localStorage
10. Usuario es redirigido a `/home.html`
11. Cada interacción renueva la sesión
12. Después de 30 minutos de inactividad, sesión expira
13. Usuario puede cerrar sesión manualmente

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Entorno de ejecución
- **Express.js** v4.18 - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** v8.0 - ODM para MongoDB
- **bcryptjs** v2.4 - Cifrado de contraseñas
- **jsonwebtoken** v9.0 - Generación de JWT
- **cors** v2.8 - Manejo de CORS
- **dotenv** v16.3 - Variables de entorno

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con variables CSS
- **JavaScript (Vanilla)** - Lógica del cliente
- **LocalStorage API** - Almacenamiento de tokens
- **Fetch API** - Comunicación con backend

## 🐛 Solución de Problemas

### MongoDB no se conecta

**Error:** `MongooseServerSelectionError`

**Soluciones:**
1. Verifica que MongoDB esté ejecutándose:
   ```bash
   net start MongoDB
   ```
2. Si usas Atlas, verifica:
   - Usuario y contraseña correctos
   - Network Access configurado (0.0.0.0/0)
   - Connection string correcto en `.env`

### Error "Token inválido o expirado"

**Causa:** La sesión expiró después de 30 minutos

**Solución:** Inicia sesión nuevamente

### Puerto 3000 en uso

**Error:** `EADDRINUSE`

**Solución:** Cambia el puerto en `.env`:
```env
PORT=3001
```

### Error de CORS

**Síntoma:** Las peticiones fallan en el navegador

**Solución:** El servidor ya tiene CORS configurado. Asegúrate de usar `http://localhost:3000`

## 🔒 Seguridad en Producción

**IMPORTANTE:** Antes de desplegar en producción:

1. ✅ Cambia `JWT_SECRET` por un valor único y complejo
2. ✅ Usa HTTPS (nunca HTTP en producción)
3. ✅ Implementa rate limiting
4. ✅ Añade helmet.js para headers de seguridad
5. ✅ Usa MongoDB Atlas con IP whitelist específica
6. ✅ Implementa logging de accesos
7. ✅ Añade validación de entrada más estricta
8. ✅ Implementa recuperación de contraseña
9. ✅ Añade verificación de email
10. ✅ Considera 2FA (autenticación de dos factores)

## 📝 Scripts Disponibles

```bash
npm start       # Inicia el servidor
npm run dev     # Inicia con nodemon (reinicio automático)
```

## 📄 Licencia

ISC

## 👨‍💻 Desarrollo

Creado con ❤️ usando las mejores prácticas de desarrollo web y seguridad.

---

## 🆘 Soporte

Si encuentras algún problema:

1. Revisa la sección de "Solución de Problemas"
2. Verifica que MongoDB esté configurado correctamente
3. Asegúrate de que todas las dependencias estén instaladas
4. Revisa los logs en la consola del navegador y del servidor

## 🎯 Próximas Mejoras Sugeridas

- [ ] Recuperación de contraseña por email
- [ ] Verificación de email al registrarse
- [ ] Autenticación de dos factores (2FA)
- [ ] Perfiles de usuario con foto
- [ ] Historial de sesiones
- [ ] Notificaciones en tiempo real
- [ ] Rate limiting para prevenir ataques
- [ ] Modo oscuro
- [ ] Integración con OAuth (Google, Facebook)
- [ ] Panel de administración

---

**¡Disfruta de tu sistema de autenticación seguro y profesional! 🚀**
