const express = require('express');
const router = express.Router();
const updateController = require('../controllers/updateController');

router.get('/', updateController.updateAll);

module.exports = router;