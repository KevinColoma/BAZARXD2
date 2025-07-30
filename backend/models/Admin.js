const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Forzar el nombre de la colección con mayúscula
module.exports = mongoose.model('Admin', AdminSchema, 'Admin');
