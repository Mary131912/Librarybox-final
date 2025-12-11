# Guía de Instalación de MongoDB

## Opción 1: MongoDB Atlas (Recomendado - Gratis y Fácil) ☁️

1. **Registrarse en MongoDB Atlas:**
   - Ve a: https://www.mongodb.com/cloud/atlas/register
   - Crea una cuenta gratuita

2. **Crear un Cluster:**
   - Selecciona el plan FREE (M0)
   - Elige una región cercana
   - Crea el cluster

3. **Configurar acceso:**
   - Crea un usuario de base de datos (guarda usuario y contraseña)
   - En Network Access, agrega tu IP o usa `0.0.0.0/0` (permite todas las IPs)

4. **Obtener string de conexión:**
   - Click en "Connect" en tu cluster
   - Selecciona "Connect your application"
   - Copia el string de conexión
   - Se verá así: `mongodb+srv://usuario:<password>@cluster0.xxxxx.mongodb.net/auth-app`

5. **Actualizar el archivo .env:**
   ```env
   MONGODB_URI=mongodb+srv://tu_usuario:tu_password@cluster0.xxxxx.mongodb.net/auth-app
   JWT_SECRET=secreto_super_seguro_cambiar_en_produccion_12345
   PORT=3000
   ```

6. **¡Listo! Ejecuta la aplicación:**
   ```bash
   npm start
   ```

---

## Opción 2: MongoDB Local (Requiere Instalación) 💻

1. **Descargar MongoDB Community Server:**
   - Ve a: https://www.mongodb.com/try/download/community
   - Descarga la versión para Windows
   - Ejecuta el instalador

2. **Durante la instalación:**
   - Selecciona "Complete" installation
   - Marca "Install MongoDB as a Service"
   - Usa la configuración predeterminada

3. **Verificar instalación:**
   ```bash
   mongod --version
   ```

4. **Iniciar MongoDB:**
   ```bash
   net start MongoDB
   ```

5. **Usar la configuración local en .env:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/auth-app
   JWT_SECRET=secreto_super_seguro_cambiar_en_produccion_12345
   PORT=3000
   ```

6. **Ejecutar la aplicación:**
   ```bash
   npm start
   ```

---

## ⚡ Inicio Rápido con Atlas (5 minutos)

Si eliges MongoDB Atlas, estos son los pasos rápidos:

1. Regístrate en https://www.mongodb.com/cloud/atlas/register
2. Crea un cluster FREE
3. Crea usuario de BD (ejemplo: `admin` / `Password123`)
4. Añade IP: `0.0.0.0/0` en Network Access
5. Obtén el connection string
6. Actualiza `.env` con tu string de conexión
7. Ejecuta `npm start`

---

## 🆘 Problemas Comunes

### Error: "MongoNetworkError"
- Verifica tu conexión a internet
- Comprueba que las credenciales sean correctas
- Asegúrate de haber configurado Network Access en Atlas

### Error: "Authentication failed"
- Verifica usuario y contraseña en el string de conexión
- Asegúrate de reemplazar `<password>` con tu contraseña real

### No puedo instalar MongoDB localmente
- Usa MongoDB Atlas, es más fácil y gratuito
- No requiere instalación local
- Funciona desde cualquier lugar con internet
