# 🚀 Guía para Usuarios - LibraryBox Docker

## Cómo ejecutar LibraryBox desde Docker Hub

### 1️⃣ Requisitos Previos
- Docker instalado en tu máquina
- Una cuenta de MongoDB Atlas (gratis en https://www.mongodb.com/cloud/atlas)

### 2️⃣ Configurar MongoDB Atlas

1. **Crear cluster en MongoDB Atlas:**
   - Ve a https://cloud.mongodb.com
   - Crea un cluster gratuito
   - Crea un usuario con contraseña

2. **Configurar acceso a red:**
   - Ve a "Network Access"
   - Click en "Add IP Address"
   - Agrega `0.0.0.0/0` para permitir acceso desde cualquier IP
   - O agrega tu IP específica

3. **Obtener tu connection string:**
   - Ve a "Database" → "Connect"
   - Selecciona "Connect your application"
   - Copia la URL: `mongodb+srv://<usuario>:<password>@cluster0.xxxxx.mongodb.net/auth-app`
   - Reemplaza `<usuario>` y `<password>` con tus credenciales

### 3️⃣ Ejecutar el Contenedor

**Opción A: Con variables de entorno en el comando**

```bash
docker run -d -p 3000:3000 \
  -e MONGODB_URI="mongodb+srv://TU_USUARIO:TU_PASSWORD@cluster0.xxxxx.mongodb.net/auth-app" \
  -e JWT_SECRET="tu_secreto_super_seguro_cambiar_en_produccion" \
  --name librarybox \
  mary1913/librarybox:latest
```

**Opción B: Con archivo .env**

1. Crea un archivo `.env` con este contenido:
```env
MONGODB_URI=mongodb+srv://TU_USUARIO:TU_PASSWORD@cluster0.xxxxx.mongodb.net/auth-app
JWT_SECRET=tu_secreto_super_seguro_cambiar_en_produccion
PORT=3000
NODE_ENV=production
```

2. Ejecuta el contenedor:
```bash
docker run -d -p 3000:3000 \
  --env-file .env \
  --name librarybox \
  mary1913/librarybox:latest
```

**Opción C: Con Docker Compose**

1. Descarga el archivo `docker-compose.yml` del repositorio GitHub

2. Crea tu archivo `.env` como se indica arriba

3. Ejecuta:
```bash
docker-compose up -d
```

### 4️⃣ Verificar que funciona

1. **Ver logs del contenedor:**
```bash
docker logs librarybox
```

Deberías ver:
```
✅ Conectado exitosamente a MongoDB
📊 Base de datos: auth-app
🚀 Servidor corriendo en http://localhost:3000
```

2. **Abrir en navegador:**
   - Ve a http://localhost:3000

### 5️⃣ Primer Acceso

**Tu base de datos estará vacía la primera vez.** Tienes 3 opciones:

**Opción A: Usuario Admin (Recomendado para probar)**
- Usuario: `admin`
- Contraseña: `1234`
- ✅ Funciona inmediatamente, no necesita registro

**Opción B: Crear Usuario Demo**
```bash
docker exec librarybox node init-db.js
```
Esto crea:
- Email: `demo@librarybox.com`
- Contraseña: `Demo1234`

**Opción C: Registrar tu propia cuenta**
- Click en "Registrarse" en la página de login
- Crea tu cuenta con email y contraseña
- Requisitos: contraseña mínimo 8 caracteres, una mayúscula, una minúscula y un número

### 6️⃣ Acceso de Administrador

**Credenciales especiales:**
- Usuario: `admin`
- Contraseña: `1234`

Como admin puedes ver todos los libros y estadísticas de todos los usuarios.

### 7️⃣ Comandos Útiles

**Inicializar base de datos con usuario demo:**
```bash
docker exec librarybox node init-db.js
```

**Ver contenedores activos:**
```bash
docker ps
```

**Detener el contenedor:**
```bash
docker stop librarybox
```

**Iniciar el contenedor:**
```bash
docker start librarybox
```

**Eliminar el contenedor:**
```bash
docker stop librarybox
docker rm librarybox
```

**Ver logs en tiempo real:**
```bash
docker logs -f librarybox
```

### 🆘 Solución de Problemas

**Error: "Could not connect to MongoDB Atlas"**
- Verifica que tu IP esté en la whitelist de MongoDB Atlas
- Revisa que el MONGODB_URI sea correcto (usuario y password)
- Asegúrate que el cluster de MongoDB esté activo

**Error: "Address already in use"**
- El puerto 3000 ya está ocupado
- Usa otro puerto: `-p 8080:3000` (accede en http://localhost:8080)

**Error al registrarse: "Error en el servidor"**
- Verifica la conexión a MongoDB con: `docker logs librarybox`
- Asegúrate de que MongoDB Atlas esté accesible
- Revisa que la whitelist de IPs incluya tu dirección

**No puedo hacer login**
- Si es la primera vez: Usa `admin`/`1234` o regístrate primero
- Si ya te registraste: Verifica email y contraseña
- Si olvidaste tu contraseña: Usa el admin o crea otra cuenta

**Inicializar base de datos con usuario demo:**
```bash
docker exec librarybox node init-db.js
```
Esto crea un usuario: `demo@librarybox.com` / `Demo1234`

**No aparecen mis libros:**
- Verifica que estés usando la misma base de datos
- Revisa el connection string en MONGODB_URI

### 📝 Más Información

- **Repositorio GitHub:** https://github.com/Mary131912/Librarybox-final
- **Docker Hub:** https://hub.docker.com/r/mary1913/librarybox

### 🔒 Seguridad

⚠️ **IMPORTANTE:** 
- Cambia el `JWT_SECRET` por uno único y seguro
- No compartas tu `MONGODB_URI` públicamente
- En producción, usa credenciales diferentes para admin
