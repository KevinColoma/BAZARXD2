const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Debug: Verificar que las credenciales se cargan correctamente
console.log('🔐 Configurando Google OAuth...');
console.log('CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Configurado ✅' : 'NO CONFIGURADO ❌');
console.log('CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'Configurado ✅' : 'NO CONFIGURADO ❌');
console.log('Entorno:', process.env.NODE_ENV || 'development');

// Configuración de Google OAuth
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'tu-client-id-aqui',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'tu-client-secret-aqui',
    callbackURL: process.env.NODE_ENV === 'production' 
        ? "https://bazarxd.onrender.com/auth/google/callback"
        : "http://localhost:4000/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('🔍 [GOOGLE-STRATEGY] Procesando perfil de Google:', {
            id: profile.id,
            displayName: profile.displayName,
            email: profile.emails?.[0]?.value,
            photo: profile.photos?.[0]?.value
        });
        
        // Aquí puedes guardar el usuario en tu base de datos si quieres
        const user = {
            id: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value || 'Sin email',
            photo: profile.photos?.[0]?.value || '',
            provider: 'google',
            accessToken: accessToken // Guardar token si lo necesitas
        };
        
        console.log('✅ [GOOGLE-STRATEGY] Usuario creado:', user);
        return done(null, user);
    } catch (error) {
        console.error('❌ [GOOGLE-STRATEGY] Error:', error);
        return done(error, null);
    }
}));

// Serializar usuario para la sesión
passport.serializeUser((user, done) => {
    console.log('📝 [PASSPORT] Serializando usuario:', user);
    done(null, user);
});

// Deserializar usuario de la sesión
passport.deserializeUser((user, done) => {
    console.log('📖 [PASSPORT] Deserializando usuario:', user);
    done(null, user);
});

module.exports = passport;
