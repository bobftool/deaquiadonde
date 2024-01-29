const express = require('express');
const router = express.Router();
const horariosController = require('../controllers/horariosController');

router.get('/', horariosController.getData);
router.post('/generate', horariosController.generateHorarios);
router.post('/regenerate', horariosController.regenerateHorarios);
router.post('/user/save', horariosController.saveHorarioUser);
router.get('/user/get', horariosController.getSavedHorariosUser);
router.post('/user/unsave', horariosController.unsaveHorarioUser);

module.exports = router;