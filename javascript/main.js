/**
 * npm init
 * node install mysql
 * 
 * node .\javascript\main.js
 */
const mysql = require('mysql')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'deaquiadonde'
})

connection.connect((err)=>{
    if(err) throw err
    console.log('La conexion funciona')
})

/*
connection.query('SELECT * FROM horarios_aulas WHERE id_horarios = 1', (err, rows) => {
    if (err) throw err;
    console.log(rows);
});
*/

let hora_actual = new Date();
hora_actual.setHours(9);
hora_actual.setMinutes(0);
hora_actual.setSeconds(0);


connection.query('SELECT id FROM horas WHERE "09:00" BETWEEN TIME_FORMAT(hora_inicio, "%H:%i") AND TIME_FORMAT(hora_final, "%H:%i")', (err, rows) => {
    if (err) throw err;
    console.log(rows);
});

connection.query('SELECT * FROM horarios WHERE id_horas = 2', (err, rows) => {
    if (err) throw err;
    console.log(rows);
});


connection.end()