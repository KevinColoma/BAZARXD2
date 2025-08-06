# 📖 Documentación de APIs - KiroGlam

Esta carpeta contiene toda la documentación completa de las APIs del sistema KiroGlam.

## 📁 Estructura de Documentación

```
docs/
├── 📄 api-docs.yaml          # Especificación OpenAPI completa
├── 📄 API-DOCS.md            # Documentación en Markdown
├── 🌐 swagger-ui.html        # Interfaz interactiva Swagger UI
├── 🏗️ architecture.puml      # Diagrama de arquitectura del sistema
├── 🔐 oauth-flow.puml        # Flujo de autenticación OAuth
├── 🗄️ database-schema.puml   # Esquema de base de datos
└── 📖 README.md              # Este archivo
```

## 🚀 Cómo Usar la Documentación

### 1. **Documentación Interactiva (Recomendado)**

Abre `swagger-ui.html` en tu navegador para una experiencia interactiva completa:

```bash
# Opción 1: Abrir directamente el archivo
start swagger-ui.html

# Opción 2: Servir con un servidor local
cd docs
python -m http.server 8080
# Luego visita: http://localhost:8080/swagger-ui.html
```

**Características:**
- ✅ Interfaz visual moderna
- ✅ Probar endpoints en tiempo real
- ✅ Ejemplos de peticiones y respuestas
- ✅ Validación automática de parámetros
- ✅ Detección automática de estado de autenticación

### 2. **Documentación en Markdown**

Lee `API-DOCS.md` para una guía completa y detallada:

```bash
# Ver en VS Code
code API-DOCS.md

# O en cualquier visor de Markdown
```

**Incluye:**
- 📋 Tabla de contenidos completa
- 🔐 Guía de autenticación
- 📊 Todos los endpoints documentados
- 💡 Ejemplos de uso prácticos
- ⚠️ Solución de errores comunes

### 3. **Especificación OpenAPI**

Usa `api-docs.yaml` con herramientas especializadas:

```bash
# Con Swagger Editor online
# Copia el contenido a: https://editor.swagger.io/

# Con Swagger Codegen para generar SDKs
swagger-codegen generate -i api-docs.yaml -l javascript -o ./sdk

# Con Postman
# Importa el archivo YAML directamente
```

## 🏗️ Diagramas de Arquitectura

### Renderizar Diagramas PlantUML

Los archivos `.puml` contienen diagramas del sistema:

```bash
# Instalar PlantUML
npm install -g plantuml

# Generar imágenes
plantuml architecture.puml
plantuml oauth-flow.puml
plantuml database-schema.puml

# O usar el servidor online
# Copia el contenido a: http://www.plantuml.com/plantuml/uml/
```

### **Diagramas Disponibles:**

1. **`architecture.puml`** - Vista general del sistema
   - Servicios en la nube (Render, MongoDB Atlas, Google Cloud)
   - Stack tecnológico completo
   - Flujo de datos entre componentes

2. **`oauth-flow.puml`** - Proceso de autenticación
   - Secuencia completa de OAuth 2.0
   - Interacciones usuario-sistema-Google
   - Manejo de sesiones

3. **`database-schema.puml`** - Estructura de datos
   - Colecciones de MongoDB
   - Relaciones entre entidades
   - Campos y tipos de datos

## 🔧 Configuración de Desarrollo

### Para Contribuir a la Documentación:

1. **Editar Especificación OpenAPI:**
   ```bash
   # Editar api-docs.yaml
   code api-docs.yaml
   
   # Validar sintaxis
   swagger-codegen validate -i api-docs.yaml
   ```

2. **Actualizar Markdown:**
   ```bash
   # Editar documentación
   code API-DOCS.md
   
   # Preview en VS Code: Ctrl+Shift+V
   ```

3. **Modificar Diagramas:**
   ```bash
   # Editar con VS Code + PlantUML extension
   code architecture.puml
   
   # O usar editor online: http://www.plantuml.com/plantuml/uml/
   ```

### Sincronización con API Real:

```bash
# Actualizar desde el código fuente
node scripts/generate-docs.js

# Validar endpoints activos
curl https://bazarxd.onrender.com/health
curl https://bazarxd.onrender.com/auth/debug
```

