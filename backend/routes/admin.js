const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin'); // Corrige la ruta
const jwt = require('jsonwebtoken');

// Login sin bcryptjs
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (!admin) return res.status(401).json({ error: 'Usuario incorrecto' });
  if (admin.password !== password) return res.status(401).json({ error: 'Contraseña incorrecta' });
  const token = jwt.sign({ userId: admin._id }, 'secreto', { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;
