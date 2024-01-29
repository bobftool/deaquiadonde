const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

router.get('/', loginController.getCaptcha);
router.post('/', loginController.login);
router.get('/check', loginController.checkLogin)

module.exports = router;