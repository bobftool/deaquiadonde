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
    let asignaturas = [].concat(req.body.asignaturas);

    horarios.getHorario(server, asignaturas);
});

module.exports = router;
