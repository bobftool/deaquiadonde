const express = require('express');
const router = express.Router();

const server = require('../server/connection');
const classrooms = require('../server/requests/aulas-libres');

/* GET home page. */
router.get('/', async(req, res, next)=>{
    const dataCurrentClassrooms = await classrooms.getCurrentClassrooms(server);
    const dataNextClassrooms = await classrooms.getNextClassrooms(server);

    res.render('index', {
        title: 'de aqui a donde?',
        dataCurrentClassrooms: dataCurrentClassrooms,
        dataNextClassrooms: dataNextClassrooms,
        cookies: req.cookies
    });
});

router.put('/like', (req, res, next)=>{
    let idHorariosAulas = req.body.idHorariosAulas;

    if(!req.cookies[`like_${idHorariosAulas}`]){
        if(req.cookies[`dislike_${idHorariosAulas}`]){
            res.clearCookie(`dislike_${idHorariosAulas}`);
            classrooms.dislikeClassroomSchedule(server, idHorariosAulas, -1);
        }

        classrooms.likeClassroomSchedule(server, idHorariosAulas, 1);

        res.cookie(`like_${idHorariosAulas}`, idHorariosAulas, {
            maxAge: 2*60*60*1000
        });
        res.send();
    }
    else{
        classrooms.likeClassroomSchedule(server, idHorariosAulas, -1);
        res.clearCookie(`like_${idHorariosAulas}`);
        res.send();
    }
});

router.put('/dislike', (req, res, next)=>{
    let idHorariosAulas = req.body.idHorariosAulas;

    if(!req.cookies[`dislike_${idHorariosAulas}`]){
        if(req.cookies[`like_${idHorariosAulas}`]){
            res.clearCookie(`like_${idHorariosAulas}`);
            classrooms.likeClassroomSchedule(server, idHorariosAulas, -1);
        }

        classrooms.dislikeClassroomSchedule(server, idHorariosAulas, 1);

        res.cookie(`dislike_${idHorariosAulas}`, idHorariosAulas, {
            maxAge: 2*60*60*1000
        });
        res.send();
    }
    else{
        classrooms.dislikeClassroomSchedule(server, idHorariosAulas, -1);
        res.clearCookie(`dislike_${idHorariosAulas}`);
        res.send();
    }
});

module.exports = router;
