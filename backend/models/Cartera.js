const mongoose = require('mongoose');

const CarteraSchema = new mongoose.Schema({
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true },
  stock: { type: Number, required: true },
  imagen: { type: String }
});

// Forzar el nombre de la colección con mayúscula
module.exports = mongoose.model('Cartera', CarteraSchema, 'Carteras');



// ...existing code...

// Descontar stock de múltiples productos
router.post('/descontar-stock', async (req, res) => {
  try {
    const { productos } = req.body;
    const resultados = [];

    for (const producto of productos) {
      const cartera = await Cartera.findById(producto._id);
      if (cartera) {
        const nuevaCantidad = cartera.cantidad - producto.cantidad;
        
        if (nuevaCantidad >= 0) {
          cartera.cantidad = nuevaCantidad;
          await cartera.save();
          resultados.push({ _id: cartera._id, nuevaCantidad });
        } else {
          return res.status(400).json({ 
            error: `Stock insuficiente para ${cartera.descripcion}` 
          });
        }
      }
    }
    res.json({ message: 'Stock actualizado', resultados });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// NUEVA RUTA: Calcular IVA para productos seleccionados
router.post('/calcular-iva', async (req, res) => {
  try {
    const { productos } = req.body; // Array de productos con {_id, cantidad}
    
    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ 
        error: 'Se requiere un array de productos con _id y cantidad' 
      });
    }

    let subtotal = 0;
    let productosDetalle = [];
    let productosNoEncontrados = [];
    
    // Procesar cada producto
    for (const producto of productos) {
      if (!producto._id || !producto.cantidad || producto.cantidad <= 0) {
        continue; // Saltar productos inválidos
      }

      try {
        const cartera = await Cartera.findById(producto._id);
        if (cartera) {
          const totalProducto = cartera.precio * producto.cantidad;
          subtotal += totalProducto;
          
          productosDetalle.push({
            _id: cartera._id,
            descripcion: cartera.descripcion,
            precio: parseFloat(cartera.precio),
            cantidad: parseInt(producto.cantidad),
            total: parseFloat(totalProducto.toFixed(2))
          });
        } else {
          productosNoEncontrados.push(producto._id);
        }
      } catch (error) {
        productosNoEncontrados.push(producto._id);
      }
    }
    
    // Calcular IVA (12% estándar de Ecuador)
    const porcentajeIva = 0.12;
    const iva = subtotal * porcentajeIva;
    const totalConIva = subtotal + iva;
    
    // Respuesta completa
    const response = {
      success: true,
      productos: productosDetalle,
      resumen: {
        subtotal: parseFloat(subtotal.toFixed(2)),
        iva: parseFloat(iva.toFixed(2)),
        total: parseFloat(totalConIva.toFixed(2)),
        porcentajeIva: '12%',
        cantidadProductos: productosDetalle.length
      },
      fecha: new Date().toISOString(),
      moneda: 'USD'
    };
    
    // Agregar advertencias si hay productos no encontrados
    if (productosNoEncontrados.length > 0) {
      response.advertencias = {
        productosNoEncontrados: productosNoEncontrados,
        mensaje: `${productosNoEncontrados.length} producto(s) no encontrado(s)`
      };
    }
    
    console.log(`💰 [CALCULAR-IVA] Cálculo realizado para ${productosDetalle.length} productos`);
    console.log(`   - Subtotal: $${subtotal.toFixed(2)}`);
    console.log(`   - IVA (12%): $${iva.toFixed(2)}`);
    console.log(`   - Total: $${totalConIva.toFixed(2)}`);
    
    res.json(response);
    
  } catch (error) {
    console.error('❌ [CALCULAR-IVA] Error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor al calcular IVA',
      details: error.message 
    });
  }
});

module.exports = router;