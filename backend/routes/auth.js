const express = require('express');
const passport = require('../config/oauth');
const router = express.Router();

// Middleware para verificar autenticación
const requireAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: 'No autenticado' });
};

// Ruta para iniciar autenticación con Google
router.get('/google', 
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback de Google OAuth
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login.html' }),
    (req, res) => {
        // Autenticación exitosa
        res.redirect('/menu.html');
    }
);

// Ruta para obtener información del usuario autenticado
router.get('/user', requireAuth, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

// Ruta para logout
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al cerrar sesión' });
        }
        res.json({ success: true, message: 'Sesión cerrada' });
    });
});

module.exports = router;
