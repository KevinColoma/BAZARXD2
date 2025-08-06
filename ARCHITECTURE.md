# 🏪 KiroGlam - Sistema de Gestión de Bazar

## 📋 Descripción del Proyecto

KiroGlam es un sistema web completo para la gestión de un bazar de variedades, desarrollado con tecnologías modernas y desplegado completamente en la nube.

## 🏗️ Arquitectura del Sistema

### 🌐 Infraestructura en la Nube

#### **Render.com** - Hosting & Deployment
- **URL:** https://bazarxd.onrender.com
- **Puerto:** 4000 (interno)
- **SSL/TLS:** Automático
- **Deploy:** Auto-deploy desde GitHub
- **Región:** us-east-1

#### **MongoDB Atlas** - Base de Datos
- **Tier:** M0 (Free Tier)
- **Provider:** AWS
- **Región:** us-east-1
- **Storage:** 512 MB
- **Backup:** Automático
- **Conexión:** SRV con SSL/TLS

#### **Google Cloud** - Autenticación
- **OAuth 2.0:** Google Identity Platform
- **Scopes:** profile, email
- **Callback:** https://bazarxd.onrender.com/auth/google/callback

#### **GitHub** - Repositorio & CI/CD
- **Repo:** KevinColoma/BAZARXD2
- **Branch:** main
- **Webhook:** Auto-deploy a Render

## 🛠️ Stack Tecnológico

### Backend
```javascript
{
  "runtime": "Node.js v18+",
  "framework": "Express.js v4.18+",
  "authentication": "Passport.js + Google OAuth 2.0",
  "sessions": "express-session",
  "database": "MongoDB with Mongoose ODM",
  "cors": "Habilitado para SPA",
  "security": "Helmet.js, HTTPS, secure cookies"
}
```

### Frontend
```javascript
{
  "markup": "HTML5",
  "styling": "CSS3 + Bootstrap 4.6",
  "scripting": "Vanilla JavaScript ES6+",
  "icons": "Font Awesome 6.4",
  "responsive": "Mobile-first design",
  "pwa": "Service Worker ready"
}
```

### Base de Datos
```javascript
{
  "engine": "MongoDB 6.0+",
  "collections": [
    "admin",      // Usuarios administradores
    "carteras",   // Productos del inventario
    "ventas",     // Historial de ventas
    "sessions"    // Sesiones de usuario (express-session)
  ]
}
```

## 🔐 Sistema de Autenticación

### Flujo OAuth 2.0
1. Usuario accede a `/login.html`
2. Click en "Continuar con Google"
3. Redirección a Google OAuth
4. Usuario autoriza la aplicación
5. Google retorna código de autorización
6. Servidor intercambia código por token
7. Creación de sesión con datos del usuario
8. Redirección a `/menu.html`

### Configuración de Sesiones
```javascript
{
  "store": "MongoDB (connect-mongo)",
  "duration": "24 horas",
  "secure": true,        // Solo HTTPS en producción
  "httpOnly": true,      // Prevenir XSS
  "sameSite": "lax",     // CSRF protection
  "name": "kiroglam.sid" // Cookie personalizada
}
```

## 📚 API Endpoints

### Autenticación
- `GET /auth/google` - Iniciar OAuth
- `GET /auth/google/callback` - Callback OAuth
- `GET /auth/user` - Verificar estado de sesión
- `POST /auth/logout` - Cerrar sesión
- `GET /auth/debug` - Información de configuración

### Gestión de Productos
- `GET /api/carteras` - Listar productos
- `POST /api/carteras` - Crear producto
- `PUT /api/carteras/:id` - Actualizar producto
- `DELETE /api/carteras/:id` - Eliminar producto
- `POST /api/carteras/descontar-stock` - Procesar venta

### Administración
- `POST /api/admin/login` - Login tradicional (legacy)
- `GET /api/admin/profile` - Perfil de administrador

## 🌍 Variables de Entorno

### Producción (Render)
```bash
NODE_ENV=production
GOOGLE_CLIENT_ID=tu_client_id_de_google
GOOGLE_CLIENT_SECRET=tu_client_secret_de_google
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/kiroglam
SESSION_SECRET=clave_secreta_para_sesiones
PORT=4000
```

### Desarrollo Local
```bash
NODE_ENV=development
GOOGLE_CLIENT_ID=tu_client_id_local
GOOGLE_CLIENT_SECRET=tu_client_secret_local
MONGO_URI=mongodb://localhost:27017/kiroglam
SESSION_SECRET=desarrollo-secret
PORT=4000
```

## 📱 Funcionalidades

### 🏪 Gestión de Inventario
- ✅ CRUD completo de productos
- ✅ Subida de imágenes por URL
- ✅ Control de stock con alertas
- ✅ Búsqueda y filtrado
- ✅ Responsive design para móviles

### 💰 Sistema de Ventas
- ✅ Carrito de compras
- ✅ Cálculo automático de totales
- ✅ Reducción automática de stock
- ✅ Generación de facturas en PDF
- ✅ Historial de ventas

### 🔒 Seguridad
- ✅ Autenticación OAuth 2.0 con Google
- ✅ Sesiones seguras con MongoDB
- ✅ HTTPS obligatorio en producción
- ✅ Cookies seguras y HttpOnly
- ✅ Protección CSRF

### 📊 Panel de Administración
- ✅ Dashboard principal
- ✅ Información del usuario autenticado
- ✅ Logout seguro
- ✅ Navegación intuitiva

## 🚀 Deployment

### Configuración en Render
1. Conectar repositorio GitHub
2. Configurar variables de entorno
3. Build command: `npm install`
4. Start command: `npm start`
5. Deploy automático en cada push

### Configuración OAuth en Google Cloud
1. Crear proyecto en Google Cloud Console
2. Habilitar Google+ API
3. Crear credenciales OAuth 2.0
4. Configurar URLs autorizadas:
   - `https://bazarxd.onrender.com`
   - `https://bazarxd.onrender.com/auth/google/callback`

## 📈 Monitoreo y Logs

### Render Dashboard
- ✅ Logs en tiempo real
- ✅ Métricas de performance
- ✅ Status de deployment
- ✅ Variables de entorno

### MongoDB Atlas
- ✅ Métricas de base de datos
- ✅ Conexiones activas
- ✅ Queries más lentas
- ✅ Uso de storage

## 🔧 Desarrollo Local

```bash
# Clonar repositorio
git clone https://github.com/KevinColoma/BAZARXD2.git
cd BAZARXD2/backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Ejecutar en desarrollo
npm run dev

# Acceder a la aplicación
open http://localhost:4000
```

## 📞 Soporte

- **Repositorio:** https://github.com/KevinColoma/BAZARXD2
- **Aplicación:** https://bazarxd.onrender.com
- **Documentación:** Ver carpeta `/docs`

---

**Desarrollado con ❤️ para KiroGlam Bazar**
