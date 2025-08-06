# 🚀 KiroGlam API Documentation

## 📋 Tabla de Contenidos

- [Información General](#información-general)
- [Autenticación](#autenticación)
- [Endpoints de Autenticación](#endpoints-de-autenticación)
- [Endpoints de Productos](#endpoints-de-productos)
- [Endpoints de Administración](#endpoints-de-administración)
- [Códigos de Respuesta](#códigos-de-respuesta)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [Errores Comunes](#errores-comunes)

## 📝 Información General

**Base URL:** `https://bazarxd.onrender.com`  
**Versión:** 1.0.0  
**Formato:** JSON  
**Autenticación:** OAuth 2.0 + Sesiones  

### 🏗️ Arquitectura API
- **Framework:** Express.js + Node.js
- **Base de Datos:** MongoDB Atlas
- **Autenticación:** Google OAuth 2.0
- **Sesiones:** express-session con MongoDB store

## 🔐 Autenticación

La API utiliza **OAuth 2.0 con Google** para autenticación. Una vez autenticado, el sistema maneja sesiones mediante cookies seguras.

### Flujo de Autenticación
1. Usuario hace clic en "Continuar con Google"
2. Redirección a Google OAuth
3. Usuario autoriza la aplicación
4. Callback recibe código de autorización
5. Servidor crea sesión con datos del usuario
6. Cookie `kiroglam.sid` se establece para peticiones futuras

### Headers Requeridos
```http
Cookie: kiroglam.sid=s%3A...
Content-Type: application/json
```

---

## 🔑 Endpoints de Autenticación

### `GET /auth/google`
Inicia el flujo de autenticación OAuth con Google.

**Respuesta:**
- `302` - Redirección a Google OAuth

**Ejemplo:**
```bash
curl -X GET https://bazarxd.onrender.com/auth/google
```

---

### `GET /auth/google/callback`
Callback que recibe la respuesta de Google OAuth.

**Parámetros Query:**
- `code` (string, requerido) - Código de autorización de Google
- `state` (string, opcional) - Parámetro de estado para CSRF

**Respuestas:**
- `302` - Redirección exitosa a `/menu.html`
- `401` - Error de autenticación

---

### `GET /auth/user`
Verifica el estado de autenticación del usuario actual.

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "user": {
    "id": "108169624057227550122",
    "name": "KevinC Blad",
    "email": "kcoloma89@gmail.com",
    "photo": "https://lh3.googleusercontent.com/a/...",
    "provider": "google",
    "accessToken": "ya29.A0AS3H6N..."
  },
  "nodeEnv": "production",
  "sessionID": "abc123..."
}
```

**Respuesta Error (401):**
```json
{
  "error": "No autenticado",
  "details": {
    "hasSession": false,
    "sessionID": "abc123...",
    "isAuthenticated": false,
    "hasUser": false
  }
}
```

**Ejemplo:**
```bash
curl -X GET https://bazarxd.onrender.com/auth/user \
  -H "Cookie: kiroglam.sid=s%3A..."
```

---

### `POST /auth/logout`
Cierra la sesión del usuario actual.

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Sesión cerrada"
}
```

**Ejemplo:**
```bash
curl -X POST https://bazarxd.onrender.com/auth/logout \
  -H "Cookie: kiroglam.sid=s%3A..."
```

---

### `GET /auth/debug`
Información técnica para debugging (solo desarrollo).

**Respuesta (200):**
```json
{
  "environment": "production",
  "hasClientId": true,
  "hasClientSecret": true,
  "callbackURL": "https://bazarxd.onrender.com/auth/google/callback",
  "sessionConfig": {
    "secure": true,
    "httpOnly": true,
    "sameSite": "lax",
    "maxAge": 86400000
  },
  "currentSession": {
    "id": "session-id",
    "data": {...}
  }
}
```

---

## 🛍️ Endpoints de Productos

### `GET /api/carteras`
Obtiene la lista completa de productos del inventario.

**Respuesta (200):**
```json
[
  {
    "_id": "64a1b2c3d4e5f6789abcdef0",
    "descripcion": "Cartera de cuero roja",
    "precio": 29.99,
    "stock": 15,
    "imagen": "https://example.com/images/cartera.jpg",
    "categoria": "Accesorios",
    "createdAt": "2025-08-04T12:00:00.000Z",
    "updatedAt": "2025-08-04T12:00:00.000Z"
  }
]
```

**Ejemplo:**
```bash
curl -X GET https://bazarxd.onrender.com/api/carteras \
  -H "Cookie: kiroglam.sid=s%3A..."
```

---

### `POST /api/carteras`
Crea un nuevo producto en el inventario.

**Body (JSON):**
```json
{
  "descripcion": "Cartera de cuero roja",
  "precio": 29.99,
  "stock": 15,
  "imagen": "https://example.com/images/cartera.jpg",
  "categoria": "Accesorios"
}
```

**Respuesta (201):**
```json
{
  "_id": "64a1b2c3d4e5f6789abcdef0",
  "descripcion": "Cartera de cuero roja",
  "precio": 29.99,
  "stock": 15,
  "imagen": "https://example.com/images/cartera.jpg",
  "categoria": "Accesorios",
  "createdAt": "2025-08-04T12:00:00.000Z",
  "updatedAt": "2025-08-04T12:00:00.000Z"
}
```

**Ejemplo:**
```bash
curl -X POST https://bazarxd.onrender.com/api/carteras \
  -H "Cookie: kiroglam.sid=s%3A..." \
  -H "Content-Type: application/json" \
  -d '{
    "descripcion": "Cartera de cuero roja",
    "precio": 29.99,
    "stock": 15,
    "imagen": "https://example.com/images/cartera.jpg"
  }'
```

---

### `GET /api/carteras/{id}`
Obtiene los detalles de un producto específico.

**Parámetros:**
- `id` (string) - ID único del producto

**Respuesta (200):**
```json
{
  "_id": "64a1b2c3d4e5f6789abcdef0",
  "descripcion": "Cartera de cuero roja",
  "precio": 29.99,
  "stock": 15,
  "imagen": "https://example.com/images/cartera.jpg",
  "categoria": "Accesorios",
  "createdAt": "2025-08-04T12:00:00.000Z",
  "updatedAt": "2025-08-04T12:00:00.000Z"
}
```

**Ejemplo:**
```bash
curl -X GET https://bazarxd.onrender.com/api/carteras/64a1b2c3d4e5f6789abcdef0 \
  -H "Cookie: kiroglam.sid=s%3A..."
```

---

### `PUT /api/carteras/{id}`
Actualiza un producto existente.

**Parámetros:**
- `id` (string) - ID único del producto

**Body (JSON):**
```json
{
  "descripcion": "Cartera de cuero roja actualizada",
  "precio": 35.99,
  "stock": 20,
  "imagen": "https://example.com/images/cartera-nueva.jpg",
  "categoria": "Accesorios Premium"
}
```

**Respuesta (200):**
```json
{
  "_id": "64a1b2c3d4e5f6789abcdef0",
  "descripcion": "Cartera de cuero roja actualizada",
  "precio": 35.99,
  "stock": 20,
  "imagen": "https://example.com/images/cartera-nueva.jpg",
  "categoria": "Accesorios Premium",
  "createdAt": "2025-08-04T12:00:00.000Z",
  "updatedAt": "2025-08-04T12:30:00.000Z"
}
```

**Ejemplo:**
```bash
curl -X PUT https://bazarxd.onrender.com/api/carteras/64a1b2c3d4e5f6789abcdef0 \
  -H "Cookie: kiroglam.sid=s%3A..." \
  -H "Content-Type: application/json" \
  -d '{
    "descripcion": "Cartera de cuero roja actualizada",
    "precio": 35.99,
    "stock": 20,
    "imagen": "https://example.com/images/cartera-nueva.jpg"
  }'
```

---

### `DELETE /api/carteras/{id}`
Elimina un producto del inventario.

**Parámetros:**
- `id` (string) - ID único del producto

**Respuesta (200):**
```json
{
  "message": "Producto eliminado exitosamente"
}
```

**Ejemplo:**
```bash
curl -X DELETE https://bazarxd.onrender.com/api/carteras/64a1b2c3d4e5f6789abcdef0 \
  -H "Cookie: kiroglam.sid=s%3A..."
```

---

### `POST /api/carteras/descontar-stock`
Reduce el stock de productos cuando se realiza una venta.

**Body (JSON):**
```json
{
  "productos": [
    {
      "id": "64a1b2c3d4e5f6789abcdef0",
      "cantidad": 2
    },
    {
      "id": "64a1b2c3d4e5f6789abcdef1",
      "cantidad": 1
    }
  ]
}
```

**Respuesta (200):**
```json
{
  "message": "Stock actualizado exitosamente",
  "productosActualizados": [
    {
      "_id": "64a1b2c3d4e5f6789abcdef0",
      "descripcion": "Cartera de cuero roja",
      "precio": 29.99,
      "stock": 13,
      "imagen": "https://example.com/images/cartera.jpg"
    }
  ]
}
```

**Ejemplo:**
```bash
curl -X POST https://bazarxd.onrender.com/api/carteras/descontar-stock \
  -H "Cookie: kiroglam.sid=s%3A..." \
  -H "Content-Type: application/json" \
  -d '{
    "productos": [
      {"id": "64a1b2c3d4e5f6789abcdef0", "cantidad": 2}
    ]
  }'
```

---

## 👨‍💼 Endpoints de Administración

### `POST /api/admin/login` ⚠️ DEPRECATED
Sistema de login tradicional (obsoleto, usar OAuth).

**Body (JSON):**
```json
{
  "email": "admin@kiroglam.com",
  "password": "password123"
}
```

**Respuesta (200):**
```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "64a1b2c3d4e5f6789abcdef0",
    "nombre": "Administrador Principal",
    "email": "admin@kiroglam.com",
    "rol": "admin"
  }
}
```

---

## 🏥 Endpoints de Sistema

### `GET /health`
Verifica el estado de salud del servidor.

**Respuesta (200):**
```json
{
  "status": "OK",
  "message": "Servidor KiroGlam funcionando correctamente",
  "timestamp": "2025-08-04T12:00:00.000Z"
}
```

**Ejemplo:**
```bash
curl -X GET https://bazarxd.onrender.com/health
```

---

## 📊 Códigos de Respuesta

| Código | Descripción | Uso |
|--------|-------------|-----|
| `200` | OK | Operación exitosa |
| `201` | Created | Recurso creado exitosamente |
| `302` | Found | Redirección |
| `400` | Bad Request | Datos inválidos en la petición |
| `401` | Unauthorized | No autenticado |
| `403` | Forbidden | Sin permisos |
| `404` | Not Found | Recurso no encontrado |
| `500` | Internal Server Error | Error interno del servidor |

---

## 💡 Ejemplos de Uso

### Flujo Completo de Autenticación
```javascript
// 1. Iniciar OAuth (desde el frontend)
window.location.href = '/auth/google';

// 2. Después del callback, verificar estado
fetch('/auth/user', {
  credentials: 'same-origin'
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    console.log('Usuario autenticado:', data.user.name);
  }
});
```

### Gestión de Productos
```javascript
// Obtener todos los productos
const productos = await fetch('/api/carteras', {
  credentials: 'same-origin'
}).then(res => res.json());

// Crear nuevo producto
const nuevoProducto = await fetch('/api/carteras', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'same-origin',
  body: JSON.stringify({
    descripcion: 'Cartera nueva',
    precio: 25.00,
    stock: 10,
    imagen: 'https://example.com/imagen.jpg'
  })
}).then(res => res.json());

// Actualizar producto
const productoActualizado = await fetch(`/api/carteras/${id}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'same-origin',
  body: JSON.stringify({
    descripcion: 'Cartera actualizada',
    precio: 30.00,
    stock: 15,
    imagen: 'https://example.com/imagen-nueva.jpg'
  })
}).then(res => res.json());

// Eliminar producto
await fetch(`/api/carteras/${id}`, {
  method: 'DELETE',
  credentials: 'same-origin'
});
```

### Procesar Venta
```javascript
// Descontar stock después de una venta
const resultado = await fetch('/api/carteras/descontar-stock', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'same-origin',
  body: JSON.stringify({
    productos: [
      { id: '64a1b2c3d4e5f6789abcdef0', cantidad: 2 },
      { id: '64a1b2c3d4e5f6789abcdef1', cantidad: 1 }
    ]
  })
}).then(res => res.json());
```

---

## ⚠️ Errores Comunes

### Error 401 - No autenticado
```json
{
  "error": "No autenticado",
  "details": {
    "hasSession": false,
    "sessionID": null,
    "isAuthenticated": false,
    "hasUser": false
  }
}
```
**Solución:** Verificar que la cookie de sesión esté presente y válida.

### Error 400 - Datos inválidos
```json
{
  "error": "Datos inválidos",
  "details": {
    "field": "precio",
    "message": "El precio debe ser mayor a 0"
  }
}
```
**Solución:** Verificar que todos los campos requeridos estén presentes y con formato correcto.

### Error 404 - Producto no encontrado
```json
{
  "error": "Producto no encontrado",
  "details": {
    "id": "64a1b2c3d4e5f6789abcdef0"
  }
}
```
**Solución:** Verificar que el ID del producto sea válido y exista en la base de datos.

---

## 📞 Soporte

- **Repositorio:** [GitHub](https://github.com/KevinColoma/BAZARXD2)
- **Demo:** [https://bazarxd.onrender.com](https://bazarxd.onrender.com)
- **Documentación:** Ver carpeta `/docs`

---

*Documentación generada para KiroGlam API v1.0.0*