## 🌐 Integración en Aplicación

### Servir Documentación desde Express:

```javascript
// En server.js
app.use('/docs', express.static('docs'));

// Rutas específicas
app.get('/api-docs', (req, res) => {
  res.sendFile(path.join(__dirname, 'docs/swagger-ui.html'));
});

app.get('/api-docs.yaml', (req, res) => {
  res.sendFile(path.join(__dirname, 'docs/api-docs.yaml'));
});
```

### URLs de Acceso:
- 📊 **Swagger UI:** https://bazarxd.onrender.com/docs/swagger-ui.html
- 📄 **OpenAPI Spec:** https://bazarxd.onrender.com/docs/api-docs.yaml
- 📖 **Markdown:** https://bazarxd.onrender.com/docs/API-DOCS.md

## 📚 Herramientas Recomendadas

### **Para Desarrollo:**
- [VS Code](https://code.visualstudio.com/) + [OpenAPI Extension](https://marketplace.visualstudio.com/items?itemName=42Crunch.vscode-openapi)
- [Swagger Editor](https://editor.swagger.io/) - Editor online
- [Postman](https://www.postman.com/) - Testing de APIs
- [Insomnia](https://insomnia.rest/) - Cliente REST alternativo

### **Para Diagramas:**
- [PlantUML Extension for VS Code](https://marketplace.visualstudio.com/items?itemName=jebbs.plantuml)
- [PlantUML Online Server](http://www.plantuml.com/plantuml/uml/)
- [Draw.io](https://app.diagrams.net/) - Alternativa visual

### **Para Documentación:**
- [Markdown Preview Enhanced](https://marketplace.visualstudio.com/items?itemName=shd101wyy.markdown-preview-enhanced)
- [GitBook](https://www.gitbook.com/) - Hosting de documentación
- [Notion](https://www.notion.so/) - Wiki colaborativo

## 🔍 Casos de Uso

### **1. Desarrollador Frontend:**
```bash
# Consultar endpoints disponibles
open swagger-ui.html

# Ver ejemplos de respuestas
grep -A 10 "Response" API-DOCS.md

# Copiar código JavaScript
# Ver sección "Ejemplos de Uso" en API-DOCS.md
```

### **2. Desarrollador Backend:**
```bash
# Validar implementación actual
swagger-codegen validate -i api-docs.yaml

# Generar mock server
swagger-codegen generate -i api-docs.yaml -l nodejs-server -o ./mock-server

# Sincronizar con código real
diff api-docs.yaml ../backend/routes/
```

### **3. Tester/QA:**
```bash
# Importar en Postman
# File > Import > api-docs.yaml

# Generar colección automatizada
newman run postman-collection.json

# Verificar todos los endpoints
curl -X GET https://bazarxd.onrender.com/health
```

### **4. DevOps/Deployment:**
```bash
# Servir documentación estática
nginx -c nginx-docs.conf

# Integrar en CI/CD
docker run -v $(pwd):/docs swaggerapi/swagger-ui

# Monitoring de APIs
curl -s https://bazarxd.onrender.com/health | jq '.status'
```

## 🚨 Mantenimiento

### **Actualización Regular:**
1. **Revisar cambios en código:** Cada vez que se añaden/modifican endpoints
2. **Validar documentación:** Verificar que ejemplos funcionen
3. **Sincronizar versiones:** Mantener consistencia entre código y docs
4. **Testing:** Probar la documentación interactiva regularmente

### **Checklist de Actualización:**
- [ ] ¿Nuevos endpoints documentados?
- [ ] ¿Ejemplos de respuesta actualizados?
- [ ] ¿Códigos de error cubiertos?
- [ ] ¿Diagramas reflejan cambios arquitectónicos?
- [ ] ¿Swagger UI funciona correctamente?

## 📞 Soporte

- **Repositorio:** [GitHub](https://github.com/KevinColoma/BAZARXD2)
- **API en Producción:** [https://bazarxd.onrender.com](https://bazarxd.onrender.com)
- **Documentación Interactiva:** [Swagger UI](./swagger-ui.html)

---

*📅 Última actualización: Enero 2025*  
*📝 Versión: 1.0.0*  
*👨‍💻 Equipo: KiroGlam Development*
