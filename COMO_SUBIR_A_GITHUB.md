# 🚀 Guía Completa: Subir LibraryBox a GitHub (Windows)

## ⚠️ Primero: Instalar Git

### Descargar e Instalar Git para Windows

1. **Descargar Git:**
   - Ve a: [https://git-scm.com/download/win](https://git-scm.com/download/win)
   - Descarga la versión de 64-bit para Windows
   - Ejecuta el instalador `Git-x.xx.x-64-bit.exe`

2. **Instalar Git:**
   - Siguiente → Siguiente (deja todas las opciones por defecto)
   - **Importante:** En "Adjusting your PATH environment" selecciona "Git from the command line and also from 3rd-party software"
   - Continúa con Siguiente hasta Finalizar

3. **Verificar instalación:**
   - Abre una **nueva** ventana de PowerShell
   - Ejecuta:
   ```powershell
   git --version
   ```
   - Deberías ver algo como: `git version 2.43.0`

---

## 📋 Método 1: Usando GitHub Desktop (MÁS FÁCIL)

### Descargar GitHub Desktop

1. Ve a: [https://desktop.github.com](https://desktop.github.com)
2. Descarga e instala GitHub Desktop
3. Inicia sesión con tu cuenta de GitHub

### Publicar el Proyecto

1. **Abrir GitHub Desktop**
2. **File → Add local repository**
3. Selecciona la carpeta: `c:\Users\UserGPC\OneDrive\Desktop\App\auth-app`
4. Si dice "This directory does not appear to be a Git repository":
   - Haz clic en **"create a repository"**
   - Name: `librarybox`
   - Local path: (ya está correcto)
   - Haz clic en **"Create Repository"**
5. **Publish repository:**
   - Haz clic en "Publish repository" (esquina superior derecha)
   - Name: `librarybox`
   - Description: "📚 Sistema de gestión de biblioteca personal con Node.js y MongoDB"
   - **Desmarcar** "Keep this code private" (si quieres que sea público)
   - Haz clic en **"Publish Repository"**

¡Listo! Tu proyecto ya está en GitHub 🎉

---

## 📋 Método 2: Usando Git desde PowerShell

### Paso 1: Configurar Git (primera vez solamente)

```powershell
# Configurar tu nombre y email (aparecerán en los commits)
git config --global user.name "Tu Nombre"
git config --global user.email "tu-email@example.com"

# Verificar configuración
git config --list
```

### Paso 2: Ir a la carpeta del proyecto

```powershell
Set-Location "c:\Users\UserGPC\OneDrive\Desktop\App\auth-app"
```

### Paso 3: Inicializar Git

```powershell
# Inicializar repositorio
git init

# Verificar que .env está en .gitignore
cat .gitignore

# Ver archivos que se subirán (NO debe aparecer .env)
git status
```

### Paso 4: Agregar archivos

```powershell
# Agregar todos los archivos al staging
git add .

# Verificar archivos agregados
git status
```

### Paso 5: Crear el primer commit

```powershell
git commit -m "Initial commit: LibraryBox v1.0.0"
```

### Paso 6: Crear repositorio en GitHub

1. Ve a [https://github.com/new](https://github.com/new)
2. **Repository name:** `librarybox`
3. **Description:** "📚 Sistema de gestión de biblioteca personal con Node.js, Express, MongoDB y JWT"
4. Elige **Public** o **Private**
5. **NO marques** ninguna de las opciones de inicialización
6. Haz clic en **"Create repository"**

### Paso 7: Conectar con GitHub

GitHub te mostrará comandos. Copia tu nombre de usuario y ejecuta:

```powershell
# Reemplaza TU-USUARIO con tu usuario de GitHub
git remote add origin https://github.com/TU-USUARIO/librarybox.git

# Cambiar a rama main
git branch -M main

# Subir el código
git push -u origin main
```

### Autenticación

Si te pide credenciales:
- **Usuario:** tu usuario de GitHub
- **Password:** usar un **Personal Access Token** (no tu contraseña)

#### Crear Personal Access Token:

1. Ve a: [https://github.com/settings/tokens](https://github.com/settings/tokens)
2. **Generate new token → Generate new token (classic)**
3. **Note:** "LibraryBox deployment"
4. **Expiration:** 90 days (o el que prefieras)
5. **Select scopes:** marca **`repo`** (todos los checkboxes bajo repo)
6. Haz clic en **"Generate token"**
7. **COPIA EL TOKEN** (se muestra solo una vez)
8. Úsalo como password cuando Git te lo pida

---

## 📋 Método 3: Subir directamente desde la Web

### Si tienes problemas con Git

1. **Comprimir el proyecto:**
   - Ve a `c:\Users\UserGPC\OneDrive\Desktop\App\auth-app`
   - **ELIMINA la carpeta `node_modules`** (puedes reinstalarla después)
   - **ELIMINA el archivo `.env`** (¡MUY IMPORTANTE!)
   - Selecciona todos los archivos restantes
   - Click derecho → Enviar a → Carpeta comprimida (zip)
   - Nombra el archivo: `librarybox.zip`

2. **Crear repositorio en GitHub:**
   - Ve a [https://github.com/new](https://github.com/new)
   - Name: `librarybox`
   - Public
   - Marca: **"Add a README file"**
   - Create repository

3. **Subir archivos:**
   - En tu nuevo repositorio, haz clic en **"Add file" → "Upload files"**
   - Arrastra el archivo `librarybox.zip`
   - O descomprime y arrastra las carpetas
   - **Commit changes**

⚠️ **IMPORTANTE:** Verifica que NO subiste `.env` ni `node_modules`

---

## ✅ Verificación Final

### Checklist antes de subir:

- [ ] Git instalado (o usando GitHub Desktop)
- [ ] Carpeta `node_modules/` eliminada o en `.gitignore`
- [ ] Archivo `.env` NO está incluido (debe estar en `.gitignore`)
- [ ] README.md está actualizado
- [ ] Cuenta de GitHub activa

### Verificar en GitHub:

1. Ve a tu repositorio: `https://github.com/TU-USUARIO/librarybox`
2. **VERIFICA** que NO veas:
   - ❌ Archivo `.env`
   - ❌ Carpeta `node_modules/`
3. **DEBES ver:**
   - ✅ `README.md`
   - ✅ `package.json`
   - ✅ `server.js`
   - ✅ Carpeta `public/`
   - ✅ `.gitignore`
   - ✅ `Dockerfile`
   - ✅ `docker-compose.yml`

---

## 🔄 Hacer cambios después

### Con GitHub Desktop:
1. Haz cambios en tus archivos
2. GitHub Desktop los detectará automáticamente
3. Escribe un mensaje de commit
4. Haz clic en "Commit to main"
5. Haz clic en "Push origin"

### Con Git en PowerShell:
```powershell
# Ver cambios
git status

# Agregar cambios
git add .

# Commit
git commit -m "Descripción del cambio"

# Subir
git push
```

---

## 🎨 Mejorar el README

Una vez subido, edita el README.md en GitHub para:
1. Agregar screenshot de la aplicación
2. Agregar link al demo (si lo despliegas)
3. Personalizar las instrucciones

---

## 🚀 Desplegar en Producción (GRATIS)

### Railway (Recomendado)

1. Ve a [railway.app](https://railway.app)
2. "Login with GitHub"
3. "New Project" → "Deploy from GitHub repo"
4. Selecciona `librarybox`
5. Agrega variables de entorno:
   ```
   MONGODB_URI=mongodb+srv://Mariana:Jonas1234@cluster0.jb6bct3.mongodb.net/auth-app
   JWT_SECRET=tu_secreto_super_seguro
   PORT=3000
   NODE_ENV=production
   ```
6. Railway desplegará automáticamente usando tu Dockerfile
7. Te dará una URL como: `librarybox.up.railway.app`

### Render

1. Ve a [render.com](https://render.com)
2. "New +" → "Web Service"
3. "Connect account" → GitHub
4. Selecciona `librarybox`
5. Configuración:
   - **Name:** librarybox
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Add Environment Variables** (mismo que Railway)
6. "Create Web Service"

---

## 🆘 Solución de Problemas

### "Git no se reconoce como comando"
- Reinicia PowerShell después de instalar Git
- O usa GitHub Desktop (más fácil)

### "Permission denied (publickey)"
- Usa HTTPS en lugar de SSH
- URL: `https://github.com/TU-USUARIO/librarybox.git`
- O usa GitHub Desktop

### "Subí .env por error"
```powershell
# Eliminar del repositorio (mantenerlo local)
git rm --cached .env
git commit -m "Remove .env"
git push

# CAMBIAR todas las credenciales de MongoDB y JWT
```

---

## 📞 Recursos Adicionales

- **Git:** https://git-scm.com/book/es/v2
- **GitHub Desktop:** https://desktop.github.com
- **GitHub Docs:** https://docs.github.com
- **Railway:** https://docs.railway.app
- **Render:** https://render.com/docs

---

## 🎯 Resumen Rápido

**Opción más fácil:**
1. Instala GitHub Desktop
2. Add local repository → `auth-app`
3. Publish repository
4. ¡Listo! 🎉

**Si prefieres línea de comandos:**
1. Instala Git
2. `git init`
3. `git add .`
4. `git commit -m "Initial commit"`
5. Crear repo en GitHub
6. `git remote add origin URL`
7. `git push -u origin main`

¡Tu proyecto LibraryBox estará en GitHub! 🚀
