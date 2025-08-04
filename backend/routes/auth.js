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
    (req, res, next) => {
        console.log('🔄 Callback recibido de Google');
        console.log('Query params:', req.query);
        console.log('Entorno:', process.env.NODE_ENV);
        console.log('URL completa:', req.url);
        
        // Verificar si hay errores en los query params
        if (req.query.error) {
            console.log('❌ Error en OAuth:', req.query.error);
            console.log('Descripción:', req.query.error_description);
            return res.redirect('/login.html?error=' + encodeURIComponent(req.query.error));
        }
        
        next();
    },
    passport.authenticate('google', { 
        failureRedirect: '/login.html?error=auth_failed',
        failureMessage: true,
        session: true
    }),
    (req, res) => {
        console.log('✅ Autenticación exitosa');
        console.log('Usuario autenticado:', req.user);
        console.log('Sesión ID:', req.sessionID);
        console.log('¿Está autenticado?:', req.isAuthenticated());
        
        // Verificar que el usuario existe antes de redirigir
        if (!req.user) {
            console.log('❌ No hay usuario en la sesión');
            return res.redirect('/login.html?error=no_user');
        }
        
        // Autenticación exitosa
        res.redirect('/menu.html');
    }
);

// Ruta para obtener información del usuario autenticado
router.get('/user', (req, res) => {
    console.log('🔍 Verificación de usuario solicitada');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('Sesión ID:', req.sessionID);
    console.log('¿Está autenticado?:', req.isAuthenticated ? req.isAuthenticated() : 'función no disponible');
    console.log('Usuario en sesión:', req.user);
    console.log('Cookies:', req.headers.cookie);
    console.log('Session data:', JSON.stringify(req.session, null, 2));
    
    if (req.isAuthenticated && req.isAuthenticated() && req.user) {
        console.log('✅ Usuario autenticado encontrado');
        res.json({
            success: true,
            user: req.user,
            nodeEnv: process.env.NODE_ENV,
            sessionID: req.sessionID
        });
    } else {
        console.log('❌ Usuario no autenticado');
        res.status(401).json({ 
            error: 'No autenticado',
            details: {
                hasSession: !!req.session,
                sessionID: req.sessionID,
                isAuthenticated: req.isAuthenticated ? req.isAuthenticated() : false,
                hasUser: !!req.user,
                nodeEnv: process.env.NODE_ENV,
                cookies: req.headers.cookie
            }
        });
    }
});

// Ruta de debug para verificar configuración
router.get('/debug', (req, res) => {
    res.json({
        environment: process.env.NODE_ENV,
        hasClientId: !!process.env.GOOGLE_CLIENT_ID,
        hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.NODE_ENV === 'production' 
            ? "https://bazarxd.onrender.com/auth/google/callback"
            : "http://localhost:4000/auth/google/callback",
        isAuthenticated: req.isAuthenticated ? req.isAuthenticated() : false,
        sessionConfig: {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
        },
        currentSession: {
            id: req.sessionID,
            data: req.session
        }
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
