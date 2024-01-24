const express = require('express');
const router = express.Router();

const server = require('../server/connection');
const data = require('../server/requests/data');

/* GET home page. */
/*
router.get('/', (req, res, next)=>{
    const getClases = data.getClases(server);
    const getAsignaturas = data.getAsignaturas(server);
    const getProfesores = data.getProfesores(server);
    const getHorarios = data.getHorarios(server);

    getClases.then((dataClases)=>{
        getAsignaturas.then((dataAsignaturas)=>{
            getProfesores.then((dataProfesores)=>{
                getHorarios.then((dataHorarios)=>{
                    res.render('admin', {
                        title: 'admin',
                        dataClases: dataClases,
                        dataAsignaturas: dataAsignaturas,
                        dataProfesores: dataProfesores,
                        dataHorarios: dataHorarios
                    });
                });
            });
        });
    });
});

router.post('/add', (req, res, next)=>{
    let grupo = req.body.grupo;
    let asignatura = req.body.asignatura;
    let profesor = req.body.profesor;
    let horario1 = req.body.horario1;
    let horario2 = req.body.horario2;
    let horario3 = req.body.horario3;
    let horario4 = req.body.horario4;
    let horario5 = req.body.horario5;

    let insert =
    `INSERT INTO clases
    (grupo, id_asignaturas, id_profesores)
    VALUES
    ('${grupo}','${asignatura}','${profesor}')`;
    
    server.query(insert, (error, result)=>{
        if(error) throw error;
        res.redirect('/admin');
    });

    if(horario1 != 'NULL'){
        insert =
        `INSERT INTO horarios_clases
        (id_horarios, id_clases)
        VALUES
        ('${horario1}','${grupo}-${asignatura}')`

        server.query(insert, (error, result)=>{
            if(error) throw error;
        });
    }

    if(horario2 != 'NULL'){
        insert =
        `INSERT INTO horarios_clases
        (id_horarios, id_clases)
        VALUES
        ('${horario2}','${grupo}-${asignatura}')`

        server.query(insert, (error, result)=>{
            if(error) throw error;
        });
    }

    if(horario3 != 'NULL'){
        insert =
        `INSERT INTO horarios_clases
        (id_horarios, id_clases)
        VALUES
        ('${horario3}','${grupo}-${asignatura}')`

        server.query(insert, (error, result)=>{
            if(error) throw error;
        });
    }

    if(horario4 != 'NULL'){
        insert =
        `INSERT INTO
        horarios_clases (id_horarios, id_clases)
        VALUES
        ('${horario4}','${grupo}-${asignatura}')`

        server.query(insert, (error, result)=>{
            if(error) throw error;
        });
    }

    if(horario5 != 'NULL'){
        insert =
        `INSERT INTO horarios_clases
        (id_horarios, id_clases)
        VALUES
        ('${horario5}','${grupo}-${asignatura}')`

        server.query(insert, (error, result)=>{
            if(error) throw error;
        });
    }
});
*/

router.get('/', (req, res, next)=>{
    res.render('admin', {
        title: 'admin'
    });
});

module.exports = router;
