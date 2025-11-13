const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');

router.get('/', auth, categoryController.getAll);
router.post('/', auth, categoryController.create);

module.exports = router;