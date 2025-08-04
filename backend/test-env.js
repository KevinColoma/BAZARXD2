// Prueba rápida de variables de entorno
require('dotenv').config();

console.log('=== VERIFICACIÓN DE VARIABLES DE ENTORNO ===');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✅ Configurado' : '❌ NO configurado');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✅ Configurado' : '❌ NO configurado');
console.log('SESSION_SECRET:', process.env.SESSION_SECRET ? '✅ Configurado' : '❌ NO configurado');
console.log('NODE_ENV:', process.env.NODE_ENV || 'No definido');
console.log('MONGO_URI:', process.env.MONGO_URI ? '✅ Configurado' : '❌ NO configurado');

console.log('\n=== VALORES (parciales) ===');
if (process.env.GOOGLE_CLIENT_ID) {
    console.log('CLIENT_ID (primeros 20 char):', process.env.GOOGLE_CLIENT_ID.substring(0, 20) + '...');
}
if (process.env.GOOGLE_CLIENT_SECRET) {
    console.log('CLIENT_SECRET (primeros 10 char):', process.env.GOOGLE_CLIENT_SECRET.substring(0, 10) + '...');
}
