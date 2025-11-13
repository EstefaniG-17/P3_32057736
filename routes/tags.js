const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const auth = require('../middleware/auth');

router.get('/', auth, tagController.getAll);

module.exports = router;