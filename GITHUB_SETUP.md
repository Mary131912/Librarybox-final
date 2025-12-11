# 📤 Guía para Subir LibraryBox a GitHub

## Paso 1: Preparar el Repositorio Local

### 1.1 Abrir PowerShell en la carpeta del proyecto

```powershell
cd "c:\Users\UserGPC\OneDrive\Desktop\App\auth-app"
```

### 1.2 Inicializar Git (si aún no está inicializado)

```powershell
git init
```

### 1.3 Verificar que .env está ignorado

```powershell
# Verificar que .env NO aparezca en la lista
git status
```

⚠️ **IMPORTANTE:** Si ves `.env` en la lista de archivos, NUNCA lo subas. Contiene credenciales sensibles.

### 1.4 Agregar todos los archivos

```powershell
git add .
```

### 1.5 Crear el primer commit

```powershell
git commit -m "Initial commit: LibraryBox v1.0.0 - Sistema de gestión de biblioteca personal"
```

## Paso 2: Crear Repositorio en GitHub

### 2.1 Ir a GitHub

1. Abre tu navegador y ve a [https://github.com](https://github.com)
2. Inicia sesión en tu cuenta
3. Haz clic en el botón **"+"** (esquina superior derecha) → **"New repository"**

### 2.2 Configurar el Repositorio

- **Repository name:** `librarybox` (o el nombre que prefieras)
- **Description:** "📚 Sistema web de gestión de biblioteca personal con Node.js, Express, MongoDB y JWT"
- **Visibility:** 
  - ✅ **Public** (recomendado para portafolio)
  - ⚪ **Private** (si prefieres mantenerlo privado)
- **NO marques:** "Initialize this repository with a README" (ya tienes uno)
- Haz clic en **"Create repository"**

## Paso 3: Conectar y Subir

### 3.1 Copiar la URL del repositorio

GitHub te mostrará comandos. Copia la URL que se ve así:
```
https://github.com/TU-USUARIO/librarybox.git
```

### 3.2 Conectar el repositorio local con GitHub

```powershell
# Reemplaza TU-USUARIO con tu nombre de usuario de GitHub
git remote add origin https://github.com/TU-USUARIO/librarybox.git
```

### 3.3 Cambiar a la rama main (si es necesario)

```powershell
git branch -M main
```

### 3.4 Subir el código

```powershell
git push -u origin main
```

Te pedirá autenticación:
- **Opción 1:** GitHub te redirigirá al navegador para autenticarte
- **Opción 2:** Necesitarás un Personal Access Token (ver abajo)

## Paso 4: Personal Access Token (si es necesario)

Si Git te pide usuario y contraseña:

1. Ve a GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Clic en "Generate new token (classic)"
3. Dale un nombre: "LibraryBox deployment"
4. Marca el scope: **repo** (full control)
5. Clic en "Generate token"
6. **COPIA EL TOKEN** (solo se muestra una vez)
7. Usa el token como contraseña cuando Git te lo pida

## Paso 5: Verificar

1. Ve a tu repositorio en GitHub: `https://github.com/TU-USUARIO/librarybox`
2. Deberías ver todos tus archivos
3. Verifica que `.env` NO esté ahí (debe estar en .gitignore)

## 📝 Comandos para Futuras Actualizaciones

```powershell
# 1. Ver cambios
git status

# 2. Agregar cambios
git add .

# 3. Crear commit con mensaje descriptivo
git commit -m "Descripción de los cambios"

# 4. Subir a GitHub
git push
```

## 🎨 Mejorar el README en GitHub

Una vez subido, puedes:

1. Agregar una imagen de portada (screenshot de la app)
2. Agregar badges de tecnologías
3. Incluir demo en vivo si lo despliegas

## 🚀 Opcional: Desplegar en Producción

Una vez en GitHub, puedes desplegar gratis en:

### Railway
1. Ve a [railway.app](https://railway.app)
2. "Start a New Project" → "Deploy from GitHub repo"
3. Selecciona `librarybox`
4. Agrega variables de entorno:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `PORT` (Railway lo detecta automáticamente)
   - `NODE_ENV=production`
5. Railway detectará el Dockerfile y desplegará automáticamente

### Render
1. Ve a [render.com](https://render.com)
2. "New +" → "Web Service"
3. Conecta tu repo de GitHub
4. Configurar:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - Agregar Environment Variables (mismo que Railway)
5. Deploy

### Vercel (solo frontend)
1. Ve a [vercel.com](https://vercel.com)
2. "Add New Project"
3. Importar desde GitHub
4. Vercel desplegará automáticamente

## ⚠️ Recordatorios Importantes

### NUNCA subir a GitHub:
- ❌ Archivo `.env` (credenciales)
- ❌ Carpeta `node_modules/` (dependencias)
- ❌ Logs con información sensible
- ❌ Tokens o API keys

### SÍ subir:
- ✅ `.env.docker.example` (plantilla SIN credenciales)
- ✅ Todo el código fuente
- ✅ Archivos de configuración (package.json, Dockerfile, etc.)
- ✅ Documentación (README, guías)

## 🔒 Seguridad

Si accidentalmente subiste `.env`:

```powershell
# 1. Eliminar del repositorio (pero mantenerlo local)
git rm --cached .env

# 2. Asegurarte que esté en .gitignore
echo ".env" >> .gitignore

# 3. Commit
git commit -m "Removed .env from tracking"

# 4. Push
git push

# 5. CAMBIAR todas las credenciales (MongoDB, JWT_SECRET, etc.)
```

## 📧 Agregar Colaboradores

Si trabajas en equipo:

1. Ve a tu repo en GitHub
2. Settings → Collaborators
3. Add people → Invitar por email o usuario

## 🎯 Checklist Final

- [ ] Git inicializado en el proyecto
- [ ] `.env` está en `.gitignore` y NO se sube
- [ ] README.md actualizado con información del proyecto
- [ ] Repositorio creado en GitHub
- [ ] Código subido correctamente
- [ ] `.env` verificado que NO está en GitHub
- [ ] (Opcional) Desplegado en Railway/Render/Vercel
- [ ] (Opcional) README con screenshot y link al demo

¡Listo! Tu proyecto LibraryBox ahora está en GitHub 🎉
