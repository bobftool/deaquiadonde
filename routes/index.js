const express = require('express');
const router = express.Router();

const dataAulasLibres = require('../server/requests/aulas-libres');

/* GET home page. */
router.get('/',
  (req, res, next)=>{
    dataAulasLibres.then((dataAulasLibres)=>{
      res.render('index', {
        title: 'de aqui a donde?',
        dataAulasLibres: dataAulasLibres
      });
    });
  }
);

module.exports = router;
