# 🐳 Inicio Rápido con Docker

## Paso 1: Configurar Variables de Entorno

```powershell
# Opción A: Usar el helper
.\docker-helper.ps1 setup

# Opción B: Manual
copy .env.docker.example .env
```

Edita `.env` con tu MongoDB Atlas URI:
```env
MONGODB_URI=mongodb+srv://TU_USUARIO:TU_PASSWORD@cluster0.xxxxx.mongodb.net/auth-app
JWT_SECRET=tu_secreto_seguro_aqui
```

## Paso 2: Iniciar Docker

```powershell
# Opción A: Usar el helper
.\docker-helper.ps1 start

# Opción B: Docker Compose directo
docker-compose up -d
```

## Paso 3: Acceder

- 🌐 Aplicación: http://localhost:3000/login.html
- 👑 Admin: `admin` / `1234`

## Comandos Útiles

```powershell
.\docker-helper.ps1 logs      # Ver logs
.\docker-helper.ps1 status    # Estado
.\docker-helper.ps1 stop      # Detener
.\docker-helper.ps1 restart   # Reiniciar
.\docker-helper.ps1 clean     # Limpiar todo
```

## ⚠️ Importante

1. Asegúrate de tener Docker Desktop corriendo
2. Configura IP Whitelist en MongoDB Atlas: `0.0.0.0/0`
3. El puerto 3000 debe estar disponible

## 📚 Documentación Completa

Ver [DOCKER_DEPLOY.md](./DOCKER_DEPLOY.md) para guía detallada.
