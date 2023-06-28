const express = require('express');
const router = express.Router();

const server = require('../server/connection');

const data = require('../server/requests/data');
const dataClases = data.getClases;
const dataAsignaturas = data.getAsignaturas;
const dataProfesores = data.getProfesores;

/* GET home page. */
router.get('/',
  (req, res, next)=>{
    dataClases.then((dataClases)=>{
        dataAsignaturas.then((dataAsignaturas)=>{
            dataProfesores.then((dataProfesores)=>{
                res.render('admin', {
                    title: 'admin',
                    dataClases: dataClases,
                    dataAsignaturas : dataAsignaturas,
                    dataProfesores: dataProfesores
                });
            });
        });
    });
  }
);

router.post('/add',
    (req, res, next)=>{
        let grupo = req.body.grupo;
        let asignatura = req.body.asignatura;
        let profesor = req.body.profesor;

        let insert =
        `INSERT INTO clases (grupo, id_asignatura, id_profesor)
        VALUES ('${grupo}','${asignatura}','${profesor}')`;
    
        server.query(insert, (error, result) => {
            if(error) throw error;
            res.redirect('/admin');
        });
    }
);

module.exports = router;
