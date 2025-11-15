const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');

router.use(auth); // ✅ Todas protegidas

// ✅ CRUD COMPLETO
router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);
router.post('/', categoryController.create);
router.put('/:id', categoryController.update);
router.delete('/:id', categoryController.delete);

module.exports = router;