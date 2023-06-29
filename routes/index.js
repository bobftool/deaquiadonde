const express = require('express');
const router = express.Router();

const server = require('../server/connection');
const data = require('../server/requests/aulas-libres');

/* GET home page. */
router.get('/', (req, res, next)=>{
    const getCurrentClassrooms = data.getCurrentClassrooms(server);

    getCurrentClassrooms.then((dataCurrentClassrooms)=>{
        res.render('index', {
            title: 'de aqui a donde?',
            dataCurrentClassrooms: dataCurrentClassrooms
        });
    });
});

module.exports = router;
