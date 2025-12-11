# 📚 Mi Biblioteca Personal - Guía de Usuario

## 🎨 Nueva Interfaz Estética

Tu aplicación ahora cuenta con un diseño moderno y estético tipo dashboard con las siguientes mejoras:

### ✨ Características del Nuevo Diseño

#### 1. **Dashboard Principal** (`dashboard-new.html`)
- 🎯 **Interfaz amigable** al iniciar sesión
- 📊 **Tarjetas interactivas** con efectos hover
- 📈 **Estadísticas en tiempo real** (total de libros, géneros, promedio de valoración)
- 🚀 **Acciones rápidas** para navegar fácilmente

#### 2. **Colores y Efectos**
- 🌈 Gradientes modernos (púrpura, azul, rosa)
- ✨ Efectos de glass morphism (vidrio esmerilado)
- 🎭 Animaciones suaves y transiciones elegantes
- 💫 Sombras profundas y realistas

#### 3. **Navegación Mejorada**
- 🏠 Header con tu avatar personalizado
- 📅 Fecha actual actualizada
- 🔐 Cierre de sesión visible
- 🎯 Botones grandes y claros

---

## 🚀 Cómo Usar la Aplicación

### 1️⃣ **Iniciar Sesión**
1. Abre http://localhost:3000/login.html
2. Ingresa tu email y contraseña
3. Haz clic en "Iniciar Sesión"
4. Serás redirigido al **Dashboard Principal**

### 2️⃣ **Dashboard Principal**
Al iniciar sesión verás:

- **📖 Mi Biblioteca**: Ver todos tus libros
  - Muestra cuántos libros tienes
  - Indica cuántos géneros diferentes has leído
  
- **➕ Agregar Libro**: Añadir un nuevo libro
  - Se abre directamente el formulario de agregar
  - Rápido acceso sin navegar por menús
  
- **👤 Mi Perfil**: Gestionar tu cuenta
  - Ver tu información personal
  - Cambiar contraseña de forma segura
  
- **📊 Estadísticas**: Ver tus datos de lectura
  - Promedio de valoraciones
  - Análisis de tus hábitos de lectura

### 3️⃣ **Agregar un Libro**
Desde el dashboard:
1. Haz clic en la tarjeta **"Agregar Libro"** (➕)
2. Se abrirá automáticamente el formulario
3. Completa los campos:
   - 📖 Título (obligatorio)
   - ✍️ Autor (obligatorio)
   - 📂 Género (obligatorio, 11 opciones)
   - 📅 Año de publicación (obligatorio)
   - ⭐ Valoración del 1 al 5 (obligatorio)
   - 💭 Comentario (opcional)
4. Haz clic en **"Guardar Libro"**

### 4️⃣ **Ver y Gestionar tu Biblioteca**
1. Haz clic en **"Mi Biblioteca"** desde el dashboard
2. Usa las herramientas de búsqueda y filtro:
   - 🔍 **Buscar**: por título, autor o género
   - 📂 **Filtrar por género**: selecciona uno específico
   - 🔄 **Ordenar por**: fecha, título, autor, año, valoración

3. En cada tarjeta de libro puedes:
   - ✏️ **Editar**: modificar la información
   - 🗑️ **Eliminar**: con confirmación de seguridad

### 5️⃣ **Gestionar tu Perfil**
1. Haz clic en **"Mi Perfil"** desde el dashboard
2. Verás tu información:
   - Nombre completo
   - Email
   - Fecha de registro
   - Último acceso

3. Para cambiar contraseña:
   - Ingresa tu contraseña actual
   - Ingresa la nueva contraseña
   - Confirma la nueva contraseña
   - Haz clic en **"Cambiar Contraseña"**

---

## 🎨 Detalles Estéticos

### Colores y Gradientes
- **Primario**: Azul/Púrpura (#667eea → #764ba2)
- **Acento**: Rosa (#f093fb → #f5576c)
- **Secundario**: Cyan (#4facfe → #00f2fe)
- **Terciario**: Naranja (#fa709a → #fee140)

### Efectos Visuales
- ✨ **Glass Morphism**: Fondos translúcidos con blur
- 🎭 **Hover Effects**: Tarjetas que se elevan al pasar el mouse
- 💫 **Sombras Profundas**: Para dar sensación de profundidad
- 🌈 **Gradientes Animados**: En títulos y elementos importantes

### Iconos Emoji
- 📚 Biblioteca
- ➕ Agregar
- 👤 Perfil
- 📊 Estadísticas
- ⭐ Valoraciones
- 🔍 Búsqueda
- ✏️ Editar
- 🗑️ Eliminar

---

## 📱 Diseño Responsive

La aplicación se adapta perfectamente a:
- 💻 **Desktop**: Vista completa con todas las tarjetas
- 📱 **Tablet**: Diseño de 2 columnas
- 📱 **Móvil**: Vista de una sola columna, optimizada para touch

---

## 🔒 Seguridad

- 🛡️ JWT tokens con 30 minutos de expiración
- 🔐 Contraseñas encriptadas con bcrypt
- ✅ Validación en frontend y backend
- 🚫 Prevención de XSS con escape de HTML
- 👁️ Cada usuario solo ve sus propios libros

---

## 💡 Tips de Uso

1. **Búsqueda inteligente**: La búsqueda funciona en tiempo real mientras escribes
2. **Múltiples filtros**: Puedes combinar búsqueda + género + ordenamiento
3. **Estadísticas automáticas**: Se actualizan cada vez que agregas/eliminas un libro
4. **Sesión persistente**: Tu sesión dura 30 minutos sin actividad
5. **Confirmación de eliminación**: Siempre te pedirá confirmar antes de borrar

---

## 🎯 Accesos Directos

Desde cualquier página puedes:
- 🏠 **Botón Inicio**: Volver al dashboard principal
- 📚 **Botón Biblioteca**: Ir directamente a tus libros
- 👤 **Botón Perfil**: Acceder a tu configuración
- 🚪 **Cerrar Sesión**: Salir de forma segura

---

## 📞 Soporte

Si tienes problemas:
1. Verifica que el servidor esté corriendo: `npm run dev`
2. Revisa la consola del navegador (F12) para errores
3. Asegúrate de estar usando `http://localhost:3000`
4. Limpia el localStorage si hay problemas de sesión

---

## 🎉 ¡Disfruta tu Biblioteca!

Tu aplicación ahora es:
- ✅ Más bonita y moderna
- ✅ Más fácil de usar
- ✅ Más intuitiva
- ✅ Más profesional

¡Feliz lectura! 📖✨
