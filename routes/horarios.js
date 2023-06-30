const express = require('express');
const router = express.Router();

const server = require('../server/connection');
const data = require('../server/requests/data');
const horarios = require('../server/requests/generador-horarios');

/* GET home page. */
router.get('/', (req, res, next)=>{
    const getAsignaturas = data.getAsignaturas(server);

    getAsignaturas.then((dataAsignaturas)=>{
        res.render('horarios', {
            title: 'horarios',
            dataAsignaturas: dataAsignaturas
        });
    });
});

router.post('/add', (req, res, next)=>{
    let asignaturas = req.body.asignaturas;

    asignaturas.forEach((element) => {
        console.log(element);
    });
});

module.exports = router;
