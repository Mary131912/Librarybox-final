# 🐳 DOCKER SETUP - LIBRIFY

Esta guía te ayudará a dockerizar y ejecutar la aplicación LIBRIFY usando Docker y Docker Compose.

---

## 📋 PREREQUISITOS

1. **Docker Desktop instalado** (incluye Docker y Docker Compose)
   - Windows: https://docs.docker.com/desktop/install/windows-install/
   - Mac: https://docs.docker.com/desktop/install/mac-install/
   - Linux: https://docs.docker.com/desktop/install/linux-install/

2. **Verificar instalación:**
   ```bash
   docker --version
   docker-compose --version
   ```

---

## 🚀 OPCIÓN 1: DOCKER CON MONGODB ATLAS (Recomendado)

### Paso 1: Configurar Variables de Entorno

1. Copia el archivo de ejemplo:
   ```bash
   copy .env.docker.example .env
   ```

2. Edita el archivo `.env` con tus credenciales de MongoDB Atlas:
   ```env
   MONGODB_URI=mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/auth-app?retryWrites=true&w=majority
   JWT_SECRET=tu_secreto_super_seguro_cambiar_en_produccion
   PORT=3000
   NODE_ENV=production
   ```

### Paso 2: Construir la Imagen Docker

```bash
docker build -t librify-app .
```

### Paso 3: Ejecutar el Contenedor

```bash
docker run -d \
  --name librify \
  -p 3000:3000 \
  --env-file .env \
  librify-app
```

### Paso 4: Verificar que Funciona

1. Abre tu navegador en: http://localhost:3000/login.html
2. Verifica los logs:
   ```bash
   docker logs librify
   ```

### Comandos Útiles:

```bash
# Ver contenedores corriendo
docker ps

# Detener contenedor
docker stop librify

# Iniciar contenedor
docker start librify

# Ver logs en tiempo real
docker logs -f librify

# Eliminar contenedor
docker rm -f librify

# Eliminar imagen
docker rmi librify-app
```

---

## 🏗️ OPCIÓN 2: DOCKER COMPOSE CON TODO INCLUIDO

Esta opción incluye MongoDB local en Docker (no necesitas MongoDB Atlas).

### Paso 1: Configurar Variables de Entorno

1. Copia el archivo de ejemplo:
   ```bash
   copy .env.docker.example .env
   ```

2. Edita `.env` para usar MongoDB local:
   ```env
   MONGODB_URI=mongodb://admin:admin123@mongodb:27017/auth-app?authSource=admin
   JWT_SECRET=tu_secreto_super_seguro
   PORT=3000
   NODE_ENV=production
   ```

### Paso 2: Iniciar Todos los Servicios

```bash
docker-compose up -d
```

Esto iniciará:
- ✅ Aplicación Node.js (puerto 3000)
- ✅ MongoDB (puerto 27017)

### Paso 3: Verificar que Funciona

1. Abre: http://localhost:3000/login.html
2. Verifica los logs:
   ```bash
   docker-compose logs -f
   ```

### Comandos Docker Compose:

```bash
# Ver servicios corriendo
docker-compose ps

# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (CUIDADO: borra la BD)
docker-compose down -v

# Reconstruir imágenes
docker-compose build

# Reiniciar servicios
docker-compose restart

# Ver logs de un servicio específico
docker-compose logs -f app
docker-compose logs -f mongodb

# Ejecutar comandos dentro del contenedor
docker-compose exec app sh
docker-compose exec mongodb mongosh
```

---

## 📊 ESTRUCTURA DE ARCHIVOS DOCKER

```
auth-app/
├── Dockerfile              # Definición de la imagen Docker
├── docker-compose.yml      # Orquestación de contenedores
├── .dockerignore          # Archivos a ignorar en build
├── .env.docker.example    # Ejemplo de variables de entorno
├── .env                   # Variables de entorno (NO subir a Git)
└── DOCKER_SETUP.md        # Esta guía
```

---

## 🔐 SEGURIDAD EN PRODUCCIÓN

### Variables de Entorno Seguras

1. **NO incluyas el archivo `.env` en Git:**
   ```bash
   echo ".env" >> .gitignore
   ```

2. **Genera un JWT_SECRET seguro:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

3. **Usa Docker Secrets en producción** (para Docker Swarm):
   ```yaml
   secrets:
     jwt_secret:
       external: true
   ```

---

## 🌐 DESPLIEGUE EN PRODUCCIÓN

### Opción A: Docker Hub

1. **Tag la imagen:**
   ```bash
   docker tag librify-app tuusuario/librify-app:latest
   ```

