const express = require('express');
const router = express.Router();

router.get('/', (req, res)=>{
    res.json("Servidor funcionando.");
});

module.exports = router;