const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

// RUTAS PÚBLICAS
router.get('/', productController.getPublicProducts);
router.get('/p/:id-:slug', productController.getProductBySlug);

// RUTAS PROTEGIDAS
router.use(authMiddleware);
router.get('/admin', productController.getAll); // Para administradores
router.get('/:id', productController.getById);
router.post('/', productController.create);
router.put('/:id', productController.update);
router.delete('/:id', productController.delete);

module.exports = router;