2. **Push a Docker Hub:**
   ```bash
   docker login
   docker push tuusuario/librify-app:latest
   ```

3. **Pull en servidor:**
   ```bash
   docker pull tuusuario/librify-app:latest
   docker run -d -p 3000:3000 --env-file .env tuusuario/librify-app:latest
   ```

### Opción B: Servidor VPS (DigitalOcean, AWS, etc.)

1. **Instala Docker en el servidor**
2. **Copia archivos al servidor:**
   ```bash
   scp -r auth-app/ usuario@servidor:/home/usuario/
   ```

3. **Conecta por SSH y ejecuta:**
   ```bash
   cd auth-app
   docker-compose up -d
   ```

### Opción C: Servicios Cloud Especializados

- **AWS ECS/Fargate**: https://aws.amazon.com/ecs/
- **Google Cloud Run**: https://cloud.google.com/run
- **Azure Container Instances**: https://azure.microsoft.com/en-us/services/container-instances/
- **DigitalOcean App Platform**: https://www.digitalocean.com/products/app-platform

---

## 🔧 TROUBLESHOOTING

### Problema: "Cannot connect to MongoDB"

**Solución 1** (MongoDB Atlas):
- Verifica que tu IP está en la whitelist de MongoDB Atlas
- Verifica que `MONGODB_URI` en `.env` es correcta

**Solución 2** (MongoDB local):
- Verifica que el contenedor de MongoDB está corriendo:
  ```bash
  docker-compose ps
  ```
- Verifica los logs de MongoDB:
  ```bash
  docker-compose logs mongodb
  ```

### Problema: "Port 3000 already in use"

**Solución:**
```bash
# Windows PowerShell
netstat -ano | findstr ":3000"
taskkill /PID [PID_NUMBER] /F

# O cambia el puerto en .env
PORT=3001
```

### Problema: "Cannot find module"

**Solución:**
```bash
# Reconstruir imagen sin caché
docker-compose build --no-cache
docker-compose up -d
```

### Problema: Cambios en código no se reflejan

**Solución:**
```bash
# Reconstruir imagen
docker-compose down
docker-compose build
docker-compose up -d
```

---

## 📈 MONITOREO Y LOGS

### Ver logs en tiempo real:
```bash
docker-compose logs -f app
```

### Ver solo últimas 100 líneas:
```bash
docker-compose logs --tail=100 app
```

### Ver estadísticas de recursos:
```bash
docker stats librify-app
```

### Inspeccionar contenedor:
```bash
docker inspect librify-app
```

---

## 🧪 TESTING CON DOCKER

### Ejecutar tests dentro del contenedor:
```bash
docker-compose exec app npm test
```

### Acceder a shell del contenedor:
```bash
docker-compose exec app sh
```

---

## 📦 BACKUP DE DATOS (MongoDB Local)

### Backup:
```bash
docker-compose exec mongodb mongodump --username admin --password admin123 --authenticationDatabase admin --out /backup
docker cp librify-mongodb:/backup ./backup
```

### Restore:
```bash
docker cp ./backup librify-mongodb:/backup
docker-compose exec mongodb mongorestore --username admin --password admin123 --authenticationDatabase admin /backup
```

---

## ✅ CHECKLIST DE DOCKERIZACIÓN

- [x] Dockerfile creado
- [x] docker-compose.yml configurado
- [x] .dockerignore creado
- [x] Variables de entorno configuradas (.env)
- [x] MongoDB configurado (Atlas o local)
- [x] Puertos expuestos correctamente (3000)
- [x] Volúmenes para persistencia de datos
- [x] Network configurada entre contenedores
- [x] Documentación completa (este archivo)

---

## 🎯 VENTAJAS DE DOCKERIZAR

✅ **Portabilidad**: Funciona igual en cualquier máquina  
✅ **Aislamiento**: No interfiere con otras aplicaciones  
✅ **Escalabilidad**: Fácil de replicar y escalar  
✅ **Consistencia**: Mismo entorno en desarrollo y producción  
✅ **Simplicidad**: Un comando para iniciar todo  
✅ **Reproducibilidad**: Versiones controladas de dependencias  

---

## 📚 RECURSOS ADICIONALES

- Docker Documentation: https://docs.docker.com/
- Docker Compose: https://docs.docker.com/compose/
- Node.js Docker Best Practices: https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md
- MongoDB Docker: https://hub.docker.com/_/mongo

---

**¿Necesitas ayuda?** Revisa la sección de Troubleshooting o consulta los logs con `docker-compose logs -f`
