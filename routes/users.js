const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth'); // ✅ CORREGIR nombre del middleware

// ✅ Todas las rutas requieren autenticación
router.use(auth); // ✅ USAR 'auth' en lugar de 'authenticateToken'

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;