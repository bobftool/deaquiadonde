const express = require('express');
const router = express.Router();

const server = require('../server/connection');
const data = require('../server/requests/data');
const horarios = require('../server/requests/generador-horarios');

let userHorarios;

/* GET home page. */
router.get('/', async(req, res, next)=>{
    const dataAsignaturas = await data.getAsignaturas(server);
    const dataProfesores = await data.getProfesores(server);

    res.render('horarios', {
        title: 'Horarios',
        dataAsignaturas: dataAsignaturas,
        dataProfesores: dataProfesores,
        userHorarios: userHorarios
    });
});

router.post('/add', async(req, res, next)=>{
    let asignaturas = [].concat(req.body.asignaturas);
    let profesores = [].concat(req.body.profesores);

    userHorarios = await horarios.getHorario(server, asignaturas, profesores);

    res.redirect('/horarios');
});

module.exports = router;
