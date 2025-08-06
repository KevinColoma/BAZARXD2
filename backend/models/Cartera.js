const mongoose = require('mongoose');

const CarteraSchema = new mongoose.Schema({
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true },
  stock: { type: Number, required: true },
  imagen: { type: String }
});

// Forzar el nombre de la colección con mayúscula
module.exports = mongoose.model('Cartera', CarteraSchema, 'Carteras');
