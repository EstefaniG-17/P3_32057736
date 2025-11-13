const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');

// ✅ RUTAS PÚBLICAS
router.get('/', productController.search); // Búsqueda avanzada con filtros
router.get('/p/:id-:slug', productController.getBySlug); // Self-healing URL

// ✅ RUTAS PROTEGIDAS
router.post('/', auth, productController.create);
router.get('/:id', auth, productController.getById); // Para administración
router.put('/:id', auth, productController.update);
router.delete('/:id', auth, productController.delete);

module.exports = router;