# 🐳 Guía de Despliegue con Docker - LibraryBox

## 📋 Requisitos Previos

- Docker Desktop instalado ([Descargar aquí](https://www.docker.com/products/docker-desktop))
- Docker Compose (incluido con Docker Desktop)
- Cuenta en MongoDB Atlas (o usar MongoDB local incluido)

## 🚀 Despliegue Rápido

### 1. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
# Copiar el archivo de ejemplo
copy .env.docker.example .env
```

O usa PowerShell:
```powershell
.\docker-helper.ps1 setup
```

Edita el archivo `.env` con tus credenciales:

```env
# MongoDB Atlas (recomendado)
MONGODB_URI=mongodb+srv://tu_usuario:tu_password@cluster0.xxxxx.mongodb.net/auth-app?retryWrites=true&w=majority

# O MongoDB local en Docker
# MONGODB_URI=mongodb://admin:admin123@mongodb:27017/auth-app?authSource=admin

# JWT Secret (generar uno único)
JWT_SECRET=tu_secreto_super_seguro_cambiar_en_produccion

# Puerto
PORT=3000

# Entorno
NODE_ENV=production
```

### 2. Construir y Ejecutar

**Opción A: Usando Docker Compose (recomendado)**

```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

**Opción B: Usando el Helper de PowerShell**

```powershell
# Ver comandos disponibles
.\docker-helper.ps1 help

# Iniciar contenedores
.\docker-helper.ps1 start

# Ver logs
.\docker-helper.ps1 logs

# Ver estado
.\docker-helper.ps1 status

# Detener contenedores
.\docker-helper.ps1 stop
```

**Opción C: Docker manual (sin Compose)**

```bash
# Construir imagen
docker build -t librarybox-app .

# Ejecutar contenedor
docker run -d \
  --name librarybox \
  -p 3000:3000 \
  --env-file .env \
  librarybox-app
```

### 3. Acceder a la Aplicación

Una vez iniciado, accede a:
- **Aplicación:** http://localhost:3000/login.html
- **API:** http://localhost:3000/api

**Credenciales de Admin:**
- Usuario: `admin`
- Contraseña: `1234`

## 📦 Arquitectura de Contenedores

### Servicios Incluidos

1. **app** (Node.js)
   - Puerto: 3000
   - Aplicación principal LibraryBox
   - Conecta a MongoDB Atlas o MongoDB local

2. **mongodb** (opcional)
   - Puerto: 27017
   - MongoDB local para desarrollo
   - Usuario: admin / Password: admin123
   - Solo si no usas MongoDB Atlas

## 🔧 Comandos Útiles

### Docker Compose

```bash
# Iniciar en modo desarrollo (con logs visibles)
docker-compose up

# Reconstruir imágenes
docker-compose build --no-cache

# Ver contenedores activos
docker-compose ps

# Ejecutar comando en contenedor
docker-compose exec app sh

# Ver logs específicos
docker-compose logs app
docker-compose logs mongodb

# Limpiar todo (incluyendo volúmenes)
docker-compose down -v
```

### Docker Helper (PowerShell)

```powershell
# Todos los comandos disponibles
.\docker-helper.ps1 help
.\docker-helper.ps1 start      # Iniciar
.\docker-helper.ps1 stop       # Detener
.\docker-helper.ps1 restart    # Reiniciar
.\docker-helper.ps1 logs       # Ver logs
.\docker-helper.ps1 status     # Estado
.\docker-helper.ps1 build      # Reconstruir
.\docker-helper.ps1 clean      # Limpiar
.\docker-helper.ps1 shell      # Acceder a shell
.\docker-helper.ps1 setup      # Configurar .env
```

## 🌐 MongoDB: Local vs Atlas

### Opción 1: MongoDB Atlas (Recomendado para producción)

**Ventajas:**
- ✅ Gratis hasta 512MB
- ✅ Backups automáticos
- ✅ Alta disponibilidad
- ✅ No consume recursos locales

**Configuración:**
```env
MONGODB_URI=mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/auth-app
```

**IP Whitelist:** Agregar `0.0.0.0/0` para permitir acceso desde Docker

### Opción 2: MongoDB Local en Docker

**Ventajas:**
- ✅ No requiere internet
- ✅ Desarrollo offline
- ✅ Datos locales

**Configuración:**
```env
MONGODB_URI=mongodb://admin:admin123@mongodb:27017/auth-app?authSource=admin
```

## 🔒 Seguridad

### Variables de Entorno Importantes

⚠️ **NUNCA** subas el archivo `.env` a repositorios públicos

```env
# Generar JWT Secret seguro (PowerShell)
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

### Configuración de MongoDB Atlas

1. Ir a MongoDB Atlas → Network Access
2. Agregar IP: `0.0.0.0/0` (permitir desde cualquier IP)
3. O agregar IP específica de tu servidor

## 📊 Verificación de Funcionamiento

```bash
# Verificar que los contenedores estén corriendo
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f

# Probar conectividad
curl http://localhost:3000/api/health

# Verificar MongoDB (si es local)
docker-compose exec mongodb mongosh -u admin -p admin123
```

## 🐛 Solución de Problemas

### Error: Puerto 3000 ya en uso

```powershell
# Detener proceso en puerto 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# O cambiar puerto en .env
PORT=3001
```

### Error: No puede conectar a MongoDB

```bash
# Ver logs de MongoDB
docker-compose logs mongodb

# Verificar variables de entorno
docker-compose exec app printenv | grep MONGODB

# Probar conexión desde contenedor
docker-compose exec app node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('OK')).catch(e => console.error(e))"
```

### Error: Contenedor se detiene inmediatamente

```bash
# Ver logs del contenedor
docker-compose logs app

# Ejecutar en modo interactivo
docker-compose up app
```

### Limpiar y Empezar de Nuevo

```bash
# Detener y limpiar todo
docker-compose down -v

# Limpiar imágenes huérfanas
docker system prune -a

# Reconstruir todo
docker-compose build --no-cache
docker-compose up -d
```

## 📤 Despliegue en Producción

### Railway / Render / Fly.io

1. **Conectar repositorio Git**
2. **Configurar variables de entorno:**
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `PORT` (usualmente auto-detectado)
   - `NODE_ENV=production`

3. **Configurar Dockerfile:**
   Ya incluido en el proyecto

4. **Configurar MongoDB Atlas:**
   - IP Whitelist: `0.0.0.0/0`

### Docker Hub (Opcional)

```bash
# Login a Docker Hub
docker login

# Etiquetar imagen
docker tag librarybox-app tu-usuario/librarybox:latest

# Subir a Docker Hub
docker push tu-usuario/librarybox:latest

# Descargar y ejecutar desde otro servidor
docker pull tu-usuario/librarybox:latest
docker run -d -p 3000:3000 --env-file .env tu-usuario/librarybox:latest
```

## 📝 Checklist de Despliegue

- [ ] Docker Desktop instalado y corriendo
- [ ] Archivo `.env` creado y configurado
- [ ] MongoDB configurado (Atlas o local)
- [ ] IP Whitelist configurada en MongoDB Atlas
- [ ] Variables de entorno verificadas
- [ ] Puerto 3000 disponible
- [ ] `docker-compose up -d` ejecutado exitosamente
- [ ] Aplicación accesible en http://localhost:3000
- [ ] Login de admin funcionando (admin/1234)

## 🎯 Próximos Pasos

1. Accede a http://localhost:3000/login.html
2. Inicia sesión con admin/1234
3. Agrega tus primeros libros
4. Configura usuarios adicionales

¡Tu aplicación LibraryBox está corriendo en Docker! 🚀
