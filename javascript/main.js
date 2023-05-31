/**
 * npm init
 * node install mysql
 * 
 * node .\javascript\main.js
 */
const mysql = require('mysql')

/**
 * Create connection between user and server
 */
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'deaquiadonde'
});

connection.connect((error)=>{
    if(error) throw error;
    console.log('Connection successful');
});

/**
 * Asks for the current time of the server
 */
const getCurrentTime = new Promise((resolve, reject) => {
    let request = 'SELECT CURRENT_TIME()';

    connection.query(request, (error, result) => {
        if(error) throw error;
        const data = result[0]['CURRENT_TIME()'];
        resolve(data);
    });
});

/**
 * Asks for the current day of week of the server
 */
const getCurrentDayOfWeek = new Promise((resolve, reject) => {
    let request = 'SELECT DAYOFWEEK(CURDATE())';

    connection.query(request, (error, result) => {
        if(error) throw error;
        const data = result[0]['DAYOFWEEK(CURDATE())'];
        resolve(data);
    });
});

/**
 * After receiving the information of the current time and day of week, asks for the 'id' column of the item in the 'horarios' database that matches with that information
 */
const getCurrentSchedule = new Promise((resolve, reject) => {
    getCurrentTime.then((currentTime) => {
        getCurrentDayOfWeek.then((currentDayOfWeek) => {
            //*/ ONLY FOR TEST PURPOSES
            currentTime = '09:00:00';
            currentDayOfWeek = 2;
            //*/
            let schedulesTable = `SELECT * FROM horarios WHERE id_dias = ${currentDayOfWeek}`;
            let hoursTable = `SELECT * FROM horas WHERE '${currentTime}' BETWEEN TIME_FORMAT(hora_inicio, "%H:%i:%s") AND TIME_FORMAT(hora_final, "%H:%i:%s")`;
            let request = `SELECT horarios.id, id_dias, hora_inicio, hora_final FROM (${schedulesTable}) AS horarios INNER JOIN (${hoursTable}) AS horas ON horarios.id_horas = horas.id`;
    
            connection.query(request, (error, result) => {
                if(error) throw error;
                const data = result[0]['id'];
                resolve(data);
            });
        });
    });
});


/**
 * After obtaining the current schedule, asks for the 'id_aulas' column of the items in the 'horarios_aulas' database that matches with the current schedule
 */
const getData = new Promise((resolve, reject) => {
    getCurrentSchedule.then((currentSchedule) => {
        let request = `SELECT id_aulas FROM horarios_aulas WHERE id_horarios = ${currentSchedule}`;
    
        connection.query(request, (error, result) => {
            if(error) throw error;
            const data = result;
            resolve(data);
        });
    });
});

//connection.end();