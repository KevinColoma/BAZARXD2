# KiroGlam - Sistema de Gestión

Sistema de gestión de inventario y facturación para KiroGlam.

## Características

- 🎒 Gestión de inventario de carteras
- 💰 Sistema de facturación
- 📊 Control de stock
- 👥 Sistema de administración
- 🔐 Autenticación de usuarios

## Tecnologías

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT para autenticación
- bcryptjs para encriptación

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla)
- Bootstrap 4
- Font Awesome

## Instalación Local

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/kiroglam.git
cd kiroglam
```

2. Instala las dependencias del backend:
```bash
cd backend
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env
# Edita el archivo .env con tus configuraciones
```

4. Inicia el servidor:
```bash
npm start
```

5. Abre tu navegador en `http://localhost:4000`

## Despliegue en Render

Este proyecto está configurado para desplegarse automáticamente en [Render](https://render.com).

### Variables de entorno necesarias:
- `MONGO_URI`: String de conexión a MongoDB Atlas
- `NODE_ENV`: production

## Estructura del Proyecto

```
├── backend/
│   ├── models/          # Modelos de MongoDB
│   ├── routes/          # Rutas de la API
│   ├── server.js        # Servidor principal
│   └── package.json
├── Fronted/
│   ├── JS/              # Scripts del frontend
│   ├── *.html           # Páginas web
│   └── style.css        # Estilos
└── README.md
```

## API Endpoints

### Carteras
- `GET /api/carteras` - Obtener todas las carteras
- `POST /api/carteras` - Crear nueva cartera
- `PUT /api/carteras/:id` - Actualizar cartera
- `DELETE /api/carteras/:id` - Eliminar cartera
- `POST /api/carteras/descontar-stock` - Descontar stock

### Admin
- `POST /api/admin/login` - Iniciar sesión
- `POST /api/admin/register` - Registrar admin

## Contribuir

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request
