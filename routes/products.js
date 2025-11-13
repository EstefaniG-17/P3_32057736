const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');

// Rutas públicas
router.get('/', productController.search);
router.get('/:id', productController.getBySlug);

// Rutas protegidas
router.post('/', auth, productController.create);

module.exports = router;