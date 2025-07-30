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

module.exports = router;
