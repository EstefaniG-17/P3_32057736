// routes/tags.js
const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const auth = require('../middleware/auth');

router.get('/', auth, tagController.getAll);

// ✅ AGREGAR ESTA LÍNEA AL FINAL
module.exports = router;