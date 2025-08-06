# Nuevas Funcionalidades - Sistema de Inventario

## APIs Agregadas

### 1. Calcular Total de Stock
**Endpoint:** `GET /api/carteras/total-stock`

**Descripción:** Obtiene el total de stock de todos los productos en el inventario.

**Respuesta:**
```json
{
  "totalStock": 150,
  "totalProductos": 25,
  "stockPorProducto": [
    {
      "descripcion": "Cartera Clásica",
      "stock": 10
    }
  ]
}
```

### 2. Calcular IVA de Productos
**Endpoint:** `POST /api/carteras/calcular-iva`

**Descripción:** Calcula el IVA para una lista de productos seleccionados.

**Cuerpo de la petición:**
```json
{
  "productos": [
    {
      "_id": "product_id",
      "cantidad": 2
    }
  ],
  "porcentajeIva": 16
}
```

**Respuesta:**
```json
{
  "productos": [
    {
      "descripcion": "Cartera Clásica",
      "precio": 25.00,
      "cantidad": 2,
      "precioTotal": 50.00
    }
  ],
  "subtotal": "50.00",
  "iva": "8.00",
  "porcentajeIva": 16,
  "total": "58.00"
}
```

### 3. Resumen Completo del Inventario
**Endpoint:** `GET /api/carteras/resumen-completo`

**Descripción:** Obtiene un resumen completo incluyendo stock, valores con IVA y alertas.

**Respuesta:**
```json
{
  "stock": {
    "totalStock": 150,
    "totalProductos": 25,
    "productosBajoStock": 3
  },
  "valores": {
    "subtotal": "2500.00",
    "iva": "400.00",
    "porcentajeIva": 16,
    "total": "2900.00"
  },
  "alertas": {
    "productosBajoStock": [
      {
        "descripcion": "Cartera Vintage",
        "stock": 2
      }
    ]
  }
}
```

## Funcionalidades del Frontend

### 1. Botón "Ver Total Stock"
- Muestra un modal con el total de unidades en stock
- Lista todos los productos con su stock individual
- Identifica productos con bajo stock

### 2. Botón "Calcular IVA"
- Permite seleccionar productos específicos
- Configurable el porcentaje de IVA
- Muestra desglose completo: subtotal, IVA y total

### 3. Botón "Resumen Completo"
- Dashboard completo del inventario
- Métricas de stock y valores monetarios
- Alertas de productos con stock bajo
- Valor total del inventario con IVA incluido

## Características Técnicas

- **IVA por defecto:** 16%
- **Stock bajo:** Productos con 5 unidades o menos
- **Validaciones:** Control de stock insuficiente
- **Interfaz:** Modales responsivos con Bootstrap
- **Iconos:** Font Awesome para mejor UX

## Uso Recomendado

1. **Total Stock:** Para control rápido de inventario
2. **Calcular IVA:** Para cotizaciones y facturación
3. **Resumen Completo:** Para reportes gerenciales y toma de decisiones

## Instalación y Configuración

Las nuevas funcionalidades están integradas automáticamente en:
- `/backend/routes/carteras.js` (APIs)
- `/backend/public/inventario.html` (Botones)
- `/backend/public/JS/inventario.js` (Funcionalidad frontend)

No se requiere configuración adicional. Las funcionalidades están listas para usar.
