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
            dataAsignaturas: dataAsignaturas,
            userHorarios: req.session.horarios
        });
    });
});

router.post('/add', (req, res, next)=>{
    let asignaturas = [].concat(req.body.asignaturas);

    horarios.getHorario(server, asignaturas).then((horarios)=>{
        req.session.horarios = horarios;
        res.redirect('/horarios');
    });
});

module.exports = router;
