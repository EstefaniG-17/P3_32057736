const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const auth = require('../middleware/auth');

// ✅ Todas las rutas requieren autenticación
router.use(auth);

// ✅ CRUD COMPLETO para Tags
router.get('/', tagController.getAll);
router.get('/:id', tagController.getById);
router.post('/', tagController.create);
router.put('/:id', tagController.update);
router.delete('/:id', tagController.delete);

module.exports = router;