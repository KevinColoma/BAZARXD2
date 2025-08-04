// Cargar variables de entorno PRIMERO
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const passport = require('./config/oauth');

const app = express();
app.use(cors());
app.use(express.json());

// Configurar sesiones para OAuth
app.use(session({
  secret: process.env.SESSION_SECRET || 'kiroglam-secret-key-2025',
  resave: false,
  saveUninitialized: false,
  name: 'kiroglam.sid', // Nombre personalizado para la cookie
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true, // Proteger contra XSS
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
    sameSite: 'lax' // Permitir cookies en redirects
  }
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error(err));

// Ruta de prueba
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Servidor KiroGlam funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Rutas de la API
app.use('/api/admin', require('./routes/admin'));
app.use('/api/carteras', require('./routes/carteras'));

// Rutas de autenticación OAuth
app.use('/auth', require('./routes/auth'));

// Ruta para servir el frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
