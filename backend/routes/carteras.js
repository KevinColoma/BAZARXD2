const express = require('express');
const router = express.Router();
const Cartera = require('../models/Cartera');

// Obtener todas las carteras
router.get('/', async (req, res) => {
  const carteras = await Cartera.find();
  res.json(carteras);
});

// Agregar una cartera
router.post('/', async (req, res) => {
  const cartera = new Cartera(req.body);
  await cartera.save();
  res.status(201).json(cartera);
});

// Editar una cartera
router.put('/:id', async (req, res) => {
  const cartera = await Cartera.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(cartera);
});

// Eliminar una cartera
router.delete('/:id', async (req, res) => {
  await Cartera.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

// NUEVO: Descontar stock al generar factura
router.post('/descontar-stock', async (req, res) => {
  try {
    const { productos } = req.body; // Array de productos con {_id, cantidad}
    
    for (const producto of productos) {
      const cartera = await Cartera.findById(producto._id);
      if (cartera) {
        const nuevoCantidad = cartera.stock - producto.cantidad;
        if (nuevoCantidad < 0) {
          return res.status(400).json({ 
            error: `Stock insuficiente para ${cartera.descripcion}. Stock disponible: ${cartera.stock}` 
          });
        }
        cartera.stock = nuevoCantidad;
        await cartera.save();
      }
    }
    
    res.json({ mensaje: 'Stock actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar stock: ' + error.message });
  }
});

// NUEVO: Calcular total de stock de todos los productos
router.get('/total-stock', async (req, res) => {
  try {
    const carteras = await Cartera.find();
    const totalStock = carteras.reduce((total, cartera) => total + cartera.stock, 0);
    const totalProductos = carteras.length;
    const stockPorProducto = carteras.map(cartera => ({
      descripcion: cartera.descripcion,
      stock: cartera.stock
    }));
    
    res.json({
      totalStock,
      totalProductos,
      stockPorProducto
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al calcular el stock total: ' + error.message });
  }
});

// NUEVO: Calcular IVA de productos (subtotal, IVA y total con IVA)
router.post('/calcular-iva', async (req, res) => {
  try {
    const { productos, porcentajeIva = 16 } = req.body; // Array de productos con {_id, cantidad} y porcentaje de IVA (default 16%)
    
    let subtotal = 0;
    const productosConPrecio = [];
    
    for (const producto of productos) {
      const cartera = await Cartera.findById(producto._id);
      if (cartera) {
        const precioTotal = cartera.precio * producto.cantidad;
        subtotal += precioTotal;
        productosConPrecio.push({
          descripcion: cartera.descripcion,
          precio: cartera.precio,
          cantidad: producto.cantidad,
          precioTotal
        });
      }
    }
    
    const iva = subtotal * (porcentajeIva / 100);
    const total = subtotal + iva;
    
    res.json({
      productos: productosConPrecio,
      subtotal: subtotal.toFixed(2),
      iva: iva.toFixed(2),
      porcentajeIva,
      total: total.toFixed(2)
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al calcular el IVA: ' + error.message });
  }
});

// NUEVO: Obtener resumen completo (stock + valores con IVA)
router.get('/resumen-completo', async (req, res) => {
  try {
    const carteras = await Cartera.find();
    
    // Calcular totales de stock
    const totalStock = carteras.reduce((total, cartera) => total + cartera.stock, 0);
    const totalProductos = carteras.length;
    
    // Calcular valor total del inventario (sin IVA)
    const valorInventarioSinIva = carteras.reduce((total, cartera) => 
      total + (cartera.precio * cartera.stock), 0);
    
    // Calcular con IVA (16% por defecto)
    const porcentajeIva = 16;
    const ivaInventario = valorInventarioSinIva * (porcentajeIva / 100);
    const valorInventarioConIva = valorInventarioSinIva + ivaInventario;
    
    // Productos con bajo stock (<=5)
    const productosBajoStock = carteras.filter(cartera => cartera.stock <= 5);
    
    res.json({
      stock: {
        totalStock,
        totalProductos,
        productosBajoStock: productosBajoStock.length
      },
      valores: {
        subtotal: valorInventarioSinIva.toFixed(2),
        iva: ivaInventario.toFixed(2),
        porcentajeIva,
        total: valorInventarioConIva.toFixed(2)
      },
      alertas: {
        productosBajoStock: productosBajoStock.map(p => ({
          descripcion: p.descripcion,
          stock: p.stock
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el resumen completo: ' + error.message });
  }
});

module.exports = router;
