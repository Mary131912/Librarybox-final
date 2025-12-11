# 🚀 Subir LibraryBox a GitHub - Pasos para Mary131912

## Opción 1: GitHub Desktop (RECOMENDADO - MÁS FÁCIL)

### Paso 1: Descargar e Instalar GitHub Desktop

Si no lo has instalado:
1. Ve a: https://desktop.github.com
2. Descarga e instala
3. Abre GitHub Desktop
4. **Sign in to GitHub.com** con tu usuario: **Mary131912**

### Paso 2: Agregar el Proyecto

1. En GitHub Desktop, haz clic en: **File → Add local repository**
2. Busca y selecciona la carpeta: `C:\Users\UserGPC\OneDrive\Desktop\App\auth-app`
3. Si dice "This directory does not appear to be a Git repository":
   - Haz clic en **"create a repository"**
   - Repository name: `librarybox`
   - Local path: (ya debería estar correcto)
   - Initialize with a README: NO (ya tienes uno)
   - Haz clic en **"Create Repository"**

### Paso 3: Verificar Archivos

En GitHub Desktop verás todos los archivos que se van a subir.

**⚠️ IMPORTANTE - Verifica que NO aparezca:**
- ❌ `.env` (contiene tu contraseña de MongoDB)
- ❌ `node_modules/` (carpeta de dependencias)

**✅ Deberían aparecer:**
- README.md
- package.json
- server.js
- Carpeta `public/`
- Dockerfile
- Y todos los demás archivos

### Paso 4: Hacer el Primer Commit

1. En la parte inferior izquierda, escribe un mensaje de commit:
   ```
   Initial commit: LibraryBox v1.0.0
   ```
2. Haz clic en **"Commit to main"**

### Paso 5: Publicar en GitHub

1. Haz clic en **"Publish repository"** (botón azul arriba)
2. **Name:** `librarybox`
3. **Description:** `📚 Sistema de gestión de biblioteca personal con Node.js, Express y MongoDB`
4. **Keep this code private:** DESMARCA si quieres que sea público (recomendado para portafolio)
5. Haz clic en **"Publish Repository"**

### ✅ ¡Listo!

Tu proyecto ahora está en: `https://github.com/Mary131912/librarybox`

---

## Opción 2: Usar Git desde PowerShell

### IMPORTANTE: Reiniciar PowerShell

Si instalaste Git, **cierra esta ventana de PowerShell** y abre una **NUEVA** para que reconozca Git.

Luego ejecuta estos comandos:

```powershell
# 1. Ir a la carpeta del proyecto
cd "C:\Users\UserGPC\OneDrive\Desktop\App\auth-app"

# 2. Configurar Git (primera vez)
git config --global user.name "Mary131912"
git config --global user.email "tu-email@gmail.com"

# 3. Verificar que Git funciona
git --version

# 4. Inicializar repositorio
git init

# 5. Verificar que .env NO está en la lista
git status

# 6. Agregar todos los archivos
git add .

# 7. Crear el primer commit
git commit -m "Initial commit: LibraryBox v1.0.0"

# 8. Cambiar a rama main
git branch -M main

# 9. Conectar con GitHub (reemplaza TU-EMAIL)
git remote add origin https://github.com/Mary131912/librarybox.git

# 10. Subir el código
git push -u origin main
```

### Autenticación

Cuando hagas `git push`, te pedirá credenciales:
- **Username:** Mary131912
- **Password:** Usa un **Personal Access Token** (NO tu contraseña)

#### Crear Personal Access Token:

1. Ve a: https://github.com/settings/tokens
2. **Generate new token → Generate new token (classic)**
3. **Note:** "LibraryBox deployment"
4. **Expiration:** 90 days
5. **Select scopes:** Marca **repo** (todos los checkboxes)
6. **Generate token**
7. **COPIA EL TOKEN** (se muestra solo una vez)
8. Úsalo como password cuando Git te lo pida

---

## Antes de Subir: Crear el Repositorio en GitHub

### Crear Repositorio Vacío en GitHub

1. Ve a: https://github.com/new
2. **Repository name:** `librarybox`
3. **Description:** `📚 Sistema de gestión de biblioteca personal con Node.js, Express, MongoDB y JWT`
4. **Public** (para portafolio) o **Private** (si prefieres)
5. **NO MARCAR:**
   - ❌ Add a README file
   - ❌ Add .gitignore
   - ❌ Choose a license
6. Haz clic en **"Create repository"**

GitHub te mostrará comandos, pero si usas GitHub Desktop, ignóralos.

---

## ⚠️ Verificación de Seguridad

### Antes de subir, verifica:

```powershell
# Ver qué archivos se subirán
git status

# Verificar que .env está en .gitignore
cat .gitignore | Select-String ".env"
```

**NUNCA debe aparecer `.env` en la lista de archivos a subir.**

---

## 🎯 Resumen Rápido

**Si usas GitHub Desktop (FÁCIL):**
1. Instala GitHub Desktop
2. Add local repository → `auth-app`
3. Create repository
4. Commit
5. Publish repository
6. ¡Listo! 🎉

**Si usas Git en PowerShell:**
1. Abre NUEVA PowerShell
2. Crea repo en GitHub primero
3. Ejecuta comandos de arriba
4. Usa Token como password
5. ¡Listo! 🎉

---

## 📍 Tu Repositorio

Una vez subido, estará en:
```
https://github.com/Mary131912/librarybox
```

---

## 🚀 Después: Desplegar en Railway (GRATIS)

1. Ve a: https://railway.app
2. **Login with GitHub**
3. **New Project → Deploy from GitHub repo**
4. Selecciona: **Mary131912/librarybox**
5. Railway detectará el Dockerfile automáticamente
6. **Add Variables:**
   - `MONGODB_URI`: tu connection string de MongoDB Atlas
   - `JWT_SECRET`: tu_secreto_seguro
   - `PORT`: 3000
   - `NODE_ENV`: production
7. Deploy automático
8. Railway te dará una URL: `librarybox-production.up.railway.app`

---

## 🆘 Problemas Comunes

### "Git no se reconoce"
- Cierra PowerShell y abre una nueva ventana
- O usa GitHub Desktop (más fácil)

### "Permission denied"
- Asegúrate de usar HTTPS: `https://github.com/Mary131912/librarybox.git`
- Usa Personal Access Token, no tu contraseña

### "Subí .env por error"
```powershell
git rm --cached .env
git commit -m "Remove .env"
git push
# CAMBIA TODAS las credenciales de MongoDB
```

---

## 📞 Ayuda

Si tienes problemas:
1. Asegúrate que GitHub Desktop esté instalado
2. O abre una NUEVA PowerShell después de instalar Git
3. Verifica que estés en la carpeta correcta: `auth-app`

¡Tu proyecto LibraryBox estará en GitHub! 🚀
