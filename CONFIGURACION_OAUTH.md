# 🔐 CONFIGURACIÓN DE GOOGLE OAUTH - INSTRUCCIONES

## Paso 1: Crear un proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Dale un nombre como "KiroGlam OAuth"

## Paso 2: Habilitar la API de Google+

1. En el menú lateral, ve a "APIs y servicios" > "Biblioteca"
2. Busca "Google+ API" y habilítala
3. También habilita "Google OAuth2 API"

## Paso 3: Crear credenciales OAuth

1. Ve a "APIs y servicios" > "Credenciales"
2. Haz clic en "Crear credenciales" > "ID de cliente OAuth 2.0"
3. Selecciona "Aplicación web"
4. Configura:
   - **Nombre**: KiroGlam Web App
   - **Orígenes autorizados de JavaScript**:
     - http://localhost:4000
     - https://kiroglam.onrender.com
   - **URIs de redireccionamiento autorizados**:
     - http://localhost:4000/auth/google/callback
     - https://kiroglam.onrender.com/auth/google/callback

## Paso 4: Copiar las credenciales

1. Copia el **Client ID** y **Client Secret**
2. Reemplaza en tu archivo `.env`:
   ```
   GOOGLE_CLIENT_ID=tu-client-id-aqui
   GOOGLE_CLIENT_SECRET=tu-client-secret-aqui
   ```

## Paso 5: Configurar para producción (Render)

1. En tu dashboard de Render, ve a tu servicio
2. Ve a "Environment"
3. Agrega las variables:
   - `GOOGLE_CLIENT_ID`: tu client ID real
   - `GOOGLE_CLIENT_SECRET`: tu client secret real
   - `SESSION_SECRET`: una clave secreta segura
   - `NODE_ENV`: production

## 🚀 ¡Listo!

Una vez configurado, tu aplicación tendrá:
- ✅ Login con Google OAuth
- ✅ Sesiones seguras
- ✅ Información del usuario (nombre, email, foto)
- ✅ Logout funcional
- ✅ Protección de rutas

## 🔧 Para probar localmente:

1. Configura las credenciales en `.env`
2. Ejecuta: `npm start`
3. Ve a: http://localhost:4000/login.html
4. Haz clic en "Continuar con Google"

## 📝 Notas importantes:

- Mantén las credenciales secretas
- No las subas a GitHub
- El `.env` ya está en `.gitignore`
- Para producción, usa variables de entorno en Render
