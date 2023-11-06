/**
 * Asks for the current time of the server
 */
function getCurrentTime(server){
    return new Promise((resolve, reject)=>{
        resolve(((new Date(Date.now()))).toLocaleTimeString('en-US', {timeZone: 'America/Mexico_City', hour12: false}));

        /*
        let request =
        'SELECT CURRENT_TIME()';
    
        server.query(request, (error, result)=>{
            if(error) throw error;
            let data = result[0]['CURRENT_TIME()'];
            resolve(data);
        });
        */
    });
}

/**
 * Asks for the current day of week of the server
 */
function getCurrentDayOfWeek(server){
    return new Promise((resolve, reject)=>{
        let request =
        'SELECT DAYOFWEEK(CURDATE())';
    
        server.query(request, (error, result)=>{
            if(error) throw error;
            let data = result[0]['DAYOFWEEK(CURDATE())'];
            resolve(data);
        });
    });
}

/**
 * After receiving the information of the current time and day of week, asks for the 'id' column of the item in the 'horarios' database that matches with that information
 */
function getCurrentSchedule(server){
    return new Promise((resolve, reject)=>{
        getCurrentTime(server).then((currentTime)=>{
            getCurrentDayOfWeek(server).then((currentDayOfWeek)=>{
                /*/ FOR TEST PURPOSES ONLY
                currentTime = '09:00:00';
                currentDayOfWeek = 2;
                //*/
                let schedulesTable =
                `SELECT *
                FROM horarios
                WHERE id_dias = ${currentDayOfWeek}`;
    
                let hoursTable =
                `SELECT *
                FROM horas
                WHERE '${currentTime}'
                BETWEEN TIME_FORMAT(hora_inicio, "%H:%i:%s")
                AND TIME_FORMAT(hora_final, "%H:%i:%s")`;
    
                let request =
                `SELECT horarios.id, id_dias, hora_inicio, hora_final
                FROM (${schedulesTable}) AS horarios
                INNER JOIN (${hoursTable}) AS horas
                ON horarios.id_horas = horas.id`;
        
                server.query(request, (error, result)=>{
                    let data = -1;
                    if(error) throw error;
                    if(result.length > 0) data = result[0]['id'];
                    resolve(data);
                });
            });
        });
    });
}


/**
 * After obtaining the current schedule, asks for the 'id_aulas' column of the items in the 'horarios_aulas' database that matches with the current schedule
 */
function getCurrentClassrooms(server){
    return new Promise((resolve, reject)=>{
        getCurrentSchedule(server).then((currentSchedule)=>{
            let classroomsTable =
            `SELECT id, id_aulas, rank
            FROM horarios_aulas
            WHERE id_horarios = ${currentSchedule}`;
    
            let request =
            `SELECT classroomsInfo.id AS aula, classroomsId.id AS id
            FROM aulas AS classroomsInfo
            INNER JOIN (${classroomsTable}) AS classroomsId
            ON classroomsInfo.id = classroomsId.id_aulas
            ORDER BY rank DESC`;
        
            server.query(request, (error, result)=>{
                if(error) throw error;
                let data = result;
                resolve(data);
            });
        });
    });
}

function getNextClassrooms(server){
    return new Promise((resolve, reject)=>{
        getCurrentSchedule(server).then((currentSchedule)=>{
            let classroomsTable =
            `SELECT id, id_aulas
            FROM horarios_aulas
            WHERE id_horarios = ${currentSchedule+1}`;
    
            let request =
            `SELECT classroomsInfo.id AS aula, classroomsId.id AS id 
            FROM aulas AS classroomsInfo
            INNER JOIN (${classroomsTable}) AS classroomsId
            ON classroomsInfo.id = classroomsId.id_aulas`;
        
            server.query(request, (error, result)=>{
                if(error) throw error;
                let data = result;
                resolve(data);
            });
        });
    });
}

function likeClassroomSchedule(server, idClassroomSchedule, value){
    let update =
    `UPDATE horarios_aulas
    SET likes = likes + ${value}
    WHERE id = ${idClassroomSchedule}`;
    
    server.query(update, (error, result)=>{
        if(error) throw error;
    });
}

function dislikeClassroomSchedule(server, idClassroomSchedule, value){
    let update =
    `UPDATE horarios_aulas
    SET dislikes = dislikes + ${value}
    WHERE id = ${idClassroomSchedule}`;

    server.query(update, (error, result)=>{
        if(error) throw error;
    });
}

module.exports = {
    getCurrentTime,
    getCurrentDayOfWeek,
    getCurrentSchedule,
    getCurrentClassrooms,
    getNextClassrooms,
    likeClassroomSchedule,
    dislikeClassroomSchedule
};

/**
 * COMMAND FOR TESTING:
 * node server\requests\aulas-libres.js
 */